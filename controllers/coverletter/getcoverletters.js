import Coverletter from "../../models/Coverletter.js";

const getAllLetters = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User ID is missing" });
    }

    const letters = await Coverletter.find({ userId })
      .sort({ primary: -1 })
      .populate("jobId");

    return res.status(200).json({
      message: "Coverletters fetched successfully",
      letters,
    });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default getAllLetters;
