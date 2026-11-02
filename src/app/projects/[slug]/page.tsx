import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROFILE } from "@/data/profile";
import { PRIVATE_NOTE, PROJECTS, getProject } from "@/data/projects";
import { ArrowIcon, GitHubIcon, MailIcon } from "@/components/icons";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} · ${PROFILE.name}`,
    description: project.tagline,
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <>
      <SiteHeader />
      <main
        style={{ "--c": project.accent } as CSSProperties}
        className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-10"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowIcon className="size-4 rotate-180" />
          Back to all projects
        </Link>

        <div
          className="relative mt-4 overflow-hidden rounded-2xl p-6 text-white sm:p-8"
          style={{
            background:
              "linear-gradient(135deg, var(--c), color-mix(in srgb, var(--c) 55%, #000))",
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -bottom-6 select-none text-[9rem] leading-none opacity-25"
          >
            {project.icon}
          </span>
          <div className="relative">
            <p className="text-sm font-medium opacity-90">
              {project.category}
              {project.period ? ` · ${project.period}` : ""}
              {project.context ? ` · ${project.context}` : ""}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
            <p className="mt-2 max-w-2xl text-white/90">{project.tagline}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <li key={t} className="rounded-md bg-black/25 px-2.5 py-1 text-xs font-medium">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_16rem]">
          <div>
            <h2 className="text-lg font-bold">Overview</h2>
            <p className="mt-2 leading-7 text-muted">{project.overview}</p>

            <h2 className="mt-8 text-lg font-bold">What I built</h2>
            <ul className="mt-3 list-disc space-y-2.5 pl-5 leading-7 text-muted">
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>

          <aside className="h-fit rounded-xl border border-line bg-surface p-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted">
              {project.researchOnly ? "Research project" : "Source code"}
            </h2>
            {project.researchOnly ? (
              <>
                <p className="mt-3 text-sm leading-6 text-muted">
                  📄 This is a research project that I presented at a competition. Ask me about the
                  methods and results.
                </p>
                <a
                  href={`mailto:${PROFILE.email}?subject=${encodeURIComponent(project.title)}`}
                  className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-line bg-surface-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
                >
                  <MailIcon className="size-4" />
                  Ask me about it
                </a>
              </>
            ) : project.repo ? (
              <>
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-85"
                >
                  <GitHubIcon className="size-4" />
                  View on GitHub
                </a>
                <p className="mt-3 break-all text-xs text-muted">{project.repo.replace("https://", "")}</p>
              </>
            ) : (
              <>
                <p className="mt-3 inline-block rounded-md bg-surface-2 px-2.5 py-1 text-xs font-semibold">
                  🔒 Private
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {PRIVATE_NOTE} I&apos;m happy to walk through the design and implementation,
                  though.
                </p>
                <a
                  href={`mailto:${PROFILE.email}?subject=${encodeURIComponent(project.title)}`}
                  className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-line bg-surface-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
                >
                  <MailIcon className="size-4" />
                  Ask me about it
                </a>
              </>
            )}
          </aside>
        </div>

        <nav
          aria-label="More projects"
          className="mt-12 grid gap-3 border-t border-line pt-6 sm:grid-cols-2"
        >
          <Link
            href={`/projects/${prev.slug}`}
            className="rounded-lg border border-line bg-surface p-4 transition-colors hover:border-brand"
          >
            <span className="text-xs text-muted">← Previous</span>
            <span className="mt-1 block font-semibold">{prev.title}</span>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="rounded-lg border border-line bg-surface p-4 text-right transition-colors hover:border-brand"
          >
            <span className="text-xs text-muted">Next →</span>
            <span className="mt-1 block font-semibold">{next.title}</span>
          </Link>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
