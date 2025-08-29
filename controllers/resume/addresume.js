import convertJson from "../../helpers/convert-json.js";
import convertText from "../../helpers/convert-text.js";
import upload from "../../middleware/upload.js";
import Resume from "../../models/Resume.js";
import User from "../../models/User.js";
import downloadPdf from "../../utils/downloadpdf.js";
import uploadPdfBuffer from "../../utils/uploadpdfbuffer.js";
import resumeTemplate from "./resumetemplate.js";

const addResume = async (req, res) => {
  try {
    const userId = req.user._id;

    const isDefaultResume = req.query.isDefaultResume;

    if (isDefaultResume === "yes") {
      const isresume = await Resume.findOne({ userId, primary: true });
      if (isresume) {
        return res.status(400).json({ error: "Default resume already exists" });
      }
    }

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "File upload failed" });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = req.files[0];

      // Convert file to text
      const extractedText = await convertText(file);

      // Convert text to JSON
      const extractedJson = await convertJson(extractedText);

      if (!extractedJson) {
        return res.status(400).json({
          error: "Resume json is not provided",
        });
      }

      const html = resumeTemplate(extractedJson);
      const buffer = await downloadPdf(html);
      const result = await uploadPdfBuffer(
        buffer,
        file.originalname,
        "resumes"
      );

      console.log("Uploaded PDF URL:", result);

      if (!result) {
        return res.status(500).json({
          error: "Failed to upload PDF",
        });
      }

      const resume = new Resume({
        userId: userId,
        url: result?.secure_url,
        filename: file.originalname,
        primary: isDefaultResume === "yes",
        resume_type: 1,
        text: extractedText,
        json: extractedJson,
        skills: extractedJson.skills || [],
        yearsOfExperience: extractedJson.totalYearsOfExperience || 0,
        degreeType: extractedJson.degreeType || 0,
        skills: extractedJson.allSkills || [],
      });

      await resume.save();

      // auto fill the user profile fields if it's a default resume
      if (isDefaultResume === "yes") {
        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        user.default_resume = resume._id;
        user.totalYearsOfExperience = extractedJson.totalYearsOfExperience;
        user.work = resume.json.parsedExperience;
        user.education = resume.json.parsedEducation;
        user.projects = resume.json.parsedProjects;
        user.skills = resume.json.allSkills;
        user.languages = resume.json.parsedLanguages;

        user.socialLinks.linkedIn = resume.json.parsedPersonalInfo?.linkedIn;
        user.socialLinks.github = resume.json.parsedPersonalInfo?.github;
        user.socialLinks.website = resume.json.parsedPersonalInfo?.website;
        user.phone = resume.json.parsedPersonalInfo?.phone;

        await user.save();
      }

      return res.status(200).json({
        message: `Resume "${resume?.filename}" uploaded successfully`,
        resume,
      });
    });
  } catch (error) {
    console.error("Error adding resume:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export default addResume;
