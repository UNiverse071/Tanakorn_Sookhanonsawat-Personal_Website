const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const CONTACT = {
  email: "tsookhanonsawat@utexas.edu",
  github: "https://github.com/UNiverse071",
  linkedin: "https://linkedin.com/in/tanakorn-sookhanonsawat",
};

const EXPERIENCE = [
  {
    role: "Software Engineer Intern",
    org: "UnaliWear, Inc.",
    context: "Medical-Alert Smartwatch Startup · Austin, TX",
    period: "May 2026 – Aug 2026",
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
    bullets: [
      "Mentored top 30 high school competitive programmers in Upper Southern Thailand, teaching advanced algorithms and data structures to prepare them for the Thailand Olympiad in Informatics (TOI).",
      "Coordinated and administered qualifying examinations to evaluate and select 6 regional representatives.",
    ],
  },
];

const PROJECTS = [
  {
    title: "Pipelined CPU",
    period: "Mar 2026 – Apr 2026",
    tags: ["Verilog"],
    description:
      "Architected a 16-bit, 5-stage pipelined CPU executing a custom instruction set with arithmetic, branching, and multi-word memory operations.",
    bullets: [
      "Managed data and control hazards by forwarding data across pipeline stages and integrating a branch predictor with valid-bit pipeline flushing.",
      "Engineered a stalling policy and instruction fetch buffer to restrict hazard penalties to a maximum of 2 stall cycles per instruction.",
    ],
  },
  {
    title: "Multi-Process Shared Heap Allocator",
    period: "Feb 2026 – Mar 2026",
    tags: ["C", "Unix Systems"],
    description:
      "A dynamic memory allocator using Unix system calls (fork, mmap, waitpid) to manage a shared heap across concurrent processes within 40 isolated 512KB memory arenas.",
    bullets: [
      "Implemented core malloc, realloc, and free with 64-byte metadata overhead per arena.",
      "Achieved O(1) deallocation time via constant-time coalescing of adjacent free memory blocks.",
    ],
  },
  {
    title: "Python to x86-64 Compiler",
    period: "Jan 2026 – Feb 2026",
    tags: ["C", "x86-64 Assembly", "GCC", "Make"],
    description:
      "A C compiler translating a statically-typed Python subset into x86-64 Assembly, supporting type-checking, nested functions, conditionals/iteration, and dynamic I/O.",
    bullets: [
      "Built an abstract syntax tree (AST) to drive code generation.",
      "Optimized generated assembly with constant folding, tail-call optimization (TCO), and dead-code elimination (DCE).",
    ],
  },
];

const HONORS = [
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

const SKILLS = [
  {
    label: "Languages",
    items: [
      "C/C++",
      "x86/ARM Assembly",
      "Verilog",
      "Java",
      "Go",
      "SQL",
      "Python",
      "JavaScript",
      "HTML/CSS",
      "R",
    ],
  },
  { label: "Frameworks", items: ["React"] },
  { label: "Tools", items: ["Git/GitHub", "Valgrind", "Make", "GCC"] },
];

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <nav className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <a href="#top" className="text-sm font-semibold">
            Tanakorn Sookhanonsawat
          </a>
          <ul className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="top" className="mx-auto w-full max-w-3xl flex-1 px-6">
        {/* Hero */}
        <section className="flex flex-col gap-6 py-24">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Hi, I&apos;m
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Tanakorn Sookhanonsawat
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Computer Science student at UT Austin (Turing Scholars Honors
            Program) who likes building things close to the metal &mdash;
            from pipelined CPUs to compilers to backend systems. Currently a
            Software Engineer Intern at UnaliWear, Inc.
          </p>
          <div className="flex flex-wrap gap-3 pt-2 text-sm font-medium">
            <a
              href="#projects"
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="rounded-full border border-zinc-300 px-5 py-2.5 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            >
              Get in Touch
            </a>
          </div>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-20 border-t border-zinc-200 py-16 dark:border-zinc-800">
          <SectionHeading>About</SectionHeading>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:gap-12">
            <div className="flex-1 space-y-4 text-zinc-700 dark:text-zinc-300">
              <p>
                I&apos;m pursuing a B.S. in Computer Science at the
                University of Texas at Austin through the Turing Scholars
                Honors Program, graduating May 2029. I care most about
                systems-level work: how CPUs, compilers, allocators, and
                backend services actually work under the hood.
              </p>
              <p>
                Before UT Austin, I mentored top competitive programmers in
                Thailand as a teaching assistant for the Academic Olympiad
                and Development of Science Education Foundation, and
                competed in national programming olympiads myself.
              </p>
            </div>
            <div className="sm:w-56">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Skills
              </h3>
              <div className="mt-3 space-y-4">
                {SKILLS.map((group) => (
                  <div key={group.label}>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {group.label}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="scroll-mt-20 border-t border-zinc-200 py-16 dark:border-zinc-800">
          <SectionHeading>Experience</SectionHeading>
          <div className="mt-6 flex flex-col gap-10">
            {EXPERIENCE.map((job) => (
              <div key={job.role + job.org}>
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                  <h3 className="font-semibold">
                    {job.role} &middot; {job.org}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {job.period}
                  </p>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {job.context}
                </p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="scroll-mt-20 border-t border-zinc-200 py-16 dark:border-zinc-800">
          <SectionHeading>Projects</SectionHeading>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {PROJECTS.map((project) => (
              <div
                key={project.title}
                className="flex flex-col rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{project.title}</h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {project.period}
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  {project.description}
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {project.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
            More code and project history on{" "}
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
            >
              GitHub
            </a>
            .
          </p>
        </section>

        {/* Honors */}
        <section id="honors" className="scroll-mt-20 border-t border-zinc-200 py-16 dark:border-zinc-800">
          <SectionHeading>Honors &amp; Awards</SectionHeading>
          <ul className="mt-6 flex flex-col gap-4">
            {HONORS.map((honor) => (
              <li
                key={honor.title}
                className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline"
              >
                <div>
                  <p className="font-medium">{honor.title}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {honor.org}
                  </p>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {honor.year}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-20 border-t border-zinc-200 py-16 dark:border-zinc-800">
          <SectionHeading>Contact</SectionHeading>
          <p className="mt-6 max-w-lg text-zinc-700 dark:text-zinc-300">
            I&apos;m always happy to talk about systems, compilers, or
            interesting engineering problems. Reach out any time.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium">
            <a
              href={`mailto:${CONTACT.email}`}
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {CONTACT.email}
            </a>
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-300 px-5 py-2.5 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            >
              GitHub
            </a>
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-300 px-5 py-2.5 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            >
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        &copy; {new Date().getFullYear()} Tanakorn Sookhanonsawat
      </footer>
    </div>
  );
}
