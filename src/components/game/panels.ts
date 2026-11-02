import { COMMUNITY, EDUCATION, EXPERIENCE, HOBBIES, HONORS, PROFILE } from "@/data/profile";
import { PRIVATE_NOTE, getProject } from "@/data/projects";
import type { Station } from "./world";

export type PanelLink = {
  label: string;
  href: string;
  external?: boolean;
  primary?: boolean;
};

export type Panel = {
  title: string;
  meta?: string;
  tags?: string[];
  body: string[];
  links: PanelLink[];
};

const SOCIAL: PanelLink[] = [
  { label: "LinkedIn", href: PROFILE.linkedin, external: true },
  { label: "GitHub", href: PROFILE.github, external: true },
];

const [INTERN, COACH] = EXPERIENCE;

/** What each villager says when you talk to them. */
const VILLAGERS: Record<string, Panel> = {
  "npc-guide": {
    title: "Guide",
    body: [
      `Welcome to ${PROFILE.name.split(" ")[0]}'s home base! Every object in this hall is one of his projects.`,
      "Walk up to one and press E. The green ring on the floor takes you back to the dashboard.",
    ],
    links: [],
  },
  "npc-intern": {
    title: "Intern",
    meta: `${INTERN.role} · ${INTERN.org} · ${INTERN.period}`,
    body: [
      "Built an internal inventory tool (React, Go, MySQL) that tracks the WiFi hub devices behind Kanega medical-alert watches.",
      "Cut multi-minute server stalls with a thread-safe API Token Manager in Go, and hunted down every leaked goroutine.",
    ],
    links: [],
  },
  "npc-coach": {
    title: "Coach",
    meta: `${COACH.role} · ${COACH.period}`,
    body: [
      "Coached the top 30 high school competitive programmers in Upper Southern Thailand — C++, algorithms, data structures, and math — for the Thailand Olympiad in Informatics.",
      "Also ran the qualifying exams that picked 6 regional representatives.",
    ],
    links: [],
  },
  "npc-scholar": {
    title: "Scholar",
    meta: `${EDUCATION.school} · ${EDUCATION.graduating}`,
    body: [
      EDUCATION.degree,
      `Honors coursework: ${EDUCATION.honorsCourses.join(", ")}.`,
      `Also: ${EDUCATION.otherCourses.join(", ")}.`,
    ],
    links: [],
  },
  "npc-champion": {
    title: "Champion",
    meta: "Honors & Awards",
    body: HONORS.map((h) => `${h.year} · ${h.title} (${h.org})`),
    links: [],
  },
  "npc-volunteer": {
    title: "Volunteer",
    meta: "Volunteering & Leadership",
    body: COMMUNITY.map((c) => `${c.title} — ${c.where}${c.period ? ` (${c.period})` : ""}`),
    links: [],
  },
  "npc-bard": {
    title: "Bard",
    meta: "Beyond the code",
    body: HOBBIES.map((h) => `${h.label}: ${h.items.join(", ")}`),
    links: [],
  },
  "npc-hacker": {
    title: "Hacker",
    meta: "🔒 About the private projects",
    body: [
      "His school doesn't let him publish the source code for the 🔒 projects, so those stay private.",
      "Everything on GitHub is open to read. For the rest, just ask — he's happy to explain how they work.",
    ],
    links: [{ label: "Email him", href: `mailto:${PROFILE.email}`, primary: true }],
  },
};

export function panelFor(s: Station): Panel {
  if (s.slug) {
    const p = getProject(s.slug);
    if (p) {
      const links: PanelLink[] = [
        { label: "Full details", href: `/projects/${p.slug}`, primary: true },
      ];
      if (p.repo) links.push({ label: "Source on GitHub", href: p.repo, external: true });
      return {
        title: p.title,
        meta: [p.category, p.period, p.context].filter(Boolean).join(" · "),
        tags: p.tech,
        body: [
          p.overview,
          ...(p.repo
            ? []
            : p.researchOnly
              ? ["📄 A research project presented at a competition — ask me about it."]
              : [`🔒 ${PRIVATE_NOTE}`]),
        ],
        links,
      };
    }
  }

  if (VILLAGERS[s.id]) return VILLAGERS[s.id];

  switch (s.id) {
    case "about":
      return {
        title: PROFILE.name,
        meta: PROFILE.role,
        body: [PROFILE.blurb, `${EDUCATION.degree} · ${EDUCATION.graduating}`],
        links: [{ label: "Email me", href: `mailto:${PROFILE.email}`, primary: true }, ...SOCIAL],
      };
    case "journey":
      return {
        title: "Journey",
        body: EXPERIENCE.map((e) => `${e.role} — ${e.org} (${e.period})`),
        links: [],
      };
    case "honors":
      return {
        title: "Honors & Awards",
        body: HONORS.map((h) => `${h.year} · ${h.title}`),
        links: [],
      };
    default:
      return {
        title: "Contact",
        meta: PROFILE.location,
        body: ["Say hi — email is the fastest way to reach me."],
        links: [
          { label: PROFILE.email, href: `mailto:${PROFILE.email}`, primary: true },
          ...SOCIAL,
        ],
      };
  }
}
