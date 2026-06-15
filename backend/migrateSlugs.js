const mongoose = require('mongoose');
const productModel = require('./models/productModel');
const generateSlug = require('./helpers/generateSlug');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log('Connected to DB');
    const products = await productModel.find({ slug: { $exists: false } });
    console.log(`Found ${products.length} products without slug`);
    
    for (const product of products) {
        const slug = await generateSlug(product.productName);
        product.slug = slug;
        await product.save();
        console.log(`Updated ${product.productName} with slug ${slug}`);
    }
    
    console.log('Done');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
