const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Role = mongoose.model('Category', categorySchema);

module.exports = Role;
