import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

const extractJobFromUrl = async (url) => {
  if (!url) return null;

  console.log(`🔍 Extracting from: ${url}`);

  // Method 1: URL Context
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: createExtractionPrompt(),
      config: { tools: [{ urlContext: { urls: [url] } }] },
    });

    const jobData = parseJson(response.text);
    if (isGoodData(jobData)) {
      console.log("✅ URL context worked");
      return jobData;
    }
  } catch (error) {
    console.log("⚠️ URL context failed:", error.message);
  }

  // // Method 2: Manual fetch
  // try {
  //   console.log("🔍 Trying manual fetch...");

  //   const html = await fetchHtml(url);
  //   if (!html) throw new Error("No HTML content");

  //   const response = await ai.models.generateContent({
  //     model: "gemini-2.5-flash",
  //     contents: `${createExtractionPrompt()}\n\nHTML:\n${html.substring(
  //       0,
  //       30000
  //     )}`,
  //   });

  //   const jobData = parseJson(response.text);
  //   if (isGoodData(jobData)) {
  //     console.log("✅ Manual fetch worked");
  //     return jobData;
  //   }
  // } catch (error) {
  //   console.log("⚠️ Manual fetch failed:", error.message);
  // }

  // console.error("❌ All methods failed");
  // return null;
};

const createExtractionPrompt = () => `
Extract job posting details with maximum accuracy. Look carefully for:

JOB TITLE: Check <title>, <h1>, <h2>, or any prominent job title text
COMPANY: Look for company name near logo, in header, or job details
LOCATION: Find city/state/country, remote/hybrid/onsite details  
DESCRIPTION: Get complete job description including responsibilities, requirements, company info
SKILLS: Extract ALL technical skills, programming languages, tools, frameworks mentioned
EXPERIENCE: Look for years of experience, seniority level (junior/senior/mid-level)
SALARY: Find salary range, hourly rate, compensation details, benefits

Return JSON:
{
  "job_title": "complete job title",
  "company_name": "company name",
  "company_logo": "logo image URL or empty string",
  "location": "full location with remote/hybrid info",
  "description": "complete description with all sections",
  "skills": ["skill1", "skill2", "tool1", "framework1"],
  "experience": "experience level and years required", 
  "salary": "salary range or compensation details"
}

IMPORTANT: Be thorough, read everything, extract ALL available information.`;

const fetchHtml = async (url) => {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    timeout: 15000,
  });

  return response.ok ? await response.text() : null;
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
    data.job_title?.length > 2 &&
    data.company_name?.length > 1 &&
    data.description?.length > 50
  );
};

export default extractJobFromUrl;
