const uploadProductPermission = require("../../helpers/permission")
const productModel = require("../../models/productModel")
const generateSlug = require("../../helpers/generateSlug")

const ALLOWED_UPDATE_FIELDS = [
    "productName",
    "brandName",
    "category",
    "subCategory",
    "hotDeal",
    "productImage",
    "description",
    "price",
    "sellingPrice",
    "item",
    "productStatus",
]

async function updateProductController (req,res){
    try{

        if(!uploadProductPermission(req.userId)){
            throw new Error ("Permission Denied")
        }

        const { _id } = req.body

        if (!_id) {
            throw new Error("Product ID is required")
        }

        const updatePayload = {}
        for (const key of ALLOWED_UPDATE_FIELDS) {
            if (req.body[key] !== undefined) {
                updatePayload[key] = req.body[key]
            }
        }

        if (updatePayload.productName !== undefined && !updatePayload.productName) {
            throw new Error("Product name is required")
        }
        if (updatePayload.brandName !== undefined && !updatePayload.brandName) {
            throw new Error("Brand name is required")
        }
        if (updatePayload.productImage !== undefined) {
            if (!Array.isArray(updatePayload.productImage) || updatePayload.productImage.length === 0) {
                throw new Error("At least one product image is required")
            }
        }

        if (updatePayload.productName) {
            updatePayload.slug = await generateSlug(updatePayload.productName);
        }

        const updateProduct = await productModel.findByIdAndUpdate(
            _id,
            {
                $set: updatePayload,
                $unset: {
                    sellerName: "",
                    sellerBrandName: "",
                    sellerPhoneNumber: "",
                },
            },
            { new: true, runValidators: true }
        )

        if (!updateProduct) {
            throw new Error("Product not found")
        }

        res.json({
            message : "Product Update Successfully",
            data : updateProduct,
            success : true,
            error : false
        })


    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}


module.exports = updateProductController
