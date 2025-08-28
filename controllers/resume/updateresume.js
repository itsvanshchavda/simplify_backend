import Resume from "../../models/Resume.js";
import resumeTemplate from "./resumetemplate.js";
import downloadPdf from "../../utils/downloadpdf.js";
import uploadPdfBuffer from "../../utils/uploadpdfbuffer.js";
import { v2 as cloudinary } from "cloudinary";

const updateResume = async (req, res) => {
  try {
    const { json, filename, resumeId } = req.body;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (filename && !json) {
      resume.filename = filename;
      await resume.save();
      return res.status(200).json({
        message: "Resume filename updated successfully",
        resume,
      });
    }

    if (json) {
      // delete old file if url exists
      if (resume.url) {
        try {
          const publicId = resume.url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`resumes/${publicId}`);
          console.log("Old file deleted:", publicId);
        } catch (err) {
          console.warn("Old file delete failed:", err.message);
        }
      }

      // Json -> Text
      const text = JSON.stringify(json).replace(/\s+/g, "");

      // JSON -> HTML
      const html = resumeTemplate(json);

      // HTML -> PDF
      const buffer = await downloadPdf(html);

      // Upload new PDF
      const result = await uploadPdfBuffer(
        buffer,
        filename || resume.filename,
        "resumes"
      );

      if (!result) {
        return res.status(500).json({ error: "Failed to upload new PDF" });
      }

      const updatedResume = await Resume.findByIdAndUpdate(
        {
          _id: resumeId,
          userId: req.user._id,
        },

        {
          url: result.secure_url,
          json: json,
          filename: filename,
          text: text,
          skills: json.allSkills || [],
          yearsOfExperience: json.totalYearsOfExperience || 0,
          degreeType: json.degreeType || 0,
          url: result?.secure_url,
        },
        { new: true }
      );

      if (!updatedResume) {
        return res.status(400).json({ error: "Failed to update resume" });
      }

      return res.status(200).json({
        message: "Resume updated successfully",
        resume: updatedResume,
      });
    }

    return res.status(400).json({ error: "No valid fields to update" });
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export default updateResume;
