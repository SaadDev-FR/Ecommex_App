// middleware/permissions.js
const jwt = require('jsonwebtoken');
const Subscription = require('../models/subscription');

const { SECRET_KEY } = require('../utils/constants');

const checkSubscription = async (req,res,next) => {
    // Get the token from the request headers or wherever it's stored
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - Token not provided' });
    }

    try {
      // Verify the token and extract user information
      const decoded = jwt.verify(token, SECRET_KEY);

      // Check if the user has the required role
      if (decoded) {

        const subscription = await Subscription.findOne({ userId: decoded.sellerId })

        const currentDate = new Date()

        if (subscription && subscription.endDate > currentDate) {


          req.user = decoded; 
          next();
        }

        else {
          res.status(400).json({ success: false, message: 'Insufficient permissions' });

        }
      } else {
        // User does not have the required role, send a forbidden response
        res.status(403).json({ success: false, message: 'Insufficient permissions' });
      }
    } catch (error) {
      res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' });
    }
  };

module.exports = {
  checkSubscription
};
