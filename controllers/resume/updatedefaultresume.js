import Resume from "../../models/Resume.js";
import User from "../../models/User.js";

const updateDefaultResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const { resumeId } = req.body; // customized resume id

    // remove old default
    await Resume.updateMany(
      { userId, primary: true },
      { $set: { primary: false } }
    );

    // set new default
    const newDefault = await Resume.findByIdAndUpdate(
      resumeId,
      { $set: { primary: true } },
      { new: true }
    );

    // update user profile
    await User.findByIdAndUpdate(userId, { default_resume: resumeId });

    res
      .status(200)
      .json({ message: "Default resume updated", resume: newDefault });
  } catch (err) {
    res.status(500).json({ error: "Failed to update default resume" });
  }
};

export default updateDefaultResume;
