import { GoogleGenAI, Type } from "@google/genai";
import User from "../../models/User.js";
const customizeResume = async (req, res) => {
  try {
    const { job_title, description, job_skills, customjson } = req.body;

    const user = await User.findById(req.user.id).populate("default_resume");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userResume = customjson ? customjson : user.default_resume?.json;

    const userExp = userResume.parsedExperience || [];

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `
Customize my resume for this job:

- Job Title: ${job_title}
- Job Description: ${description}
- Required Skills: ${job_skills}

Current Resume: ${JSON.stringify(userResume)}
Current Experiences: ${JSON.stringify(userExp)}

STRICT RULES:
1. Contact Info: Use ONLY from userResume (firstName, lastName, email, phone, linkedin, github).
2. Dates: Format as "MMM YYYY" (e.g., Jan 2023). Use "MMM YYYY - Present" for ongoing roles.
3. Set endDate = "" and present = true (never write "Present 2024").
4. Experiences: Return exactly 2 experiences. Keep same number of bullet points per experience as input.
5. Company & Titles: Keep existing company names and job titles. Leave location as "".
6. Experience Points: Format strictly as: <ul><li>Point 1</li><li>Point 2</li></ul>
7. XYZ Format: Each point must show What + How + Result (with numbers/metrics).
8. Keywords: Highlight important skills, technologies, and metrics using <strong> tags. Do NOT bold connectors or common words.
9. Skills Integration: Naturally weave ${job_skills} into summary and experience points.
10. Summary:
   - Must begin with "I am ..."
   - Be results-driven, professional, human-like, and engaging.
   - 0–175 words: single <p>. Over 175 words: split into 3 paragraphs with <p>.
   - Highlight important skills with <strong>.
11. Skills:
   - Combine all relevant skills (existing parsedSkills + job_skills).
   - If job_skills is empty, extract from job description.
12. Education: Detect highest degree (degreeType: 0 = Bachelor's, 1 = Master's, 2 = PhD).
13. Languages: Identify languages spoken and classify as Basic, Conversational, Fluent, or Native/Bilingual.
14. Projects: For project links, return actual link if provided, else "".
15. Missing Data: Always return empty strings "" for unavailable fields.
16. Prohibited Content: Never mention citizenship, visa status, or clearance.

CALCULATIONS:
- totalYearsOfExperience = Sum of all work experience durations (integer).
- allSkills = Flatten all skills into one array.
- degreeType = Highest degree detected.

OUTPUT FORMAT:
- Return a complete resume object with all sections properly filled.
- Ensure summary and experiences are rewritten to align with the job requirements.
- Output ONLY valid HTML (no JSON, no markdown, no extra text).
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
      resume: parsedResume,
    });
  } catch (error) {
    console.error("Error customizing resume:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default customizeResume;
