const Subscription = require('../models/subscription');
const mongoose = require('mongoose');
const subscriptionPlan = require('../models/subscriptionPlan');
const { STRIPE_SECRET_KEY } = require('../utils/constants')
const { PaymentStatus } = require('../utils/orderConstants');

const stripe = require('stripe')(STRIPE_SECRET_KEY);

const create = async (req, res, next) => {
  try {
    const data = req.body

    const pattern = /id/i;
    const keysContainingId = Object.keys(req.user).filter(key => pattern.test(key));

    data.createdBy = req.user[keysContainingId];

    if (data.planId) {
      const SSPlan = await subscriptionPlan.findById(data.planId)

      const currentDate = new Date();
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + SSPlan.durationInMonths);

      data.endDate = newDate

      // payment 

      // Create payment method with the token
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          token: data.paymentToken
        }
      });

      // process payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: SSPlan.price.amount * 100,
        currency: SSPlan.price.currency,
        payment_method: paymentMethod.id,
        confirm: true,
        'automatic_payment_methods[enabled]': true,
        'automatic_payment_methods[allow_redirects]': 'never',

      })

      // Check payment status
      if (paymentIntent.status === 'succeeded') {

        data.payment.status = PaymentStatus.SUCCESS

        data.status="active"
        const subscription = await Subscription.create(data);

        return subscription;
      } else {
        throw new Error('Payment Fail')
      }
    }

  } catch (error) {
    throw new Error('Failt to Create Subscription: ' + error.message);
  }
};

const getAllSubscription = async (req, res, next) => {

  try {

    return await Subscription.find();

  } catch (error) {
    throw new Error('Failed to retrieve Subscription: ' + error.message);
  }
}

const getSubscriptionById = async (req, res, next) => {
  try {
   
    const id = req.params.id;
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      throw new Error('Subscription  not Found')
    }

    return subscription;
  } catch (error) {
    throw new Error('Failed to retrieve Subscription: ' + error.message);

  }
}

const mySubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const subscription = await Subscription.findOne({userId});

    if (!subscription) {
      throw new Error('Subscription  not Found')
    }

    return subscription;
  } catch (error) {
    throw new Error('Failed to retrieve Subscription: ' + error.message);

  }
}



const updateSubscription = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = req.body;

    const pattern = /id/i;
    const keysContainingId = Object.keys(req.user).filter(key => pattern.test(key));

    data.updatedBy = req.user[keysContainingId];

    const subscription = await Subscription.findByIdAndUpdate(id, data, { new: true });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    return subscription;

  } catch (error) {
    throw new Error('Failed to update Subscription: ' + error.message);

  }

}

const deleteSubscription = async (req, res, next) => {
  try {
    const id = req.params.id

    // Check if the subscription exists
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    // Delete the subscription 
    return await Subscription.findByIdAndDelete(id);

  } catch (error) {
    throw new Error('Failed to Delete: ' + error.message);

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
