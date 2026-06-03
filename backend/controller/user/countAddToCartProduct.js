const addToCartModel = require("../../models/cartProduct")

const countAddToCartProduct = async (req,res)=>{
    try{
        const userId = req.userId

        const cartItems = await addToCartModel.find({ userId: userId }).select("quantity")
        const count = cartItems.reduce((total, item) => total + (item.quantity || 0), 0)

        res.json({

            data : {
                count : count
            },
            message : "ok",
            error : false,
            success : true
        })

    }catch(err){
        res.json({
            message : err.message || error,
            error : false,
            sucess : false
        })
        
    }
}

module.exports = countAddToCartProduct