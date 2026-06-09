const addToCartModel = require("../../models/cartProduct");
const productModel = require("../../models/productModel");

const getCartAnalytics = async (req, res) => {
  try {
    // Aggregate cart data grouped by product
    const cartAggregation = await addToCartModel.aggregate([
      {
        $group: {
          _id: "$productId",
          totalQuantity: { $sum: "$quantity" },
          uniqueUsers: { $addToSet: "$userId" },
          cartCount: { $sum: 1 }
        }
      },
      {
        $addFields: {
          uniqueUserCount: { $size: "$uniqueUsers" }
        }
      },
      {
        $sort: { totalQuantity: -1 }
      }
    ]);

    // Get product details for the aggregated products
    const productIds = cartAggregation.map(item => item._id);
    const products = await productModel.find({ _id: { $in: productIds } });

    const productMap = {};
    products.forEach(product => {
      productMap[product._id.toString()] = product;
    });

    // Combine data and calculate worth
    let totalCartValue = 0;
    let totalItemsInCarts = 0;
    let uniqueProductsInCarts = cartAggregation.length;

    const cartAnalytics = cartAggregation.map(item => {
      const product = productMap[item._id] || {};
      const sellingPrice = product.sellingPrice || 0;
      const worth = item.totalQuantity * sellingPrice;
      totalCartValue += worth;
      totalItemsInCarts += item.totalQuantity;

      return {
        productId: item._id,
        productName: product.productName || "Unknown Product",
        brandName: product.brandName || "",
        category: product.category || "",
        sellingPrice,
        totalQuantity: item.totalQuantity,
        uniqueUsers: item.uniqueUserCount,
        cartCount: item.cartCount,
        worth: worth,
        productImage: product.productImage?.[0] || null
      };
    });

    // Overview stats
    const totalUsersWithCarts = await addToCartModel.distinct("userId").then(users => users.length);

    res.status(200).json({
      success: true,
      error: false,
      data: {
        overview: {
          totalCartValue,
          totalItemsInCarts,
          uniqueProductsInCarts,
          totalUsersWithCarts
        },
        products: cartAnalytics
      }
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Error fetching cart analytics",
      error: true,
      success: false
    });
  }
};

module.exports = getCartAnalytics;
