const mongoose = require('mongoose');
const { Schema } = mongoose;
const { PaymentMethod, PaymentStatus } = require('../utils/orderConstants')



const subscriptionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Seller',
            required: true
        },
        planId: {
            type: String,
            ref: 'SubscriptionPlan',
            required: true
        },
        startDate: {
            type: Date,
            default: Date.now,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'inactive',
            required: true
        },
        payment: {
            method: {
                type: String,
                enum: Object.values(PaymentMethod),
                required: true
            },

            status: {
                type: String,
                enum: Object.values(PaymentStatus),
                required: true
            },
        },
        createdBy: {
            type: Schema.Types.ObjectId, ref: 'seller'
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'seller'
        }
    },
    {
        timestamps: true
    }
);



const subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = subscription;
