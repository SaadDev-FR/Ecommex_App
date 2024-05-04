const mongoose = require('mongoose');
const { Schema } = mongoose;
const { HOST, PORT } = require('../utils/constants')
const Reviews = require('./productReview');


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

        averageRating: {
            type: Number,
            default: 0
        },

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

productSchema.post('find', async function (docs) {
    // Array to store all promises
    const promises = [];
    
    docs.forEach(product => {
        // Check if images URLs already have the prefix added
        const imagesWithUrls = product.images.map(image => {
            if (!image.startsWith(`${HOST}:${PORT}/images/product/`)) {
                return `${HOST}:${PORT}/images/product/${image}`;
            } else {
                return image; // URL already has the prefix, no need to append again
            }
        });
        
        product.images = imagesWithUrls;

        if (product.reviews && product.reviews.length > 0) {
            // Push each asynchronous operation into the promises array
            promises.push(
                Reviews.find({_id: {$in: product.reviews}}, { rating: 1 })
                    .then(reviews => {
                        reviews = reviews.map(item => item.rating);
                        const sum = reviews.reduce((total, rating) => total + rating, 0);
                        product.averageRating = sum / reviews.length;
                    })
            );
        }
    });

    // Wait for all asynchronous operations to complete
    await Promise.all(promises);
});


productSchema.post('findOne', async function(doc) {
    if (doc) {
        // Transform images URLs
        doc.images = doc.images.map(image => {
            // Check if the URL prefix has already been added
            if (!image.startsWith(`${HOST}:${PORT}/images/product/`)) {
                return `${HOST}:${PORT}/images/product/${image}`;
            } else {
                return image; // URL already has the prefix, no need to append again
            }
        });
        
        // Process reviews and calculate average rating if needed
        if (doc.reviews && doc.reviews.length > 0) {
            const reviews = await Reviews.find({_id: {$in: doc.reviews}}, { rating: 1 });
            const ratings = reviews.map(item => item.rating);
            const sum = ratings.reduce((total, rating) => total + rating, 0);
            doc.averageRating = sum / ratings.length;
        }
    }
});


productSchema.virtual('payableAmount').get(function () {
    return this.price.amount - (this.price.amount * this.discountInPercent / 100);
});


productSchema.set('toJSON', { virtuals: true });

const product = mongoose.model('Product', productSchema)

module.exports = product;
