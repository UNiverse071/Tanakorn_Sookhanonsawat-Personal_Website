import { H, STATIONS, TOP_BASE, TORCHES, W, WINDOWS, type Station } from "./world";

type Ctx = CanvasRenderingContext2D;

/** Dark outline colour shared by every sprite (Terraria-style crisp edges). */
export const OUT = "#1b1017";

export function r(c: Ctx, x: number, y: number, w: number, h: number, col: string) {
  c.fillStyle = col;
  c.fillRect(Math.round(x), Math.round(y), w, h);
}

export function disc(c: Ctx, cx: number, cy: number, rad: number, col: string) {
  c.fillStyle = col;
  for (let dy = -rad; dy <= rad; dy++) {
    const half = Math.floor(Math.sqrt(rad * rad - dy * dy + 0.25));
    c.fillRect(Math.round(cx) - half, Math.round(cy) + dy, half * 2 + 1, 1);
  }
}

export function ell(c: Ctx, cx: number, cy: number, rx: number, ry: number, col: string) {
  c.fillStyle = col;
  for (let dy = -ry; dy <= ry; dy++) {
    const half = Math.floor(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.5))));
    c.fillRect(Math.round(cx) - half, Math.round(cy) + dy, half * 2 + 1, 1);
  }
}

/** Filled box with a dark outline plus optional top highlight / bottom shade. */
function box(c: Ctx, x: number, y: number, w: number, h: number, fill: string, hi?: string, sh?: string) {
  r(c, x - 1, y - 1, w + 2, h + 2, OUT);
  r(c, x, y, w, h, fill);
  if (hi) r(c, x, y, w, 1, hi);
  if (sh) r(c, x, y + h - 1, w, 1, sh);
}

function shadow(c: Ctx, cx: number, by: number, w: number) {
  r(c, cx - w / 2 + 1, by - 4, w - 2, 1, "rgba(0,0,0,0.22)");
  r(c, cx - w / 2, by - 3, w, 3, "rgba(0,0,0,0.3)");
}

