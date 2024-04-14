const Notification = require('../models/notification');


const sendNotification = async (recipients, message) => {
  try {

    const notification = new Notification({
      recipients,
      message
    })

    return await notification.save();
  } catch (error) {
    throw new Error('Failt to send Notification: ' + error.message);
  }
};

const getAllNotificationByUserId = async (req, res, next) => {
  try {
    const userId = req.user.id

    const notifications = await Notification.find({ recipients: userId },{message:1,readBy:1, read:1});

    if (notifications) {
      const readNotifications = notifications.map(item=>{
        if(item.readBy.includes(userId)){
           item.read=true
        }

        return item
      })

      return readNotifications

    } else {
      throw new Error('Notifications Not Found');
    }


  } catch (error) {
    throw new Error('Failed to retrieve notifications: ' + error.message);
  }
}


const markNotificationAsRead = async (req, res, next) => {
  try {

    const id = req.params.id
    const userId = req.user.id

    const notification = await Notification.findById(id);
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (!notification.readBy.includes(userId)) {
      notification.readBy.push(userId);
    }

    await notification.save();

  } catch (error) {
    throw new Error('Failed to mark notification as read: ' + error.message);
  }
};

const removeUserFromNotification = async (req, res, next) => {

  try {

    const id = req.params.id
    const userId = req.user.id

    const notification = await Notification.findById(id);
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.recipients.includes(userId)) {
      notification.recipients = notification.recipients.filter(recipientId => recipientId != userId);
    }

    if (notification.readBy.includes(userId)) {
      notification.readBy = notification.readBy.filter(readById => readById != userId);
    }

    return await notification.save();

  } catch (error) {
    throw new Error('Failed to remove user from notification: ' + error.message);
  }
}



module.exports = {
  sendNotification,
  getAllNotificationByUserId,
  markNotificationAsRead,
  removeUserFromNotification
};
