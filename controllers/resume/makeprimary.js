import Resume from "../../models/Resume.js";
import User from "../../models/User.js";

const makeprimary = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { resumeId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "Unauthorized user id is missing ",
      });
    }

    const user = await User.findById(userId);

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: userId,
    });

    if (!resume) {
      return res.status(400).json({
        error: "Resume not found",
      });
    }

    if (resume.primary) {
      return res.status(400).json({
        error: "Resume is already primary",
      });
    }

    await Resume.updateMany(
      { userId, primary: true },
      { $set: { primary: false } }
    );

    resume.primary = true;
    await resume.save();

    user.default_resume = resumeId;
    await user.save();

    res.status(200).json({
      message: "Resume updated as primary!",
    });
  } catch (err) {
    console.error("Error making primary", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default makeprimary;
