const orderModel = require("../../models/checkoutModel");

const updateProfitController = async (req, res) => {
    try {
        const { orderId, profit } = req.body;
        
        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required",
                success: false,
                error: true
            });
        }

        if (profit === undefined) {
            return res.status(400).json({
                message: "Profit amount is required",
                success: false,
                error: true
            });
        }

        const updateResult = await orderModel.findByIdAndUpdate(
            orderId,
            { profit: Number(profit) },
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
            message: "Order profit updated successfully",
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