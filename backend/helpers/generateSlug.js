const productModel = require("../models/productModel");

const generateSlug = async (productName) => {
    let slug = productName
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')       // Replace spaces with -
        .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
        .replace(/\-\-+/g, '-');    // Replace multiple - with single -

    // Check if slug exists
    let existingProduct = await productModel.findOne({ slug });
    if (existingProduct) {
        // Append a random string or timestamp
        const randomString = Math.random().toString(36).substring(2, 6);
        slug = `${slug}-${randomString}`;
    }
    return slug;
};

module.exports = generateSlug;
