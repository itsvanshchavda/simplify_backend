import Resume from "../../models/Resume.js";

const getSharedResume = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: "Public ID is required" });
    }

    const resume = await Resume.findOne({
      public_id: public_id,
      sharing: true,
    });

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or not shared" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    console.error("Error fetching shared resume:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default getSharedResume;
