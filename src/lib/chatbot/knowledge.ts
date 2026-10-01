// Knowledge base and system instructions for S Akash Dora's AI Assistant

export const AKASH_PROFILE = {
  name: "S Akash Dora",
  title: "Full-Stack Software Engineer & AI Developer",
  location: "Bhubaneswar, Odisha, India",
  email: "sakashdora@gmail.com",
  portfolio: "https://sakashdora.vercel.app",
  linkedin: "https://linkedin.com/in/sakashdora",
  github: "https://github.com/sakashdora",
  resumePdf: "/S_Akash_Dora_Resume.pdf",
  resumeCv: "/cv.html",
  availability: "Available for Full-Time Roles, Internships, and Freelance Opportunities",
  education: [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "Srusti Academy of Management and Technology",
      period: "2025 - 2027",
      coursework: "Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, Artificial Intelligence"
    },
    {
      degree: "B.Sc. in Computer Science",
      institution: "Orissa University of Agriculture and Technology (OUAT)",
      period: "2022 - 2025",
      specialization: "Graduated with honors in Computer Science & Distributed Systems"
    }
  ],
  experience: [
    {
      role: "Senior Full-Stack Engineer",
      period: "2026 - Present",
      description: "Leading development of scalable AI-powered products and resilient backend microservices."
    },
    {
      role: "Cloud Solutions Architect",
      period: "2025",
      description: "Architected cloud solutions, migrated monolithic systems into distributed microservices on AWS and Azure."
    },
    {
      role: "Software Engineer Intern",
      company: "AssetMagnets",
      period: "90-day Internship (Bhubaneswar, India)",
      description: "Contributed to Tradevault trading journal, integrated AI content moderation and end-to-end encrypted (E2EE) messaging, deployed on Azure Container Apps using React, Express, Prisma, and PostgreSQL."
    }
  ],
  skills: {
    frontend: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Three.js", "Redux", "D3.js", "Framer Motion"],
    backend: ["Node.js", "Express", "Python", "REST APIs", "GraphQL", "WebSockets", "Prisma"],
    database: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Supabase"],
    devops_and_tools: ["Git", "GitHub", "Docker", "AWS", "Azure Container Apps", "Vercel", "Linux", "Figma"]
  },
  projects: [
    {
      name: "Disease Prediction System",
      tech: "Python, TensorFlow, React, Node.js, Tailwind CSS",
      description: "AI-driven health diagnostic platform analyzing patient biomarkers and symptoms for early detection insights."
    },
    {
      name: "E-Commerce Platform (Elesene)",
      tech: "Next.js, TypeScript, Stripe, PostgreSQL, Prisma",
      description: "Scalable online shopping engine featuring real-time revenue analytics, Super Admin panel, inventory control, and secure checkout."
    },
    {
      name: "Homelux Real Estate",
      tech: "React, Firebase, Google Maps API, Framer Motion",
      description: "High-end real estate portal with virtual tours, interactive map exploration, and advanced filters."
    },
    {
      name: "Tradevault",
      tech: "React, Redux, WebSockets, Node.js, Express, Prisma, PostgreSQL",
      description: "Secure real-time cryptocurrency trading journal with end-to-end encrypted chat and automated AI moderation."
    },
    {
      name: "Veil Cybersecurity & Anonymous Network",
      tech: "Vue.js, D3.js, Python, PostgreSQL, Docker",
      description: "Dual-purpose platform providing enterprise threat intelligence visualization and privacy-first encrypted social interactions."
    },
    {
      name: "AI Voice Assistant",
      tech: "Python, React.js, Gemini API",
      description: "Intelligent voice assistant delivering hands-free voice-to-text queries and smooth speech synthesis."
    }
  ],
  certifications: [
    "Data Analytics Job Simulation by Deloitte Australia (Forage)",
    "Master Artificial Intelligence by Great Learning Academy"
  ]
};

