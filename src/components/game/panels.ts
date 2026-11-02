import { EDUCATION, EXPERIENCE, HONORS, PROFILE } from "@/data/profile";
import { getProject } from "@/data/projects";
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
        body: [p.overview, ...(p.repo ? [] : ["Source code for this project isn't published."])],
        links,
      };
    }
  }

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
