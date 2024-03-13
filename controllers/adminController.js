const adminService = require('../services/adminService');

const allUser = async (req, res) => {
  try {
    
    const result = await adminService.allSellers();

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  allUser,
};
