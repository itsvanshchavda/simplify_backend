import express from "express";
import protectUser from "../middleware/protectuser.js";
import getUser from "../controllers/user/getuser.js";
import updateUser from "../controllers/user/updateuser.js";
import generateMail from "../controllers/mailgeneration/generatemail.js";
const router = express.Router();

router.route("/getuser").get(protectUser, getUser);
router.route("/updateuser").patch(protectUser, updateUser);
router.route("/generate-mail").get(protectUser, generateMail);

export default router;
