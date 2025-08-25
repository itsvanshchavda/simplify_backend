import Resume from "../../models/Resume.js";
import User from "../../models/User.js";
import downloadPdf from "../../utils/downloadpdf.js";
import uploadPdfBuffer from "../../utils/uploadpdfbuffer.js";
import resumeTemplate from "./resumetemplate.js";

const resumeFromScratch = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ error: "Unauthorized user id not found" });
    }

    const user = await User.findById(userId).populate("default_resume");

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const userResume = user?.default_resume?.json;

    const json = {
      parsedPersonalInfo: {
        firstName: userResume?.parsedPersonalInfo?.firstName,
        lastName: userResume?.parsedPersonalInfo?.lastName,
        phone: userResume?.parsedPersonalInfo?.phone,
        email: userResume?.parsedPersonalInfo?.email,
        linkedin: userResume?.parsedPersonalInfo?.linkedin,
        github: userResume?.parsedPersonalInfo?.github,
        website: userResume?.parsedPersonalInfo?.website,
      },
      parsedEducation: [],
      parsedExperience: [],
      parsedProjects: [],
      parsedSkills: [],
      parsedAchievementsAndCertifications: [],
      totalYearsOfExperience: user?.totalYearsOfExperience || 0,
      allSkills: [],
      degreeType: userResume?.degreeType || 0,
    };
    const text = JSON.stringify(json).replace(/\s+/g, "");
    // Convert text to JSON
    const html = resumeTemplate(json);
    const buffer = await downloadPdf(html);

    const fileName = `${userResume?.parsedPersonalInfo?.firstName}_${userResume?.parsedPersonalInfo?.lastName}`;
    const result = await uploadPdfBuffer(buffer);

    const newResume = await new Resume({
      userId: userId,
      json: json,
      resume_type: 1,
      primary: false,
      customized: false,
      text: text,
      url: result?.secure_url,
      filename: fileName,
      skills: [],
    }).save();

    if (!newResume) {
      return res.status(400).json({ error: "Failed to create new resume" });
    }

    return res.status(201).json({
      message: "New resume created from scratch",
      resume: newResume,
    });
  } catch (error) {
    console.error("Error making resume from scratch:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default resumeFromScratch;
