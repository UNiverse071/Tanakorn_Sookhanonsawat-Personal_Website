export const PROFILE = {
  name: "Tanakorn Sookhanonsawat",
  role: "Computer Science @ UT Austin · Turing Scholars",
  location: "Austin, TX",
  hometown: "Surat Thani, Thailand",
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
      "Created mock coding exams and coordinated and administered qualifying examinations to evaluate and select 6 regional representatives.",
    ],
  },
];

export const HONORS = [
  {
    title: "The Lawther O. Smith Computer Science Prize",
    org: "The Lawrenceville School",
    year: "2025",
    detail: "Awarded for excellence in the study of computer science.",
  },
  {
    title: "The Kathleen Wallace Award",
    org: "The Lawrenceville School",
    year: "2025",
    detail:
      "Presented to the best one-year Fifth Form (post-graduate) student, recognizing commitment and growth.",
  },
  {
    title: "Regional Representative, Thailand Olympiad in Informatics (TOI)",
    org: "Top 90 competitive programmers nationally",
    year: "2024",
    detail: "Qualified as one of the top ninety computer programming students in Thailand.",
  },
  {
    title: "Citizenship Award & Captain of Kindness Award",
    org: "Choate Summer Program",
    year: "2024",
    detail: "Two awards from the Choate Rosemary Hall summer program, where I earned an A.",
  },
  {
    title: "Silver Medalist, Computer Research Project Competition",
    org: "Southern Thailand",
    year: "2023",
    detail:
      "Researched the efficiency of Prim's versus Kruskal's algorithm on dense and sparse graphs.",
  },
  {
    title: "Qualified Participant, Regional Olympiad in Informatics Camp",
    org: "Upper Southern Thailand",
    year: "2023",
    detail:
      "Qualified for the competitive-programming camp that comes before selection for Thailand's national coding contest.",
  },
  {
    title: "Winner, Thailand Upper Southern Computing Olympiad (TUSCO)",
    org: "Upper Southern Thailand",
    year: "2022",
    detail: "The first and only participant to earn a full score at TUSCO in 2022.",
  },
  {
    title: "Winner, Southern Thailand Computing Contest",
    org: "Representing Suratthani School",
    year: "2022",
    detail: "Won a contest testing computer programming skills.",
  },
  {
    title: "Bronze Medalist, Asian Science and Maths Olympiad (ASMO)",
    org: "Thailand",
    year: "2020",
    detail: "Scored in the top few percent of students in Southern Thailand.",
  },
  {
    title: "2nd Runner-Up Team Award, ASMO",
    org: "Asian Science and Maths Olympiad",
    year: "2020",
    detail: "Led a team to an award for high overall science scores.",
  },
];

export const EDUCATION_HISTORY = [
  {
    school: "The University of Texas at Austin",
    place: "Austin, TX",
    period: "Expected May 2029",
    detail: "B.S. in Computer Science · Turing Scholars Honors Program.",
  },
  {
    school: "The Lawrenceville School",
    place: "Lawrenceville, NJ",
    period: "2024 – 2025",
    detail:
      "Post-graduate year, Class of 2025. A+ in Honors Calculus-Based Probability and Statistics, JavaScript Programming, and Python Programming.",
  },
  {
    school: "Choate Rosemary Hall",
    place: "Wallingford, CT",
    period: "Summer 2024",
    detail: "Summer program (grade A). Received the Citizenship Award and the Captain of Kindness Award.",
  },
  {
    school: "Suratthani School",
    place: "Muang Surat Thani, Thailand",
    period: "2018 – 2024",
    detail: "Graduated from 12th grade.",
  },
];

export const COMMUNITY = [
  {
    title: "Event Staff, College Application Advising",
    where: "Chulalongkorn University Alumni Association · Suratthani School",
    period: "2024",
    detail:
      "As an admitted Chulalongkorn University student, advised younger students on preparing for the Thai college admission exam and their resumes.",
  },
  {
    title: "Assistant Staff, Blood Donation Events",
    where: "Thai Red Cross Society",
    period: "2023 – 2024",
    detail:
      "Helped blood donors, recorded their health information, moved equipment, organized snacks, and donated blood.",
  },
  {
    title: "Member, Wellness Council",
    where: "The Lawrenceville School",
    period: "2025",
    detail:
      "Suggested and organized activities to improve the mental health of the school community.",
  },
  {
    title: "Unit Leader, R.O.T.C. Student Training",
    where: "Southern Thailand military training camp",
    period: "2024",
    detail: "Trained as a Thai R.O.T.C. student and became the leader of a student unit.",
  },
  {
    title: "Vice President, Track Team",
    where: "Suratthani School sports festival",
    period: "",
    detail:
      "Organized the team tryouts and prepared teammates to compete against other teams at the school sports festival.",
  },
];

export const HOBBIES = [
  { label: "Sports", items: ["Tennis", "Basketball", "Table tennis", "Badminton", "Swimming", "Running"] },
  { label: "Music", items: ["Piano", "Drums", "Dulcimer"] },
  { label: "Other", items: ["Drawing", "Fast typing", "Calisthenics", "Netflix", "Online comics"] },
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
