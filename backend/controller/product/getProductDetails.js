const productModel = require("../../models/productModel")
const mongoose = require("mongoose")

const getProductDetails = async(req,res) =>{
    try{
        const {productId} = req.body

        let query = {};
        if (mongoose.Types.ObjectId.isValid(productId)) {
            query = { $or: [{ _id: productId }, { slug: productId }] };
        } else {
            query = { slug: productId };
        }

        const product = await productModel.findOne(query)

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