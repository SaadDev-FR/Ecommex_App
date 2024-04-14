const subscriptionService = require('../services/subscriptionService');

const create = async (req, res, next) => {
  try {
    const data = req.body

    const result = await subscriptionService.create(req, res, next);

    res.status(201).json({ success: true, message: 'subscription added successfully', subscription: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const getAllSubscription = async (req, res, next) => {
  try {

    const result = await subscriptionService.getAllSubscription(req,res,next);

    res.status(200).json(
      {
        success: true,
        message: 'subscription retrieved successfully.',
        total: result.length,
        subscriptions: result
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getSubscriptionById = async (req, res, next) => {
  try {

    const result = await subscriptionService.getSubscriptionById(req,res,next);

    res.status(200).json({ success: true, message: 'subscription retrieved successfully.', subscription: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const mySubscription = async (req, res, next) => {
  try {

    const result = await subscriptionService.mySubscription(req,res,next);

    res.status(200).json({ success: true, message: 'subscription retrieved successfully.', subscription: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateSubscription = async (req, res,next) => {
  try {
    
    const result = await subscriptionService.updateSubscription(req,res,next)
    res.status(200).json({ success: true, message: 'subscription updated successfully.', subscription: result });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

const deleteSubscription = async (req, res,next) => {
  try {

    await subscriptionService.deleteSubscription(req,res,next)

    res.status(200).json({ success: true, message: 'subscription deleted successfully' });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = {
  create,
  getAllSubscription,
  getSubscriptionById,
  mySubscription,
  updateSubscription,
  deleteSubscription
};
