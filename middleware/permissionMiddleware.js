// middleware/permissions.js
const jwt = require('jsonwebtoken');
const User = require('../models/admin');

const { SECRET_KEY } = require('../utils/constants');

const checkPermissions = (requiredRole) => {
  return async (req, res, next) => {
    // Get the token from the request headers or wherever it's stored
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - Token not provided' });
    }

    try {
      // Verify the token and extract user information
      const decoded = jwt.verify(token, SECRET_KEY);

      // Check if the user has the required role
      if (decoded && decoded.roles && requiredRole.some(role => decoded.roles.includes(role))) {

        // User has the required role, proceed to the next middleware or route handler
        req.user = decoded; // Attach user information to the request object if needed
        next();
      } else {
        // User does not have the required role, send a forbidden response
        res.status(403).json({ success: false, message: 'Insufficient permissions' });
      }
    } catch (error) {
      console.error('Error in checkPermissions middleware:', error);
      res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' });
    }
  };
};

module.exports = {
  checkPermissions,
};
