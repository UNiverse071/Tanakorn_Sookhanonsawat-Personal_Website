export type Category = "Systems" | "AI / ML" | "Web & Tools";

export const CATEGORIES: Category[] = ["Systems", "AI / ML", "Web & Tools"];

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  category: Category;
  period?: string;
  context?: string;
  tech: string[];
  overview: string;
  highlights: string[];
  /** GitHub repository, or null when the source code isn't published. */
  repo: string | null;
  accent: string;
  icon: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "os-kernel",
    title: "Custom Operating System Kernel",
    tagline: "x86-64 kernel with concurrency, async I/O, and an Ext2 file system",
    category: "Systems",
    period: "Aug 2026 – Oct 2026",
    tech: ["C++", "x86-64"],
    overview:
      "An operating-system kernel for x86-64 written in C++, built up from threads and synchronization to virtual memory and a real on-disk file system.",
    highlights: [
      "Designed and implemented an x86-64 kernel featuring a thread-safe concurrency suite, an asynchronous API (co_await), and a custom Ext2 file system enabling read access and path resolution across directories, normal files, and symbolic links.",
      "Constructed in-kernel virtual memory and a shared heap allocator, implementing mmap and munmap system calls and using a Red-Black tree to manage virtual address space in O(log n) time.",
    ],
    repo: null,
    accent: "#7c3aed",
    icon: "⚙️",
  },
  {
    slug: "gans",
    title: "Generative Adversarial Networks",
    tagline: "GANs that synthesize MNIST and CIFAR-10 images",
    category: "AI / ML",
    period: "Sep 2026 – Oct 2026",
    tech: ["Python", "PyTorch"],
    overview:
      "Generator and discriminator networks trained adversarially to produce realistic, high-dimensional image samples.",
    highlights: [
      "Engineered and trained GANs in PyTorch to synthesize realistic, high-dimensional image samples for the MNIST and CIFAR-10 datasets.",
      "Architected generator and discriminator models, optimizing custom training loops, cross-entropy loss functions, and latent-space sampling to stabilize adversarial training dynamics.",
    ],
    repo: null,
    accent: "#db2777",
    icon: "🎨",
  },
  {
    slug: "motion-autoencoder",
    title: "Motion Manifold Autoencoder",
    tagline: "Learning a manifold of human motion from CMU Mocap",
    category: "AI / ML",
    context: "University coursework",
    tech: ["Python", "PyTorch", "CMU Mocap"],
    overview:
      "A convolutional autoencoder that compresses ~5-second motion-capture windows into a latent manifold, then uses that manifold to blend, repair, complete, and restyle motion.",
    highlights: [
      "Trained on 9,839 motion windows drawn from 2,480 CMU Mocap files (38-joint skeleton, 117 input channels), with per-joint z-score normalization so high-variance limbs don't dominate the loss.",
      "Two-phase schedule — 15 epochs of denoising training with 10% input corruption, then 15 epochs of fine-tuning — using MSE reconstruction plus an L1 sparsity penalty on the latent code; validation loss fell to 0.214.",
      "Synthesis: latent-space interpolation between motions, and repair of corrupted motion (recovers additive noise well; heavy 50% dropout degrades the pose).",
      "Extra credit: motion completion by iterative manifold inpainting (gap-filling and ending extension) and style transfer by Gram-matrix optimization in latent space.",
    ],
    repo: null,
    accent: "#0891b2",
    icon: "🏃",
  },
  {
    slug: "web-crawler",
    title: "Web Crawler & Search Engine",
    tagline: "Inverted index over 300+ document collections, Trie-backed lookup",
    category: "Web & Tools",
    period: "Nov 2025 – Dec 2025",
    tech: ["Java"],
    overview:
      "A scalable crawler and search engine that parses pages, builds an inverted index, and answers text queries quickly.",
    highlights: [
      "Developed a scalable web crawler and search engine in Java, implementing an inverted index to efficiently parse, store, and query across over 300 document collections.",
      "Accelerated data retrieval by engineering a Trie-based algorithm, achieving O(n) search time for words of length n to process high-volume text queries across hundreds of web pages.",
    ],
    repo: null,
    accent: "#ea580c",
    icon: "🕷️",
  },
  {
    slug: "pipelined-cpu",
    title: "Pipelined CPU",
    tagline: "16-bit, 5-stage pipelined CPU with forwarding and branch prediction",
    category: "Systems",
    period: "Mar 2026 – Apr 2026",
    tech: ["Verilog"],
    overview:
      "A 16-bit, 5-stage pipelined processor executing a custom instruction set with arithmetic, branching, and multi-word memory operations.",
    highlights: [
      "Architected a 16-bit, 5-stage pipelined CPU in Verilog, executing a custom instruction set featuring arithmetic, branching, and multi-word memory operations.",
      "Managed data and control hazards by forwarding data across pipeline stages and integrating a branch predictor with valid-bit pipeline flushing, allowing data bypassing and correct state rollbacks.",
      "Engineered a stalling policy and instruction fetch buffer to restrict hazard penalties to a maximum of 2 stall cycles per instruction.",
    ],
    repo: null,
    accent: "#2563eb",
    icon: "🔲",
  },
  {
    slug: "shared-heap-allocator",
    title: "Multi-Process Shared Heap Allocator",
    tagline: "malloc/realloc/free across processes with O(1) coalescing",
    category: "Systems",
    period: "Feb 2026 – Mar 2026",
    tech: ["C", "Unix syscalls"],
    overview:
      "A dynamic memory allocator that manages one shared heap across concurrent processes using Unix system calls.",
    highlights: [
      "Designed a dynamic memory allocator in C utilizing Unix system calls (fork, mmap, waitpid) to manage a shared heap across concurrent processes within 40 isolated 512KB memory arenas.",
      "Implemented core malloc, realloc, and free with a 64-byte metadata overhead per arena, achieving O(1) deallocation time via constant-time coalescing of adjacent free memory blocks.",
    ],
    repo: null,
    accent: "#059669",
    icon: "📦",
  },
  {
    slug: "python-x86-compiler",
    title: "Python to x86-64 Compiler",
    tagline: "A statically-typed Python subset compiled to x86-64 assembly",
    category: "Systems",
    period: "Jan 2026 – Feb 2026",
    tech: ["C", "x86-64 Assembly", "GCC", "Make"],
    overview:
      "A compiler written in C that translates a statically-typed subset of Python into optimized x86-64 assembly.",
    highlights: [
      "Built a C compiler translating a statically-typed Python subset into x86-64 Assembly, supporting type-checking, nested functions, conditional/iteration statements, and dynamic I/O.",
      "Optimized generated assembly memory usage and execution time by implementing an abstract syntax tree (AST), constant folding, tail-call optimization (TCO), and dead-code elimination (DCE).",
    ],
    repo: null,
    accent: "#ca8a04",
    icon: "🛠️",
  },
  {
    slug: "focus-ledger",
    title: "Focus Ledger",
    tagline: "Chrome extension that tracks productive, idle, and wait-on-AI time",
    category: "Web & Tools",
    tech: ["JavaScript", "Chrome Extension (MV3)", "Node.js"],
    overview:
      "A Manifest V3 Chrome extension that splits your browser time between productive work, waiting on AI, and idle — with a popup, a full dashboard, and an optional local bridge for monitoring AI coding agents.",
    highlights: [
      "Tracks only the active, focused tab while the computer is unlocked; stores site names only — never page contents, typed text, or full URLs.",
      "Popup with a productivity ring, live status, hourly chart, and top sites; dashboard with overview, by-hour, AI-waiting, sites, and 7/14/30-day trends, built with dependency-free SVG charts.",
      "Accounts with admin/member roles, per-user data separation, salted PBKDF2-SHA256 password hashing, and lockout after 5 wrong passwords.",
      "Optional dependency-free Node.js bridge that adds an Agent inbox for reviewing sub-agent tasks and permission rules (ask / block / allow) enforced through a Claude Code PreToolUse hook.",
    ],
    repo: "https://github.com/UNiverse071/Productivity_Tracker-Chrome_Extension",
    accent: "#dc2626",
    icon: "⏱️",
  },
  {
    slug: "coding-test-platform",
    title: "Coding Test Platform",
    tagline: "My first website — a platform for coding tests",
    category: "Web & Tools",
    period: "May 2025",
    tech: ["JavaScript"],
    overview:
      "My first website: a platform for taking coding tests, split into a separate backend and frontend.",
    highlights: [
      "Organized as two parts — coding-test-backend and coding-test-frontend.",
    ],
    repo: "https://github.com/UNiverse071/coding-test-platform",
    accent: "#4f46e5",
    icon: "🧪",
  },
  {
    slug: "code-grader",
    title: "Programming Code Grader",
    tagline: "A web platform for grading students' programming code",
    category: "Web & Tools",
    period: "Mar 2025",
    tech: ["HTML", "CSS", "JavaScript"],
    overview:
      "A browser-based platform for grading students' computer programming code.",
    highlights: [
      "A front end made of grader.html, grader.css, and grader.js.",
    ],
    repo: "https://github.com/UNiverse071/UNiverse071.github.io",
    accent: "#0d9488",
    icon: "✅",
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
