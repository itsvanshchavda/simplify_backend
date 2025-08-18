import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "User not found!",
      });
    }

    const stringPass = password.toString();
    const isMatch = await bcrypt.compare(stringPass, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Please enter correct password!",
      });
    }

    const userData = user.toObject();
    delete userData.password;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    user.token = token;
    await user.save();

    return res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: user.token,
    });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export default loginUser;
