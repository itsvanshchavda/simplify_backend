import Resume from "../../models/Resume.js";

const deleteReusume = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    await Resume.findOneAndDelete({ userId: userId, _id: id });

    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteReusume;
