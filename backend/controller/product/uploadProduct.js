//go to model folder in backend to create product model

const uploadProductPermission = require("../../helpers/permission")
const productModel = require("../../models/productModel")


async function uploadProductController(req,res) {
    try{
            const sessionUserId = req.userId

            const hasPermission = await uploadProductPermission(sessionUserId)
            if(!hasPermission){
                throw new Error ("Permission Denied")
            }
            
            

            const {
                productName,
                brandName,
                category,
                subCategory,
                hotDeal,
                productImage,
                description,
                price,
                sellingPrice,
                item,
                productStatus,
            } = req.body

            if (!productName || !brandName) {
                throw new Error("Product name and brand name are required")
            }
            if (!Array.isArray(productImage) || productImage.length === 0) {
                throw new Error("At least one product image is required")
            }

            const uploadProduct = new productModel({
                productName,
                brandName,
                category,
                subCategory,
                hotDeal,
                productImage,
                description,
                price: price !== "" && price != null ? Number(price) : undefined,
                sellingPrice: sellingPrice !== "" && sellingPrice != null ? Number(sellingPrice) : undefined,
                item: item !== "" && item != null ? Number(item) : undefined,
                productStatus: productStatus || "Available",
            })
            const saveProduct = await uploadProduct.save()

                res.status(201).json({
                    message : "Product Uploaded Successfully",
                    error : false,
                    success : true,
                    data : saveProduct
                })
        }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = uploadProductController