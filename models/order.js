const mongoose = require('mongoose');
const { Schema } = mongoose;
const { OrderStatus, PaymentMethod, PaymentStatus, ShippingMethod } = require('../utils/orderConstants')



const orderSchema = new Schema(
    {
        orderNumber: {type:String, unique:true},
        customer: {
            customerId: {
                type: Schema.Types.ObjectId,
                ref: 'Seller',
                required: true
            },
        },
        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true }
            }

        ],
        totalAmount: {type:Number, required:true},
        currency:{type:String, required:true},
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING
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
        shipping: {
            address: { type: String, required: true },
            mobile: { type: String, required: true },
            method: {
                type: String,
                enum: Object.values(ShippingMethod),
                required: true
            },
        }
    },
    {
        timestamps: true
    }
);



const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
