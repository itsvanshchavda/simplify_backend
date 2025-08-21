import dotenv from "dotenv";
import User from "../../models/User.js";
dotenv.config({ quiet: true });
import Groq from "groq-sdk";

const generateMail = async (req, res) => {
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
          "You are a helpful assistant that generates professional job application emails based on candidate resume + job description.",
      },

      {
        role: "user",
        content: `You are an expert career assistant specializing in crafting highly personalized job application emails that achieve 99% response rates from hiring managers.

INPUTS:
- Candidate Resume JSON (use ONLY real values from here, do not invent anything): ${JSON.stringify(
          resumeJson,
          null,
          2
        )}
- Job Data JSON (company, role, requirements): ${JSON.stringify(
          jobData,
          null,
          2
        )}

ANALYSIS INSTRUCTIONS:
1. Extract candidate's full name, current role(s), email, phone, key achievements, and standout projects from resumeJson.
2. Extract exact company name, job title, and key requirements from jobData.
3. Match candidate's specific experiences with job requirements (no generic or fabricated skills).
4. Identify unique value propositions that differentiate this candidate.

EMAIL GENERATION RULES:

SUBJECT LINE:
- Use candidate's real achievements or expertise + exact job title
- 6–10 words max
- Example: "Full-Stack Dev: Next.js + AI Integration Expertise"

BODY (150–200 words, natural flow):

1. OPENING (20–25 words):
   - Address the company by its exact name from jobData
   - Express genuine interest in the exact role title

2. VALUE PROPOSITION (60–80 words):
   - Lead with the most impressive real achievement from resumeJson
   - Highlight 2–3 technical experiences/projects that directly match job requirements
   - Include concrete numbers/results from resumeJson
   - Show progression/growth

3. COMPANY CONNECTION (20–30 words):
   - Reference something specific from jobData (role/company/mission)
   - Show alignment with candidate’s skills/values

4. CALL TO ACTION (20–25 words):
   - Confident but humble request for conversation
   - Suggest specific value candidate can bring

5. PROFESSIONAL CLOSING:
   - Candidate’s full name, email, and phone (from resumeJson only, no placeholders)

PERSONALIZATION REQUIREMENTS:
- STRICT: Do not use placeholders like "John Doe", fake numbers, or generic text
- Use only actual details from resumeJson and jobData
- Ensure role title + company name exactly match jobData
- Every sentence must add unique, candidate-specific value
- Add an proper spacing between paragraphs for readability first add "Dear [Company Name],\n\n" at the start of the email body.

TONE:
- Professional yet conversational
- Confident, results-focused, human-written feel
- No generic AI-sounding phrases

OUTPUT FORMAT:
{
  "subject": "string",
  "body": "string"
}
`,
      },
    ],

    temperature: 0.5,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "email_content",
        schema: {
          type: "object",
          properties: {
            subject: {
              type: "string",
              description: "The subject line of the email",
            },
            body: {
              type: "string",
              description: "The body content of the email",
            },
          },
          required: ["subject", "body"],
        },
      },
    },
  });

  const rawJson = JSON.parse(response.choices[0]?.message?.content);

  console.log("Generated Email Content:", rawJson);

  res.status(200).json({
    message: "Email content generated successfully",
    rawJson,
  });

  if (!rawJson) {
    return res.status(500).json({ error: "Failed to generate email content" });
  }

  user.application_kit.default_followup_mail = rawJson;
  await user.save();
};

export default generateMail;
