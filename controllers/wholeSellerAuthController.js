const wholeSellerAuthService = require("../services/wholeSellerAuthService");

const registerWholeSeller = async (req, res) => {
  try {
    const wholeSeller = req.body;
    const {
      firstName,
      lastName,
      businessName,
      email,
      mobile,
      password,
      confirmPassword,
    } = wholeSeller;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password does not match" });
    }
    wholeSeller.roleName = "wholeSeller";
    const result = await wholeSellerAuthService.registerWholeSeller(
      wholeSeller
    );
    res.status(201).json({
      success: true,
      message: "WholeSeller Registered Successfully",
      wholeSeller: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const loginWholeSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { seller, token } = await wholeSellerAuthService.loginWholeSeller(
      email,
      password
    );

    res
      .status(200)
      .json({ success: true, message: "Login Successful", seller, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await wholeSellerAuthService.sendPasswordResetEmail(email);

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
    await wholeSellerAuthService.resetPassword(token, newPassword);

    res
      .status(200)
      .json({ success: true, message: "Password Reset Successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerWholeSeller,
  loginWholeSeller,
  sendPasswordResetEmail,
  resetPassword,
};
