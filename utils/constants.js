require("dotenv").config();
// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI;

// JWT secret key
const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

// Email configuration for password reset
const EMAIL_HOST =
  process.env.EMAIL_HOST ||
  "your-email-service or host name e.g sandbox.smtp.mailtrap.io";
const EMAIL_HOST_PORT =
  process.env.EMAIL_HOST_PORT ||
  "your-email-service or host name e.g sandbox.smtp.mailtrap.io";
const EMAIL_USER = process.env.EMAIL_USER || "your-email-username";
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "your-email-password";
const SENDER_EMAIL = process.env.SENDER_EMAIL;

// Front-end base url
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

// Other constants
const PORT = process.env.PORT || 3000;

module.exports = {
  MONGODB_URI,
  SECRET_KEY,
  EMAIL_HOST,
  EMAIL_HOST_PORT,
  EMAIL_USER,
  EMAIL_PASSWORD,
  SENDER_EMAIL,
  PORT,
  FRONTEND_BASE_URL,
};
