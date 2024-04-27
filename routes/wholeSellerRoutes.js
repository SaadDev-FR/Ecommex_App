const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const { checkPermissions } = require('../middleware/permissionMiddleware');
const wholeSellerController = require('../controllers/wholeSellerController');

const router = express.Router();

// Protect the route with authentication middleware
router.use(authenticateUser);

router.get('/orders', checkPermissions(['wholeSeller']), wholeSellerController.getAllOrders);


module.exports = router;