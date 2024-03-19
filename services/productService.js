const Product = require('../models/product');
const mongoose = require('mongoose');
const Category = require('../models/category');


const create = async (req, res, next) => {
  try {
    const data = req.body

    let category = await Category.findOne({ name: data.category });
    if (!category) {
      category = (await Category.create({ name: data.category }));
    }

    data.category = category;

    // Example ObjectId values
    const pattern = /id/i;
    const keysContainingId = Object.keys(req.user).filter(key => pattern.test(key));

    data.createdBy = req.user[keysContainingId];

    const products = await Product.create(data);

    return products;
  } catch (error) {
    throw new Error('Failt to Add Product: ' + error.message);
  }
};

const getAllProducts = async (req, res, next) => {

  try {

    // const query = {
    //   newCurrency: "EUR",
    //   conversionRates: {
    //     'USD': 1, // Example conversion rate from USD to USD (1:1)
    //     'EUR': 0.84 // Example conversion rate from USD to EUR
    //   },



    //   // if discount return discounted amount
    //   discount: true,

    //   //  select fields
    //   projection: {
    //     name: 1,
    //     description: 1,
    //     images: 1,
    //     status: 1,
    //     category: 1,
    //     discountInPercent: 1
    //   }

    // }

    // // filter
    // if (req.params.id) {
    //   query.filter = { _id: new mongoose.Types.ObjectId(`${req.params.id}`) }
    // }

    // const pipeline = [];
    // const selectFields = {
    //   _id: 1,
    //   price: {
    //     amount: '$price.amount',
    //     currency: '$price.currency',
    //   },
    // };

    // // filter product
    // if (query.filter) {
    //   pipeline.push({ $match: query.filter });
    // }

    // // currency convertion
    // if (query.newCurrency && query.conversionRates) {
    //   pipeline.push({
    //     $addFields: {
    //       convertedPrice: {
    //         $multiply: [
    //           { $divide: ['$price.amount', query.conversionRates['USD']] },
    //           query.conversionRates[query.newCurrency]
    //         ]
    //       },
    //     }
    //   });

    //   selectFields.convertedPrice = '$convertedPrice'
    // }

    // // price amount
    // const amount = query.newCurrency && query.conversionRates ? '$convertedPrice' : '$price.amount';

    // // calculate discount
    // if (query.discount) {
    //   pipeline.push({
    //     $addFields: {
    //       discountedAmount: {
    //         $multiply: [
    //           amount,
    //           { $subtract: [1, { $divide: ['$discountInPercent', 100] }] } // Apply discount percentage
    //         ]
    //       }
    //     }
    //   });

    //   selectFields.discountedAmount = {
    //     amount: '$discountedAmount',
    //     currency: query.newCurrency ? query.newCurrency : '$price.currency'
    //   }



    //   // projections
    //   if (query.projection) {
    //     pipeline.push({
    //       $project: {
    //         ...selectFields,
    //         ...query.projection
    //       }
    //     })
    //   } else {
    //     pipeline.push({
    //       $project:
    //         selectFields
    //     })
    //   }

    // }

    // const productsWithConvertedPrices = await Product.aggregate(pipeline);

    return await Product.find().populate('category');

  } catch (error) {
    throw new Error('Failed to retrieve products: ' + error.message);
  }
}

const getProductbyId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate('category');

    if (!product) {
      throw new Error('Product not Found')
    }

    return product;
  } catch (error) {
    throw new Error('Failed to retrieve products: ' + error.message);

  }
}



const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = req.body;

    // Example ObjectId values
    const pattern = /id/i;
    const keysContainingId = Object.keys(req.user).filter(key => pattern.test(key));

    data.updatedBy = req.user[keysContainingId];

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!product) {
      throw new Error("product not found");
    }

    return product;

  } catch (error) {
    throw new Error('Failed to update product: ' + error.message);

  }

}

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id

    // Check if the product exists
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("product not found");
    }

    // Delete the product
    return await Product.findByIdAndDelete(id);

  } catch (error) {
    throw new Error('Failed to Delete: ' + error.message);

  }

}


module.exports = {
  getAllProducts,
  getProductbyId,
  create,
  updateProduct,
  deleteProduct
};
