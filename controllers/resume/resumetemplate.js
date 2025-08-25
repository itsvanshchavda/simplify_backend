const resumeTemplate = (parsedData) => {
  const {
    parsedPersonalInfo,
    parsedEducation,
    parsedExperience,
    parsedProjects,
    parsedSkills,
    parsedAchievementsAndCertifications,
  } = parsedData;

  const resume = {
    personalInfo: parsedPersonalInfo,
    education: parsedEducation,
    experience: parsedExperience,
    projects: parsedProjects,
    technicalSkills: parsedSkills,
    achievementsAndCertifications: parsedAchievementsAndCertifications,
  };

  // CSS Styles with PDF-like formatting
  const cssStyles = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Tinos:wght@400;700&display=swap');
        
        body {
          font-family: 'Tinos', serif;
          font-size: 15px;
          line-height: 1.2;
          margin: 0;
          padding: 30px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .resume-header {
          text-align: center;
          margin-bottom: 10px;
        }
        
        .name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 3px;
        }
        
       .contact-info {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 13px;
    margin-bottom: 5px;
  }
  
  .contact-info a {
    color: inherit;
    text-decoration: none;
  }
  
  .contact-info a:hover {
    text-decoration: underline;
  }
  
  .contact-info .divider {
    color: #666;
  }
        
        .summary {
          font-size: 15px;
          text-align: justify;
          border-top: 0.010rem solid black;
          padding-top: 10px;
          margin-bottom: 10px;
        }
        
        .section-header {
          font-size: 16px;
          text-transform: uppercase;
          border-bottom: 0.010rem solid black;
          padding-bottom: 2px;
          margin-bottom: 5px;
        }
        
        .experience-item, 
        .education-item,
        .project-item,
        .skills-item {
          margin-bottom: 10px;
          letter-spacing: 0.05em;
        }
        
        .experience-header,
        .education-header,
        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 2px;
        }
        
        .job-title {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 7px;
        }
        
        .job-details {
          font-size: 13px;
          text-align: right;
        }
        
        .job-location {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 4px;
          margin-top: 4px;
        }
        
        .description {
        padding-left: 15px;
      }
  
      .description ul {
        margin: 0;
        padding-left: 20px;
      }
  
      .description li {
        margin-bottom: 3px;
        position: relative;
      }
  
      .description li::before {
        content: "•";
        position: absolute;
        left: -15px;
      }
  
        
      a {
          color: black;
          text-decoration: none;
      }
      </style>
    `;

  // If no personal info, return empty string
  if (!resume?.personalInfo) return "";

  // Start HTML generation
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${resume.personalInfo.firstName} ${
    resume.personalInfo.lastName
  } - Resume</title>
        ${cssStyles}
      </head>
      <body>
        <div class="resume-content">
          <header class="resume-header">
            <div class="name">${resume.personalInfo.firstName} ${
    resume.personalInfo.lastName
  }</div>
            
            <div class="contact-info">
    ${
      resume.personalInfo.phone
        ? `
      <span>${resume.personalInfo.phone}</span>
      ${
        resume.personalInfo.email ||
        resume.personalInfo.linkedin ||
        resume.personalInfo.github ||
        resume.personalInfo.website
          ? '<span class="divider">•</span>'
          : ""
      }
    `
        : ""
    }
  
    ${
      resume.personalInfo.email
        ? `
      <span>${resume.personalInfo.email}</span>
      ${
        resume.personalInfo.linkedin ||
        resume.personalInfo.github ||
        resume.personalInfo.website
          ? '<span class="divider">•</span>'
          : ""
      }
    `
        : ""
    }
  
    ${
      resume.personalInfo.linkedin
        ? `
      <a href="${
        resume.personalInfo.linkedin.startsWith("http")
          ? resume.personalInfo.linkedin
          : `https://${resume.personalInfo.linkedin}`
      }"
        target="_blank" 
        rel="noopener noreferrer">
        LinkedIn
      </a>
      ${
        resume.personalInfo.github || resume.personalInfo.website
          ? '<span class="divider">•</span>'
          : ""
      }
    `
        : ""
    }
  
    ${
      resume.personalInfo.github
        ? `
      <a href="${
        resume.personalInfo.github.startsWith("http")
          ? resume.personalInfo.github
          : `https://${resume.personalInfo.github}`
      }"
        target="_blank" 
        rel="noopener noreferrer">
        GitHub
      </a>
      ${resume.personalInfo.website ? '<span class="divider">•</span>' : ""}
    `
        : ""
    }
  
    ${
      resume.personalInfo.website
        ? `
      <a href="${
        resume.personalInfo.website.startsWith("http")
          ? resume.personalInfo.website
          : `https://${resume.personalInfo.website}`
      }"
        target="_blank" 
        rel="noopener noreferrer">
        ${resume.personalInfo.website}
      </a>
    `
        : ""
    }
  </div>
  
            <div class="summary">
              <p style="font-weight: bold; margin-bottom: 3px;">${
                resume?.personalInfo?.title || resume?.personalInfo?.role || ""
              }</p>
              ${resume?.personalInfo?.summary || ""}
            </div>
          </header>
  
          ${
            resume.experience && resume.experience.length > 0
              ? `
            <section>
              <h2 class="section-header">Work Experience</h2>
              ${resume.experience
                .map(
                  (exp) => `
                <div class="experience-item">
                  <div class="experience-header">
                    <div>
                      <span class="job-title">${exp?.title || ""}</span>
                     <div class="job-location">${
                       exp?.company ? exp?.company : ""
                     } ${exp?.location || ""}</div>
  
                    </div>
                    <div class="job-details">
                      ${
                        exp?.startDate?.month && exp?.startDate?.year
                          ? `${exp.startDate.month} ${exp.startDate.year}`
                          : ""
                      }
                      ${
                        exp?.startDate?.month &&
                        exp?.startDate?.year &&
                        (exp?.endDate?.month ||
                          exp?.endDate?.year ||
                          exp?.present)
                          ? " - "
                          : ""
                      }
                      ${
                        exp?.endDate?.month && exp?.endDate?.year
                          ? `${exp.endDate.month} ${exp.endDate.year}`
                          : exp?.present
                          ? "Present"
                          : ""
                      }
                    </div>
                  </div>
                  <div class="description">${exp?.description || ""}</div>
                </div>
              `
                )
                .join("")}
            </section>
          `
              : ""
          }
  
          ${
            resume.education && resume.education.length > 0
              ? `
            <section>
              <h2 class="section-header">Education</h2>
              ${resume.education
                .map(
                  (edu) => `
                <div class="education-item">
                  <div class="education-header">
                    <span style="font-weight: bold;">${edu?.school || ""}</span>
                    <span class="job-details">
                      ${
                        edu?.startDate?.month && edu?.startDate?.year
                          ? `${edu.startDate.month} ${edu.startDate.year}`
                          : ""
                      }
                      ${
                        edu?.startDate?.month &&
                        edu?.startDate?.year &&
                        (edu?.endDate?.month ||
                          edu?.endDate?.year ||
                          edu?.present)
                          ? " - "
                          : ""
                      }
                      ${
                        edu?.endDate?.month === "Present"
                          ? "Present"
                          : edu?.endDate?.month && edu?.endDate?.year
                          ? `${edu.endDate.month} ${edu.endDate.year}`
                          : edu?.present
                          ? "Present"
                          : ""
                      }
  
  
                    </span>
                  </div>
                  <div>${edu?.degree || ""} ${edu?.fieldOfStudy || ""}</div>
                  <div>${edu?.location || ""}</div>
                </div>
              `
                )
                .join("")}
            </section>
          `
              : ""
          }
  
          ${
            resume.projects && resume.projects.length > 0
              ? `
            <section>
              <h2 class="section-header">Projects</h2>
              ${resume.projects
                .map(
                  (proj) => `
                <div class="project-item">
                  <div class="project-header">
                    <span class="job-title">${proj?.name || ""}</span>
                    <span class="job-details">
                      ${
                        proj?.startDate?.month && proj?.startDate?.year
                          ? `${proj.startDate.month} ${proj.startDate.year}`
                          : ""
                      }
                      ${
                        proj?.startDate?.month &&
                        proj?.startDate?.year &&
                        (proj?.endDate?.month ||
                          proj?.endDate?.year ||
                          proj?.present)
                          ? " - "
                          : ""
                      }
                      ${
                        proj?.endDate?.month && proj?.endDate?.year
                          ? `${proj.endDate.month} ${proj.endDate.year}`
                          : proj?.present
                          ? "Present"
                          : ""
                      }
                    </span>
                  </div>
                 <div style="margin-top:-10px; margin-bottom: 6px;">
                   ${
                     proj?.link
                       ? `<a href="${
                           proj?.link.startsWith("http")
                             ? proj.link
                             : `https://${proj.link}`
                         }"
                              target="_blank"
                              rel="noopener noreferrer">View Project</a>`
                       : ""
                   }
                 </div>
                  <div>
                    <strong>Tech Stack: </strong>
                    ${
                      Array.isArray(proj?.technologies)
                        ? proj.technologies.join(", ")
                        : ""
                    }
                  </div>
                  <div class="description">${proj?.description || ""}</div>
                </div>
              `
                )
                .join("")}
            </section>
          `
              : ""
          }
  
          ${
            resume.technicalSkills && resume.technicalSkills.length > 0
              ? `
            <section>
              <h2 class="section-header">Skills</h2>
              ${resume.technicalSkills
                .map(
                  (skill) => `
                <div class="skills-item">
                  <strong>${skill?.heading || ""}:</strong> 
                  ${skill?.skills ? skill.skills.join(", ") : "Not specified"}
                </div>
              `
                )
                .join("")}
            </section>
          `
              : ""
          }
  
           ${
             resume?.achievementsAndCertifications?.length > 0
               ? `
          <section>
            <h2 class="section-header">ACHIEVEMENTS AND CERTIFICATIONS</h2>
            ${resume.achievementsAndCertifications
              .map(
                (cert) => `
              <div class="certification-item">
                ${
                  cert?.title
                    ? `
                  <div>${cert?.title}</div>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </section>
        `
               : ""
           }
        </div>
      </body>
      </html>
    `;

  return htmlContent;
};

export default resumeTemplate;
