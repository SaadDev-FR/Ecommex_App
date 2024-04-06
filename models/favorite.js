const mongoose = require('mongoose');
const { Schema } = mongoose;

const FavoriteSchema = Schema(
    {
        userId: { type: String, required: true ,ref: 'Seller' },
        products: [{ type: String,required: true, ref: 'Product' }]
    },
    {
        timestamps: true
    }
);


const favorite = mongoose.model('Favorite', FavoriteSchema)

module.exports = favorite;
