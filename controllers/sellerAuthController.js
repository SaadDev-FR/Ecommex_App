const sellerAuthService = require('../services/sellerAuthService');

const registerSeller = async (req, res) => {
  try {
    const seller = req.body
    const { firstName, lastName, email, mobile, password,confirmPassword} = seller;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and Confirm Password do not match' });
    }
    seller.roleName="seller";
    const result = await sellerAuthService.registerSeller(seller);
    res.status(201).json(result.message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await sellerAuthService.loginSeller(email, password);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await sellerAuthService.sendPasswordResetEmail(email);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await sellerAuthService.resetPassword(token, newPassword);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid token or failed to reset password' });
  }
};

module.exports = {
  registerSeller,
  loginSeller,
  sendPasswordResetEmail,
  resetPassword,
};
