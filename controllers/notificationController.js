const notificationService = require('../services/notificationService');

const markNotificationAsRead = async (req, res, next) => {
  try {

    const result = await notificationService.markNotificationAsRead(req, res, next);

    res.status(201).json({ success: true, message: 'Notification mark as read successfully', favorite: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const getAllNotification = async (req, res, next) => {
  try {

    const result = await notificationService.getAllNotificationByUserId(req, res, next);

    res.status(200).json(
      {
        success: true,
        message: 'Notifications retrieved successfully.',
        total: result.length,
        notifications: result
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const removeUserFromNotification = async (req, res, next) => {
  try {

    const result = await notificationService.removeUserFromNotification(req, res, next);

    res.status(200).json(
      {
        success: true,
        message: 'Notifications removed successfully.',
        total: result.length,
        notifications: result
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


module.exports = {
  getAllNotification,
  markNotificationAsRead,
  removeUserFromNotification
};
