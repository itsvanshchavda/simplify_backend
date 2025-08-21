import { GoogleGenAI, Type } from "@google/genai";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

const getJob = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Job url is not provided" });
  }

  console.log(`🔍 Extracting from: ${url}`);

  try {
    // 1. Get full rendered HTML using Puppeteer
    const html = await fetchHtmlWithPuppeteer(url);
    if (!html) console.log("No HTML Content Found!!");

    // 2. Send HTML into Gemini with your JSON schema prompt
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `You are given a raw job posting HTML:

      HTML:
      ${html}

      Your task is to carefully extract ALL relevant job posting details into a **single structured JSON object**.

      ### Extraction Rules:
      - Always read <title>, <h1>, <h2>, headers, and main content to find the most relevant values.
      - Use short, clean formats. Do not include extra text, labels, or HTML tags.
      - If a field is missing, leave it as an empty string "" (or null if specified).

      ### Fields to Extract:
      - job_url → "${url}"
      - job_title → Most prominent title (<title>, <h1>, <h2>)
      - platform → Source platform (LinkedIn, Internshala, Indeed, etc.)
      - company_name → Company name (near logo, header, or job info)
      - company_logo → Logo URL (or "" if not found)
      - location → City, state, country. Indicate if Remote / Hybrid / Onsite
      - description → Full job description (responsibilities, requirements, company info)
      - skills → Array of technical skills, tools, programming languages, frameworks
      - experience → Short clean format. Example: "2+ years", "Fresher", "Senior level"
      - salary → Clean salary range. Example: "₹3,00,000 - ₹4,80,000 / year"
      - applications → Number of applications if mentioned (else null)
      - job_posted → Relative posting time (not full date). Examples:
        - "10 seconds ago"
        - "5 minutes ago"
        - "3 days ago"
        - "2 weeks ago"
        - "5 months ago"
      - remote → true if Remote/Hybrid, false otherwise
      - job_type → Array. Example: ["Full-time"], ["Internship"], ["Part-time"]
      - industry → Company industry (only one string, no array)
      - sponsorship → true if visa sponsorship is offered, else false
      - easyapply → true if Easy Apply / Quick Apply option is available, else false

      ### Output Format:
      Return JSON in **exactly** this format (no extra text, no explanation):

      {
        "job_url": "${url}",
        "job_title": "",
        "platform": "",
        "company_name": "",
        "company_logo": "",
        "location": "",
        "description": "",
        "skills": [],
        "experience": "",
        "salary": "",
        "applications": null,
        "job_posted": "",
        "remote": false,
        "job_type": [],
        "industry": "",
        "sponsorship": false,
        "easyapply": false
      }
      `,
        },
      ],
      config: {
        temperature: 0.1,
        systemInstruction:
          "You are a helpful assistant that extracts structured information from job postings",
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: "object",
          properties: {
            job_title: { type: Type.STRING },
            job_url: { type: Type.STRING },
            platform: { type: Type.STRING },
            company_name: { type: Type.STRING },
            company_logo: { type: Type.STRING },
            location: { type: Type.STRING },
            description: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            experience: { type: Type.STRING },
            salary: { type: Type.STRING },
            applications: { type: Type.NUMBER || Type.NULL },
            job_posted: { type: Type.STRING },
            remote: { type: Type.BOOLEAN },
            job_type: { type: Type.ARRAY, items: { type: Type.STRING } },
            industry: { type: Type.STRING },
            sponsorship: { type: Type.BOOLEAN },
            easyapply: { type: Type.BOOLEAN },
          },
          required: [
            "job_url",
            "job_title",
            "platform",
            "company_name",
            "company_logo",
            "location",
            "description",
            "skills",
            "experience",
            "salary",
            "applications",
            "job_posted",
            "remote",
            "job_type",
            "industry",
            "sponsorship",
            "easyapply",
          ],
        },
      },
    });

    // 3. Parse AI output into JSON

    let jobData;

    if (response.text) {
      console.log("🔍 Parsing AI response...");
      jobData = JSON.parse(response.text);
    }

    if (isGoodData(jobData)) {
      console.log("✅ Extracted successfully");
      return res.status(200).json({
        job: jobData,
        message: "Job data extracted successfully",
      });
    } else {
      console.error("⚠️ Bad or incomplete job data");
      return res.status(500).json({
        error: "Bad or incomplete job data extracted",
      });
    }
  } catch (error) {
    console.error("❌ Extraction failed:", error.message);
    return res.status(500).json({ error: "Extraction failed" });
  }
};

// Puppeteer fetch full rendered HTML
const fetchHtmlWithPuppeteer = async (url) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  try {
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (["image", "stylesheet", "font"].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const html = await page.evaluate(() => {
      // remove non-essential tags
      document
        .querySelectorAll("script, style, noscript")
        .forEach((e) => e.remove());

      // return cleaned HTML (not text)
      return document.body.innerHTML;
    });

    // ✅ Get full rendered HTML (no trimming, no cut off)

    const isJobPost = async (page) => {
      // Get all visible text
      const text = await page.evaluate(() =>
        document.body.innerText.toLowerCase()
      );

      // Check for key indicators
      const hasJobTitle =
        /engineer|developer|manager|designer|intern|analyst/.test(text);
      const hasResponsibilities =
        /responsibilities|requirements|qualifications|skills|experience/.test(
          text
        );
      const hasApply = /apply|submit application|easy apply/.test(text);

      // If at least 2 indicators exist, treat as a job post
      return (
        [hasJobTitle, hasResponsibilities, hasApply].filter(Boolean).length >= 2
      );
    };

    const jobCheck = await isJobPost(page);
    if (!jobCheck) {
      console.log("❌ Not a valid job post");
      return null;
    } else {
      console.log("✅ Valid job post detected");
      return html;
    }
  } catch (error) {
    console.error("⚠️ Puppeteer fetch failed:", error.message);
    return null;
  } finally {
    await browser.close();
  }
};

const isGoodData = (data) => {
  return (
    data &&
    typeof data === "object" &&
    Object.keys(data).length > 0 &&
    data.job_title &&
    data.company_name &&
    data.location &&
    data.description &&
    Array.isArray(data.skills) &&
    data.skills.length > 0 &&
    data.job_url
  );
};

export default getJob;
