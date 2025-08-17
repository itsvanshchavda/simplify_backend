import express from "express";
import registerUser from "../controllers/authentication/register.js";
import loginUser from "../controllers/authentication/login.js";
import forgotpassword from "../controllers/authentication/forgotpassword.js";
import resetpassword from "../controllers/authentication/resetpassword.js";
import {
  googleAuth,
  googleCallback,
} from "../controllers/authentication/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgot-password").post(forgotpassword);
router.route("/reset-password/").post(resetpassword);

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// router.get("/linkedin", linkedinAuth);
// router.get("/linkedin/callback", linkedinCallback);

export default router;
