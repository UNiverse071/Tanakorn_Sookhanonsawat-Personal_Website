"use client";

import type { ReactNode } from "react";
import { useViewMode } from "@/lib/view-mode";

/** Renders whichever interface the visitor picked. Both are built on the server. */
export default function ModeSwitcher({
  classic,
  game,
}: {
  classic: ReactNode;
  game: ReactNode;
}) {
  const mode = useViewMode();
  return <>{mode === "game" ? game : classic}</>;
}
