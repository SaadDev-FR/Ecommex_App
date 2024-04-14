const adminService = require('../services/adminService');

const allSeller = async (req, res, next) => {
  try {

    const result = await adminService.allSellers(req, res, next);

    res.status(200).json(
      { 
        success: true, 
        message: 'Sellers retrieved successfully.', 
        total: result.length,
        sellers: result 
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const allWholeSeller = async (req, res, next) => {
  try {

    const result = await adminService.allWholeSellers(req, res, next);

    res.status(200).json(
      { 
        success: true, 
        message: 'Whole Sellers retrieved successfully.', 
        total: result.length,
        sellers: result 
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  allSeller,
  allWholeSeller
};
