const categoryService = require("../services/categoryService");

const create = async (req, res, next) => {
  try {
    const data = req.body;
    const { name } = data;

    const result = await categoryService.create(req, res, next);

    res
      .status(201)
      .json({
        success: true,
        message: "Category added successfully",
        category: result,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const result = await categoryService.getAllCategories(req, res, next);

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully.",
      total: result.length,
      categories: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getCategorybyId = async (req, res, next) => {
  try {
    const result = await categoryService.getCategorybyId(req, res, next);

    res
      .status(200)
      .json({
        success: true,
        message: "Category retrieved successfully.",
        category: result,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const result = await categoryService.updateCategory(req, res, next);
    res
      .status(200)
      .json({
        success: true,
        message: "Category updated successfully.",
        category: result,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req, res, next);

    res
      .status(200)
      .json({ success: true, message: "category deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategorybyId,
  create,
  updateCategory,
  deleteCategory,
};
