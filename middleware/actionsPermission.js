// middleware/permissions.js
const jwt = require("jsonwebtoken");
const User = require("../models/admin");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const { SECRET_KEY } = require("../utils/constants");

const actionPermissions = (modelName) => {
  return async (req, res, next) => {
    try {
      const id = req.params.id;
      let Model;

      if (mongoose.models[modelName]) {
        // Return the existing model
        Model = mongoose.model(modelName);
      }

      const documents = await Model?.findById(id);

      if (!documents) {
        return res.status(404).json({ success: false, message: "Not Found" });
      }

      // Example ObjectId values
      const pattern = /id/i;
      const keysContainingId = Object.keys(req.user).filter((key) =>
        pattern.test(key)
      );

      const userId = req.user[keysContainingId];
      const createdbyId = documents.createdBy.toString();

      if (userId === createdbyId) {
        next();
      } else {
        res
          .status(403)
          .json({ success: false, message: "Insufficient permissions" });
      }
    } catch (error) {
      res
        .status(401)
        .json({ success: false, message: "Fail to process: " + error.message });
    }
  };
};

module.exports = {
  actionPermissions,
};
