const mongoose = require('mongoose');
const { Schema } = mongoose;

let Seller;

try {
  // Attempt to retrieve an existing model
  Seller = mongoose.model('Seller');
} catch (error) {
  // If the model does not exist, create it
  Seller = mongoose.model('Seller', {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
    resetToken: String,
    resetTokenExpiration: Date,
  });
}

module.exports = Seller;
