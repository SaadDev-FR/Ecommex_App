const express = require('express');
const AdminAuthController = require('../controllers/AdminAuthController');
const sellerAuthController = require('../controllers/sellerAuthController');
const wholeSellerAuthController = require('../controllers/wholeSellerAuthController');

const router = express.Router();

// Admin
router.post('/admin/register', AdminAuthController.registerAdmin);
router.post('/admin/login', AdminAuthController.loginAdmin);
router.post('/admin/forgot-password', AdminAuthController.sendPasswordResetEmail);
router.post('/admin/reset-password', AdminAuthController.resetPassword);

// Seller
router.post('/seller/register', sellerAuthController.registerSeller);
router.post('/seller/login', sellerAuthController.loginSeller);
router.post('/seller/forgot-password', sellerAuthController.sendPasswordResetEmail);
router.post('/seller/reset-password', sellerAuthController.resetPassword);

// Whole seller
router.post('/wholeSeller/register', wholeSellerAuthController.registerWholeSeller);
router.post('/wholeSeller/login', wholeSellerAuthController.loginWholeSeller);
router.post('/wholeSeller/forgot-password', wholeSellerAuthController.sendPasswordResetEmail);
router.post('/wholeSeller/reset-password', wholeSellerAuthController.resetPassword);

module.exports = router;
