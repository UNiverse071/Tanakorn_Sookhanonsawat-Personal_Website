import { H, LANTERNS, STATIONS, TOP_BASE, W, type Station } from "./world";

type Ctx = CanvasRenderingContext2D;
export type Dir = "up" | "down" | "left" | "right";

function r(c: Ctx, x: number, y: number, w: number, h: number, col: string) {
  c.fillStyle = col;
  c.fillRect(Math.round(x), Math.round(y), w, h);
}

function disc(c: Ctx, cx: number, cy: number, rad: number, col: string) {
  c.fillStyle = col;
  for (let dy = -rad; dy <= rad; dy++) {
    const half = Math.floor(Math.sqrt(rad * rad - dy * dy + 0.25));
    c.fillRect(Math.round(cx) - half, Math.round(cy) + dy, half * 2 + 1, 1);
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

/* ------------------------------------------------------------------ */
/* Static background: floor, walls, rug, wall decor                    */
/* ------------------------------------------------------------------ */

function bricks(c: Ctx, x: number, y: number, w: number, h: number, shades: string[], mortar: string, rand: () => number) {
  r(c, x, y, w, h, mortar);
  for (let row = 0; row * 8 < h; row++) {
    const off = (row % 2) * 8;
    for (let bx = -off; bx < w; bx += 16) {
      const x0 = Math.max(0, bx + 1);
      const x1 = Math.min(w, bx + 15);
      const bh = Math.min(7, h - row * 8 - 1);
      if (x1 > x0 && bh > 0) {
        r(c, x + x0, y + row * 8 + 1, x1 - x0, bh, shades[Math.floor(rand() * shades.length)]);
      }
    }
  }
}

export function drawBackground(c: Ctx) {
  const rand = rng(11);
  r(c, 0, 0, W, H, "#120d14");

  // Wooden floor
  for (let y = 42, row = 0; y < 208; y += 8, row++) {
    const off = (row % 3) * 8;
    for (let x = 8 - off; x < W - 8; x += 24) {
      const x0 = Math.max(8, x);
      const x1 = Math.min(W - 8, x + 24);
      const shade = ["#4a3427", "#46301f", "#503829"][Math.floor(rand() * 3)];
      r(c, x0, y, x1 - x0, 8, shade);
      r(c, x0, y + 7, x1 - x0, 1, "#2f2018");
      if (x >= 8) r(c, x0, y, 1, 8, "#2f2018");
      if (rand() < 0.18) r(c, x0 + 4 + Math.floor(rand() * 12), y + 2 + Math.floor(rand() * 4), 2, 1, "#37251a");
    }
  }

  // Rug under the About table
  r(c, 100, 84, 120, 72, "#1b4332");
  r(c, 102, 86, 116, 68, "#d4a017");
  r(c, 104, 88, 112, 64, "#2d6a4f");
  for (let y = 90; y < 150; y += 6) {
    for (let x = 106 + ((y / 6) % 2) * 3; x < 214; x += 6) r(c, x, y, 2, 2, "#3b8a65");
  }
  r(c, 104, 88, 112, 2, "#1f5a41");
  r(c, 104, 150, 112, 2, "#1f5a41");

  // Walls
  bricks(c, 0, 0, W, 42, ["#3a2c3d", "#352838", "#412f43"], "#241a28", rand);
  r(c, 0, 38, W, 4, "#1d1520");
  r(c, 0, 42, W, 2, "#0d080f");
  bricks(c, 0, 0, 8, H, ["#3a2c3d", "#352838"], "#241a28", rand);
  bricks(c, W - 8, 0, 8, H, ["#3a2c3d", "#352838"], "#241a28", rand);
  bricks(c, 0, 208, W, 8, ["#3a2c3d", "#352838"], "#241a28", rand);
  r(c, 8, 44, 1, 164, "#0d080f");
  r(c, W - 9, 44, 1, 164, "#0d080f");

  // Banners above each top-wall station, coloured per project.
  for (const s of STATIONS.filter((s) => s.y === TOP_BASE)) {
    r(c, s.x - 8, 2, 16, 14, s.accent);
    r(c, s.x - 8, 2, 16, 2, "rgba(0,0,0,0.25)");
    r(c, s.x - 8, 16, 4, 3, s.accent);
    r(c, s.x + 4, 16, 4, 3, s.accent);
    r(c, s.x - 2, 6, 4, 6, "rgba(255,255,255,0.55)");
    r(c, s.x - 10, 1, 20, 1, "#7a5a2a");
  }

  // A shelf of bottles on the left and a poster on the right wall edge
  r(c, 84, 22, 22, 2, "#7a5a2a");
  const bottles = ["#60a5fa", "#f87171", "#34d399", "#fbbf24"];
  bottles.forEach((col, i) => r(c, 86 + i * 5, 16, 3, 6, col));
}

/* ------------------------------------------------------------------ */
/* Stations                                                            */
/* ------------------------------------------------------------------ */

function shadow(c: Ctx, cx: number, by: number, w: number) {
  r(c, cx - w / 2, by - 2, w, 3, "rgba(0,0,0,0.35)");
}

const DRAW: Record<Station["kind"], (c: Ctx, cx: number, by: number, t: number, s: Station) => void> = {
  kernel(c, cx, by, t) {
    shadow(c, cx, by, 22);
    r(c, cx - 10, by - 26, 20, 26, "#2b2f3a");
    r(c, cx - 10, by - 26, 20, 2, "#4a5266");
    for (let i = 0; i < 4; i++) {
      r(c, cx - 8, by - 22 + i * 6, 16, 4, "#171a21");
      const on = Math.sin(t * 3 + i * 1.7) > -0.2;
      r(c, cx + 4, by - 21 + i * 6, 2, 2, on ? "#4ade80" : "#14532d");
      r(c, cx - 7, by - 21 + i * 6, 5, 1, "#3b4252");
    }
    r(c, cx - 9, by - 1, 3, 1, "#0d080f");
    r(c, cx + 6, by - 1, 3, 1, "#0d080f");
  },
  cpu(c, cx, by, t) {
    shadow(c, cx, by, 26);
    r(c, cx - 13, by - 6, 26, 6, "#14532d");
    r(c, cx - 12, by - 4, 24, 1, "#22c55e");
    r(c, cx - 9, by - 24, 18, 18, "#111827");
    r(c, cx - 9, by - 24, 18, 1, "#6b7280");
    for (let i = 0; i < 5; i++) {
      r(c, cx - 12, by - 22 + i * 3, 3, 1, "#d1d5db");
      r(c, cx + 9, by - 22 + i * 3, 3, 1, "#d1d5db");
    }
    const stages = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];
    const lit = Math.floor(t * 4) % 5;
    stages.forEach((col, i) => {
      r(c, cx - 7 + i * 3, by - 20, 2, 10, i === lit ? col : "rgba(255,255,255,0.12)");
    });
  },
  compiler(c, cx, by, t) {
    shadow(c, cx, by, 26);
    r(c, cx - 12, by - 26, 24, 18, "#1f2937");
    r(c, cx - 10, by - 24, 20, 14, "#0b1220");
    const lines = [8, 12, 6, 10];
    lines.forEach((w, i) => {
      r(c, cx - 8, by - 22 + i * 3, w, 1, i % 2 ? "#fbbf24" : "#4ade80");
    });
    if (Math.floor(t * 2) % 2 === 0) r(c, cx + 4, by - 13, 3, 1, "#e5e7eb");
    r(c, cx - 3, by - 8, 6, 4, "#374151");
    r(c, cx - 8, by - 4, 16, 4, "#4b5563");
  },
  allocator(c, cx, by) {
    shadow(c, cx, by, 28);
    r(c, cx - 13, by - 12, 14, 12, "#a16207");
    r(c, cx - 13, by - 12, 14, 1, "#fcd34d");
    r(c, cx - 13, by - 6, 14, 1, "#713f12");
    r(c, cx - 7, by - 12, 1, 12, "#713f12");
    r(c, cx + 2, by - 9, 11, 9, "#ca8a04");
    r(c, cx + 2, by - 9, 11, 1, "#fde68a");
    r(c, cx - 9, by - 20, 9, 8, "#eab308");
    r(c, cx - 9, by - 20, 9, 1, "#fef08a");
    r(c, cx + 3, by - 16, 7, 7, "#facc15");
    // an empty "free block" outline
    r(c, cx + 3, by - 24, 8, 1, "rgba(255,255,255,0.5)");
    r(c, cx + 3, by - 17, 8, 1, "rgba(255,255,255,0.5)");
    r(c, cx + 3, by - 24, 1, 8, "rgba(255,255,255,0.5)");
    r(c, cx + 10, by - 24, 1, 8, "rgba(255,255,255,0.5)");
  },
  crawler(c, cx, by, t) {
    shadow(c, cx, by, 24);
    r(c, cx, by - 26, 1, 9, "#e5e7eb");
    const step = Math.floor(t * 4) % 2;
    for (let i = 0; i < 3; i++) {
      const dy = ((i + step) % 2) * 1;
      r(c, cx - 12, by - 12 + i * 3 + dy, 7, 1, "#7f1d1d");
      r(c, cx + 5, by - 12 + i * 3 - dy + 1, 7, 1, "#7f1d1d");
    }
    r(c, cx - 6, by - 14, 12, 8, "#991b1b");
    r(c, cx - 6, by - 14, 12, 1, "#ef4444");
    r(c, cx - 4, by - 19, 8, 6, "#b91c1c");
    r(c, cx - 3, by - 17, 2, 2, "#fde047");
    r(c, cx + 1, by - 17, 2, 2, "#fde047");
  },
  gan(c, cx, by, t) {
    shadow(c, cx, by, 24);
    r(c, cx - 11, by - 6, 22, 6, "#4b5563");
    r(c, cx - 11, by - 6, 22, 1, "#9ca3af");
    disc(c, cx - 6, by - 14, 5, "#f472b6");
    disc(c, cx + 6, by - 14, 5, "#22d3ee");
    r(c, cx - 8, by - 17, 2, 2, "#fbcfe8");
    r(c, cx + 4, by - 17, 2, 2, "#a5f3fc");
    const sparks = Math.floor(t * 8) % 3;
    for (let i = 0; i < 3; i++) {
      r(c, cx - 1, by - 18 + i * 3, 2, 2, i === sparks ? "#ffffff" : "rgba(255,255,255,0.25)");
    }
  },
  motion(c, cx, by, t) {
    shadow(c, cx, by, 18);
    r(c, cx - 7, by - 3, 14, 3, "#374151");
    r(c, cx - 1, by - 14, 2, 11, "#6b7280");
    const swing = Math.round(Math.sin(t * 3) * 2);
    disc(c, cx, by - 22, 3, "#e5e7eb");
    r(c, cx - 1, by - 19, 2, 8, "#e5e7eb");
    r(c, cx - 7, by - 18 + swing, 6, 1, "#e5e7eb");
    r(c, cx + 1, by - 18 - swing, 6, 1, "#e5e7eb");
    r(c, cx - 3, by - 11, 1, 8, "#e5e7eb");
    r(c, cx + 2, by - 11, 1, 8, "#e5e7eb");
    // mocap markers on the joints
    for (const [mx, my] of [[-2, -19], [1, -19], [-2, -11], [1, -11], [-8, -18 + swing], [6, -18 - swing]]) {
      r(c, cx + mx, by + my, 2, 2, "#f87171");
    }
  },
  focus(c, cx, by, t) {
    shadow(c, cx, by, 22);
    r(c, cx - 5, by - 4, 10, 4, "#4b5563");
    r(c, cx - 1, by - 28, 2, 3, "#ef4444");
    disc(c, cx, by - 15, 10, "#ef4444");
    disc(c, cx, by - 15, 8, "#f8fafc");
    const a = t * 2 - Math.PI / 2;
    for (let i = 1; i <= 6; i++) {
      r(c, cx + Math.cos(a) * i, by - 15 + Math.sin(a) * i, 1, 1, "#111827");
    }
    r(c, cx, by - 15, 1, 1, "#ef4444");
  },
  codetest(c, cx, by, t) {
    shadow(c, cx, by, 20);
    r(c, cx - 9, by - 28, 18, 28, "#1e3a8a");
    r(c, cx - 9, by - 28, 18, 4, "#f59e0b");
    r(c, cx - 7, by - 23, 14, 9, "#020617");
    const rows = [6, 9, 4, 8];
    rows.forEach((w, i) => {
      const lit = (Math.floor(t * 3) + i) % 4 !== 0;
      r(c, cx - 5, by - 22 + i * 2, w, 1, lit ? "#4ade80" : "#14532d");
    });
    r(c, cx - 9, by - 12, 18, 4, "#334155");
    r(c, cx - 5, by - 15, 1, 3, "#e5e7eb");
    r(c, cx - 6, by - 17, 3, 3, "#ef4444");
    r(c, cx + 2, by - 11, 2, 2, "#fbbf24");
    r(c, cx + 5, by - 11, 2, 2, "#34d399");
  },
  grader(c, cx, by, t) {
    shadow(c, cx, by, 26);
    r(c, cx - 9, by - 8, 2, 8, "#78350f");
    r(c, cx + 7, by - 8, 2, 8, "#78350f");
    r(c, cx - 12, by - 26, 24, 18, "#92400e");
    r(c, cx - 10, by - 24, 20, 14, "#f8fafc");
    r(c, cx - 8, by - 22, 8, 1, "#94a3b8");
    r(c, cx - 8, by - 19, 6, 1, "#94a3b8");
    const pulse = Math.floor(t * 3) % 2;
    const g = pulse ? "#22c55e" : "#16a34a";
    r(c, cx + 1, by - 17, 2, 2, g);
    r(c, cx + 3, by - 19, 2, 2, g);
    r(c, cx + 5, by - 21, 2, 2, g);
    r(c, cx - 1, by - 19, 2, 2, g);
  },
  about(c, cx, by, t) {
    shadow(c, cx, by, 34);
    r(c, cx - 15, by - 14, 30, 12, "#8b5a2b");
    r(c, cx - 15, by - 14, 30, 2, "#c58a4a");
    r(c, cx - 13, by - 2, 4, 3, "#5a3a1a");
    r(c, cx + 9, by - 2, 4, 3, "#5a3a1a");
    // dishes and a lit candle
    r(c, cx - 11, by - 12, 6, 3, "#e5e7eb");
    r(c, cx + 5, by - 12, 6, 3, "#fca5a5");
    r(c, cx - 1, by - 18, 2, 5, "#fde68a");
    r(c, cx - 1, by - 21 + (Math.floor(t * 6) % 2), 2, 3, "#fb923c");
  },
  journey(c, cx, by, t) {
    shadow(c, cx, by, 32);
    r(c, cx - 15, by - 12, 30, 12, "#7c4a21");
    r(c, cx - 15, by - 12, 30, 2, "#b0713a");
    r(c, cx - 8, by - 19, 16, 7, "#f5f5f4");
    r(c, cx - 1, by - 19, 2, 7, "#a8a29e");
    r(c, cx - 6, by - 17, 4, 1, "#78716c");
    r(c, cx + 2, by - 17, 4, 1, "#78716c");
    r(c, cx + 10, by - 24, 2, 8, "#fde68a");
    r(c, cx + 10, by - 27 + (Math.floor(t * 6) % 2), 2, 3, "#fb923c");
  },
  honors(c, cx, by, t) {
    shadow(c, cx, by, 26);
    r(c, cx - 11, by - 26, 22, 26, "#3f2a1d");
    r(c, cx - 9, by - 24, 18, 22, "#241710");
    for (let i = 0; i < 3; i++) {
      r(c, cx - 9, by - 17 + i * 8, 18, 1, "#7c4a21");
      // little gold cup
      const x = cx - 6 + (i % 2) * 6;
      const y = by - 22 + i * 8;
      r(c, x, y, 5, 3, "#fbbf24");
      r(c, x + 2, y + 3, 1, 2, "#fbbf24");
      r(c, x, y + 5, 5, 1, "#b45309");
    }
    if (Math.floor(t * 4) % 3 === 0) r(c, cx + 5, by - 22, 1, 1, "#ffffff");
  },
  mail(c, cx, by, t) {
    shadow(c, cx, by, 20);
    r(c, cx - 1, by - 14, 3, 14, "#6b4f2a");
    r(c, cx - 8, by - 26, 16, 12, "#2563eb");
    r(c, cx - 8, by - 26, 16, 2, "#60a5fa");
    r(c, cx - 5, by - 20, 10, 2, "#0b1220");
    r(c, cx - 3, by - 22, 6, 3, "#f8fafc");
    const wig = Math.floor(t * 3) % 2;
    r(c, cx + 8, by - 28 + wig, 2, 9, "#7f1d1d");
    r(c, cx + 8, by - 28 + wig, 5, 3, "#ef4444");
  },
  portal(c, cx, by, t) {
    for (let i = 0; i < 3; i++) {
      const rad = 11 - i * 3;
      const col = ["#065f46", "#10b981", "#6ee7b7"][i];
      c.fillStyle = col;
      for (let dy = -rad / 2; dy <= rad / 2; dy++) {
        const half = Math.floor(Math.sqrt(Math.max(0, (rad / 2) ** 2 - dy * dy)) * 2);
        c.fillRect(Math.round(cx) - half, Math.round(by - 4 + dy), half * 2, 1);
      }
    }
    for (let i = 0; i < 4; i++) {
      const a = t * 2 + i * 1.57;
      r(c, cx + Math.cos(a) * 6, by - 4 + Math.sin(a) * 3 - 6 - (t * 8 + i * 3) % 6, 1, 1, "#ecfdf5");
    }
  },
};

export function drawStation(c: Ctx, s: Station, t: number) {
  DRAW[s.kind](c, s.x, s.y, t, s);
}

/* ------------------------------------------------------------------ */
/* Characters and small props                                          */
/* ------------------------------------------------------------------ */

export function drawPlant(c: Ctx, x: number, y: number) {
  shadow(c, x, y, 14);
  r(c, x - 4, y - 6, 8, 6, "#92400e");
  r(c, x - 4, y - 6, 8, 1, "#b45309");
  r(c, x - 5, y - 13, 4, 8, "#15803d");
  r(c, x + 1, y - 14, 4, 9, "#16a34a");
  r(c, x - 1, y - 16, 2, 10, "#22c55e");
}

export function drawNpc(c: Ctx, x: number, y: number, color: string, t: number, phase: number) {
  const bob = Math.round(Math.sin(t * 2.2 + phase) * 1);
  shadow(c, x, y, 10);
  r(c, x - 4, y - 9 + bob, 8, 8, color);
  r(c, x - 4, y - 9 + bob, 8, 1, "rgba(255,255,255,0.35)");
  r(c, x - 4, y - 11 + bob, 2, 3, color);
  r(c, x + 2, y - 11 + bob, 2, 3, color);
  r(c, x - 2, y - 6 + bob, 1, 2, "#111827");
  r(c, x + 1, y - 6 + bob, 1, 2, "#111827");
  r(c, x - 3, y - 1, 2, 1, "#111827");
  r(c, x + 1, y - 1, 2, 1, "#111827");
}

export function drawPlayer(c: Ctx, x: number, y: number, dir: Dir, moving: boolean, walk: number) {
  const frame = moving ? Math.floor(walk * 8) % 2 : 0;
  const bob = moving && frame === 1 ? -1 : 0;
  const skin = "#fcd9b6";

  shadow(c, x, y, 12);
  // legs
  r(c, x - 3, y - 4 + (moving && frame === 0 ? -1 : 0), 2, 4, "#1e3a8a");
  r(c, x + 1, y - 4 + (moving && frame === 1 ? -1 : 0), 2, 4, "#1e3a8a");
  // body + belt
  r(c, x - 4, y - 10 + bob, 8, 6, "#3b82f6");
  r(c, x - 4, y - 10 + bob, 8, 1, "#93c5fd");
  r(c, x - 4, y - 6 + bob, 8, 1, "#92400e");
  // arms
  const swing = moving ? (frame === 0 ? 1 : -1) : 0;
  r(c, x - 6, y - 10 + bob + (dir === "left" || dir === "right" ? 0 : swing), 2, 5, "#60a5fa");
  r(c, x + 4, y - 10 + bob - (dir === "left" || dir === "right" ? 0 : swing), 2, 5, "#60a5fa");
  // helmet
  r(c, x - 4, y - 16 + bob, 8, 7, "#cbd5e1");
  r(c, x - 4, y - 16 + bob, 8, 1, "#f1f5f9");
  r(c, x - 1, y - 19 + bob, 2, 3, "#ef4444");
  // face
  if (dir === "down") {
    r(c, x - 3, y - 13 + bob, 6, 3, skin);
    r(c, x - 2, y - 12 + bob, 1, 1, "#111827");
    r(c, x + 1, y - 12 + bob, 1, 1, "#111827");
  } else if (dir === "left") {
    r(c, x - 4, y - 13 + bob, 4, 3, skin);
    r(c, x - 3, y - 12 + bob, 1, 1, "#111827");
  } else if (dir === "right") {
    r(c, x, y - 13 + bob, 4, 3, skin);
    r(c, x + 2, y - 12 + bob, 1, 1, "#111827");
  }
  // sword
  if (dir === "left") {
    r(c, x + 4, y - 12 + bob, 1, 7, "#e5e7eb");
    r(c, x + 3, y - 6 + bob, 3, 1, "#fbbf24");
  } else if (dir === "right") {
    r(c, x - 5, y - 12 + bob, 1, 7, "#e5e7eb");
    r(c, x - 6, y - 6 + bob, 3, 1, "#fbbf24");
  } else {
    r(c, x + 5, y - 12 + bob, 1, 7, "#e5e7eb");
    r(c, x + 4, y - 6 + bob, 3, 1, "#fbbf24");
  }
}

/** Bouncing arrow over the station the player can interact with. */
export function drawArrow(c: Ctx, x: number, topY: number, t: number) {
  const y = topY + Math.round(Math.sin(t * 6) * 1.5);
  r(c, x - 3, y, 7, 1, "#fbbf24");
  r(c, x - 2, y + 1, 5, 1, "#fbbf24");
  r(c, x - 1, y + 2, 3, 1, "#fbbf24");
  r(c, x, y + 3, 1, 1, "#fbbf24");
}

/* ------------------------------------------------------------------ */
/* Lighting                                                            */
/* ------------------------------------------------------------------ */

export function drawLights(c: Ctx, t: number) {
  for (const l of LANTERNS) {
    r(c, l.x - 1, 0, 1, l.y, "#241a28");
    r(c, l.x - 3, l.y, 6, 7, "#b45309");
    r(c, l.x - 2, l.y + 1, 4, 5, "#fbbf24");
    r(c, l.x - 3, l.y, 6, 1, "#451a03");
  }
  c.save();
  for (const l of LANTERNS) {
    const flicker = 0.9 + Math.sin(t * 7 + l.x) * 0.1;
    for (let i = 3; i >= 1; i--) {
      c.globalAlpha = 0.045 * flicker;
      c.fillStyle = "#fb923c";
      c.beginPath();
      c.arc(l.x, l.y + 4, i * 20, 0, Math.PI * 2);
      c.fill();
    }
  }
  c.restore();

  // Soft vignette so the middle of the room reads as the lit area.
  const g = c.createRadialGradient(W / 2, H / 2 + 6, 70, W / 2, H / 2 + 6, 190);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(5,2,8,0.5)");
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
}
