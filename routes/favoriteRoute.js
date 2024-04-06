const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const { checkPermissions } = require('../middleware/permissionMiddleware');

const { actionPermissions } = require('../middleware/actionsPermission');
const favoriteController = require('../controllers/favoriteController');

const router = express.Router();

router.use(authenticateUser);

router.post('/', favoriteController.addToFavorite);

router.use(actionPermissions('Favorite'))
router.get('/', favoriteController.getAllFavoriteByUserId);
router.put('/', favoriteController.removeFromFavorite);


module.exports = router;