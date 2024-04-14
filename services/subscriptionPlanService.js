const SubscriptionPlan = require('../models/subscriptionPlan');
const mongoose = require('mongoose');


const create = async (req, res, next) => {
  try {
    const data = req.body

    const pattern = /id/i;
    const keysContainingId = Object.keys(req.user).filter(key => pattern.test(key));

    data.createdBy = req.user[keysContainingId];

    const subscriptionPlan = await SubscriptionPlan.create(data);

    return subscriptionPlan;
  } catch (error) {
    throw new Error('Failt to Create Subscription Plan: ' + error.message);
  }
};

const getAllSubscriptionPlan = async (req, res, next) => {

  try {

    return await SubscriptionPlan.find();

  } catch (error) {
    throw new Error('Failed to retrieve Subscription Plan: ' + error.message);
  }
}

const getSubscriptionPlanById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const subscriptionPlan = await SubscriptionPlan.findById(id);

    if (!subscriptionPlan) {
      throw new Error('Subscription Plan not Found')
    }

    return subscriptionPlan;
  } catch (error) {
    throw new Error('Failed to retrieve Subscription Plan: ' + error.message);

  }
}



const updateSubscriptionPlan = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = req.body;

    const pattern = /id/i;
    const keysContainingId = Object.keys(req.user).filter(key => pattern.test(key));

    data.updatedBy = req.user[keysContainingId];

    const subscriptionPlan = await SubscriptionPlan.findByIdAndUpdate(id, data, { new: true });

    if (!subscriptionPlan) {
      throw new Error("Subscription Plan not found");
    }

    return subscriptionPlan;

  } catch (error) {
    throw new Error('Failed to update Subscription Plan: ' + error.message);

  }

}

const deleteSubscriptionPlan = async (req, res, next) => {
  try {
    const id = req.params.id

    // Check if the subscription Plan exists
    const subscriptionPlan = await SubscriptionPlan.findById(id);
    if (!subscriptionPlan) {
      throw new Error("Subscription Plan not found");
    }

    // Delete the subscription Plan
    return await SubscriptionPlan.findByIdAndDelete(id);

  } catch (error) {
    throw new Error('Failed to Delete: ' + error.message);

  }

}


module.exports = {
  create,
  getAllSubscriptionPlan,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan
};
