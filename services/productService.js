const Product = require('../models/product');
const mongoose = require('mongoose');
const Category = require('../models/category');
const ProductReview = require('../models/productReview');
const Favorite = require('../models/favorite');
const notificationService = require('../services/notificationService');
const Order = require('../models/order');



const create = async (req, res, next) => {
  try {
    const data = req.body
    const images = req.files.map(file => file.filename);

    data.images = images

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

    const query = {};
    if (req.query.createdBy) {
      query.createdBy = req.query.createdBy
    }

    const products = await Product.find(query)
      .populate({
        path: 'categoryId',
        select: 'name'
      })
      .populate({
        path: 'createdBy',
        select: 'businessName'
      });

    return products

  } catch (error) {
    throw new Error('Failed to retrieve products: ' + error.message);
  }
}

const getProductbyId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id)
      .populate({
        path: 'categoryId',
        select: 'name'
      })
      .populate({
        path: 'createdBy',
        select: 'businessName'
      })
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: ['firstName', 'lastName'] }
      });

    if (!product) {
      throw new Error('Product not Found')
    }

    return product
  } catch (error) {
    throw new Error('Failed to retrieve products: ' + error.message);

  }
}


const getTrendingProduct = async (req, res, next) => {
  try {
    // Calculate weightage for each factor (adjust as needed)
    const reviewWeight = 0.4;
    const ratingWeight = 0.3;
    const saleWeight = 0.3;

    let limit = 10
    if (req.query.limit) {
      limit = req.query.limit
    }

    const orders = await Order.find().populate('products.productId');

    // Calculate score for each product
    const productScores = {};
    orders.forEach(order => {
      order.products.forEach(product => {
        const productId = product.productId._id.toString();
        if (!productScores[productId]) {
          productScores[productId] = {
            reviewCount: 0,
            totalRating: 0,
            saleCount: 0
          };
        }
        productScores[productId].saleCount += product.quantity;
      });
    });

    // Find all product reviews and calculate total ratings and review counts
    const productReviews = await ProductReview.find();
    productReviews.forEach(review => {
      const productId = review?.productId?.toString();
      if (productScores[productId]) {
        productScores[productId].totalRating += review.rating;
        productScores[productId].reviewCount++;
      }
    });

    // Calculate score for each product
    const trendingProducts = [];
    for (const productId in productScores) {
      const { reviewCount, totalRating, saleCount } = productScores[productId];
      const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
      const score = (reviewCount * reviewWeight) + (averageRating * ratingWeight) + (saleCount * saleWeight);
      trendingProducts.push({ productId, score });
    }

    // Sort products by score in descending order
    trendingProducts.sort((a, b) => b.score - a.score);

    // Limit the number of trending products
    const topTrendingProductIds = trendingProducts.slice(0, limit).map(item => item.productId);

    const topTrendingProducts = await Product.find({ _id: { $in: topTrendingProductIds } }).populate('reviews');

    return topTrendingProducts
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
    const images = req.files.map(file => file.filename);


    if (images.length > 0) {
      data.images = images
    }

    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    
    if (!product) {
      throw new Error("product not found");
    }
    
    // send notigication
    if (data.discountInPercent > 0) {
      const favorites = await Favorite.find({ products: id }, { userId: 1 })
      if (favorites) {
        const recipients = favorites.map(user => user.userId)
        await notificationService.sendNotification(recipients, `${product.name} is on sale`)
      }
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

// product reviews

const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const productId = req.params.productId

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Create a new review
    const newReview = new ProductReview({
      user: req.user.id,
      rating,
      comment
    });

    // Save the review
    await newReview.
      save();

    // Add the review to the product's reviews array
    return await Product.findByIdAndUpdate(
      productId,
      { reviews: [...product.reviews, newReview] },
      { new: true }
    );
  } catch (error) {
    throw new Error('Failt to Add Review: ' + error.message);
  }
};

const getAllReviewsByProductId = async (req, res, next) => {
  try {

    const { productId } = req.params

    return await Product.findById(productId)
      .populate({
        path: 'reviews',
        populate: ({ path: 'user', select: ['firstName', 'lastName'] })
      });

  } catch (error) {
    throw new Error('Failed to retrieve reviews: ' + error.message);
  }
}

const getReviewbyId = async (req, res, next) => {
  try {
    const { productId, reviewId } = req.params;
    const product = await Product.findById(productId)
      .populate({
        path: 'reviews',
        populate: ({ path: 'user', select: ['firstName', 'lastName'] })
      });;


    if (!product) {
      throw new Error('review not Found')
    }

    // Find the specific review within the reviews array by its ID
    const review = product.reviews.find(review => review._id.toString() === reviewId);

    if (!review) {
      throw new Error('review not Found')
    }


    return review;
  } catch (error) {
    throw new Error('Failed to retrieve review: ' + error.message);

  }
}


module.exports = {
  getAllProducts,
  getProductbyId,
  getTrendingProduct,
  create,
  updateProduct,
  deleteProduct,
  getAllReviewsByProductId,
  getReviewbyId,
  createReview
};
