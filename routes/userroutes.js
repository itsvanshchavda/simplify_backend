import express from "express";
import protectUser from "../middleware/protectuser.js";
import getUser from "../controllers/user/getuser.js";
const router = express.Router();

router.route("/getuser").get(protectUser, getUser);

export default router;
