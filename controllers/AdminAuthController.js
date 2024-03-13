const adminAuthService = require('../services/adminAuthService');

const registerAdmin = async (req, res) => {
  try {
    const admin = req.body
    const { firstName, lastName, email, mobile, password,confirmPassword} = admin;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and Confirm Password do not match' });
    }
    admin.roleName="admin";
    const result = await adminAuthService.registerAdmin(admin);
    res.status(201).json(result.message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await adminAuthService.loginAdmin(email, password);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await adminAuthService.sendPasswordResetEmail(email);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await adminAuthService.resetPassword(token, newPassword);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid token or failed to reset password' });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  sendPasswordResetEmail,
  resetPassword,
};
