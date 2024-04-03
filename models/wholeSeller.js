const mongoose = require("mongoose");
const { Schema } = mongoose;

let WholeSeller;

try {
  // Attempt to retrieve an existing model
  WholeSeller = mongoose.model("WholeSeller");
} catch (error) {
  // If the model does not exist, create it
  WholeSeller = mongoose.model("WholeSeller", {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    businessName: { type: String, required: true },
    password: { type: String, required: true },
    roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
    resetToken: String,
    resetTokenExpiration: Date,
  });
}

module.exports = WholeSeller;
