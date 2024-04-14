const mongoose = require('mongoose');
const { Schema } = mongoose;



const subscriptionPlanSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique:true
        },
        description: {
            type: String
        },
        price: {
            amount: {
                type: Number,
                required: true
            },
            currency: {
                type: String,
                required: true
            }
        },
        features: [
            { type: String }
        ],
        durationInMonths:{
            type: Number,
            required:true,
            default: 12
        },
        
        createdBy: {
            type: Schema.Types.ObjectId, 
            ref: 'admin'
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'admin'
        }
    },
    {
        timestamps: true
    }
);



const subscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

module.exports = subscriptionPlan;
