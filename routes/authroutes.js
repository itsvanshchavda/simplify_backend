import express from "express";
import registerUser from "../controllers/authentication/register.js";
import loginUser from "../controllers/authentication/login.js";
import forgotpassword from "../controllers/authentication/forgotpassword.js";
import resetpassword from "../controllers/authentication/resetpassword.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgot-password").post(forgotpassword);
router.route("/reset-password/:token").post(resetpassword);

export default router;
