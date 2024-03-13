// services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Seller = require('../models/Seller');
const Role = require('../models/role');
const crypto = require('crypto');
const { sendEmail } = require('./emailService')
const {
  SECRET_KEY,
  FRONTEND_BASE_URL,
} = require('../utils/constants');

const registerSeller = async (seller) => {
  try {
    let role = await Role.findOne({ name: seller.roleName });
    if (!role) {
      role = await Role.create({ name: seller.roleName });
    }

    const hashedPassword = await bcrypt.hash(seller.password, 10);
    seller.password = hashedPassword;
    seller.roles = [role._id]
    const newSeller = await Seller.create(seller);

    return { message: 'Seller registered successfully', newSeller };
  } catch (error) {
    console.error(error);
    throw new Error('Registration failed');
  }
};

const loginSeller = async (email, password) => {
  try {
    const seller = await Seller.findOne({ email }).populate('roles');

    if (!seller) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, seller.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    let roles = [];
    seller?.roles.forEach(role => {
      roles.push(role.name);
    });

    const token = jwt.sign({ sellerId: seller._id, roles }, SECRET_KEY, { expiresIn: '1h' });

    return { message: 'Login successful', token };
  } catch (error) {
    console.error(error);
    throw new Error('Login failed');
  }
};

const sendPasswordResetEmail = async (email) => {
  try {
    const seller = await Seller.findOne({ email: email });

    if (!seller) {
      throw new Error('Seller not found');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000 / 12; // Token valid for 5 minutes

    // Update user with reset token and expiration
    await Seller.updateOne({ _id: seller._id }, { resetToken, resetTokenExpiration });

    const subject = 'Password Reset';
    const link = `${FRONTEND_BASE_URL}/auth/reset-password/${resetToken}`;
    const html = `<p>Click the following link to reset your password</p><a href=${link}>Click</a>`;

    await sendEmail(email, subject, html);

    return { message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to send password reset email');
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    const resetToken = token;

    // Check if the token is valid and not expired
    const seller = await Seller.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } });

    if (!seller) {
      // return res.status(400).send('Invalid or expired reset link');
      throw new Error('Invalid or expired reset link');

    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    seller.password = hashedPassword;
    seller.resetToken = '';
    seller.resetTokenExpiration = '';
    await seller.save();

    return { message: 'Password reset successfully' };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to reset password');
  }
};

module.exports = {
  registerSeller,
  loginSeller,
  sendPasswordResetEmail,
  resetPassword,
};
