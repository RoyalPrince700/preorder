const productModel = require("../../models/productModel")

const getProductDetails = async(req,res) =>{
    try{
        const {productId} = req.body

        const product = await productModel.findById(productId)

        if (!product) {
            return res.status(404).json({
                data: null,
                message: "Product not found",
                success: false,
                error: true
            })
        }

        res.json({
            data : product,
            message : "OK",
            success  : true,
            error : false
        })

    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = getProductDetails