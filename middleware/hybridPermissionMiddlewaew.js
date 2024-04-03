// middleware/permissions.js
const jwt = require("jsonwebtoken");
const User = require("../models/admin");
const mongoose = require("mongoose");

const { SECRET_KEY } = require("../utils/constants");

// resource creater  or role base permission (rcorbPermisssion)
const rcorbPermisssion = (requiredRole = [], modelName) => {
  return async (req, res, next) => {
    // Get the token from the request headers or wherever it's stored
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Token not provided" });
    }

    try {
      // Verify the token and extract user information
      const decoded = jwt.verify(token, SECRET_KEY);

      // Check if the user has the required role
      if (
        decoded &&
        decoded.roles &&
        requiredRole.some((role) => decoded.roles.includes(role))
      ) {
        // User has the required role, proceed to the next middleware or route handler
        req.user = decoded; // Attach user information to the request object if needed
        next();
      } else {
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
        const keysContainingId = Object.keys(decoded).filter((key) =>
          pattern.test(key)
        );

        const userId = decoded[keysContainingId];
        const createdbyId = documents?.createdBy?.toString();

        if (userId === createdbyId) {
          next();
        } else {
          // User does not have the required role, send a forbidden response
          res
            .status(403)
            .json({ success: false, message: "Insufficient permissions" });
        }
      }
    } catch (error) {
      res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized - Invalid token: " + error,
        });
    }
  };
};

module.exports = {
  rcorbPermisssion,
};
