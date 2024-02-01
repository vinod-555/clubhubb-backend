import userModel from "../models/userModel.js";
import { sendPasswordResetCodeEmail } from "../helpers/emailHelper.js";
import bcrypt from "bcrypt";
const generateResetCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const forgotPasswordController = async (req, res) => {
    try {
        const { clubEmail } = req.body;
        if (!clubEmail) {
            return res.status(400).send({ message: "Email is required" });
        }

        const user = await userModel.findOne({ email: clubEmail });
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
        const emailSent = await sendPasswordResetCodeEmail(
            user.email,
            resetCode
        );

        if (!emailSent) {
            return res.status(500).send({
                success: false,
                message: "Failed to send reset code email",
            });
        }

        return res.status(200).send({
            success: true,
            message:
                "Reset code sent to your email. Use the code to reset your password.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};


export const verifyOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(email,otp);
        if (!email || !otp) {
            return res
                .status(400)
                .send({ message: "Email and OTP are required" });
        }

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        // Check if the received OTP matches the stored one and is not expired
        if (
            user.resetCode &&
            user.resetCode.code === otp &&
            new Date(user.resetCode.expiresAt) > new Date()
        ) {
            // Clear the reset code after successful verification
            user.resetCode = undefined;
            await user.save();

            // You can handle the success case here, such as allowing the user to reset the password.
            return res.status(200).send({
                success: true,
                message:
                    "OTP verified successfully. Proceed to reset your password.",
            });
        } else {
            return res.status(400).send({
                success: false,
                message: "Invalid or expired OTP",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};




export const resetPasswordController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate if email and password are provided
        if (!email || !password) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Email and password are required",
                });
        }

        // Find the user by email
        const user = await userModel.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        // Update the user's password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        return res
            .status(200)
            .json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error });
    }
};

