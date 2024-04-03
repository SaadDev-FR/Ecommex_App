const adminAuthService = require("../services/adminAuthService");

const registerAdmin = async (req, res) => {
  try {
    const admin = req.body;
    const { firstName, lastName, email, mobile, password, confirmPassword } =
      admin;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password does not match" });
    }
    admin.roleName = "admin";
    const result = await adminAuthService.registerAdmin(admin);
    res.status(201).json({
      success: true,
      message: "Admin Registered Successfully",
      admin: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { admin, token } = await adminAuthService.loginAdmin(email, password);

    res
      .status(200)
      .json({ success: true, message: "Login Successful", admin, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    await adminAuthService.sendPasswordResetEmail(email);

    res.status(200).json({
      success: true,
      message: "Password Reset Email Sent Successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await adminAuthService.resetPassword(token, newPassword);

    res
      .status(200)
      .json({ success: true, message: "Password Reset Successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  sendPasswordResetEmail,
  resetPassword,
};
