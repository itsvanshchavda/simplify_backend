import express from "express";
import protectUser from "../middleware/protectuser.js";
import getUser from "../controllers/user/getuser.js";
import updateUser from "../controllers/user/updateuser.js";
import generateMail from "../controllers/mailgeneration/generatemail.js";
import { uploadProfilePic } from "../controllers/user/uploadprofilepic.js";
import getCountryCodes from "../controllers/user/getcontrycodes.js";
const router = express.Router();

router.route("/getuser").get(protectUser, getUser);
router.route("/updateuser").patch(protectUser, updateUser);
router.route("/generate-mail").get(protectUser, generateMail);
router.route("/upload-profile-pic").post(protectUser, uploadProfilePic);
router.route("/getcodes").get(getCountryCodes);

export default router;
