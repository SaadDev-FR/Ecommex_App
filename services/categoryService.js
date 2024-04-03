const Product = require('../models/product');
const mongoose = require('mongoose');
const Category = require('../models/category');


const create = async (req, res, next) => {
  try {
    const data = req.body

    const pattern = /id/i;
    const keysContainingId = Object.keys(req.user).filter(key => pattern.test(key));

    data.createdBy = req.user[keysContainingId];

    const category= await Category.create(data);

    return category;
  } catch (error) {
    throw new Error('Failt to Add Category: ' + error.message);
  }
};

const getAllCategories= async (req, res, next) => {

  try {

    return await Category.find();

  } catch (error) {
    throw new Error('Failed to retrieve Category: ' + error.message);
  }
}

const getCategorybyId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);

    if (!category) {
      throw new Error('Category not Found')
    }

    return category;
  } catch (error) {
    throw new Error('Failed to retrieve Category: ' + error.message);

  }
}



const updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = req.body;

    const pattern = /id/i;
    const keysContainingId = Object.keys(req.user).filter(key => pattern.test(key));

    data.updatedBy = req.user[keysContainingId];

    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;

  } catch (error) {
    throw new Error('Failed to update Category: ' + error.message);

  }

}

const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id

    // Check if the category exists
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    // Delete the category
    return await Category.findByIdAndDelete(id);

  } catch (error) {
    throw new Error('Failed to Delete: ' + error.message);

  }

}


module.exports = {
  getAllCategories,
  getCategorybyId,
  create,
  updateCategory,
  deleteCategory
};
