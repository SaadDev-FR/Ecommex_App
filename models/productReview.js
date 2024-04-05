const mongoose = require('mongoose');
const { Schema } = mongoose;


const productReviewSchema = Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Seller',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);


const productReview = mongoose.model('ProductReview', productReviewSchema)

module.exports = productReview;
