const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const { checkPermissions } = require('../middleware/permissionMiddleware');
const { actionPermissions } = require('../middleware/actionsPermission');
const subscriptionPlanController = require('../controllers/subscriptionPlanController');

const router = express.Router();

// public routes
router.get('/', subscriptionPlanController.getAllSubscriptionPlan);
router.get('/:id', subscriptionPlanController.getSubscriptionPlanById);

// Protect the route with authentication middleware
router.use(authenticateUser);

// Use role-based permission middleware for create, update and delete
router.use(checkPermissions(['admin']));
router.post('/', subscriptionPlanController.create);

// Use action-based permission middleware for update and delete
router.put('/:id', actionPermissions('SubscriptionPlan'), subscriptionPlanController.updateSubscriptionPlan);
router.delete('/:id', actionPermissions('SubscriptionPlan'), subscriptionPlanController.deleteSubscriptionPlan);

module.exports = router;