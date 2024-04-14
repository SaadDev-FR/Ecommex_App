const orderService = require('../services/orderService');

const create = async (req, res, next) => {
  try {
    const data = req.body
    const { name, price, categoryId } = data;

    const result = await orderService.create(req, res, next);

    res.status(201).json({ success: true, message: 'Product added successfully', product: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const getAllOrders = async (req, res, next) => {
  try {

    const result = await orderService.getAllOrders(req,res,next);

    res.status(200).json(
      {
        success: true,
        message: 'Orders retrieved successfully.',
        total: result.length,
        Orders: result
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getOrderbyId = async (req, res, next) => {
  try {

    const result = await orderService.getOrderbyId(req,res,next);

    res.status(200).json({ success: true, message: 'Order retrieved successfully.', Order: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateOrder = async (req, res,next) => {
  try {
    
    const result = await orderService.updateOrder(req,res,next)
    res.status(200).json({ success: true, message: 'Order updated successfully.', order: result });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

const changeOrderStatus = async (req, res,next) => {
  try {
    
    const result = await orderService.changeOrderStatus(req,res,next)
    res.status(200).json({ success: true, message: 'Order status updated successfully.', order: result });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

const deleteOrder = async (req, res,next) => {
  try {

    await orderService.deleteOrder(req,res,next)

    res.status(200).json({ success: true, message: 'Order deleted successfully' });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = {
 
  create,
  getAllOrders,
  getOrderbyId,
  updateOrder,
  deleteOrder,
  changeOrderStatus
 
};
