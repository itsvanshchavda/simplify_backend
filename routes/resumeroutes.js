import express from "express";
import parseText from "../controllers/resume/parsetext.js";
import parseJson from "../controllers/resume/parsejson.js";
import jsonToPdf from "../controllers/resume/jsontopdf.js";
const router = express.Router();

router.route("/parse-text").post(parseText);
router.route("/parse-json").post(parseJson);
router.route("/json-to-pdf").post(jsonToPdf);

export default router;
