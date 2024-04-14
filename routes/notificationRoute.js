const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');

const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.use(authenticateUser);

router.get('/', notificationController.getAllNotification);
router.post('/:id/mark-as-read', notificationController.markNotificationAsRead);
router.post('/:id/remove', notificationController.removeUserFromNotification);


module.exports = router;