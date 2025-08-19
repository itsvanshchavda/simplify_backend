import Job from "../../models/Job.js";

const savejobdata = async (req, res) => {
  try {
    const { job } = req.body;

    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User ID is missing" });
    }

    if (!job) {
      return res.status(400).json({ error: "Job data is not provided" });
    }

    const newJob = await new Job({
      ...job,
      userId: userId,
    });

    await newJob.save();

    if (!newJob) {
      return res.status(500).json({ error: "Failed to save job data" });
    }

    return res.status(201).json({
      message: "Job data saved successfully",
      newJob,
    });
  } catch (error) {
    console.error("Error saving job data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default savejobdata;
