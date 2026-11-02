import {
  COMMUNITY,
  EDUCATION,
  EDUCATION_HISTORY,
  EXPERIENCE,
  HOBBIES,
  HONORS,
  PROFILE,
  SKILLS,
} from "@/data/profile";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";
import ProjectGrid from "./ProjectGrid";

const CONTACT_ROWS = [
  { href: `mailto:${PROFILE.email}`, label: PROFILE.email, Icon: MailIcon, external: false },
  { href: PROFILE.linkedin, label: "linkedin.com/in/tanakorn-sookhanonsawat", Icon: LinkedInIcon, external: true },
  { href: PROFILE.github, label: "github.com/UNiverse071", Icon: GitHubIcon, external: true },
];

function SectionTitle({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="text-2xl font-bold tracking-tight">
      {children}
    </h2>
  );
}

export default function Dashboard() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-14 px-4 py-8 sm:px-6 sm:py-12">
      {/* Intro + contact: everything a visitor needs is visible without scrolling. */}
      <section aria-label="Introduction" className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col justify-center gap-4">
          <p className="text-sm font-medium text-muted">Hi, I&apos;m</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{PROFILE.name}</h1>
          <p className="text-lg font-medium text-brand">{PROFILE.role}</p>
          <p className="max-w-xl leading-7 text-muted">{PROFILE.blurb}</p>
          <p className="text-sm text-muted">
            📍 {PROFILE.location} · 🌏 From {PROFILE.hometown} · 🎓 Class of{" "}
            {EDUCATION.graduating.split(" ")[1]}
          </p>
        </div>

        <aside
          aria-labelledby="contact-heading"
          className="rounded-2xl border border-line bg-surface p-5 shadow-sm"
        >
          <h2 id="contact-heading" className="text-lg font-bold">
            Get in touch
          </h2>
          <p className="mt-1 text-sm text-muted">The fastest way to reach me is email.</p>
          <ul className="mt-4 flex flex-col gap-2">
            {CONTACT_ROWS.map(({ href, label, Icon, external }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center gap-3 rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm font-medium transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="truncate">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <ProjectGrid />

      <section aria-labelledby="experience-heading" className="scroll-mt-20">
        <SectionTitle id="experience-heading">Experience</SectionTitle>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {EXPERIENCE.map((job) => (
            <article key={job.role + job.org} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="font-semibold">{job.role}</h3>
                <p className="text-sm text-muted">{job.period}</p>
              </div>
              <p className="text-sm font-medium text-brand">{job.org}</p>
              <p className="text-xs text-muted">{job.context}</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted">
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="education-heading" className="scroll-mt-20">
        <SectionTitle id="education-heading">Education</SectionTitle>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {EDUCATION_HISTORY.map((e) => (
            <article key={e.school} className="rounded-xl border border-line bg-surface p-5">
              <p className="text-xs font-medium text-brand">{e.period}</p>
              <h3 className="mt-1 font-semibold leading-snug">{e.school}</h3>
              <p className="text-xs text-muted">{e.place}</p>
              <p className="mt-3 text-sm leading-6 text-muted">{e.detail}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm">
          <span className="font-medium">UT Austin honors coursework: </span>
          <span className="text-muted">{EDUCATION.honorsCourses.join(", ")}.</span>{" "}
          <span className="font-medium">Other courses: </span>
          <span className="text-muted">{EDUCATION.otherCourses.join(", ")}.</span>
        </p>
      </section>

      <section aria-labelledby="honors-heading" className="scroll-mt-20">
        <SectionTitle id="honors-heading">Honors &amp; Awards</SectionTitle>
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {HONORS.map((h) => (
            <li key={h.title} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-medium leading-snug">{h.title}</p>
                <p className="shrink-0 text-sm font-semibold text-brand">{h.year}</p>
              </div>
              <p className="text-xs text-muted">{h.org}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{h.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="community-heading" className="scroll-mt-20">
        <SectionTitle id="community-heading">Volunteering &amp; Leadership</SectionTitle>
        <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {COMMUNITY.map((c) => (
            <li key={c.title} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-medium leading-snug">{c.title}</p>
                {c.period && <p className="shrink-0 text-xs text-muted">{c.period}</p>}
              </div>
              <p className="text-xs text-brand">{c.where}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{c.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="skills-heading" className="rounded-xl border border-line bg-surface p-5">
          <SectionTitle id="skills-heading">Skills</SectionTitle>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {SKILLS.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">{group.label}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="rounded-md bg-surface-2 px-2 py-1 text-xs">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="hobbies-heading" className="rounded-xl border border-line bg-surface p-5">
          <SectionTitle id="hobbies-heading">Beyond the code</SectionTitle>
          <div className="mt-4 flex flex-col gap-4">
            {HOBBIES.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">{group.label}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="rounded-md bg-surface-2 px-2 py-1 text-xs">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
