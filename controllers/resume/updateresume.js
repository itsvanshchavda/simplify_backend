import Resume from "../../models/Resume.js";

const updateResume = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { filename, resumeId } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized user id not found",
      });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      return res.status(404).json({
        error: "Resume not found",
      });
    }

    resume.filename = filename;
    await resume.save();

    return res.status(200).json({
      message: "Resume updated",
      resume,
    });
  } catch (error) {
    console.error("Error updating resume:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export default updateResume;
