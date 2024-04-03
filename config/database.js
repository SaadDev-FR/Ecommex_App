const mongoose = require("mongoose");
const { MONGODB_URI } = require("../utils/constants");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
module.exports = { connectDB };
