import Resume from "../../models/Resume.js";
import crypto from "crypto";

const toggleSharing = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { resumeId, sharing } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (sharing === undefined) {
      return res.status(400).json({ error: "Sharing status is required" });
    }

    if (sharing) {
      // Sharing ON → generate only if not exists
      if (!resume.public_id) {
        resume.public_id = crypto.randomBytes(12).toString("hex");
      }
      resume.sharing = true;
    } else {
      // Sharing OFF
      resume.public_id = undefined;
      resume.sharing = false;
    }

    await resume.save();

    return res.status(200).json({
      message: sharing ? "Sharing enabled" : "Sharing disabled",
      resume,
    });
  } catch (error) {
    console.error("Error toggling sharing status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default toggleSharing;
