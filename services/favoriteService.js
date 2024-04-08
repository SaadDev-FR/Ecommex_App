const Favorite = require("../models/favorite");
const mongoose = require("mongoose");
const Category = require("../models/category");

const addToFavorite = async (req, res, next) => {
  try {
    const { productId } = req.body;

    // Example ObjectId values
    const pattern = /id/i;
    const keysContainingId = Object.keys(req.user).filter((key) =>
      pattern.test(key)
    );

    const userId = req.user._id;

    const favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      const fav = new Favorite({
        userId,
        products: [productId],
      });

      return await fav.save();
    }

    favorite.products.addToSet(productId);

    await favorite.save();

    return favorite;
  } catch (error) {
    throw new Error("Failt to Add Product in Favorite: " + error.message);
  }
};

const getAllFavoriteByUserId = async (req, res, next) => {
  try {
    // Example ObjectId values
    const pattern = /id/i;
    const keysContainingId = Object.keys(req.user).filter((key) =>
      pattern.test(key)
    );

    const userId = req.user[keysContainingId];

    return await Favorite.findOne({ userId }).populate("products");
  } catch (error) {
    throw new Error("Failed to retrieve Favorites: " + error.message);
  }
};

const removeFromFavorite = async (req, res, next) => {
  try {
    const { productId } = req.body;

    // Example ObjectId values
    const pattern = /id/i;
    const keysContainingId = Object.keys(req.user).filter((key) =>
      pattern.test(key)
    );

    const userId = req.user[keysContainingId];

    const favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      throw new Error("Favorite not found");
    }

    favorite.products = favorite.products.filter(
      (product) => product !== productId
    );

    return await favorite.save();
  } catch (error) {
    throw new Error("Failed to retrieve Favorite: " + error.message);
  }
};

module.exports = {
  addToFavorite,
  getAllFavoriteByUserId,
  removeFromFavorite,
};
