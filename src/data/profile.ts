export const PROFILE = {
  name: "Tanakorn Sookhanonsawat",
  role: "Computer Science @ UT Austin · Turing Scholars",
  location: "Austin, TX",
  blurb:
    "I like building things close to the metal — from pipelined CPUs and operating-system kernels to compilers, generative models, and the backend services that tie them together.",
  email: "tsookhanonsawat@utexas.edu",
  github: "https://github.com/UNiverse071",
  linkedin: "https://linkedin.com/in/tanakorn-sookhanonsawat",
};

export const EDUCATION = {
  school: "The University of Texas at Austin",
  degree: "B.S. in Computer Science · Turing Scholars Honors Program",
  graduating: "May 2029",
  honorsCourses: [
    "Computer Architecture",
    "Operating Systems",
    "Data Structures",
    "Discrete Math",
  ],
  otherCourses: [
    "Generative Visual Computing",
    "Cryptography",
    "Vector Calculus",
    "Linear Algebra",
    "Probability",
  ],
};

export const EXPERIENCE = [
  {
    role: "Software Engineer Intern",
    org: "UnaliWear, Inc.",
    context: "Medical-Alert Smartwatch Startup · Austin, TX",
    period: "May 2026 – Aug 2026",
    summary: "Internal inventory tool and Go backend performance work.",
    bullets: [
      "Developed an internal full-stack inventory tool (React, JavaScript, Go, MySQL) for tracking the WiFi “hub” devices that give Kanega medical-alert watch users a low-cost alternative to cellular service.",
      "Eliminated multi-minute server stalls and reduced backend latency by architecting a high-throughput, thread-safe API Token Manager in Go to resolve concurrent data-refresh bottlenecks and redundant network I/O.",
      "Identified and resolved memory leaks across the backend architecture, eliminating all known leaked Goroutines.",
    ],
  },
  {
    role: "Teaching Assistant",
    org: "Academic Olympiad and Development of Science Education Foundation",
    context: "Nakhon Si Thammarat, Thailand",
    period: "Oct 2022 – May 2024",
    summary: "Coached the top 30 competitive programmers in Upper Southern Thailand.",
    bullets: [
      "Mentored top 30 high school competitive programmers in Upper Southern Thailand, teaching C++, advanced algorithms, data structures, and mathematics to prepare them for the Thailand Olympiad in Informatics (TOI).",
      "Coordinated and administered qualifying examinations to evaluate and select 6 regional representatives.",
    ],
  },
];

export const HONORS = [
  {
    title: "The Lawther O. Smith Computer Science Prize",
    org: "The Lawrenceville School",
    year: "2025",
  },
  {
    title: "Regional Representative, Thailand Olympiad in Informatics (TOI)",
    org: "Top 90 competitive programmers nationally",
    year: "2024",
  },
  {
    title: "Silver Medalist",
    org: "Computer Science Research Project Contest in Thailand",
    year: "2023",
  },
  {
    title: "Winner",
    org: "Thailand Upper Southern Computing Olympiad (TUSCO)",
    year: "2022",
  },
];

export const SKILLS = [
  {
    label: "Languages",
    items: [
      "C/C++",
      "Java",
      "Go",
      "SQL",
      "x86/ARM Assembly",
      "Verilog",
      "Python",
      "JavaScript",
      "TypeScript",
      "HTML/CSS",
      "R",
    ],
  },
  { label: "Frameworks", items: ["React", "PyTorch", "Vercel"] },
  { label: "Tools", items: ["Git/GitHub", "Valgrind", "Make", "GCC", "AI Workflow"] },
  { label: "Platforms", items: ["Linux/Unix"] },
];
