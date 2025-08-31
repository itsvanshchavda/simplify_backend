import express from "express";
import protectUser from "../middleware/protectuser.js";
import generateCoverLetter from "../controllers/coverletter/generatecoverletter.js";
import saveCoverletter from "../controllers/coverletter/savecoverletter.js";
import getAllLetters from "../controllers/coverletter/getcoverletters.js";
import deleteLeter from "../controllers/coverletter/deleteletter.js";
import getCoverletterById from "../controllers/coverletter/getcoverletterbyid.js";
import updateCoverletter from "../controllers/coverletter/updatecoverletter.js";

const router = express.Router();

router.route("/getall-letters").get(protectUser, getAllLetters);
router.route("/generate-letter").get(protectUser, generateCoverLetter);
router.route("/save-letter").post(protectUser, saveCoverletter);
router.route("/delete-letter/:id").delete(protectUser, deleteLeter);
router.route("/getcoverletter").post(protectUser, getCoverletterById);
router.route("/update-letter").put(protectUser, updateCoverletter);
export default router;