function line(c: Ctx, x0: number, y0: number, x1: number, y1: number, col: string) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= n; i++) {
    const f = n === 0 ? 0 : i / n;
    r(c, x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, 1, 1, col);
  }
}

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Small deterministic hash in [0,1) for flickery per-frame effects. */
function hash(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

/* ------------------------------------------------------------------ */
/* Static background: wooden hall, floor, rug, wall decor              */
/* ------------------------------------------------------------------ */

function stoneBricks(c: Ctx, x: number, y: number, w: number, h: number, rand: () => number) {
  const shades = ["#5b5566", "#544e5f", "#625c6e"];
  r(c, x, y, w, h, "#2b2733");
  for (let row = 0; row * 8 < h; row++) {
    const off = (row % 2) * 8;
    for (let bx = -off; bx < w; bx += 16) {
      const x0 = Math.max(0, bx + 1);
      const x1 = Math.min(w, bx + 15);
      const bh = Math.min(7, h - row * 8 - 1);
      if (x1 > x0 && bh > 0) {
        r(c, x + x0, y + row * 8 + 1, x1 - x0, bh, shades[Math.floor(rand() * shades.length)]);
        r(c, x + x0, y + row * 8 + 1, x1 - x0, 1, "rgba(255,255,255,0.12)");
      }
    }
  }
}

export function drawBackground(c: Ctx) {
  const rand = rng(11);
  r(c, 0, 0, W, H, "#0e0a10");

  // Back wall: vertical wooden planks, like Terraria's wood wall.
  for (let x = 16; x < W - 16; x += 16) {
    r(c, x, 0, 16, 96, ["#4a2f1c", "#46291a", "#4f3320"][Math.floor(rand() * 3)]);
    r(c, x, 0, 1, 96, "#2a170d");
    r(c, x + 15, 0, 1, 96, "#5a3a22");
    for (let k = 0; k < 5; k++) {
      r(c, x + 3 + Math.floor(rand() * 9), Math.floor(rand() * 80), 1, 5 + Math.floor(rand() * 10), "#3a2314");
    }
    r(c, x + 7, 14, 2, 2, "#24140b");
    r(c, x + 7, 76, 2, 2, "#24140b");
  }
  // Ceiling beam and baseboard
  r(c, 16, 0, W - 32, 12, "#6b4423");
  r(c, 16, 0, W - 32, 2, "#8a5c33");
  r(c, 16, 10, W - 32, 2, "#3b2412");
  for (let x = 40; x < W - 16; x += 80) r(c, x, 2, 2, 8, "#3b2412");
  r(c, 16, 12, W - 32, 14, "rgba(0,0,0,0.28)");
  r(c, 16, 86, W - 32, 10, "#7a4e2a");
  r(c, 16, 86, W - 32, 2, "#9a6a3c");
  r(c, 16, 94, W - 32, 2, "#3b2412");

  // Wooden floor: long planks with seams, nails and the odd knot.
  for (let y = 96, row = 0; y < 304; y += 16, row++) {
    const off = (row % 4) * 16;
    for (let x = 16 - off; x < W - 16; x += 64) {
      const x0 = Math.max(16, x);
      const x1 = Math.min(W - 16, x + 64);
      const shade = ["#9a6234", "#935c30", "#a06a3a"][Math.floor(rand() * 3)];
      r(c, x0, y, x1 - x0, 16, shade);
      r(c, x0, y, x1 - x0, 1, "#b57a44");
      r(c, x0, y + 15, x1 - x0, 1, "#5e3a1c");
      if (x >= 16) r(c, x0, y, 1, 16, "#5e3a1c");
      if (x + 62 < W - 16) {
        r(c, x + 61, y + 3, 2, 2, "#4a2d15");
        r(c, x + 61, y + 11, 2, 2, "#4a2d15");
      }
      if (rand() < 0.2) {
        const kx = x0 + 8 + Math.floor(rand() * 40);
        r(c, kx, y + 6, 4, 3, "#7d4f27");
        r(c, kx + 1, y + 7, 2, 1, "#5e3a1c");
      }
    }
  }
  r(c, 16, 96, W - 32, 8, "rgba(0,0,0,0.28)"); // shadow cast by the baseboard
  r(c, 16, 104, W - 32, 4, "rgba(0,0,0,0.12)");

  // Rug under the About table: green field, gold border, tassels.
  const rx = 150;
  const ry = 130;
  const rw = 180;
  const rh = 120;
  r(c, rx - 1, ry - 1, rw + 2, rh + 2, "#14352a");
  r(c, rx, ry, rw, rh, "#d4a017");
  r(c, rx + 4, ry + 4, rw - 8, rh - 8, "#14352a");
  r(c, rx + 6, ry + 6, rw - 12, rh - 12, "#2d6a4f");
  for (let y = ry + 8; y < ry + rh - 8; y += 8) {
    for (let x = rx + 8 + ((((y - ry) / 8) | 0) % 2) * 4; x < rx + rw - 8; x += 8) {
      r(c, x, y, 2, 2, "#3b8a65");
      r(c, x + 1, y - 1, 0, 0, "#3b8a65");
    }
  }
  for (let x = rx + 6; x < rx + rw - 6; x += 6) {
    r(c, x, ry + 2, 3, 1, "#8a6a10");
    r(c, x, ry + rh - 3, 3, 1, "#8a6a10");
  }
  for (let y = ry + 4; y < ry + rh - 2; y += 4) {
    r(c, rx - 4, y, 4, 1, "#d4a017");
    r(c, rx + rw, y, 4, 1, "#d4a017");
  }

  // Side columns and bottom trim: stone brick.
  stoneBricks(c, 0, 0, 16, H, rand);
  stoneBricks(c, W - 16, 0, 16, H, rand);
  stoneBricks(c, 0, 304, W, 16, rand);
  r(c, 16, 96, 1, 208, "rgba(0,0,0,0.5)");
  r(c, W - 17, 96, 1, 208, "rgba(0,0,0,0.5)");
  r(c, 16, 303, W - 32, 1, "rgba(0,0,0,0.5)");

  // Banners over every back-wall station, coloured per project.
  for (const s of STATIONS.filter((s) => s.y === TOP_BASE)) {
    r(c, s.x - 12, 13, 24, 2, "#d4a017");
    r(c, s.x - 10, 14, 20, 17, OUT);
    r(c, s.x - 9, 15, 18, 15, s.accent);
    r(c, s.x - 9, 15, 18, 2, "rgba(255,255,255,0.28)");
    r(c, s.x - 9, 28, 6, 4, OUT);
    r(c, s.x + 3, 28, 6, 4, OUT);
    r(c, s.x - 8, 28, 4, 3, s.accent);
    r(c, s.x + 4, 28, 4, 3, s.accent);
    r(c, s.x - 2, 19, 4, 4, "rgba(255,255,255,0.7)");
    r(c, s.x - 1, 18, 2, 6, "rgba(255,255,255,0.7)");
    r(c, s.x - 3, 20, 6, 2, "rgba(255,255,255,0.7)");
  }

  // Torch brackets (the flames are animated separately).
  for (const t of TORCHES) {
    r(c, t.x - 3, t.y - 4, 6, 18, OUT);
    r(c, t.x - 2, t.y, 4, 13, "#5b3a1e");
    r(c, t.x - 5, t.y - 4, 10, 6, OUT);
    r(c, t.x - 4, t.y - 3, 8, 4, "#52525b");
    r(c, t.x - 4, t.y - 3, 8, 1, "#a1a1aa");
  }

  // Window frames; the sky inside is drawn live.
  for (const w of WINDOWS) {
    r(c, w.x - w.w / 2 - 3, w.y - 3, w.w + 6, w.h + 6, OUT);
    r(c, w.x - w.w / 2 - 2, w.y - 2, w.w + 4, w.h + 4, "#7a4e2a");
    r(c, w.x - w.w / 2 - 2, w.y - 2, w.w + 4, 1, "#a87a45");
    r(c, w.x - w.w / 2 - 6, w.y + w.h + 2, w.w + 12, 4, OUT);
    r(c, w.x - w.w / 2 - 5, w.y + w.h + 3, w.w + 10, 2, "#9a6a3c");
  }
}

/* ------------------------------------------------------------------ */
/* Stations: fantasy-ified tech items                                  */
/* ------------------------------------------------------------------ */

function chest(c: Ctx, x: number, by: number, w: number, h: number, lift: number) {
  const lidH = Math.round(h * 0.4);
  const bodyH = h - lidH;
  box(c, x, by - bodyH, w, bodyH, "#92400e", "#c2762a", "#6b2f0a");
  r(c, x + w / 2 - 1, by - bodyH, 2, bodyH, "#d4a017");
  if (lift > 0) {
    r(c, x + 1, by - bodyH - lift, w - 2, lift, "#fde047"); // glow inside
    r(c, x + 2, by - bodyH - lift + 1, w - 4, 1, "#fffbeb");
  }
  box(c, x - 1, by - h - lift, w + 2, lidH, "#a85c1a", "#d98a3c", "#6b2f0a");
  r(c, x + w / 2 - 1, by - h - lift, 2, lidH, "#d4a017");
  r(c, x + w / 2 - 1, by - bodyH - lift - 1, 2, 3, "#fde047");
}

const DRAW: Record<Station["kind"], (c: Ctx, cx: number, by: number, t: number) => void> = {
  // Core Furnace — a stone forge with a violet "kernel" flame.
  kernel(c, cx, by, t) {
    shadow(c, cx, by, 38);
    // chimney and smoke
    box(c, cx - 6, by - 44, 12, 12, "#6b7280", "#9ca3af", "#4b5563");
    for (let i = 0; i < 3; i++) {
      const p = (t * 0.5 + i / 3) % 1;
      r(c, cx - 2 + Math.sin(t * 2 + i) * 3, by - 46 - p * 18, 4, 3, `rgba(196,181,253,${0.55 * (1 - p)})`);
    }
    box(c, cx - 16, by - 32, 32, 32, "#6b7280", "#9ca3af", "#4b5563");
    for (let y = by - 24; y < by; y += 8) r(c, cx - 16, y, 32, 1, "#4b5563");
    for (let y = by - 28, k = 0; y < by - 2; y += 8, k++) r(c, cx - 16 + ((k % 2) * 8) + 6, y, 1, 8, "#4b5563");
    // fire opening
    r(c, cx - 10, by - 26, 20, 20, OUT);
    r(c, cx - 9, by - 25, 18, 19, "#1a0b2e");
    const f = Math.sin(t * 9) * 1.5;
    r(c, cx - 8, by - 10, 16, 4, "#6d28d9");
    r(c, cx - 6, by - 15 + Math.round(f), 12, 6, "#7c3aed");
    r(c, cx - 4, by - 19 + Math.round(f * 1.4), 8, 7, "#a855f7");
    r(c, cx - 2, by - 22 + Math.round(f * 1.8), 4, 6, "#e9d5ff");
    r(c, cx - 1, by - 22, 1, 3, "#ffffff");
    // rune plate
    r(c, cx - 11, by - 5, 22, 4, "#374151");
    for (let i = 0; i < 4; i++) r(c, cx - 8 + i * 5, by - 4, 2, 2, hash(Math.floor(t * 3) + i) > 0.3 ? "#c4b5fd" : "#5b21b6");
    r(c, cx - 16, by - 2, 32, 2, "rgba(168,85,247,0.35)");
  },
  // Rune-Chip Altar — a floating silicon chip with five glowing pipeline runes.
  cpu(c, cx, by, t) {
    shadow(c, cx, by, 36);
    box(c, cx - 15, by - 8, 30, 8, "#6b7280", "#9ca3af", "#4b5563");
    box(c, cx - 10, by - 15, 20, 7, "#78808f", "#a3abba", "#4b5563");
    const bob = Math.round(Math.sin(t * 2) * 2);
    const y0 = by - 44 + bob;
    r(c, cx - 8, by - 16, 16, 1, "rgba(96,165,250,0.6)");
    box(c, cx - 11, y0, 22, 22, "#111827", "#374151", "#0b1220");
    for (let i = 0; i < 5; i++) {
      r(c, cx - 14, y0 + 3 + i * 4, 3, 2, "#e5e7eb");
      r(c, cx + 11, y0 + 3 + i * 4, 3, 2, "#e5e7eb");
      r(c, cx - 8 + i * 4, y0 - 3, 2, 3, "#e5e7eb");
      r(c, cx - 8 + i * 4, y0 + 22, 2, 3, "#e5e7eb");
    }
    const stages = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];
    const lit = Math.floor(t * 4) % 5;
    stages.forEach((col, i) => {
      r(c, cx - 8 + i * 4, y0 + 4, 3, 14, i === lit ? col : "rgba(255,255,255,0.14)");
      if (i === lit) r(c, cx - 8 + i * 4, y0 + 4, 3, 2, "#ffffff");
    });
    if (Math.floor(t * 5) % 4 === 0) r(c, cx + 12, y0 - 4, 2, 2, "#bfdbfe");
  },
  // Enchanting Table — an open spellbook with Python on one page and assembly on the other.
  compiler(c, cx, by, t) {
    shadow(c, cx, by, 44);
    r(c, cx - 16, by - 9, 4, 9, OUT);
    r(c, cx + 12, by - 9, 4, 9, OUT);
    r(c, cx - 15, by - 8, 2, 8, "#6b2f0a");
    r(c, cx + 13, by - 8, 2, 8, "#6b2f0a");
    box(c, cx - 20, by - 16, 40, 8, "#92400e", "#c2762a", "#6b2f0a");
    r(c, cx - 20, by - 12, 40, 1, "#d4a017");
    box(c, cx - 14, by - 26, 28, 10, "#f5f5f4", "#ffffff", "#d6d3d1");
    r(c, cx, by - 26, 1, 10, "#a8a29e");
    // python snake on the left page
    for (const [dx, dy] of [[-12, -22], [-10, -23], [-8, -22], [-6, -21], [-4, -22]]) r(c, cx + dx, by + dy, 2, 2, "#22c55e");
    r(c, cx - 4, by - 23, 1, 1, "#111827");
    // assembly on the right page
    r(c, cx + 3, by - 24, 9, 1, "#f97316");
    r(c, cx + 3, by - 22, 6, 1, "#fb923c");
    r(c, cx + 3, by - 20, 8, 1, "#f97316");
    // ink bottle
    box(c, cx + 15, by - 24, 5, 8, "#7c3aed", "#a78bfa", "#4c1d95");
    // rising glyphs
    const cols = ["#4ade80", "#fbbf24", "#60a5fa", "#f472b6", "#fb923c"];
    for (let i = 0; i < 5; i++) {
      const p = (t * 0.5 + i * 0.2) % 1;
      c.globalAlpha = 1 - p;
      r(c, cx - 12 + i * 6 + Math.sin(t * 2 + i) * 2, by - 28 - p * 20, 2, 2, cols[i]);
      c.globalAlpha = 1;
    }
  },
  // Loot Chests — chests of different sizes, like blocks on a heap.
  allocator(c, cx, by, t) {
    shadow(c, cx, by, 48);
    chest(c, cx - 20, by, 24, 18, 0);
    chest(c, cx - 17, by - 18, 14, 10, 0);
    const lift = Math.round((Math.sin(t * 1.6) * 0.5 + 0.5) * 5);
    chest(c, cx + 8, by, 16, 13, lift);
    // an empty "free block" outline, waiting to be allocated
    for (let i = 0; i < 12; i += 4) {
      r(c, cx + 6 + i, by - 34, 2, 1, "rgba(255,255,255,0.55)");
      r(c, cx + 6 + i, by - 22, 2, 1, "rgba(255,255,255,0.55)");
    }
    for (let i = 0; i < 12; i += 4) {
      r(c, cx + 6, by - 34 + i, 1, 2, "rgba(255,255,255,0.55)");
      r(c, cx + 17, by - 34 + i, 1, 2, "rgba(255,255,255,0.55)");
    }
    if (lift > 2) r(c, cx + 14 + Math.sin(t * 9) * 3, by - 22 - lift, 2, 2, "#ffffff");
  },
  // Spider Loom — a web strung in a wooden frame, a spider crawling it and a magnifying lens.
  crawler(c, cx, by, t) {
    shadow(c, cx, by, 36);
    box(c, cx - 19, by - 46, 3, 46, "#92400e", "#c2762a", "#6b2f0a");
    box(c, cx + 16, by - 46, 3, 46, "#92400e", "#c2762a", "#6b2f0a");
    box(c, cx - 20, by - 48, 40, 4, "#a85c1a", "#d98a3c", "#6b2f0a");
    const wx = cx;
    const wy = by - 26;
    for (let s = 0; s < 8; s++) {
      const a = (s * Math.PI) / 4;
      for (let d = 2; d <= 17; d++) r(c, wx + Math.cos(a) * d, wy + Math.sin(a) * d * 1.1, 1, 1, "rgba(229,231,235,0.85)");
    }
    for (const ring of [6, 11, 16]) {
      for (let k = 0; k < 32; k++) {
        const a = (k / 32) * Math.PI * 2;
        r(c, wx + Math.cos(a) * ring, wy + Math.sin(a) * ring * 1.1, 1, 1, "rgba(229,231,235,0.7)");
      }
    }
    const sx = wx + Math.sin(t * 0.8) * 9;
    const sy = wy + Math.cos(t * 0.6) * 7;
    const step = Math.floor(t * 6) % 2;
    for (let i = 0; i < 4; i++) {
      const dy = ((i + step) % 2) - 1;
      r(c, sx - 8, sy - 3 + i * 2 + dy, 5, 1, OUT);
      r(c, sx + 4, sy - 3 + i * 2 - dy, 5, 1, OUT);
    }
    box(c, sx - 4, sy - 3, 8, 7, "#7f1d1d", "#b91c1c", "#450a0a");
    r(c, sx - 3, sy - 1, 2, 2, "#fde047");
    r(c, sx + 1, sy - 1, 2, 2, "#fde047");
    // magnifying lens leaning on the frame
    disc(c, cx + 13, by - 8, 6, OUT);
    disc(c, cx + 13, by - 8, 5, "#fde68a");
    disc(c, cx + 13, by - 8, 3, "#bae6fd");
    r(c, cx + 11, by - 10, 2, 2, "#ffffff");
    r(c, cx + 17, by - 4, 3, 3, "#92400e");
  },
  // Twin Mirror Orbs — a generator and a discriminator, arcing at each other.
  gan(c, cx, by, t) {
    shadow(c, cx, by, 40);
    box(c, cx - 17, by - 8, 34, 8, "#1f2937", "#4b5563", "#111827");
    box(c, cx - 13, by - 14, 26, 6, "#374151", "#6b7280", "#111827");
    const orb = (ox: number, outer: string, inner: string, shine: string) => {
      disc(c, cx + ox, by - 28, 9, OUT);
      disc(c, cx + ox, by - 28, 8, outer);
      disc(c, cx + ox, by - 28, 5, inner);
      r(c, cx + ox - 4, by - 33, 3, 3, shine);
    };
    orb(-10, "#be185d", "#f472b6", "#fce7f3");
    orb(10, "#0e7490", "#67e8f9", "#ecfeff");
    for (let i = 0; i < 8; i++) {
      const off = Math.round((hash(Math.floor(t * 12) * 7 + i) - 0.5) * 6);
      r(c, cx - 4 + i, by - 28 + off, 1, 1, "#ffffff");
    }
    for (let i = 0; i < 3; i++) {
      const p = (t * 0.7 + i / 3) % 1;
      c.globalAlpha = 1 - p;
      r(c, cx - 14 + i * 14, by - 40 - p * 8, 2, 2, "#fef9c3");
      c.globalAlpha = 1;
    }
  },
  // Training Dummy — a target dummy wearing mocap markers.
  motion(c, cx, by, t) {
    shadow(c, cx, by, 28);
    box(c, cx - 11, by - 5, 22, 5, "#78350f", "#a16207", "#451a03");
    box(c, cx - 2, by - 28, 4, 24, "#a16207", "#ca8a04", "#713f12");
    box(c, cx - 8, by - 36, 16, 14, "#d6a35c", "#e8c486", "#a67c3d");
    r(c, cx - 6, by - 30, 12, 1, "#a67c3d");
    r(c, cx - 6, by - 26, 12, 1, "#a67c3d");
    const sw = Math.round(Math.sin(t * 3) * 2);
    box(c, cx - 18, by - 34 + sw, 12, 4, "#d6a35c", "#e8c486", "#a67c3d");
    box(c, cx + 6, by - 34 - sw, 12, 4, "#d6a35c", "#e8c486", "#a67c3d");
    c.globalAlpha = 0.25;
    r(c, cx - 18, by - 34 - sw, 12, 4, "#fca5a5");
    r(c, cx + 6, by - 34 + sw, 12, 4, "#fca5a5");
    c.globalAlpha = 1;
    box(c, cx - 6, by - 46, 12, 11, "#e8c486", "#f5dba8", "#b8913f");
    r(c, cx - 4, by - 42, 3, 1, "#451a03");
    r(c, cx - 3, by - 43, 1, 3, "#451a03");
    r(c, cx + 1, by - 42, 3, 1, "#451a03");
    r(c, cx + 2, by - 43, 1, 3, "#451a03");
    const pulse = Math.floor(t * 4) % 2 ? "#f87171" : "#ef4444";
    for (const [mx, my] of [[-1, -48], [-16, -33 + sw], [14, -33 - sw], [-3, -24], [1, -24], [-1, -12]]) {
      r(c, cx + mx, by + my, 3, 3, OUT);
      r(c, cx + mx + 0, by + my + 0, 2, 2, pulse);
    }
  },
  // Grandfather Clock — Focus Ledger tracks your time.
  focus(c, cx, by, t) {
    shadow(c, cx, by, 30);
    box(c, cx - 13, by - 6, 26, 6, "#7c2d12", "#b45309", "#431407");
    box(c, cx - 11, by - 50, 22, 44, "#7c2d12", "#b45309", "#431407");
    box(c, cx - 14, by - 56, 28, 7, "#92400e", "#d98a3c", "#431407");
    disc(c, cx, by - 38, 8, OUT);
    disc(c, cx, by - 38, 7, "#fef3c7");
    for (const [dx, dy] of [[0, -6], [6, 0], [0, 6], [-6, 0]]) r(c, cx + dx, by - 38 + dy, 1, 1, "#7c2d12");
    const a = t * 0.9 - Math.PI / 2;
    for (let i = 1; i <= 5; i++) r(c, cx + Math.cos(a) * i, by - 38 + Math.sin(a) * i, 1, 1, "#111827");
    const h = a / 12;
    for (let i = 1; i <= 3; i++) r(c, cx + Math.cos(h) * i, by - 38 + Math.sin(h) * i, 1, 1, "#b91c1c");
    box(c, cx - 7, by - 28, 14, 20, "#1c1917");
    const sx = Math.round(Math.sin(t * 3) * 3);
    r(c, cx + sx, by - 27, 1, 12, "#fbbf24");
    disc(c, cx + sx, by - 14, 3, "#fbbf24");
    box(c, cx + 14, by - 8, 8, 6, "#dc2626", "#f87171", "#7f1d1d");
  },
  // Trial Tablet — test cases tick green one by one.
  codetest(c, cx, by, t) {
    shadow(c, cx, by, 34);
    box(c, cx - 16, by - 6, 32, 6, "#6b7280", "#9ca3af", "#4b5563");
    box(c, cx - 13, by - 50, 26, 44, "#6b7280", "#9ca3af", "#4b5563");
    box(c, cx - 9, by - 54, 18, 5, "#78808f", "#a3abba", "#4b5563");
    r(c, cx - 10, by - 44, 20, 32, "#0f172a");
    const k = Math.floor((t * 1.1) % 7);
    for (let i = 0; i < 5; i++) {
      const y = by - 41 + i * 6;
      const done = i < k;
      const pending = i === k;
      r(c, cx - 8, y, 4, 4, done ? (i === 3 ? "#ef4444" : "#22c55e") : pending && Math.floor(t * 4) % 2 ? "#fbbf24" : "#334155");
      r(c, cx - 2, y + 1, 8 - (i % 3) * 2, 2, done ? "#94a3b8" : "#334155");
    }
    r(c, cx - 4, by - 53, 8, 1, "#a5b4fc");
    if (Math.floor(t * 3) % 3 === 0) r(c, cx + 9, by - 56, 2, 2, "#c7d2fe");
  },
  // Judge's Scroll Board — a graded parchment with a wax seal.
  grader(c, cx, by, t) {
    shadow(c, cx, by, 42);
    r(c, cx - 16, by - 12, 3, 12, OUT);
    r(c, cx + 13, by - 12, 3, 12, OUT);
    r(c, cx - 15, by - 11, 1, 11, "#6b2f0a");
    r(c, cx + 14, by - 11, 1, 11, "#6b2f0a");
    box(c, cx - 19, by - 40, 38, 30, "#92400e", "#c2762a", "#6b2f0a");
    r(c, cx - 16, by - 37, 32, 24, "#fef3c7");
    r(c, cx - 16, by - 15, 32, 2, "#e7d2a0");
    const k = Math.floor((t * 1.2) % 4);
    for (let i = 0; i < 3; i++) {
      const y = by - 34 + i * 7;
      r(c, cx - 13, y + 2, 12, 1, "#a8a29e");
      if (i < k || k === 3) {
        r(c, cx + 3, y + 3, 2, 2, "#16a34a");
        r(c, cx + 5, y + 1, 2, 2, "#16a34a");
        r(c, cx + 7, y - 1, 2, 2, "#22c55e");
        r(c, cx + 1, y + 1, 2, 2, "#16a34a");
      }
    }
    disc(c, cx + 11, by - 17, 5, OUT);
    disc(c, cx + 11, by - 17, 4, "#dc2626");
    r(c, cx + 9, by - 19, 2, 2, "#fca5a5");
    r(c, cx + 12, by - 12, 3, 5, "#b91c1c");
  },
  // Round Table — the About Me hub, with candle, mugs and a map.
  about(c, cx, by, t) {
    shadow(c, cx, by, 54);
    for (const lx of [-16, 12]) {
      r(c, cx + lx - 1, by - 10, 6, 11, OUT);
      r(c, cx + lx, by - 9, 4, 9, "#6b2f0a");
    }
    ell(c, cx, by - 14, 25, 10, OUT);
    ell(c, cx, by - 15, 24, 9, "#8b5a2b");
    ell(c, cx, by - 17, 21, 7, "#a8713a");
    r(c, cx - 14, by - 18, 10, 1, "#c58a4a");
    // parchment map
    r(c, cx - 15, by - 19, 11, 6, "#fef3c7");
    r(c, cx - 13, by - 17, 3, 1, "#b45309");
    r(c, cx - 9, by - 16, 3, 1, "#16a34a");
    // mugs
    box(c, cx + 8, by - 22, 5, 6, "#dc2626", "#f87171", "#7f1d1d");
    box(c, cx + 14, by - 20, 5, 6, "#2563eb", "#60a5fa", "#1e3a8a");
    // candle
    box(c, cx - 2, by - 26, 4, 9, "#fde68a", "#fffbeb", "#d4a017");
    const fl = Math.floor(t * 7) % 2;
    r(c, cx - 1, by - 30 - fl, 2, 4, "#fb923c");
    r(c, cx, by - 31 - fl, 1, 2, "#fef08a");
  },
  // Writing Desk — a ledger, quill and candle: the Journey.
  journey(c, cx, by, t) {
    shadow(c, cx, by, 50);
    box(c, cx - 22, by - 16, 44, 16, "#7c4a21", "#b0713a", "#4a2a12");
    r(c, cx - 20, by - 13, 18, 11, "#5e3a1a");
    r(c, cx + 2, by - 13, 18, 11, "#5e3a1a");
    r(c, cx - 12, by - 8, 3, 2, "#d4a017");
    r(c, cx + 10, by - 8, 3, 2, "#d4a017");
    box(c, cx - 14, by - 22, 18, 6, "#f5f5f4", "#ffffff", "#d6d3d1");
    r(c, cx - 5, by - 22, 1, 6, "#a8a29e");
    r(c, cx - 12, by - 20, 5, 1, "#78716c");
    r(c, cx - 3, by - 20, 5, 1, "#78716c");
    // quill in ink pot
    box(c, cx + 6, by - 22, 6, 6, "#1e293b", "#475569", "#0f172a");
    r(c, cx + 9, by - 32, 2, 10, "#e5e7eb");
    r(c, cx + 11, by - 34, 2, 6, "#f3f4f6");
    // candle
    box(c, cx + 15, by - 26, 4, 10, "#fde68a", "#fffbeb", "#d4a017");
    const fl = Math.floor(t * 7 + 1) % 2;
    r(c, cx + 16, by - 30 - fl, 2, 4, "#fb923c");
    r(c, cx + 17, by - 31 - fl, 1, 2, "#fef08a");
    // scroll
    box(c, cx - 20, by - 21, 5, 5, "#fef3c7", "#ffffff", "#d6c28a");
  },
  // Trophy Case — glass cabinet with cups and medals.
  honors(c, cx, by, t) {
    shadow(c, cx, by, 34);
    box(c, cx - 16, by - 46, 32, 46, "#3f2a1d", "#6b4a33", "#241710");
    r(c, cx - 13, by - 43, 26, 38, "#1a1210");
    for (let i = 0; i < 3; i++) {
      r(c, cx - 13, by - 31 + i * 12, 26, 2, "#7c4a21");
      const y = by - 41 + i * 12;
      if (i === 0) {
        r(c, cx - 8, y, 8, 5, "#fbbf24");
        r(c, cx - 6, y + 5, 4, 3, "#fbbf24");
        r(c, cx - 8, y + 8, 8, 2, "#b45309");
        r(c, cx - 6, y + 1, 2, 2, "#fffbeb");
        disc(c, cx + 7, y + 4, 4, "#e5e7eb");
        r(c, cx + 5, y + 7, 2, 4, "#dc2626");
      } else if (i === 1) {
        disc(c, cx - 5, y + 4, 4, "#d4d4d8");
        r(c, cx - 7, y + 7, 2, 4, "#2563eb");
        r(c, cx + 3, y, 8, 5, "#fbbf24");
        r(c, cx + 5, y + 5, 4, 3, "#fbbf24");
        r(c, cx + 3, y + 8, 8, 2, "#b45309");
      } else {
        r(c, cx - 8, y + 2, 16, 7, "#fbbf24");
        r(c, cx - 8, y + 2, 16, 1, "#fde68a");
        r(c, cx - 4, y + 4, 8, 1, "#b45309");
      }
    }
    r(c, cx - 12, by - 42, 2, 34, "rgba(255,255,255,0.1)");
    r(c, cx - 8, by - 42, 1, 34, "rgba(255,255,255,0.07)");
    if (Math.floor(t * 4) % 3 === 0) r(c, cx + 8, by - 38, 2, 2, "#ffffff");
    if (Math.floor(t * 4 + 1) % 5 === 0) r(c, cx - 9, by - 14, 2, 2, "#ffffff");
  },
  // Mailbox — send me a message.
  mail(c, cx, by, t) {
    shadow(c, cx, by, 26);
    box(c, cx - 2, by - 18, 4, 18, "#6b4f2a", "#8a6a3a", "#3f2c15");
    box(c, cx - 11, by - 32, 22, 15, "#2563eb", "#60a5fa", "#1e3a8a");
    r(c, cx - 11, by - 32, 22, 4, "#3b82f6");
    r(c, cx - 7, by - 24, 14, 3, "#0b1220");
    box(c, cx - 5, by - 27, 10, 5, "#f8fafc", "#ffffff", "#cbd5e1");
    r(c, cx - 4, by - 25, 2, 1, "#94a3b8");
    const wig = Math.floor(t * 3) % 2;
    r(c, cx + 11, by - 36 + wig, 3, 14, OUT);
    r(c, cx + 12, by - 35 + wig, 1, 12, "#7f1d1d");
    r(c, cx + 11, by - 36 + wig, 7, 5, OUT);
    r(c, cx + 12, by - 35 + wig, 5, 3, "#ef4444");
  },
  // Warp Ring — a stone ring with a green vortex. Walk in, press E.
  portal(c, cx, by, t) {
    ell(c, cx, by - 6, 22, 11, OUT);
    ell(c, cx, by - 6, 21, 10, "#6b7280");
    ell(c, cx, by - 6, 17, 8, "#374151");
    ell(c, cx, by - 6, 15, 7, "#064e3b");
    for (let i = 0; i < 18; i++) {
      const frac = i / 18;
      const a = t * 2.4 + i * 0.55;
      const rad = 0.2 + frac * 0.8;
      r(c, cx + Math.cos(a) * 14 * rad, by - 6 + Math.sin(a) * 6 * rad, 2, 1, ["#065f46", "#10b981", "#6ee7b7", "#ecfdf5"][i % 4]);
    }
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      r(c, cx + Math.cos(a) * 19, by - 6 + Math.sin(a) * 8.5, 2, 2, hash(Math.floor(t * 2) + i) > 0.4 ? "#6ee7b7" : "#1f2937");
    }
    for (let i = 0; i < 4; i++) {
      const p = (t * 0.6 + i / 4) % 1;
      c.globalAlpha = 1 - p;
      r(c, cx - 8 + i * 5, by - 8 - p * 22, 1, 2, "#d1fae5");
      c.globalAlpha = 1;
    }
  },
  // Graph Board — a chalkboard where a minimum spanning tree grows edge by edge.
  research(c, cx, by, t) {
    shadow(c, cx, by, 40);
    r(c, cx - 15, by - 12, 3, 12, OUT);
    r(c, cx + 12, by - 12, 3, 12, OUT);
    r(c, cx - 14, by - 11, 1, 11, "#6b2f0a");
    r(c, cx + 13, by - 11, 1, 11, "#6b2f0a");
    box(c, cx - 18, by - 42, 36, 32, "#92400e", "#c2762a", "#6b2f0a");
    r(c, cx - 15, by - 39, 30, 26, "#1e293b");
    r(c, cx - 15, by - 39, 30, 1, "#334155");
    const nodes: [number, number][] = [[-10, -33], [0, -36], [10, -31], [-6, -21], [8, -20]];
    const edges: [number, number][] = [[0, 1], [1, 2], [0, 3], [1, 3], [2, 4], [3, 4], [1, 4]];
    const mst: [number, number][] = [[0, 1], [0, 3], [3, 4], [2, 4]];
    const lit = Math.floor((t * 1.1) % 6);
    for (const [a, b] of edges) {
      line(c, cx + nodes[a][0], by + nodes[a][1], cx + nodes[b][0], by + nodes[b][1], "#475569");
    }
    mst.forEach(([a, b], i) => {
      if (i < lit) line(c, cx + nodes[a][0], by + nodes[a][1], cx + nodes[b][0], by + nodes[b][1], "#4ade80");
    });
    for (const [nx, ny] of nodes) {
      r(c, cx + nx - 2, by + ny - 2, 5, 5, OUT);
      r(c, cx + nx - 1, by + ny - 1, 3, 3, "#fbbf24");
    }
    r(c, cx - 14, by - 12, 28, 2, "#6b2f0a");
    r(c, cx - 9, by - 14, 5, 2, "#f8fafc");
    r(c, cx + 2, by - 14, 4, 2, "#fde68a");
  },
  // Villagers are drawn by drawPerson, not here.
  npc() {},
};

