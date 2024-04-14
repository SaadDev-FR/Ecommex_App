const productService = require('../services/productService');

const create = async (req, res, next) => {
  try {
    const data = req.body
    const { name, price, categoryId } = data;

    const result = await productService.create(req, res, next);

    res.status(201).json({ success: true, message: 'Product added successfully', product: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const getAllProducts = async (req, res, next) => {
  try {

    const result = await productService.getAllProducts(req,res,next);

    res.status(200).json(
      {
        success: true,
        message: 'Products retrieved successfully.',
        total: result.length,
        products: result
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res, next) => {
  try {

    const result = await productService.getProductbyId(req,res,next);

    res.status(200).json({ success: true, message: 'Product retrieved successfully.', product: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getTrendingProduct = async (req, res, next) => {
  try {

    const result = await productService.getTrendingProduct(req,res,next);

    res.status(200).json({ success: true, message: 'Product retrieved successfully.', product: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res,next) => {
  try {
    
    const result = await productService.updateProduct(req,res,next)
    res.status(200).json({ success: true, message: 'Product updated successfully.', product: result });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

const deleteProduct = async (req, res,next) => {
  try {

    await productService.deleteProduct(req,res,next)

    res.status(200).json({ success: true, message: 'product deleted successfully' });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// product review

const createReview = async (req, res, next) => {
  try {
    const data = req.body
    const { user, comment } = data;

    const result = await productService.createReview(req, res, next);

    res.status(201).json({ success: true, message: 'Review added successfully', product: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const getAllReviewsByProductId = async (req, res, next) => {
  try {

    const result = await productService.getAllReviewsByProductId(req,res,next);

    res.status(200).json(
      {
        success: true,
        message: 'Reviews retrieved successfully.',
        total: result.length,
        product: result
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getReviewbyId = async (req, res, next) => {
  try {

    const result = await productService.getReviewbyId(req,res,next);

    res.status(200).json({ success: true, message: 'Review retrieved successfully.', review: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getTrendingProduct,
  create,
  updateProduct,
  deleteProduct,
  createReview,
  getAllReviewsByProductId,
  getReviewbyId
};
