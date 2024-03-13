// services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Admin = require('../models/admin');
const Role = require('../models/role');
const crypto = require('crypto');
const { sendEmail } = require('./emailService')
const {
  SECRET_KEY,
  FRONTEND_BASE_URL,
} = require('../utils/constants');

const registerAdmin = async (admin) => {
  try {
    let role = await Role.findOne({ name: admin.roleName });
    if (!role) {
      role = await Role.create({ name: admin.roleName });
    }

    const hashedPassword = await bcrypt.hash(admin.password, 10);
    admin.password = hashedPassword;
    admin.roles = [role._id]
    const newUser = await Admin.create(admin);

    return { message: 'Admin registered successfully', newUser };
  } catch (error) {
    console.error(error);
    throw new Error('Registration failed');
  }
};

const loginAdmin = async (email, password) => {
  try {
    const admin = await Admin.findOne({ email }).populate('roles');

    if (!admin) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    let roles = [];
    admin?.roles.forEach(role => {
      roles.push(role.name);
    });

    const token = jwt.sign({ adminId: admin._id, roles }, SECRET_KEY, { expiresIn: '1h' });

    return { message: 'Login successful', token };
  } catch (error) {
    console.error(error);
    throw new Error('Login failed');
  }
};

const sendPasswordResetEmail = async (email) => {
  try {
    const admin = await Admin.findOne({ email: email });

    if (!admin) {
      throw new Error('Admin not found');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000 / 12; // Token valid for 5 minutes

    // Update user with reset token and expiration
    await Admin.updateOne({ _id: admin._id }, { resetToken, resetTokenExpiration });

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
    const admin = await Admin.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } });

    if (!admin) {
      // return res.status(400).send('Invalid or expired reset link');
      throw new Error('Invalid or expired reset link');

    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.resetToken = '';
    admin.resetTokenExpiration = '';
    await admin.save();

    return { message: 'Password reset successfully' };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to reset password');
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  sendPasswordResetEmail,
  resetPassword,
};
