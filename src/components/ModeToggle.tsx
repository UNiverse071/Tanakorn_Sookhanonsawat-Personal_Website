"use client";

import { setViewMode, useViewMode, type ViewMode } from "@/lib/view-mode";

const OPTIONS: { mode: ViewMode; label: string; icon: string }[] = [
  { mode: "classic", label: "Dashboard", icon: "▦" },
  { mode: "game", label: "Game", icon: "🎮" },
];

export default function ModeToggle() {
  const current = useViewMode();

  return (
    <div
      role="group"
      aria-label="Choose website interface"
      className="inline-flex rounded-lg border border-line bg-surface-2 p-0.5 text-sm"
    >
      {OPTIONS.map(({ mode, label, icon }) => {
        const active = current === mode;
        return (
          <button
            key={mode}
            type="button"
            aria-pressed={active}
            onClick={() => setViewMode(mode)}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              active
                ? "bg-brand text-white shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            <span aria-hidden="true">{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
