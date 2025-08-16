import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../../models/User.js";
const resetpassword = async (req, res) => {
  try {
    const { email, password, token } = req.body;

    if (!token)
      return res.status(400).json({ error: "Reset token is required" });
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password)
      return res.status(400).json({ error: "Password is required" });

    const user = await User.findOne({
      email,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(401).json({
        error: "Password reset link has expired. Please request a new one.",
      });
    }

    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    const salt = await bcrypt.genSalt(10);
    const stringPass = password.toString();
    const hashPass = await bcrypt.hash(stringPass, salt);

    user.password = hashPass;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully!!",
    });
  } catch (err) {
    console.log("Reset password error : ", err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export default resetpassword;
