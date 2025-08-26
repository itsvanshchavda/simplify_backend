import { GoogleGenAI, Type } from "@google/genai";
import User from "../../models/User.js";
const customizeResume = async (req, res) => {
  try {
    const { job_title, description, job_skills } = req.body;

    const user = await User.findById(req.user.id).populate("default_resume");

    const userResume = user.default_resume?.json;
    const userExp = user.default_resume?.json?.parsedExperience?.slice(0, 2);

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `
Customize my resume for this job:
- Job title: ${job_title}
- Job description: ${description}
- Required skills: ${job_skills}

Current resume: ${JSON.stringify(userResume)}
Current experiences: ${JSON.stringify(userExp)}

STRICT RULES:
1. Contact Info: Use ONLY existing contact from userResume (firstName, lastName, email, phone, linkedin, github)
2. Dates: Convert ALL dates to "MMM YYYY" format (Jan 2023, Feb 2021)
3. Experiences: Return exactly 2 experiences, keep same number of bullet points as input
4. Companies: Keep existing company names and job titles, leave location empty
5. HTML Format: Wrap experience points like: ["<ul>","<li>point 1</li>","<li>point 2</li>","</ul>"]
6. Keywords: Use <strong> tags to highlight important skills in summary and experience
7. Skills Integration: Use ${job_skills} throughout experience points naturally
8. XYZ Format: Each point should show What accomplished + How measured + How done
9. Quantify: Add numbers, percentages, metrics to show impact
10. No Prohibited Content: Never mention security clearance, citizenship, or visa status

CUSTOMIZATION FOCUS:
- Rewrite professional summary to match job requirements
- Calculate total experience years from work history (don't mention specific years in summary)
- Make experience points highly relevant to job description
- Add quantified achievements using required skills
- Combine all relevant skills (existing + job required)
- If job_skills is empty, extract skills from job description
- Be specific, avoid generic statements
- Show deep expertise in mentioned technologies

OUTPUT: Complete resume object with all sections properly formatted.
`,
        },
      ],
      config: {
        temperature: 0.1,
        systemInstruction:
          "You are a resume optimization assistant based on the job data. Output only valid JSON format that will be directly compiled to PDF. Be precise, professional, and follow all formatting requirements exactly.",

        responseMimeType: "application/json",
        responseJsonSchema: {
          type: Type.OBJECT,
          properties: {
            parsedPersonalInfo: {
              type: Type.OBJECT,
              properties: {
                firstName: { type: Type.STRING },
                lastName: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                github: { type: Type.STRING },
                summary: { type: Type.STRING },
                website: { type: Type.STRING },
              },
              required: [
                "firstName",
                "lastName",
                "email",
                "phone",
                "linkedin",
                "github",
                "summary",
                "website",
              ],
            },
            parsedEducation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  school: { type: Type.STRING },
                  location: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  fieldOfStudy: { type: Type.STRING },
                  startDate: {
                    type: Type.OBJECT,
                    properties: {
                      month: { type: Type.STRING },
                      year: { type: Type.STRING },
                    },
                    required: ["month", "year"],
                  },
                  endDate: {
                    type: Type.OBJECT,
                    properties: {
                      month: { type: Type.STRING },
                      year: { type: Type.STRING },
                    },
                    required: ["month", "year"],
                  },
                },
                required: [
                  "school",
                  "location",
                  "degree",
                  "fieldOfStudy",
                  "startDate",
                  "endDate",
                ],
              },
            },
            parsedExperience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  location: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  present: { type: "boolean" },
                  startDate: {
                    type: Type.OBJECT,
                    properties: {
                      month: { type: Type.STRING },
                      year: { type: Type.STRING },
                    },
                    required: ["month", "year"],
                  },
                  endDate: {
                    type: Type.OBJECT,
                    properties: {
                      month: { type: Type.STRING },
                      year: { type: Type.STRING },
                    },
                    required: ["month", "year"],
                  },
                },
                required: [
                  "company",
                  "location",
                  "title",
                  "description",
                  "startDate",
                  "endDate",
                  "present",
                ],
              },
            },
            parsedProjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  link: { type: Type.STRING },
                  description: { type: Type.STRING },
                  technologies: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.STRING,
                    },
                  },

                  startDate: {
                    type: Type.OBJECT,
                    properties: {
                      month: { type: Type.STRING },
                      year: { type: Type.STRING },
                    },
                    required: ["month", "year"],
                  },
                  endDate: {
                    type: Type.OBJECT,
                    properties: {
                      month: { type: Type.STRING },
                      year: { type: Type.STRING },
                    },
                    required: ["month", "year"],
                  },

                  present: { type: "boolean" },
                },
                required: [
                  "name",
                  "link",
                  "technologies",
                  "description",
                  "startDate",
                  "endDate",
                  "present",
                ],
              },
            },
            parsedSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  skills: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.STRING,
                    },
                  },
                },
                required: ["heading", "skills"],
              },
            },
            parsedAchievementsAndCertifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                },
                required: ["title"],
              },
            },

            parsedLanguages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  language: { type: Type.STRING },
                  proficiency: { type: Type.STRING },
                },
                required: ["language", "proficiency"],
              },
            },
            totalYearsOfExperience: {
              type: Type.INTEGER,
              description:
                "The total number of years of professional experience.",
            },
            allSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
            degreeType: {
              type: Type.INTEGER,
              enum: [0, 1, 2],
              description: "0 for Bachelors, 1 for Masters, 2 for PhD",
            },
          },
          required: [
            "parsedPersonalInfo",
            "parsedEducation",
            "parsedExperience",
            "parsedProjects",
            "parsedSkills",
            "parsedAchievementsAndCertifications",
            "totalYearsOfExperience",
            "allSkills",
            "degreeType",
          ],
        },
        strict: true,
      },
    });

    const customizedResume = response.text;

    if (!customizeResume) {
      return res.status(400).json({ error: "Failed to customize resume" });
    }

    const parsedResume = JSON.parse(customizedResume);

    return res.status(200).json({
      message: "Resume customized successfully",
      parsedResume,
    });
  } catch (error) {
    console.error("Error customizing resume:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default customizeResume;
