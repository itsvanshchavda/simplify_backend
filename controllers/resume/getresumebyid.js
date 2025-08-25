import Resume from "../../models/Resume.js";

const getResumeById = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { resumeId } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User Id is missing" });
    }

    if (!resumeId) {
      return res.status(401).json({ error: "Resume id missing" });
    }

    const resume = await Resume.findOne({
      userId,
      _id: resumeId,
    });

    return res.status(200).json({
      message: "Resume fetched successfully",
      resume,
    });
  } catch (error) {
    console.error("Error getting resume:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default getResumeById;
