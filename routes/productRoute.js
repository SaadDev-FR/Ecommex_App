const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const { checkPermissions } = require('../middleware/permissionMiddleware');
const { actionPermissions } = require('../middleware/actionsPermission');
const productController = require('../controllers/productController');

const router = express.Router();

// public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protect the route with authentication middleware
router.use(authenticateUser);

// Use role-based permission middleware for create, update and delete
router.use(checkPermissions(['admin', 'seller', 'wholeSeller']));
router.post('/', productController.create);

// Use action-based permission middleware for update and delete
// router.use()
router.put('/:id', actionPermissions('Product'), productController.updateProduct);
router.delete('/:id', actionPermissions('Product'), productController.deleteProduct);

module.exports = router;