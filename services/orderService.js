const Order = require('../models/order');
const { OrderStatus, PaymentStatus } = require('../utils/orderConstants');
const { totalOrderAmount } = require('../utils/common')
const { STRIPE_SECRET_KEY } = require('../utils/constants')

const stripe = require('stripe')(STRIPE_SECRET_KEY);



const create = async (req, res, next) => {
  try {
    const data = req.body

    data.status = OrderStatus.PENDING
    const total = await totalOrderAmount(req.body.products);

    if (data.totalAmount < total) {
      throw new Error(`Total Amout not me equal to ${total}`);
    }

    // Create payment method with the token
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: data.paymentToken
      }
    });

    // process payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.totalAmount * 100,
      currency: data.currency,
      payment_method: paymentMethod.id,
      confirm: true,
      'automatic_payment_methods[enabled]': true,
      'automatic_payment_methods[allow_redirects]':'never',

      
    })

    // Check payment status
    if (paymentIntent.status === 'succeeded') {

      data.payment.status = PaymentStatus.SUCCESS
      const products = await Order.create(data);

      return products;
    } else {
      throw new Error('Payment Fail')
    }

  } catch (error) {
    throw new Error('Failt to Create Order: ' + error.message);
  }
};

const getAllOrders = async (req, res, next) => {

  try {

    const orders = await Order.find()
      .populate({
        path: 'customer.customerId',
        select: ['firstName', 'lastName']
      }).populate('products.productId');

    return orders
  } catch (error) {
    throw new Error('Failed to retrieve Orders: ' + error.message);
  }
}

const getOrderbyId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id)
      .populate({
        path: 'customer.customerId',
        select: ['firstName', 'lastName']
      }).populate({
        path: 'products.productId',
        select: ['name', 'price', 'discountInPercent']

      });

    if (!order) {
      throw new Error('Order not Found')
    }

    return order
  } catch (error) {
    throw new Error('Failed to retrieve Order: ' + error.message);

  }
}



const updateOrder = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = req.body;

    const order = await Order.findByIdAndUpdate(id, data, { new: true });

    return order;

  } catch (error) {
    throw new Error('Failed to update Order: ' + error.message);

  }

}

const changeOrderStatus = async (req, res, next) => {
  try {
    const id = req.params.id
    const status = req.body.status;

    const order = await Order.findByIdAndUpdate(id, {status}, { new: true });

    return order;

  } catch (error) {
    throw new Error('Failed to update Order status: ' + error.message);

  }

}

const deleteOrder = async (req, res, next) => {
  try {
    const id = req.params.id

    const order = await Order.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    // Delete the order
    return await Order.findByIdAndDelete(id);

  } catch (error) {
    throw new Error('Failed to Delete: ' + error.message);

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
