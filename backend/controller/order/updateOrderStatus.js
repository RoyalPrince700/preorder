const orderModel = require("../../models/checkoutModel");
const UserModel = require("../../models/userModel");
const {
    sendOrderStatusUpdateEmail,
    sendUserOrderConfirmationEmail,
    sendOrderDeliveredEmail,
} = require("../../mailtrap/emails");

async function updateOrderStatus(req, res) {
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
        if (typeof adminConfirmed !== "undefined") {
            updatePayload.adminConfirmed = adminConfirmed;
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            updatePayload,
            { new: true }
        );

        const justConfirmed =
            !existingOrder.adminConfirmed && updatedOrder.adminConfirmed;
        const justDelivered =
            existingOrder.status !== "Delivered" &&
            updatedOrder.status === "Delivered";
        const statusChanged = existingOrder.status !== updatedOrder.status;

        try {
            const user = await UserModel.findById(updatedOrder.userId);
            if (user && user.email && updatedOrder.userId) {
                const notifyOpts = { userId: updatedOrder.userId };

                if (justConfirmed) {
                    await sendUserOrderConfirmationEmail(
                        user.email,
                        updatedOrder._id,
                        notifyOpts
                    );
                }

                if (justDelivered) {
                    await sendOrderDeliveredEmail(
                        user.email,
                        updatedOrder._id,
                        notifyOpts
                    );
                } else if (statusChanged && !justConfirmed) {
                    await sendOrderStatusUpdateEmail(
                        user.email,
                        {
                            orderId: updatedOrder._id,
                            orderDate: updatedOrder.createdAt.toLocaleDateString(),
                            status: status,
                        },
                        notifyOpts
                    );
                }
            }
        } catch (emailError) {
            console.error("Error sending order emails/notifications:", emailError);
        }

        res.json({
            data: updatedOrder,
            message: justConfirmed
                ? "Order confirmed. User notified by email and in-app notification."
                : "Order status updated successfully.",
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
