const Product = require('../models/product')


const totalOrderAmount = async (productsWithQuantity = []) => {
    try {
        const productIds = productsWithQuantity?.map(p => p.productId) ?? [];

        const products = await Product.find(
            { _id: { $in: productIds } }
        );


        let totalAmount = 0

        products.forEach((product) => {
            productsWithQuantity.forEach((productWQ) => {
                if (product._id == productWQ.productId) {

                    totalAmount += product.payableAmount * productWQ.quantity

                }
            })

        });

        return totalAmount

    } catch (error) {
        throw new Error(error.message)

    }


}


module.exports = { totalOrderAmount }