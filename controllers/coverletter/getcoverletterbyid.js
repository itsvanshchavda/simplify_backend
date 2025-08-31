import Coverletter from "../../models/Coverletter.js";

const getCoverletterById = async (req, res) => {
  try {
    const userId = req.user?._id;

    const { coveletter_id } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User ID is missing" });
    }

    const coverletter = await Coverletter.findOne({
      _id: coveletter_id,
      userId,
    });

    if (!coverletter) {
      return res.status(404).json({ error: "Coverletter not found" });
    }

    return res.status(200).json({
      coverletter,
    });
  } catch (error) {
    console.error("Error fetching coverletter by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default getCoverletterById;
