const productService = require("../services/productService");

const create = async (req, res, next) => {
  try {
    const data = req.body;
    const { name, price, categoryId } = data;

    const result = await productService.create(req, res, next);

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const result = await productService.getAllProducts(req, res, next);

    res.status(200).json({
      success: true,
      message: "Products Retrieved Successfully",
      total: result.length,
      products: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res, next) => {
  try {
    const result = await productService.getProductbyId(req, res, next);

    res.status(200).json({
      success: true,
      message: "Product Retrieved Successfully",
      product: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const result = await productService.updateProduct(req, res, next);
    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req, res, next);

    res
      .status(200)
      .json({ success: true, message: "Product Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  create,
  updateProduct,
  deleteProduct,
};
