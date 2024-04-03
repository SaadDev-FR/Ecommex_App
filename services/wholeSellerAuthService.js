const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const WholeSeller = require("../models/wholeSeller");
const Role = require("../models/role");
const crypto = require("crypto");
const { sendEmail } = require("./emailService");
const { SECRET_KEY, FRONTEND_BASE_URL } = require("../utils/constants");

const registerWholeSeller = async (wholeSeller) => {
  try {
    let role = await Role.findOne({ name: wholeSeller.roleName });
    if (!role) {
      role = await Role.create({ name: wholeSeller.roleName });
    }

    const hashedPassword = await bcrypt.hash(wholeSeller.password, 10);
    wholeSeller.password = hashedPassword;
    wholeSeller.roles = [role._id];
    const newUser = await WholeSeller.create(wholeSeller);

    return newUser;
  } catch (error) {
    throw new Error("Failed to register: " + error.message);
  }
};

const loginWholeSeller = async (email, password) => {
  try {
    const wholeSeller = await WholeSeller.findOne({ email }).populate("roles");

    if (!wholeSeller) {
      throw new Error("No whole seller found.");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      wholeSeller.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    let roles = [];
    wholeSeller?.roles.forEach((role) => {
      roles.push(role.name);
    });

    const token = jwt.sign(
      { wholeSellerId: wholeSeller._id, roles },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return {
      seller: {
        id: wholeSeller._id,
        firstName: wholeSeller.firstName,
        lastName: wholeSeller.lastName,
        email: wholeSeller.email,
        mobile: wholeSeller.mobile,
        businessName: wholeSeller.businessName,
        roles: wholeSeller.roles,
      },
      token,
    };
  } catch (error) {
    throw new Error("Failed to Login: " + error.message);
  }
};

const sendPasswordResetEmail = async (email) => {
  try {
    const wholeSeller = await WholeSeller.findOne({ email: email });

    if (!wholeSeller) {
      throw new Error("WholeSeller not found");
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000 / 12; // Token valid for 5 minutes

    // Update user with reset token and expiration
    await WholeSeller.updateOne(
      { _id: wholeSeller._id },
      { resetToken, resetTokenExpiration }
    );

    const subject = "Password Reset";
    const link = `${FRONTEND_BASE_URL}/seller-reset-password?token=${resetToken}`;
    const html = `<p>Click the following link to reset your password</p><a href=${link}>Click</a>`;

    return await sendEmail(email, subject, html);
  } catch (error) {
    throw new Error("Failed to send password reset email: " + error.message);
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    const resetToken = token;

    // Check if the token is valid and not expired
    const wholeSeller = await WholeSeller.findOne({
      resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!wholeSeller) {
      throw new Error("Invalid or expired reset link");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    wholeSeller.password = hashedPassword;
    wholeSeller.resetToken = "";
    wholeSeller.resetTokenExpiration = "";
    await wholeSeller.save();

    return { message: "Password reset successfully" };
  } catch (error) {
    throw new Error("Failed to reset password: " + error.message);
  }
};

module.exports = {
  registerWholeSeller,
  loginWholeSeller,
  sendPasswordResetEmail,
  resetPassword,
};
