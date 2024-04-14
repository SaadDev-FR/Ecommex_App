const subscriptionPlanService = require('../services/subscriptionPlanService');

const create = async (req, res, next) => {
  try {
    const data = req.body

    const result = await subscriptionPlanService.create(req, res, next);

    res.status(201).json({ success: true, message: 'subscription Plan added successfully', subscription: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const getAllSubscriptionPlan = async (req, res, next) => {
  try {

    const result = await subscriptionPlanService.getAllSubscriptionPlan(req,res,next);

    res.status(200).json(
      {
        success: true,
        message: 'subscription Plans retrieved successfully.',
        total: result.length,
        subscriptions: result
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getSubscriptionPlanById = async (req, res, next) => {
  try {

    const result = await subscriptionPlanService.getSubscriptionPlanById(req,res,next);

    res.status(200).json({ success: true, message: 'subscription Plan retrieved successfully.', subscription: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateSubscriptionPlan = async (req, res,next) => {
  try {
    
    const result = await subscriptionPlanService.updateSubscriptionPlan(req,res,next)
    res.status(200).json({ success: true, message: 'subscription Plan updated successfully.', subscription: result });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

const deleteSubscriptionPlan = async (req, res,next) => {
  try {

    await subscriptionPlanService.deleteSubscriptionPlan(req,res,next)

    res.status(200).json({ success: true, message: 'subscription Plan deleted successfully' });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = {
  create,
  getAllSubscriptionPlan,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan
};
