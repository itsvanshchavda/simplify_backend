import User from "../../models/User.js";

const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .select("-password")
      .populate(
        "default_resume application_kit.default_job application_kit.default_cover_letter"
      );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Get user error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default getUser;
