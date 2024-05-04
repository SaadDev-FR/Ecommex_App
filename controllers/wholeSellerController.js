const wholeSellerService = require('../services/wholeSellerService');

const getAllOrders = async (req, res, next) => {
    try {
  
      const result = await wholeSellerService.getAllOrders(req,res,next);
  
      res.status(200).json(
        {
          success: true,
          message: 'Orders retrieved successfully.',
          total: result.orders?.length,
          data: result
        });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

module.exports = {
    getAllOrders
 
};
