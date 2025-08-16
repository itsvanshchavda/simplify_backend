import crypto from "crypto";
import User from "../../models/User.js";
import { sendEmail } from "../../utils/sendmail.js";
const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Please provide your email address",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "No account found with this email address",
      });
    }

    const resetToken = crypto.randomBytes(16).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password/?token=${
      user.resetPasswordToken
    }&email=${encodeURIComponent(email)}`;

    const name = user.firstName + " " + user.lastName;
    await sendEmail(resetLink, email, name);

    return res.status(200).json({
      message: "Password reset link sent to your email address",
    });
  } catch (error) {
    console.error("Forgot password error ", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export default forgotpassword;
