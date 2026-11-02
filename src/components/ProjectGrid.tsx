"use client";

import { useState } from "react";
import { CATEGORIES, PROJECTS, type Category } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const shown = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="projects-heading" className="text-2xl font-bold tracking-tight">
            Projects
          </h2>
          <p className="mt-1 text-sm text-muted">
            Click a card to see the full details. 🔒 Private projects are school work — I&apos;m not
            allowed to publish their source code.
          </p>
        </div>
        <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-1.5">
          {(["All", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                filter === c
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-surface text-muted hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
