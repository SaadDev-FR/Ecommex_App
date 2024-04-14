const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const { checkPermissions } = require('../middleware/permissionMiddleware');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.use(authenticateUser);

router.get('/', orderController.getAllOrders);
router.post('/', orderController.create);
router.get('/:id', orderController.getOrderbyId);
router.delete('/:id', orderController.deleteOrder);

router.patch('/:id/change-status', checkPermissions(['admin']),  orderController.changeOrderStatus);


module.exports = router;