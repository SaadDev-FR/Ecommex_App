const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const { checkPermissions } = require('../middleware/permissionMiddleware');
const { actionPermissions } = require('../middleware/actionsPermission');
const subscriptionController = require('../controllers/subscriptionController');

const router = express.Router();

// public routes
router.get('/', subscriptionController.getAllSubscription);
router.get('/:id', subscriptionController.getSubscriptionById);

router.use(authenticateUser);
router.get('/my-subscription', subscriptionController.mySubscription);

router.use(checkPermissions(['seller']));
router.post('/', subscriptionController.create);

router.put('/:id', actionPermissions('Subscription'), subscriptionController.updateSubscription);
router.delete('/:id', actionPermissions('Subscription'), subscriptionController.deleteSubscription);

module.exports = router;