export const CHATBOT_SYSTEM_PROMPT = `You are the official AI Assistant for S Akash Dora on his personal portfolio website.
You represent Akash with a warm, articulate, highly professional, and natural voice.

CRITICAL INSTRUCTION - NO ASTERISKS (*) AND NO HASHES (#):
- NEVER use the asterisk symbol (*) anywhere in your reply.
- NEVER use markdown bolding like **word** or *word*.
- NEVER use the hash symbol (#) anywhere in your reply. No markdown headers like # or ##.
- NEVER use asterisk bullets like * item.
- For lists, use clean unicode bullet points (•) or numbers (1., 2.) or hyphens (-).
- Write in clean, beautiful, natural prose that reads smoothly and effortlessly.

ABOUT AKASH DORA:
- Full Name: S Akash Dora
- Role: Full-Stack Software Engineer and AI Enthusiast
- Location: Bhubaneswar, Odisha, India
- Status: Available for full-time software engineering roles, internships, and freelance projects.
- Education:
  • Master of Computer Applications (MCA) at Srusti Academy of Management and Technology (2025 - 2027)
  • B.Sc. in Computer Science with honors from Orissa University of Agriculture and Technology (OUAT) (2022 - 2025)
- Core Expertise:
  • Frontend: React, Next.js, TypeScript, JavaScript, Tailwind CSS, Three.js, Redux, Framer Motion
  • Backend: Node.js, Express, Python, REST APIs, GraphQL, Prisma, WebSockets
  • Databases: PostgreSQL, MongoDB, MySQL, Redis, Supabase
  • Cloud & DevOps: AWS, Azure Container Apps, Docker, Git, GitHub, Vercel, Linux
- Key Projects:
  1. Disease Prediction System: Machine learning diagnostic platform built with Python, TensorFlow, and React.
  2. E-Commerce Platform (Elesene): High-performance e-commerce store with Super Admin dashboard, Stripe payments, and live analytics.
  3. Homelux Real Estate: Modern property discovery platform with interactive Google Maps and virtual walkthroughs.
  4. Tradevault: Real-time crypto portfolio journal with AI moderation and end-to-end encrypted messaging.
  5. Veil Cybersecurity: Threat intelligence dashboard visualizing network anomalies in real time.
  6. AI Voice Assistant: Speech-to-text and text-to-speech assistant powered by Gemini API and Python.
- Work Experience:
  • Software Engineer Intern at AssetMagnets in Bhubaneswar, India (Tradevault trading platform, AI content moderation, Azure Container Apps).
- Contact & Links:
  • Email: sakashdora@gmail.com
  • LinkedIn: linkedin.com/in/sakashdora
  • GitHub: github.com/sakashdora
  • Portfolio: sakashdora.vercel.app
  • Resume: Available to download via the Download Resume button or /cv.html

BEHAVIOR GUIDELINES:
- Keep answers crisp, informative, and engaging.
- If the user asks how to contact Akash, provide his email sakashdora@gmail.com and LinkedIn link.
- If the user asks about his resume, encourage them to download it or visit the resume page.
- If the user asks about his projects, describe them clearly and mention the tech stack.
- Remember: Absolutely NO * or # characters in the output.`;

/**
 * Sanitizes response text to guarantee that no '*' or '#' characters are ever rendered,
 * maintaining high-grade natural typography without markdown noise.
 */
export function cleanResponseText(text: string): string {
  if (!text) return "";

  return text
    // Replace markdown bold/italic asterisks with just the inner text
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    // Remove any remaining stray asterisks
    .replace(/\*/g, "")
    // Remove markdown headers #, ##, ### at line start
    .replace(/^#{1,6}\s+/gm, "")
    // Remove any remaining hash symbols
    .replace(/#/g, "")
    // Normalize bullets if any asterisk bullets slipped through
    .replace(/^\s*\*\s+/gm, "• ")
    // Clean up multiple spaces
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
