const wholeSellerAuthService = require('../services/wholeSellerAuthService');

const registerWholeSeller = async (req, res) => {
  try {
    const user = req.body
    const { firstName, lastName, businessName, email, mobile, password,confirmPassword} = user;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and Confirm Password do not match' });
    }
    user.roleName="wholeSeller";
    const result = await wholeSellerAuthService.registerWholeSeller(user);
    res.status(201).json(result.message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const loginWholeSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await wholeSellerAuthService.loginWholeSeller(email, password);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await wholeSellerAuthService.sendPasswordResetEmail(email);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await wholeSellerAuthService.resetPassword(token, newPassword);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid token or failed to reset password' });
  }
};

module.exports = {
  registerWholeSeller,
  loginWholeSeller,
  sendPasswordResetEmail,
  resetPassword,
};
