import userModel from '../models/userModel.js';
import { sendPasswordResetCodeEmail } from '../helpers/emailHelper.js';

const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Generate a reset code, store it in the user document, and set an expiration time (e.g., 1 hour)
    const resetCode = generateResetCode();
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration
    user.resetCode = { code: resetCode, expiresAt: expirationTime };
    await user.save();

    // Send the reset code to the user's email
    const emailSent = await sendPasswordResetCodeEmail(user.email, resetCode);

    if (!emailSent) {
      return res.status(500).send({
        success: false,
        message: "Failed to send reset code email",
      });
    }

    res.status(200).send({
      success: true,
      message: "Reset code sent to your email. Use the code to reset your password.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