export function drawStation(c: Ctx, s: Station, t: number) {
  DRAW[s.kind](c, s.x, s.y, t);
}

/* ------------------------------------------------------------------ */
/* Small props                                                         */
/* ------------------------------------------------------------------ */

export function drawPlant(c: Ctx, x: number, y: number, t: number) {
  shadow(c, x, y, 18);
  box(c, x - 6, y - 9, 12, 9, "#92400e", "#c2762a", "#6b2f0a");
  r(c, x - 7, y - 11, 14, 3, "#a85c1a");
  const sway = Math.round(Math.sin(t * 1.5 + x) * 1);
  const leaves = [
    { dx: -6, dy: -24, h: 14, col: "#15803d" },
    { dx: -2, dy: -28, h: 18, col: "#22c55e" },
    { dx: 3, dy: -25, h: 15, col: "#16a34a" },
    { dx: 6, dy: -21, h: 11, col: "#15803d" },
  ];
  for (const l of leaves) r(c, x + l.dx - 1 + sway, y + l.dy - 1, 4, l.h + 2, OUT);
  for (const l of leaves) {
    r(c, x + l.dx + sway, y + l.dy, 2, l.h, l.col);
    r(c, x + l.dx + 2 + sway, y + l.dy + 1, 1, l.h - 2, "rgba(255,255,255,0.18)");
  }
}

/** Bouncing arrow over the object the player can interact with. */
export function drawArrow(c: Ctx, x: number, topY: number, t: number) {
  const y = topY + Math.round(Math.sin(t * 6) * 2);
  r(c, x - 5, y - 1, 11, 1, OUT);
  r(c, x - 4, y, 9, 1, "#fbbf24");
  r(c, x - 3, y + 1, 7, 1, "#fbbf24");
  r(c, x - 2, y + 2, 5, 1, "#f59e0b");
  r(c, x - 1, y + 3, 3, 1, "#f59e0b");
  r(c, x, y + 4, 1, 1, "#f59e0b");
}
