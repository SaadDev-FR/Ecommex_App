const mongoose = require('mongoose');
const { Schema } = mongoose;


// If the model does not exist, create it
const productSchema = Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: false },
        price: {

            amount: { type: Number, required: true },
            currency: { type: String, required: true }
        },
        discountInPercent: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        images: [{ type: String }],
        status: {
            type: String,
            enum: ['Active', 'Inactive', 'Out of Stock',
                'Discontinued', 'Pending Approval', 'Draft',
                'Sold Out', 'Hidden', 'Unpublished'
            ]
        },
        categoryId: {
            type: Schema.Types.ObjectId, ref: 'Category'
        },
        minimumOrder: {
            type: Number,
            default: 1,
            min: 1
        },
        reviews: [{
            type: Schema.Types.ObjectId,
            ref: 'ProductReview'
        }],

        createdBy: {
            type: Schema.Types.ObjectId, ref: 'WholeSeller'
        },
        updatedBy: {
            type: Schema.Types.ObjectId
        }
    },
    {
        timestamps: true
    }
);

productSchema.virtual('payableAmount').get(function () {
    return this.price.amount - (this.price.amount * this.discountInPercent / 100);
});


productSchema.set('toJSON', { virtuals: true });

const product = mongoose.model('Product', productSchema)

module.exports = product;
