const adminService = require('../services/adminService');

const allUser = async (req, res) => {
  try {

    const result = await adminService.allSellers();

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

module.exports = {
  allUser,
};
