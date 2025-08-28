import resumeTemplate from "./controllers/resume/resumetemplate.js";

const data = {
  allSkills: [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "SCSS",
    "SQL",
    "React JS",
    "Next JS",
    "Angular 16",
    "Redux Toolkit",
    "RTK",
    "Bootstrap 5",
    "Tailwind CSS",
    "Framer Motion",
    "Node.js",
    "Express.js",
    "MongoDB",
    "MySQL",
    "Problem Solving",
    "Critical thinking",
    "Version Control",
    "Git",
    "GitHub",
    "IDEs",
    "Visual Studio Code",
    "Sublime Text",
    "Package Managers",
    "npm",
    "Browser Developer Tools",
    "Chrome DevTools",
    "Responsive Design Principles",
    "Redux Dev Tools",
  ],
  degreeType: 0,
  parsedAchievementsAndCertifications: [
    {
      title:
        "Certification - ZTM (Zero to Mastery) – Full Stack Developer 2022",
    },
    {
      title:
        "GSSOC’24 - GirlsScript Summer of Code 2024 – Open-Source Contributor",
    },
  ],
  parsedEducation: [
    {
      degree: "Diploma In Information Technology",
      endDate: {
        month: "Jun",
        year: "2024",
      },
      fieldOfStudy: "Information Technology",
      location: "Bhavnagar, Gujarat",
      school: "Sir Bhavsinhji Polytechnic Institute",
      startDate: {
        month: "Jun",
        year: "2021",
      },
    },
  ],
  parsedExperience: [
    {
      company: "Enshrine Global Systems",
      description:
        "<ul><li>Developed a SaaS app with Next JS, Typescript, Node JS, React JS, and Tailwind CSS.</li><li>Optimized application performance and enhanced code quality through efficient frontend integration and best practices.</li></ul>",
      endDate: {
        month: "Present",
        year: "2024",
      },
      location: "",
      present: true,
      startDate: {
        month: "Jun",
        year: "2024",
      },
      title: "Full Stack Developer",
    },
  ],
  parsedPersonalInfo: {
    email: "vanshchavda328@gmail.com",
    firstName: "Vansh",
    github: "github.com",
    lastName: "Chavda",
    linkedin: "linkedin.com",
    phone: "+91 9737419935",
    summary:
      "<strong>Vansh Chavda</strong> is a <strong>Full Stack Developer</strong> with experience in developing SaaS applications using technologies like Next JS, TypeScript, Node JS, React JS, and Tailwind CSS.  He has a proven ability to optimize application performance and enhance code quality.  His project experience includes building a full-stack blog with robust user interaction features and real-time analytics, as well as developing admin dashboards and e-commerce features for various clients.  Vansh is proficient in multiple programming languages, frameworks, and backend development tools, and possesses strong problem-solving skills. He is also an active open-source contributor and holds a ZTM Full Stack Developer certification.",
    website: "",
  },
  parsedProjects: [
    {
      date: {
        month: "",
        year: "",
      },
      description:
        "<ul><li>Implement robust mechanisms for users to follow and unfollow others seamlessly.</li><li>Utilize RTK Query and Redux Toolkit for efficient data retrieval, with integrated Cloudinary support for media handling.</li><li>Develop a real-time analytics dashboard to monitor user interactions and content performance.</li><li>Enable features to like, bookmark, and share posts across various social media platforms.</li><li>Ensure scalability and responsiveness, supporting up to 500 + simultaneous users.</li></ul>",
      link: "link",
      name: "Stack Spot - Full Stack Blog",
      technologies: [
        "React Js",
        "Node Js",
        "Express Js",
        "Redux Toolkit",
        "RTK",
        "Tailwind CSS",
      ],
    },
    {
      date: {
        month: "",
        year: "",
      },
      description:
        "<ul><li>Implemented the admin dashboard support.</li><li>Configure and manage firebase for seamless user data persistence.</li><li>Develop robust add-to-cart features for a streamlined shopping experience.</li></ul>",
      link: "link",
      name: "Fusion Restaurant",
      technologies: ["React Js", "Redux Toolkit", "TypeScript", "Tailwind CSS"],
    },
    {
      date: {
        month: "",
        year: "",
      },
      description:
        "<ul><li>Implement functionality to gather news from all major news channels.</li><li>Ensure a fully responsive design for optimal viewing on all devices.</li><li>Integrate with News APIs for real-time news updates and content delivery.</li></ul>",
      link: "link",
      name: "World News",
      technologies: ["Angular 16", "Typescript", "Material UI", "Tailwind CSS"],
    },
    {
      date: {
        month: "",
        year: "",
      },
      description:
        "<ul><li>Implement Add to Cart functionality with Backend API integration.</li><li>Ensure secure user authentication and customizable notification preferences.</li><li>Integrate Razorpay for seamless payment processing and a robust admin panel for management.</li><li>Support targeted advertising with Flipkart Ads integration.</li><li>Develop an admin panel for efficient management of products and orders.</li></ul>",
      link: "link",
      name: "School Bazar",
      technologies: ["React Js", "Tailwind CSS", "Node Js", "Mongo DB"],
    },
  ],
  parsedSkills: [
    {
      heading: "Programming Languages",
      skills: [
        "Python",
        "Java",
        "JavaScript",
        "TypeScript",
        "HTML",
        "CSS",
        "SCSS",
        "SQL",
      ],
    },
    {
      heading: "Frameworks",
      skills: [
        "React JS",
        "Next JS",
        "Angular 16",
        "Redux Toolkit",
        "RTK",
        "Bootstrap 5",
        "Tailwind CSS",
        "Framer Motion",
      ],
    },
    {
      heading: "Backend Development",
      skills: ["Node.js", "Express.js", "MongoDB", "MySQL"],
    },
    {
      heading: "Developer Tools",
      skills: [
        "Problem Solving",
        "Critical thinking",
        "Version Control",
        "Git",
        "GitHub",
        "IDEs",
        "Visual Studio Code",
        "Sublime Text",
        "Package Managers",
        "npm",
        "Browser Developer Tools",
        "Chrome DevTools",
        "Responsive Design Principles",
        "Redux Dev Tools",
      ],
    },
  ],
  totalYearsOfExperience: 1,
  parsedLanguages: [
    {
      language: "New Languagesdsdfsdf",
      proficiency: "Intermediate",
    },
    {
      language: "New Language",
      proficiency: "Beginner",
    },
  ],

  parsedCustomSections: [
    {
      title: "New Section",
      content:
        "<ul><li><p>sdfsdfsdfdsdf</p></li><li><p>nsdf</p></li><li><p>kmsdf</p></li></ul><p></p>",
    },
    {
      title: "New Sectionsfsdfsdfsdf",
      content:
        "<ul><li><p><strong>sdsdfsfd</strong></p></li><li><p><em>sdf</em></p></li></ul><p>sdf</p><p></p>",
    },
  ],
};

const html = resumeTemplate(data);
console.log(html);
