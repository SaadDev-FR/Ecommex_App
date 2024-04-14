const Seller = require('../models/seller');
const WholeSeller = require('../models/wholeSeller');

const allSellers = async (req, res, next) => {
  try {
    const users = await Seller.find();

    return users;
  } catch (error) {
    throw new Error('Failed to retrieve seller: ' + error.message);
  }
};

const allWholeSellers = async (req, res, next) => {
  try {
    const users = await WholeSeller.find();

    return users;
  } catch (error) {
    throw new Error('Failed to retrieve whole-seller: ' + error.message);
  }
};

module.exports = {
  allSellers,
  allWholeSellers
};
