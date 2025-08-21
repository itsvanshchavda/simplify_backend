import express from "express";
import protectUser from "../middleware/protectuser.js";
import generateCoverLetter from "../controllers/coverletter/generatecoverletter.js";
import saveCoverletter from "../controllers/coverletter/savecoverletter.js";

const router = express.Router();

router.route("/generate-letter").get(protectUser, generateCoverLetter);
router.route("/save-letter").post(protectUser, saveCoverletter);

export default router;
