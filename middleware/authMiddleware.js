const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/constants");
const Sellers = require("../models/seller.js");
const Admin = require("../models/admin.js");
const WholeSeller = require("../models/wholeSeller.js");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, SECRET_KEY);
    let user = null;

    if (decoded.adminId) {
      user = await Admin.findOne({ _id: decoded.adminId });
    } else if (decoded.sellerId) {
      user = await Sellers.findOne({ _id: decoded.sellerId });
    } else if (decoded.wholeSellerId) {
      user = await WholeSeller.findOne({ _id: decoded.wholeSellerId });
    }

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Please authenticate: " + error });
  }
};

module.exports = {
  authenticateUser,
};
