const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const { checkPermissions } = require('../middleware/permissionMiddleware');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Protect the route with authentication middleware
router.use(authenticateUser);

// Use role-based permission middleware for specific routes
router.get('/all-sellers', checkPermissions(['admin']), adminController.allUser);

module.exports = router;