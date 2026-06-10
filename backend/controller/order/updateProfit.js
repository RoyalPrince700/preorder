const orderModel = require("../../models/checkoutModel");

const updateProfitController = async (req, res) => {
    try {
        const { orderId, profit, amountPaid } = req.body;
        
        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required",
                success: false,
                error: true
            });
        }

        if (profit === undefined && amountPaid === undefined) {
            return res.status(400).json({
                message: "Provide amount paid and/or profit to update",
                success: false,
                error: true
            });
        }

        const payload = {};
        if (profit !== undefined) {
            payload.profit = Number(profit);
        }
        if (amountPaid !== undefined) {
            payload.amountPaid =
                amountPaid === '' || amountPaid === null ? null : Number(amountPaid);
        }

        const updateResult = await orderModel.findByIdAndUpdate(
            orderId,
            payload,
            { new: true }
        );
        
        if (!updateResult) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
                error: true
            });
        }

        res.json({
            data: updateResult,
            message: "Order payment details updated successfully",
            success: true,
            error: false
        });

    } catch (error) {
        console.error("Error in updateProfitController:", error);
        res.status(500).json({
            message: error.message || "An unexpected error occurred while updating the order profit.",
            success: false,
            error: true
        });
    }
};

module.exports = updateProfitController;