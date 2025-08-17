import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();
const protectUser = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.token !== token) {
      return res.status(401).json({ message: "Token invalid or expired" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Protect user error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protectUser;
