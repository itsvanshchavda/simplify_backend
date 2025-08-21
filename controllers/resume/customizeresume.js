import { GoogleGenAI, Type } from "@google/genai";
import User from "../../models/User.js";
const customizeResume = async (req, res) => {
  try {
    const { job_title, description, job_skills, save } = req.body;

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
            Customize my experiences, skills, and professional summary based on the following job details:\n
            - Job title: ${job_title}\n
            - Job description: ${description}\n 
            - Required skills: ${job_skills}\n

            My current resume is ${JSON.stringify(userResume)}\n
            My experiences are ${JSON.stringify(userExp)}\n
            
            Important Instructions:\n
            - Use ${userResume} contact info (firstName, lastName, email, phone, linkedin, github) only do not add random contact info\n
            - Use the existing projects from the resume if available.\n
            - Ensure date consistency across all sections (education, experience, projects) using the three-letter month format (MMM YYYY). Example: "Jan 2023", "Feb 2021". Convert all dates into this format.  
            - If any section is missing data, return an empty string ("").
            - Modify the professional summary to highlight relevant experience and skills for the job\n
            - Highlight keywords in summary using <strong> tags\n
            - Calculate total years of experience based on the provided work history\n
            - Modify the experiences to better match the job requirements\n
            - Improve experience points to show quantitative impact with required skills\n
            - Make experiences as relevant to the job description as possible\n
            - Add/modify skills to match job requirements while keeping relevant existing skills\n
            - Create a consolidated list of all skills (required, nice-to-have, and existing)\n
            - Ensure each experience maintains the same number of points as the input\n
            - Do not use the target company name in the experience section\n
            - Return exactly 2 experiences\n
            - Do not mention years of experience in summary section \n
            - Do not change company name if its already there in user experience leave company location empty take it from my experiences \n
            - Also do not change title/role of experience if it already exists in user experience \n
            - Do not reduce number of points in any experience (number of input point should be equal to output points)\n
            - each point in experience , projects description array must be wrapped in <li> tag, add <ul> tag at the start and end of the array example : ["<ul>""<li>point 1 </li>""<li>point two </li>""<li>point 3 </li>""</ul>"]\n
            - Highlight keywords in summary and experience section using <strong> tag (strictly use only <strong> tag for highlighting)\n
            - Improve resume points to show Quantitative impact with the skills required in job\n
            - Use Listed skills: ${job_skills} multiple times in the resume, in the last few experiences to show strong experience in the skills. If ${job_skills} is empty, then extract the skills required for the job from the ${description}\n
            - Integrate Important Skills and the supporting skills in the experience points seamlessly into the real projects showing expertise\n
            - Use XYZ format for the experience points, The X refers to what was accomplished, Y refers to how it was measured, and Z refers to how it was accomplished\n
            - While rewriting, be specific and avoid general points. Assume you have worked in depth on these technologies\n
            - Ensure the inclusion of supporting skills and enrich the content with as many relevant skills as possible to make it more specific, detailed\n
            - Please do not mention, reference, or include any information about security clearances, citizenship status, or visa-related details anywhere in the resume\n
          `,
        },
      ],
      config: {
        temperature: 0.1,
        systemInstruction:
          "You are a helpful assistant designed to output resume in json format, your output will be used directly to compile a pdf",

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
                  description: { type: Type.STRING },
                  technologies: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.STRING,
                    },
                  },
                  date: {
                    type: Type.OBJECT,
                    properties: {
                      month: { type: Type.STRING },
                      year: { type: Type.STRING },
                    },
                    required: ["month", "year"],
                  },
                },
                required: ["name", "technologies", "description", "date"],
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
