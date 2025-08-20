import express from "express";
import parseText from "../controllers/resume/parsetext.js";
import parseJson from "../controllers/resume/parsejson.js";
import jsonToPdf from "../controllers/resume/jsontopdf.js";
import protectUser from "../middleware/protectuser.js";
import addResume from "../controllers/resume/addresume.js";
import customizeResume from "../controllers/resume/customizeresume.js";
import saveResume from "../controllers/resume/saveresume.js";
import updateDefaultResume from "../controllers/resume/updatedefaultresume.js";
const router = express.Router();

router.route("/parse-text").post(parseText);
router.route("/parse-json").post(parseJson);
router.route("/json-to-pdf").post(jsonToPdf);
router.route("/addresume").post(protectUser, addResume);
router.route("/customize-resume").post(protectUser, customizeResume);
router.route("/saveresume").post(protectUser, saveResume);
router.route("/update-defaultresume").post(protectUser, updateDefaultResume);

export default router;
