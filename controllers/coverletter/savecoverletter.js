import Coverletter from "../../models/Coverletter.js";
import User from "../../models/User.js";
import downloadPdf from "../../utils/downloadpdf.js";
import uploadFile from "../../utils/uploadfile.js";
import coverLetterTemplate from "./coverlettertemplate.js";

const saveCoverletter = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { coverletter, isDefaultCoverLetter } = req.body;

    const user = await User.findById(userId).populate(
      "default_resume application_kit.default_job"
    );

    const defaultJob = user?.application_kit?.default_job;

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User ID is missing" });
    }

    if (!coverletter) {
      return res
        .status(400)
        .json({ error: "Cover letter data is not provided" });
    }

    const cleanFileName = (name) => {
      return name
        .replace(/[^a-zA-Z0-9 ]/g, "") // keep only letters, numbers, spaces
        .replace(/\s+/g, " ") // collapse multiple spaces
        .trim();
    };

    const rawTitle = defaultJob?.job_title || "Job";
    const filename = `${cleanFileName(rawTitle)}_CoverLetter.pdf`;

    const html = coverLetterTemplate(user.default_resume?.json, coverletter);
    const buffer = await downloadPdf(html);
    const result = await uploadFile(buffer, filename, "coverletters");

    if (result) {
      const newCoverLetter = await Coverletter.create({
        userId,
        body: coverletter,
        url: result.secure_url,
        primary: isDefaultCoverLetter || false,
        jobId: defaultJob?._id,
        filename: filename,
      });

      if (isDefaultCoverLetter === true) {
        user.application_kit.default_cover_letter = newCoverLetter._id;
        await user.save();
      }

      return res.status(200).json({
        message:
          isDefaultCoverLetter === true
            ? "Cover letter saved and set as default"
            : "Cover letter saved successfully",
        coverLetter: newCoverLetter,
      });
    } else {
      return res.status(500).json({ error: "Failed to upload cover letter" });
    }
  } catch (error) {
    console.error("Error saving cover letter:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default saveCoverletter;
