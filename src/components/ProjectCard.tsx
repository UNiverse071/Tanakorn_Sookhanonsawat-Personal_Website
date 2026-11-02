import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project } from "@/data/projects";
import { ArrowIcon } from "./icons";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      style={{ "--c": project.accent } as CSSProperties}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <div
        className="relative h-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--c), color-mix(in srgb, var(--c) 55%, #000))",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute -right-1 -bottom-3 select-none text-7xl opacity-30 transition-transform duration-200 group-hover:scale-110"
        >
          {project.icon}
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white">
          {project.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-semibold leading-snug">{project.title}</h3>
          <p className="mt-1 text-sm leading-5 text-muted">{project.tagline}</p>
        </div>

        <ul className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <li key={t} className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted">
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between pt-1 text-xs">
          <span className={project.repo ? "text-emerald-600 dark:text-emerald-400" : "text-muted"}>
            {project.repo ? "● Source on GitHub" : "🔒 Private source"}
          </span>
          <span className="flex items-center gap-1 font-medium text-brand">
            Details
            <ArrowIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
