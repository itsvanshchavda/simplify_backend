import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const stringPass = password.toString();
    const hashPass = await bcrypt.hash(stringPass, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPass,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    user.token = token;
    user.save();

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      user: userData,
      token,
    });
  } catch (err) {
    console.error("Register Error", err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
export default registerUser;
