const coverLetterTemplate = (resume, coverletter) => {
  // Extract personal info from resume
  const personalInfo = resume?.parsedPersonalInfo || {};

  // Function to convert newlines to HTML paragraphs
  const formatCoverLetter = (text) => {
    if (!text) return "";

    const paragraphs = text.split("\n\n").filter((p) => p.trim());

    return paragraphs
      .map((paragraph) => {
        const cleanParagraph = paragraph.replace(/\n/g, " ").trim();
        return `<p>${cleanParagraph}</p>`;
      })
      .join("");
  };

  // CSS Styles matching the resume template
  const cssStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Tinos:wght@400;700&display=swap');
      
      body {
        font-family: 'Tinos', serif;
        font-size: 15px;
        line-height: 1.6;
        margin: 0;
        padding: 30px;
        max-width: 800px;
        margin: 0 auto;
        background: white;
      }
      
      .a4-paper {
        min-height: 297mm;
        width: 100%;
        background: white;
        padding: 0;
      }
      
      .header {
        margin-bottom: 32px;
        border-bottom: 0.08rem solid #808080;
        padding-bottom: 24px;
        padding-left: 32px;
        padding-right: 32px;
        padding-top: 32px;
      }
      
      .full-name {
        font-size: 28px;
        font-weight: bold;
        color: #111827;
        margin-bottom: 16px;
      }
      
      .contact-info {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
        color: #4B5563;
      }
      
      .contact-item {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .contact-item svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }
      
      .email-item {
        flex: 1;
        min-width: 0;
      }
      
      .letter-body {
        padding: 0 32px 32px 32px;
        text-align: justify;
      }
      
      .letter-body p {
        margin-bottom: 16px;
        line-height: 1.6;
      }
      
      .letter-body p:last-child {
        margin-bottom: 0;
      }
      
      a {
        color: black;
        text-decoration: none;
      }
      
      a:hover {
        text-decoration: underline;
      }
    </style>
  `;

  // Generate HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${personalInfo.firstName || ""} ${
    personalInfo.lastName || ""
  } - Cover Letter</title>
      ${cssStyles}
    </head>
    <body>
      <div class="a4-paper">
        <!-- Header section -->
        <header class="header">
          <div class="full-name">
            ${personalInfo.firstName || ""} ${personalInfo.lastName || ""}
          </div>
          <div class="contact-info">
            ${
              personalInfo.phone
                ? `
              <div class="contact-item">
                <svg viewBox="0 0 20 20">
                  <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z"></path>
                </svg>
                <span>${personalInfo.phone}</span>
              </div>
            `
                : ""
            }
            
            ${
              personalInfo.email
                ? `
              <div class="contact-item email-item">
                <svg viewBox="0 0 20 20">
                  <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z"></path>
                  <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z"></path>
                </svg>
                <span>${personalInfo.email}</span>
              </div>
            `
                : ""
            }
          </div>
        </header>

        <!-- Letter body -->
        <div class="letter-body">
          ${formatCoverLetter(coverletter)}
        </div>
      </div>
    </body>
    </html>
  `;

  return htmlContent;
};

const data =
  "Dear Prism Cloud Consulting Inc. Hiring Team,\n" +
  "\n" +
  "I am writing to express my enthusiasm for the Full Stack Developer – React and Node position at Prism Cloud Consulting Inc. With a year of hands‑on experience building scalable SaaS solutions, I have led the development of a React.JS/Next.JS front‑end and a Node.JS/TypeScript back‑end for Enshrine Global Systems, deploying the stack on AWS EC2 and S3 and integrating MongoDB for high‑performance data access. As CTO & Founder of Writix AI, I launched a generative‑AI SaaS that attracted 650+ users on day one, integrating Llama, Gemini, and Mixtral models via AWS Lambda and DynamoDB, and exposing robust RESTful APIs to the front‑end. My technical toolkit aligns perfectly with your requirements: React.JS, Node.JS, AWS (EC2, Lambda, S3, RDS, DynamoDB), Generative AI (GPT, BERT, GANs), Redux, React Router, microservices, and both SQL and NoSQL databases. I hold a Full Stack Developer certification from Zero to Mastery and contributed to GirlsScript Summer of Code 2024.\n" +
  "\n" +
  "I am excited about Prism Cloud’s commitment to cloud‑first, AI‑enabled solutions and would welcome the opportunity to discuss how my background can accelerate your product roadmap. Thank you for considering my application; I look forward to speaking with you soon.";

const htmlData = coverLetterTemplate(
  {
    parsedPersonalInfo: {
      firstName: "John",
      lastName: "Doe",
      phone: "123-456-7890",
      email: "",
    },
  },
  data
);
console.log("🚀 ~ html:", htmlData);
