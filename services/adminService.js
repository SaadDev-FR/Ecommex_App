// services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Seller = require('../models/Seller');
const Role = require('../models/role');
const { 
  SECRET_KEY, 
  SENDER_EMAIL,
  FRONTEND_BASE_URL,
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_HOST,
  EMAIL_HOST_PORT
} = require('../utils/constants');

const allSellers = async () => {
  try {
    let user = await Seller.find();

    return { message: 'seller list', data:user };
  } catch (error) {
    console.error(error);
    throw new Error('seller list is empty');
  }
};

module.exports = {
  allSellers
};
