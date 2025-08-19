import Job from "../../models/Job.js";

const getJobById = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User ID is missing" });
    }

    const job = await Job.findOne({
      userId,
      _id: req.params.id,
    });

    return res.status(200).json({
      message: "Jobs fetched successfully",
      job,
    });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default getJobById;
