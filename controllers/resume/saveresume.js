import Resume from "../../models/Resume.js";
import downloadPdf from "../../utils/downloadpdf.js";
import uploadPdfBuffer from "../../utils/uploadpdfbuffer.js";
import resumeTemplate from "./resumetemplate.js";

const saveResume = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User ID is missing" });
    }

    let resume_url;
    let resume_text;

    const { filename, json, resume_type, job_id } = req.body;

    if (!json || Object.keys(json).length === 0) {
      return res.status(400).json({ error: "Resume JSON is required" });
    }

    if (!filename)
      return res.status(400).json({ error: "Filename is required" });

    const html = resumeTemplate(json);
    const buffer = await downloadPdf(html);
    const result = await uploadPdfBuffer(buffer, filename);

    if (!result) {
      return res.status(500).json({
        error: "Failed to upload PDF",
      });
    }

    resume_url = result.secure_url;
    resume_text = JSON.stringify(json);

    const newResume = await Resume.create({
      url: resume_url,
      filename,
      text: resume_text,
      json,
      resume_type,
      customized: true,
      userId,
      skills: json.allSkills || [],
      yearsOfExperience: json.totalYearsOfExperience,
      degreeType: json.degreeType || 0,
      jobinfo: job_id,
    });

    return res.status(201).json({
      message: "Resume saved successfully",
      resume: newResume,
    });
  } catch (error) {
    console.error("Error saving resume:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default saveResume;
