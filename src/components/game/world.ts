// Logical (pre-scale) size of the home base: 30 x 20 tiles of 16px, like
// Terraria's grid. The canvas is drawn at this size and scaled up with
// nearest-neighbour filtering, which gives the pixel look.
export const W = 480;
export const H = 320;

export type Rect = { x: number; y: number; w: number; h: number };
export type Dir = "up" | "down" | "left" | "right";

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
  | "portal"
  | "npc";

export type Station = {
  id: string;
  kind: StationKind;
  /** Centre x and baseline y (where the object touches the floor). */
  x: number;
  y: number;
  /** Width of the solid footprint. */
  w: number;
  /** Depth of the solid footprint (defaults to FOOT_H). */
  fh?: number;
  label: string;
  /** Matches a project slug in src/data/projects.ts, for project stations. */
  slug?: string;
  accent: string;
  /** Terraria-style "rarity" colour of the name tag. */
  rarity: string;
  solid: boolean;
  /** NPCs only: which outfit to wear and where they face. */
  look?: string;
  dir?: Dir;
};

export const TOP_BASE = 104;
/** Everything above this y is the back wall and can't be walked on. */
export const WALL_BOTTOM = 94;

const SYSTEMS = "#ffa94d";
const ML = "#ff8ad8";
const WEB = "#6be4ea";
const ME = "#ffe066";

export const STATIONS: Station[] = [
  // Back wall: systems
  { id: "kernel", kind: "kernel", x: 64, y: TOP_BASE, w: 32, label: "Kernel", slug: "os-kernel", accent: "#7c3aed", rarity: SYSTEMS, solid: true },
  { id: "cpu", kind: "cpu", x: 152, y: TOP_BASE, w: 34, label: "CPU", slug: "pipelined-cpu", accent: "#2563eb", rarity: SYSTEMS, solid: true },
  { id: "compiler", kind: "compiler", x: 240, y: TOP_BASE, w: 38, label: "Compiler", slug: "python-x86-compiler", accent: "#ca8a04", rarity: SYSTEMS, solid: true },
  { id: "allocator", kind: "allocator", x: 328, y: TOP_BASE, w: 42, label: "Allocator", slug: "shared-heap-allocator", accent: "#059669", rarity: SYSTEMS, solid: true },
  { id: "crawler", kind: "crawler", x: 406, y: TOP_BASE, w: 36, label: "Crawler", slug: "web-crawler", accent: "#ea580c", rarity: WEB, solid: true },
  // Left wall: AI / ML
  { id: "gan", kind: "gan", x: 44, y: 174, w: 34, label: "GANs", slug: "gans", accent: "#db2777", rarity: ML, solid: true },
  { id: "motion", kind: "motion", x: 44, y: 240, w: 26, label: "Motion AE", slug: "motion-autoencoder", accent: "#0891b2", rarity: ML, solid: true },
  // Right wall: web & tools
  { id: "focus", kind: "focus", x: 444, y: 148, w: 26, label: "Focus Ledger", slug: "focus-ledger", accent: "#dc2626", rarity: WEB, solid: true },
  { id: "codetest", kind: "codetest", x: 444, y: 214, w: 30, label: "Code Test", slug: "coding-test-platform", accent: "#4f46e5", rarity: WEB, solid: true },
  { id: "grader", kind: "grader", x: 440, y: 272, w: 36, label: "Grader", slug: "code-grader", accent: "#0d9488", rarity: WEB, solid: true },
  // Centre and bottom: me
  { id: "about", kind: "about", x: 240, y: 200, w: 44, label: "About Me", accent: "#f59e0b", rarity: ME, solid: true },
  { id: "journey", kind: "journey", x: 100, y: 294, w: 44, label: "Journey", accent: "#a16207", rarity: ME, solid: true },
  { id: "honors", kind: "honors", x: 180, y: 294, w: 30, label: "Honors", accent: "#eab308", rarity: ME, solid: true },
  { id: "mail", kind: "mail", x: 380, y: 294, w: 24, label: "Contact", accent: "#2563eb", rarity: ME, solid: true },
  // Warp ring: step on it and press E to go back to the dashboard.
  { id: "portal", kind: "portal", x: 296, y: 290, w: 30, label: "Exit", accent: "#34d399", rarity: "#6ee7b7", solid: false },

  // Villagers: talk to them for the story behind the resume.
  { id: "npc-guide", kind: "npc", x: 184, y: 176, w: 12, fh: 6, label: "Guide", accent: "#22c55e", rarity: "#e5e7eb", solid: true, look: "guide", dir: "right" },
  { id: "npc-intern", kind: "npc", x: 296, y: 176, w: 12, fh: 6, label: "Intern", accent: "#3b82f6", rarity: "#e5e7eb", solid: true, look: "intern", dir: "left" },
  { id: "npc-coach", kind: "npc", x: 188, y: 238, w: 12, fh: 6, label: "Coach", accent: "#ef4444", rarity: "#e5e7eb", solid: true, look: "coach", dir: "right" },
  { id: "npc-scholar", kind: "npc", x: 292, y: 238, w: 12, fh: 6, label: "Scholar", accent: "#a855f7", rarity: "#e5e7eb", solid: true, look: "scholar", dir: "left" },
  { id: "npc-champion", kind: "npc", x: 140, y: 262, w: 12, fh: 6, label: "Champion", accent: "#eab308", rarity: "#e5e7eb", solid: true, look: "champion", dir: "down" },
  { id: "npc-hacker", kind: "npc", x: 344, y: 258, w: 12, fh: 6, label: "Hacker", accent: "#64748b", rarity: "#e5e7eb", solid: true, look: "hacker", dir: "left" },
];

export const FOOT_H = 12;

export function footprint(s: Station): Rect {
  const h = s.fh ?? FOOT_H;
  return { x: s.x - s.w / 2, y: s.y - h, w: s.w, h };
}

export const PLANTS = [
  { x: 36, y: 298 },
  { x: 336, y: 298 },
];

export const TORCHES = [
  { x: 28, y: 58 },
  { x: 196, y: 54 },
  { x: 284, y: 54 },
  { x: 452, y: 58 },
];

export const WINDOWS = [
  { x: 108, y: 14, w: 30, h: 40 },
  { x: 372, y: 14, w: 30, h: 40 },
];

const WALLS: Rect[] = [
  { x: 0, y: 0, w: W, h: WALL_BOTTOM },
  { x: 0, y: 0, w: 16, h: H },
  { x: W - 16, y: 0, w: 16, h: H },
  { x: 0, y: 304, w: W, h: 16 },
];

export const SOLIDS: Rect[] = [
  ...WALLS,
  ...STATIONS.filter((s) => s.solid).map(footprint),
  ...PLANTS.map((p) => ({ x: p.x - 7, y: p.y - 8, w: 14, h: 8 })),
];

export function overlaps(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/** How close (in logical px) the player must be to a station to interact. */
export const REACH = 18;

export function inReach(px: number, py: number, s: Station) {
  const f = footprint(s);
  return (
    px >= f.x - REACH &&
    px <= f.x + f.w + REACH &&
    py - 3 >= f.y - REACH &&
    py - 3 <= f.y + f.h + REACH
  );
}

export const SPAWN = { x: 240, y: 270 };
