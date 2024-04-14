const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = Schema(
    {
        message: String,
        recipients: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],

        read:{type:Boolean, default:false}
    },
    {
        timestamps: true
    }
);

const notification = mongoose.model('Notification', notificationSchema)

module.exports = notification;
