import Job from "../../models/Job.js";
import User from "../../models/User.js";

const savejobdata = async (req, res) => {
  try {
    const { jobData, isDefaultJob } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User ID is missing" });
    }

    if (!jobData) {
      return res.status(400).json({ error: "Job data is not provided" });
    }

    const existingJob = await Job.findOne({ userId, job_url: jobData.job_url });
    if (existingJob) {
      return res
        .status(400)
        .json({ error: "Job with this URL already exists" });
    }

    if (isDefaultJob) {
      await Job.updateMany(
        { userId, primary: true },
        { $set: { primary: false } }
      );

      await User.findByIdAndUpdate(userId, { default_job: newJob._id });
    }

    const newJob = new Job({
      ...jobData,
      userId,
      primary: !!isDefaultJob, // true/false
    });

    await newJob.save();

    return res.status(201).json({
      message: "Job data saved successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Error saving job data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default savejobdata;
