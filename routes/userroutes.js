import express from "express";
import protectUser from "../middleware/protectuser.js";
import getUser from "../controllers/user/getuser.js";
import updateUser from "../controllers/user/updateuser.js";
const router = express.Router();

router.route("/getuser").get(protectUser, getUser);
router.route("/updateuser").patch(protectUser, updateUser);

export default router;
