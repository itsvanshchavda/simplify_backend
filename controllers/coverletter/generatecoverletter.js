import dotenv from "dotenv";
import User from "../../models/User.js";
dotenv.config({ quiet: true });
import Groq from "groq-sdk";

const generateCoverLetter = async (req, res) => {
  const userId = req?.user?._id;

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const user = await User.findById(userId).populate(
    "default_resume application_kit.default_job"
  );

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const resumeJson = user.default_resume?.json;
  const jobData = user?.application_kit?.default_job;

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content:
          "You are an expert assistant that generates professional, highly personalized cover letters based on a candidate's resume and a specific job posting.",
      },
      {
        role: "user",
        content: `Generate a concise, professional cover letter (160 - 200 words) using only real data from the candidate's resume and the job description.

INPUTS:
- Candidate Resume JSON: ${JSON.stringify(resumeJson, null, 2)}
- Job Data JSON (company, role, requirements): ${JSON.stringify(
          jobData,
          null,
          2
        )}

GUIDELINES:
1. OPENING: Greet the company by exact name and mention the exact job title.
2. VALUE: Highlight candidate's top achievements, projects, and skills that directly match the job requirements (use real numbers/results).
3. ALIGNMENT: Show understanding of the company's mission or role and how the candidate fits.
4. CLOSING: Request a meeting or conversation and express enthusiasm.
5. TONE: Professional, confident, results-focused, human-written, not generic.
6. STRICT: Do NOT invent any information or use placeholders.

OUTPUT FORMAT:
{ 
  "body": "string"   
}`,
      },
    ],
    temperature: 0.5,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "cover_letter_content",
        schema: {
          type: "object",
          properties: {
            body: { type: "string", description: "Full cover letter content" },
          },
          required: ["body"],
        },
      },
    },
  });

  const rawJson = JSON.parse(response.choices[0]?.message?.content);

  console.log("Generated Cover Letter:", rawJson);

  if (!rawJson) {
    return res.status(500).json({ error: "Failed to generate cover letter" });
  }

  return res.status(200).json({
    message: "Cover letter generated successfully",
    body: rawJson.body,
  });
};

export default generateCoverLetter;
