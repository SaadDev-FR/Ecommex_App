const Seller = require('../models/seller');

const allSellers = async () => {
  try {
    const users = await Seller.find();

    return users;
  } catch (error) {
    throw new Error('Failed to retrieve seller: ' + error.message);
  }
};

module.exports = {
  allSellers
};
