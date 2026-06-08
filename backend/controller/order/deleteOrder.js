const orderModel = require("../../models/checkoutModel");

const deleteOrderController = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required",
                success: false,
                error: true
            });
        }

        const deleteResult = await orderModel.findByIdAndDelete(orderId);
        
        if (!deleteResult) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
                error: true
            });
        }

        res.json({
            message: "Order deleted successfully",
            success: true,
            error: false
        });

    } catch (error) {
        console.error("Error in deleteOrderController:", error);
        res.status(500).json({
            message: error.message || "An unexpected error occurred while deleting the order.",
            success: false,
            error: true
        });
    }
};

module.exports = deleteOrderController;