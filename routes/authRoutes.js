const express = require('express');
const adminAuthController = require('../controllers/adminAuthController');
const sellerAuthController = require('../controllers/sellerAuthController');
const wholeSellerAuthController = require('../controllers/wholeSellerAuthController');

const router = express.Router();

// Admin
router.post('/admin/register', adminAuthController.registerAdmin);
router.post('/admin/login', adminAuthController.loginAdmin);
router.post('/admin/forgot-password', adminAuthController.sendPasswordResetEmail);
router.post('/admin/reset-password', adminAuthController.resetPassword);

// Seller
router.post('/seller/register', sellerAuthController.registerSeller);
router.post('/seller/login', sellerAuthController.loginSeller);
router.post('/seller/forgot-password', sellerAuthController.sendPasswordResetEmail);
router.post('/seller/reset-password', sellerAuthController.resetPassword);

// WholeSeller
router.post('/wholeSeller/register', wholeSellerAuthController.registerWholeSeller);
router.post('/wholeSeller/login', wholeSellerAuthController.loginWholeSeller);
router.post('/wholeSeller/forgot-password', wholeSellerAuthController.sendPasswordResetEmail);
router.post('/wholeSeller/reset-password', wholeSellerAuthController.resetPassword);

module.exports = router;
