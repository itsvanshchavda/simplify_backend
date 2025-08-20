import { GoogleGenAI } from "@google/genai";
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
      contents: `\n\nHTML:\n${html}
      
      Extract all job posting details in a structured JSON format. Make sure to read everything carefully.

        Fields to extract:

        JOB TITLE: Use the most prominent job title (<title>, <h1>, <h2>, etc.)
        COMPANY: Company name near logo, header, or job info
        LOCATION: City, state, country; indicate if remote/hybrid/onsite
        DESCRIPTION: Full job description including responsibilities, requirements, company info
        SKILLS: All technical skills, programming languages, tools, frameworks
        EXPERIENCE: Years of experience and seniority level
        SALARY: Extract salary in short clean format. Example:
        SALARY: ₹3,00,000 - ₹4,80,000 / year
        PLATFORM: Source platform (LinkedIn, Internshala, etc.)
        COMPANY LOGO: URL or empty string
        APPLICATIONS: Number of applications if mentioned

        Extract the job posting date and return how long ago it was from today in a human-readable format. 

        Example formats:
        - "10 seconds ago"
        - "5 minutes ago"
        - "10 hours ago"
        - "3 days ago"
        - "2 weeks ago"
        - "5 months ago"

        Return only the relative time, not the full date.

        REMOTE: true if remote/hybrid, false otherwise
        JOB TYPE: Full-time, Part-time, Internship, etc.
        INDUSTRY: Company industry no array only one string
        SPONSORSHIP: true if visa sponsorship offered, false otherwise
        EASYAPPLY: true if easy apply is available, false otherwise

        Return JSON exactly like this:

        {
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
        "easyapply": false,
        }

        IMPORTANT: Be thorough. Extract all details accurately. Use short and clear formats for salary and experience.
      
      `,
    });

    // 3. Parse AI output into JSON

    let jobData;

    if (response.text) {
      console.log("🔍 Parsing AI response...");
      jobData = parseJson(response.text);

      jobData.job_url = url; // Ensure job_url is set
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

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // ✅ Get full rendered HTML (no trimming, no cut off)
    const html = await page.content();

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

const parseJson = (text) => {
  try {
    let clean = text.trim();
    if (clean.startsWith("```json")) clean = clean.slice(7, -3);
    else if (clean.startsWith("```")) clean = clean.slice(3, -3);
    return JSON.parse(clean);
  } catch {
    return null;
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
