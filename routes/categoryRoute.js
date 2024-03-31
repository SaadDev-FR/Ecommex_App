const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const { checkPermissions } = require('../middleware/permissionMiddleware');
const { actionPermissions } = require('../middleware/actionsPermission');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategorybyId);

// Protect the route with authentication middleware
router.use(authenticateUser);

// Use role-based permission middleware for create, update and delete
router.use(checkPermissions(['admin']));
router.post('/', categoryController.create);

// Use action-based permission middleware for update and delete
// router.use()
router.put('/:id', actionPermissions('Category'), categoryController.updateCategory);
router.delete('/:id', actionPermissions('Category'), categoryController.deleteCategory);

module.exports = router;