import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
const convertJson = async (resumeText) => {
  if (!resumeText) {
    throw new Error("Resume text is required");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        text: `Parse this resume into structured JSON data:

${resumeText}



FORMATTING RULES:


- Start the user  summary naturally with: I am ... (do NOT use <strong> on "I am").  
- Make it results-driven, emphasize concrete achievements and technical strengths.  
- Use <strong> ONLY for highlighting key skills, technologies, tools, or quantifiable results.  
- Do NOT bold common words, connectors, or the intro phrase.  
- Ensure the tone feels professional, human-written, and engaging.  
- Return ONLY valid HTML in a single <p> block (no JSON, no markdown, no lists).  
- For projects link do not add "link" if no link is provided. add empty string "" instead.
- Dates: Always format as "MMM YYYY" (e.g., Jan 2023, Dec 2021) and for ongoing roles use "MMM YYYY - Present" (never repeat the year).
- Missing data: Return empty strings ""
- Please include an user summary field also based on the resume text
- Experience descriptions: Format as "<ul><li>Point 1</li><li>Point 2</li></ul>"
- Use <strong> tags for important keywords
- Remove all \\n characters
- Identify the languages the user speaks and their proficiency level (Basic, Conversational, Fluent, Native/Bilingual) with the language name as the title.


CALCULATIONS:
- totalYearsOfExperience: Sum all work experience durations (integer)
- allSkills: Flatten all skills from parsedSkills into single array
- degreeType: 0=Bachelor's, 1=Master's, 2=PhD (highest degree found)

SUMMARY HANDLING:
- 0-175 words: Return as-is
- >175 words: Split into 3 paragraphs using <p> tags`,
      },
    ],
    config: {
      temperature: 0.1,
      systemInstruction:
        "You are a helpful assistant that extracts structured information from resume text",

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
          "parsedLanguages",
          "parsedAchievementsAndCertifications",
          "totalYearsOfExperience",
          "allSkills",
          "degreeType",
        ],
      },
      strict: true,
    },
  });

  const rawJson = response.text;
  return JSON.parse(rawJson);
};

export default convertJson;
