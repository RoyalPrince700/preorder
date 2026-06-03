const orderModel = require("../../models/checkoutModel");
const NotificationModel = require("../../models/notification"); // Import notification model
const UserModel = require("../../models/userModel"); // Import user model
const { sendOrderStatusUpdateEmail, sendUserOrderConfirmationEmail, sendOrderDeliveredEmail } = require("../../mailtrap/emails"); // Import email function

async function updateOrderStatus(req, res) {
    console.log("Request User ID:", req.userId);
    try {
        const { orderId, status, adminConfirmed } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({
                message: "Order ID and status are required",
                success: false,
                error: true,
            });
        }

        const existingOrder = await orderModel.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
                error: true,
            });
        }

        const updatePayload = { status };
        if (typeof adminConfirmed !== 'undefined') {
            updatePayload.adminConfirmed = adminConfirmed;
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            updatePayload,
            { new: true }
        );

        // Create a notification for the user
        const userNotification = new NotificationModel({
            userId: updatedOrder.userId,
            type: "Order Status Update",
            message: `The status of your order #${updatedOrder._id} has been updated to: ${status}.`,
            isRead: false,
            createdAt: new Date(),
        });

        await userNotification.save();

        // Send email notification to user
        try {
            const user = await UserModel.findById(updatedOrder.userId);
            if (user && user.email) {
                // Determine which email to send based on state changes
                const justConfirmed = !existingOrder.adminConfirmed && updatedOrder.adminConfirmed;
                const justDelivered = existingOrder.status !== 'Delivered' && updatedOrder.status === 'Delivered';

                if (justConfirmed) {
                    await sendUserOrderConfirmationEmail(user.email, updatedOrder._id);
                    console.log('Order confirmation email sent to user:', user.email);
                } 
                
                if (justDelivered) {
                    await sendOrderDeliveredEmail(user.email, updatedOrder._id);
                    console.log('Order delivered thank you email sent to user:', user.email);
                } else if (existingOrder.status !== updatedOrder.status && !justConfirmed) {
                    // Only send general status update if it's not a delivery (which has its own email)
                    // and not just a confirmation (unless status also changed, but we prioritize specific emails)
                    await sendOrderStatusUpdateEmail(user.email, {
                        orderId: updatedOrder._id,
                        orderDate: updatedOrder.createdAt.toLocaleDateString(),
                        status: status
                    });
                    console.log('Order status update email sent to user:', user.email);
                }
            }
        } catch (emailError) {
            console.error('Error sending order emails:', emailError);
            // Don't throw error - we don't want to block the status update
        }

        // Emit real-time update via WebSocket
        const io = req.app.get('io');
        if (io) {
            io.emit('order-status-updated', {
                orderId: updatedOrder._id,
                userId: updatedOrder.userId,
                newStatus: status,
                message: `Order #${updatedOrder._id} status changed to ${status}`
            });
        }

        res.json({
            data: updatedOrder,
            message: "Order status updated successfully, and notification sent to the user.",
            success: true,
            error: false,
        });
    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        res.status(500).json({
            message: error.message || error,
            success: false,
            error: true,
        });
    }
}

module.exports = updateOrderStatus;
