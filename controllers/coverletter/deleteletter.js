import Coverletter from "../../models/Coverletter.js";

const deleteLeter = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    await Coverletter.findOneAndDelete({ userId: userId, _id: id });

    return res
      .status(200)
      .json({ message: "Coverletter deleted successfully" });
  } catch (error) {
    console.error("Error deleting coverletter:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteLeter;
