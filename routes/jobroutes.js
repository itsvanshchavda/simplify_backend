import getJob from "../controllers/job/getjob.js";
import express from "express";
import savejobdata from "../controllers/job/savejobdata.js";
import protectUser from "../middleware/protectuser.js";
import getAllSavedJobs from "../controllers/job/getallsavedjobs.js";
import getJobById from "../controllers/job/getjobbyid.js";

const router = express.Router();

router.route("/getjob").post(getJob);
router.route("/savejobdata").post(protectUser, savejobdata);
router.route("/getallsavedjobs").get(protectUser, getAllSavedJobs);
router.route("/getjob/:id").get(protectUser, getJobById);
export default router;
