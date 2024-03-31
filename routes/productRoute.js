const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const { checkPermissions } = require('../middleware/permissionMiddleware');
const { actionPermissions } = require('../middleware/actionsPermission');
const { rcorbPermisssion } = require('../middleware/hybridPermissionMiddlewaew');
const productController = require('../controllers/productController');

const router = express.Router();

// public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protect the route with authentication middleware
router.use(authenticateUser);

// rcorbPermisssion: only resource-creater (e.g whole seller) or admin can delete product
router.delete('/:id', rcorbPermisssion(['admin'],'Product'), productController.deleteProduct);

router.use(checkPermissions(['wholeSeller']));
router.post('/', productController.create);

router.put('/:id', actionPermissions('Product'), productController.updateProduct);

module.exports = router;