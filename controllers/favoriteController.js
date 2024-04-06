const favoriteService = require('../services/favoriteService');

const addToFavorite = async (req, res, next) => {
  try {
    const { productId } = req.body

    const result = await favoriteService.addToFavorite(req, res, next);

    res.status(201).json({ success: true, message: 'Favorite added successfully', favorite: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const getAllFavoriteByUserId = async (req, res, next) => {
  try {

    const result = await favoriteService.getAllFavoriteByUserId(req,res,next);

    res.status(200).json(
      {
        success: true,
        message: 'Favorite retrieved successfully.',
        total: result.length,
        favorite: result
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const removeFromFavorite = async (req, res,next) => {
  try {

    await favoriteService.removeFromFavorite(req,res,next)

    res.status(200).json({ success: true, message: 'Favorite remove successfully' });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}


module.exports = {
  addToFavorite,
  getAllFavoriteByUserId,
  removeFromFavorite
};
