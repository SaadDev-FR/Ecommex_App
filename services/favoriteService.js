const Favorite = require('../models/favorite');
const mongoose = require('mongoose');
const Category = require('../models/category');


const addToFavorite = async (req, res, next) => {
  try {
    const { productId } = req.body

    const userId = req.user.id;

    const favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      const fav = new Favorite({
        userId,
        products: [productId]
      });

      return await fav.save();
    }


    favorite.products.addToSet(productId)

    await favorite.save();


    return favorite;
  } catch (error) {
    throw new Error('Failt to Add Product in Favorite: ' + error.message);
  }
};


const getAllFavoriteByUserId = async (req, res, next) => {
  try {
   
     const userId = req.user.id;

    const favorite = await Favorite.findOne({ userId }).populate('products');

    return favorite?favorite:[]

  } catch (error) {
    throw new Error('Failed to retrieve Favorites: ' + error.message);
  }
};

const removeFromFavorite = async (req, res, next) => {

  try {
    const { productId } = req.body

    
    const userId = req.user.id;

    const favorite = await Favorite.findOne({userId});

    if (!favorite) {

      throw new Error('Favorite not found');
    }

    favorite.products = favorite.products.filter((product) => product !== productId)

    return await favorite.save();
  } catch (error) {
    throw new Error('Failed to retrieve Favorite: ' + error.message);
  }
}



module.exports = {
  addToFavorite,
  getAllFavoriteByUserId,
  removeFromFavorite
};
