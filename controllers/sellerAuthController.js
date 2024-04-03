const sellerAuthService = require("../services/sellerAuthService");

const registerSeller = async (req, res) => {
  try {
    const seller = req.body;
    const { firstName, lastName, email, mobile, password, confirmPassword } =
      seller;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password does not match",
      });
    }
    seller.roleName = "seller";
    const result = await sellerAuthService.registerSeller(seller);
    res.status(201).json({
      success: true,
      message: "Seller Registered Successfully",
      seller: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await sellerAuthService.loginSeller(
      email,
      password
    );

    res
      .status(200)
      .json({ success: true, message: "Login Successful", user, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    await sellerAuthService.sendPasswordResetEmail(email);

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
    await sellerAuthService.resetPassword(token, newPassword);

    res
      .status(200)
      .json({ success: true, message: "Password Reset Successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerSeller,
  loginSeller,
  sendPasswordResetEmail,
  resetPassword,
};
