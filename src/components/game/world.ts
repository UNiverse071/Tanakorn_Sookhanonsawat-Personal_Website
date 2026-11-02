// Logical (pre-scale) size of the home base. The canvas is drawn at this size
// and scaled up with nearest-neighbour filtering, which gives the pixel look.
export const W = 320;
export const H = 216;

export type Rect = { x: number; y: number; w: number; h: number };

export type StationKind =
  | "kernel"
  | "cpu"
  | "compiler"
  | "allocator"
  | "crawler"
  | "gan"
  | "motion"
  | "focus"
  | "codetest"
  | "grader"
  | "about"
  | "journey"
  | "honors"
  | "mail"
  | "portal";

export type Station = {
  id: string;
  kind: StationKind;
  /** Centre x and baseline y (where the object touches the floor). */
  x: number;
  y: number;
  /** Width of the solid footprint. */
  w: number;
  label: string;
  /** Matches a project slug in src/data/projects.ts, for project stations. */
  slug?: string;
  accent: string;
  solid: boolean;
};

export const TOP_BASE = 50;

export const STATIONS: Station[] = [
  // Top wall: systems
  { id: "kernel", kind: "kernel", x: 40, y: TOP_BASE, w: 22, label: "Kernel", slug: "os-kernel", accent: "#7c3aed", solid: true },
  { id: "cpu", kind: "cpu", x: 100, y: TOP_BASE, w: 24, label: "CPU", slug: "pipelined-cpu", accent: "#2563eb", solid: true },
  { id: "compiler", kind: "compiler", x: 160, y: TOP_BASE, w: 24, label: "Compiler", slug: "python-x86-compiler", accent: "#ca8a04", solid: true },
  { id: "allocator", kind: "allocator", x: 220, y: TOP_BASE, w: 26, label: "Allocator", slug: "shared-heap-allocator", accent: "#059669", solid: true },
  { id: "crawler", kind: "crawler", x: 280, y: TOP_BASE, w: 24, label: "Crawler", slug: "web-crawler", accent: "#ea580c", solid: true },
  // Left wall: AI / ML
  { id: "gan", kind: "gan", x: 28, y: 104, w: 24, label: "GANs", slug: "gans", accent: "#db2777", solid: true },
  { id: "motion", kind: "motion", x: 28, y: 150, w: 20, label: "Motion AE", slug: "motion-autoencoder", accent: "#0891b2", solid: true },
  // Right wall: web & tools
  { id: "focus", kind: "focus", x: 292, y: 86, w: 22, label: "Focus Ledger", slug: "focus-ledger", accent: "#dc2626", solid: true },
  { id: "codetest", kind: "codetest", x: 292, y: 128, w: 20, label: "Code Test", slug: "coding-test-platform", accent: "#4f46e5", solid: true },
  { id: "grader", kind: "grader", x: 292, y: 170, w: 24, label: "Grader", slug: "code-grader", accent: "#0d9488", solid: true },
  // Centre and bottom: me
  { id: "about", kind: "about", x: 160, y: 130, w: 30, label: "About Me", accent: "#f59e0b", solid: true },
  { id: "journey", kind: "journey", x: 66, y: 198, w: 30, label: "Journey", accent: "#a16207", solid: true },
  { id: "honors", kind: "honors", x: 118, y: 198, w: 24, label: "Honors", accent: "#eab308", solid: true },
  { id: "mail", kind: "mail", x: 250, y: 198, w: 18, label: "Contact", accent: "#2563eb", solid: true },
  // Warp pad: walk onto it and press E to go back to the dashboard.
  { id: "portal", kind: "portal", x: 188, y: 196, w: 22, label: "Exit", accent: "#34d399", solid: false },
];

export const FOOT_H = 10;

export function footprint(s: Station): Rect {
  return { x: s.x - s.w / 2, y: s.y - FOOT_H, w: s.w, h: FOOT_H };
}

export const NPCS = [
  { x: 126, y: 108, color: "#f87171", phase: 0 },
  { x: 196, y: 108, color: "#60a5fa", phase: 1.3 },
  { x: 128, y: 150, color: "#fbbf24", phase: 2.1 },
  { x: 192, y: 150, color: "#34d399", phase: 0.7 },
  { x: 66, y: 112, color: "#c084fc", phase: 1.9 },
  { x: 244, y: 118, color: "#fb923c", phase: 0.4 },
  { x: 86, y: 160, color: "#f472b6", phase: 2.6 },
];

export const PLANTS = [
  { x: 22, y: 202 },
  { x: 298, y: 202 },
];

export const LANTERNS = [
  { x: 70, y: 10 },
  { x: 130, y: 10 },
  { x: 190, y: 10 },
  { x: 250, y: 10 },
];

const WALLS: Rect[] = [
  { x: 0, y: 0, w: W, h: 42 },
  { x: 0, y: 0, w: 8, h: H },
  { x: W - 8, y: 0, w: 8, h: H },
  { x: 0, y: 208, w: W, h: 8 },
];

export const SOLIDS: Rect[] = [
  ...WALLS,
  ...STATIONS.filter((s) => s.solid).map(footprint),
  ...PLANTS.map((p) => ({ x: p.x - 5, y: p.y - 6, w: 10, h: 6 })),
];

export function overlaps(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/** How close (in logical px) the player must be to a station to interact. */
export const REACH = 12;

export function inReach(px: number, py: number, s: Station) {
  const f = footprint(s);
  return (
    px >= f.x - REACH &&
    px <= f.x + f.w + REACH &&
    py - 2 >= f.y - REACH &&
    py - 2 <= f.y + f.h + REACH
  );
}

export const SPAWN = { x: 160, y: 176 };
