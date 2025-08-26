import dotenv from "dotenv";
import Groq from "groq-sdk";
dotenv.config({ quiet: true });

const rewriteSummary = async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    return res.status(401).json({
      error: "Unautorized :  user id not found",
    });
  }

  const { userSummary } = req.body;

  if (!userSummary) {
    return res.status(400).json({ error: "Missing user summary" });
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume writer. Rewrite professional summaries so they sound confident, polished, and recruiter-ready. Output must be in clean HTML (use <p>, <strong>, <em>, and short sentences for impact). Avoid generic AI tone.",
        },
        {
          role: "user",
          content: `
      Rewrite the following professional summary into 80–120 words:  
      - Write in clear, simple, professional English (avoid complex or buzzwords). 
      - Start the summary naturally with: I am ... (do NOT use <strong> on "I am").  
      - Make it results-driven, emphasize concrete achievements and technical strengths.  
      - Use <strong> ONLY for highlighting key skills, technologies, tools, or quantifiable results and user current role (e.g., "Software Engineer at XYZ").  
      - Do NOT bold common words, connectors, or the intro phrase.  
      - Ensure the tone feels professional, human-written, and engaging.  
      - Return ONLY valid HTML in a single <p> block (no JSON, no markdown, no lists).  

      Candidate Summary:  
      ${userSummary}
      `,
        },
      ],
      temperature: 0.5,
    });

    const rewrittenSummary = response.choices[0]?.message?.content?.trim();

    res.status(200).json({
      message: "Summary rewritten successfully",
      summary: rewrittenSummary,
    });
  } catch (err) {
    console.error("Error rewriting summary:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default rewriteSummary;
