import { OUT, disc, r } from "./draw";
import type { Dir } from "./world";

type Ctx = CanvasRenderingContext2D;

export type Look = {
  hair: string;
  hairHi: string;
  skin: string;
  skinSh: string;
  top: string;
  topHi: string;
  topSh: string;
  pants: string;
  boots: string;
  pack?: string;
  emblem?: boolean;
  hood?: boolean;
  sword?: boolean;
  hat?: "cap" | "grad" | "crown" | "shades" | "headset" | "hoodUp";
  hatColor?: string;
};

const SKIN = { skin: "#fcd9b6", skinSh: "#e8b98e" };

/** You: a burnt-orange-hoodie coder with a backpack and a sword on the back. */
export const HERO: Look = {
  hair: "#3b2416",
  hairHi: "#5a3a24",
  ...SKIN,
  top: "#d9691f",
  topHi: "#f0883a",
  topSh: "#a84c12",
  pants: "#334155",
  boots: "#5b3a1e",
  pack: "#0f766e",
  emblem: true,
  hood: true,
  sword: true,
};

export const LOOKS: Record<string, Look> = {
  hero: HERO,
  guide: { hair: "#a16207", hairHi: "#ca8a04", ...SKIN, top: "#16a34a", topHi: "#4ade80", topSh: "#166534", pants: "#78350f", boots: "#451a03", hat: "cap", hatColor: "#15803d" },
  intern: { hair: "#1e293b", hairHi: "#334155", ...SKIN, top: "#2563eb", topHi: "#60a5fa", topSh: "#1e40af", pants: "#1f2937", boots: "#111827", hat: "headset" },
  coach: { hair: "#7c2d12", hairHi: "#9a3412", skin: "#e8b98e", skinSh: "#c98f62", top: "#dc2626", topHi: "#f87171", topSh: "#991b1b", pants: "#1f2937", boots: "#111827", hat: "cap", hatColor: "#ef4444" },
  scholar: { hair: "#111827", hairHi: "#374151", ...SKIN, top: "#7c3aed", topHi: "#a78bfa", topSh: "#5b21b6", pants: "#1f2937", boots: "#111827", hat: "grad" },
  champion: { hair: "#fbbf24", hairHi: "#fde68a", ...SKIN, top: "#f8fafc", topHi: "#ffffff", topSh: "#cbd5e1", pants: "#92400e", boots: "#451a03", hat: "crown" },
  hacker: { hair: "#0f172a", hairHi: "#1e293b", ...SKIN, top: "#334155", topHi: "#64748b", topSh: "#1e293b", pants: "#0f172a", boots: "#020617", hat: "hoodUp" },
};

type Pose = { leg: number; bob: number; swing: number };

const WALK: Pose[] = [
  { leg: 0, bob: 0, swing: 0 },
  { leg: 1, bob: -1, swing: 1 },
  { leg: 0, bob: 0, swing: 0 },
  { leg: -1, bob: -1, swing: -1 },
];
const IDLE: Pose = { leg: 0, bob: 0, swing: 0 };

const OX = 16; // feet-centre inside the 32x40 sprite canvas
const OY = 36;

function legs(c: Ctx, look: Look, dir: Dir, leg: number) {
  const side = dir === "left" || dir === "right";
  if (side) {
    const back = OX - 2 - leg * 2;
    const front = OX - 2 + leg * 2;
    for (const [x, shade] of [[back, true], [front, false]] as const) {
      r(c, x, OY - 6, 4, 4, shade ? "#27303f" : look.pants);
      r(c, x, OY - 2, 5, 2, shade ? "#3d2a15" : look.boots);
    }
    return;
  }
  const ly = leg > 0 ? -1 : 0;
  const ry = leg < 0 ? -1 : 0;
  r(c, OX - 5, OY - 6 + ly, 4, 4, look.pants);
  r(c, OX - 5, OY - 2 + ly, 4, 2, look.boots);
  r(c, OX + 1, OY - 6 + ry, 4, 4, look.pants);
  r(c, OX + 1, OY - 2 + ry, 4, 2, look.boots);
  r(c, OX - 5, OY - 6 + ly, 1, 4, "rgba(255,255,255,0.12)");
}

function hat(c: Ctx, look: Look, dir: Dir, bob: number) {
  if (!look.hat) return;
  const col = look.hatColor ?? look.top;
  const y = OY - 26 + bob;
  const side = dir === "left" || dir === "right";
  switch (look.hat) {
    case "cap":
      r(c, OX - 6, y - 2, 12, 4, col);
      r(c, OX - 6, y - 2, 12, 1, "rgba(255,255,255,0.3)");
      if (dir === "down") r(c, OX - 6, y + 2, 12, 1, "rgba(0,0,0,0.35)");
      if (side) r(c, OX + 4, y + 2, 5, 1, "rgba(0,0,0,0.4)");
      break;
    case "grad":
      r(c, OX - 8, y - 4, 16, 2, "#111827");
      r(c, OX - 5, y - 2, 10, 4, "#111827");
      r(c, OX - 8, y - 4, 16, 1, "#374151");
      r(c, OX + 7, y - 3, 1, 6, "#fbbf24");
      r(c, OX + 6, y + 3, 3, 2, "#fbbf24");
      break;
    case "crown":
      r(c, OX - 5, y - 4, 10, 5, "#fbbf24");
      r(c, OX - 5, y - 6, 2, 2, "#fbbf24");
      r(c, OX - 1, y - 7, 2, 3, "#fbbf24");
      r(c, OX + 3, y - 6, 2, 2, "#fbbf24");
      r(c, OX - 5, y - 4, 10, 1, "#fde68a");
      r(c, OX - 1, y - 1, 2, 2, "#ef4444");
      break;
    case "shades":
      r(c, OX - 5, y + 5, 10, 3, "#0f172a");
      break;
    case "headset":
      r(c, OX - 6, y - 1, 12, 1, "#475569");
      r(c, OX - 7, y, 2, 7, "#475569");
      r(c, OX + 5, y, 2, 7, "#475569");
      r(c, OX - 8, y + 5, 3, 4, "#1e293b");
      if (dir !== "up") r(c, OX - 7, y + 9, 4, 1, "#475569");
      r(c, OX - 6, y + 10, 2, 2, "#ef4444");
      break;
    case "hoodUp":
      r(c, OX - 7, y - 2, 14, 6, col);
      r(c, OX - 7, y + 4, 3, 9, col);
      r(c, OX + 4, y + 4, 3, 9, col);
      r(c, OX - 7, y - 2, 14, 1, look.topHi);
      if (dir !== "up") {
        r(c, OX - 4, y + 4, 8, 8, "#0b1020");
        r(c, OX - 3, y + 7, 2, 2, "#e2e8f0");
        r(c, OX + 1, y + 7, 2, 2, "#e2e8f0");
      }
      break;
  }
}

function drawBody(c: Ctx, look: Look, dir: Dir, pose: Pose, blink: boolean) {
  const { bob, swing, leg } = pose;
  const { skin, skinSh, hair, hairHi, top, topHi, topSh } = look;
  const headY = OY - 25 + bob;
  const bodyY = OY - 15 + bob;
  legs(c, look, dir, leg);

  if (dir === "down") {
    if (look.sword) {
      r(c, OX + 7, headY + 4, 2, 5, "#92400e");
      r(c, OX + 6, headY + 4, 4, 1, "#fbbf24");
    }
    r(c, OX - 6, bodyY, 12, 10, top);
    r(c, OX - 6, bodyY, 1, 10, topHi);
    r(c, OX - 6, bodyY + 9, 12, 1, topSh);
    r(c, OX - 3, bodyY + 5, 6, 3, topSh);
    r(c, OX - 3, bodyY + 5, 6, 1, topHi);
    if (look.pack) {
      r(c, OX - 5, bodyY, 1, 8, "#78350f");
      r(c, OX + 4, bodyY, 1, 8, "#78350f");
    }
    if (look.hood) {
      r(c, OX - 7, bodyY - 2, 14, 4, topSh);
      r(c, OX - 7, bodyY - 2, 14, 1, top);
    }
    r(c, OX - 2, bodyY + 1, 1, 4, "#f5f5f4");
    r(c, OX + 1, bodyY + 1, 1, 4, "#f5f5f4");
    r(c, OX - 2, bodyY + 5, 1, 1, "#d6d3d1");
    r(c, OX + 1, bodyY + 5, 1, 1, "#d6d3d1");
    if (look.emblem) {
      r(c, OX + 2, bodyY + 2, 1, 1, "#ffffff");
      r(c, OX + 3, bodyY + 3, 2, 1, "#ffffff");
      r(c, OX + 5, bodyY + 2, 1, 1, "#ffffff");
    }
    r(c, OX - 8, bodyY + 1 + swing, 2, 7, top);
    r(c, OX - 8, bodyY + 1 + swing, 1, 7, topHi);
    r(c, OX - 8, bodyY + 8 + swing, 2, 2, skin);
    r(c, OX + 6, bodyY + 1 - swing, 2, 7, top);
    r(c, OX + 6, bodyY + 8 - swing, 2, 2, skin);
    // head
    r(c, OX - 5, headY, 10, 10, skin);
    r(c, OX - 5, headY + 9, 10, 1, skinSh);
    r(c, OX - 6, headY + 4, 1, 3, skin);
    r(c, OX + 5, headY + 4, 1, 3, skin);
    if (blink) {
      r(c, OX - 3, headY + 6, 2, 1, "#1c1917");
      r(c, OX + 1, headY + 6, 2, 1, "#1c1917");
    } else {
      r(c, OX - 3, headY + 4, 2, 3, "#1c1917");
      r(c, OX + 1, headY + 4, 2, 3, "#1c1917");
      r(c, OX - 3, headY + 4, 1, 1, "#ffffff");
      r(c, OX + 1, headY + 4, 1, 1, "#ffffff");
    }
    r(c, OX - 1, headY + 8, 2, 1, "#b45309");
    r(c, OX - 4, headY + 7, 1, 1, "#fca5a5");
    r(c, OX + 3, headY + 7, 1, 1, "#fca5a5");
    // hair
    r(c, OX - 6, headY - 2, 12, 4, hair);
    r(c, OX - 6, headY + 2, 2, 3, hair);
    r(c, OX + 4, headY + 2, 2, 3, hair);
    r(c, OX - 4, headY + 2, 3, 1, hair);
    r(c, OX + 1, headY + 2, 4, 1, hair);
    r(c, OX - 3, headY - 4, 3, 2, hair);
    r(c, OX + 1, headY - 3, 3, 1, hair);
    r(c, OX - 3, headY - 1, 4, 1, hairHi);
  } else if (dir === "up") {
    if (look.sword) {
      r(c, OX - 9, headY + 4, 2, 5, "#92400e");
      r(c, OX - 10, headY + 4, 4, 1, "#fbbf24");
    }
    r(c, OX - 6, bodyY, 12, 10, top);
    r(c, OX - 6, bodyY + 9, 12, 1, topSh);
    if (look.hood) {
      r(c, OX - 5, bodyY - 2, 10, 5, topSh);
      r(c, OX - 5, bodyY - 2, 10, 1, top);
    }
    if (look.pack) {
      r(c, OX - 5, bodyY - 1, 10, 10, look.pack);
      r(c, OX - 5, bodyY - 1, 10, 1, "#14b8a6");
      r(c, OX - 5, bodyY + 8, 10, 1, "#115e59");
      r(c, OX - 3, bodyY + 4, 6, 3, "#115e59");
      r(c, OX - 1, bodyY + 5, 2, 1, "#fbbf24");
      r(c, OX - 5, bodyY, 1, 9, "#0b4f4a");
    }
    r(c, OX - 8, bodyY + 1 - swing, 2, 7, top);
    r(c, OX - 8, bodyY + 8 - swing, 2, 2, skin);
    r(c, OX + 6, bodyY + 1 + swing, 2, 7, top);
    r(c, OX + 6, bodyY + 8 + swing, 2, 2, skin);
    r(c, OX - 2, headY + 10, 4, 1, skin);
    r(c, OX - 5, headY, 10, 10, hair);
    r(c, OX - 6, headY - 2, 12, 5, hair);
    r(c, OX - 6, headY + 3, 1, 4, hair);
    r(c, OX + 5, headY + 3, 1, 4, hair);
    r(c, OX - 3, headY - 4, 3, 2, hair);
    r(c, OX + 1, headY - 3, 3, 1, hair);
    r(c, OX - 4, headY, 4, 1, hairHi);
    r(c, OX - 2, headY + 7, 4, 2, "rgba(0,0,0,0.18)");
  } else {
    // facing right (left is mirrored by the caller)
    if (look.pack) {
      r(c, OX - 10, bodyY - 1, 6, 10, look.pack);
      r(c, OX - 10, bodyY - 1, 6, 1, "#14b8a6");
      r(c, OX - 10, bodyY + 8, 6, 1, "#115e59");
      r(c, OX - 9, bodyY + 4, 4, 3, "#115e59");
      r(c, OX - 8, bodyY + 5, 2, 1, "#fbbf24");
    }
    if (look.sword) {
      r(c, OX - 9, headY - 4, 2, 11, "#d6d3d1");
      r(c, OX - 9, headY - 4, 1, 11, "#f5f5f4");
      r(c, OX - 11, headY + 7, 6, 1, "#fbbf24");
      r(c, OX - 9, headY + 8, 2, 3, "#92400e");
    }
    r(c, OX - 5, bodyY, 10, 10, top);
    r(c, OX - 5, bodyY, 1, 10, topSh);
    r(c, OX - 5, bodyY + 9, 10, 1, topSh);
    r(c, OX - 1, bodyY + 5, 5, 3, topSh);
    if (look.hood) {
      r(c, OX - 7, bodyY - 3, 9, 5, topSh);
      r(c, OX - 7, bodyY - 3, 9, 1, top);
    }
    r(c, OX - 5, headY, 9, 10, skin);
    r(c, OX - 5, headY + 9, 9, 1, skinSh);
    r(c, OX + 4, headY + 5, 1, 2, skin);
    r(c, OX - 1, headY + 4, 2, 3, skinSh);
    if (blink) r(c, OX + 2, headY + 6, 2, 1, "#1c1917");
    else {
      r(c, OX + 2, headY + 4, 2, 3, "#1c1917");
      r(c, OX + 2, headY + 4, 1, 1, "#ffffff");
    }
    r(c, OX + 3, headY + 8, 2, 1, "#b45309");
    r(c, OX + 1, headY + 7, 1, 1, "#fca5a5");
    r(c, OX - 6, headY - 2, 11, 4, hair);
    r(c, OX - 6, headY + 2, 4, 7, hair);
    r(c, OX + 1, headY + 2, 4, 1, hair);
    r(c, OX + 2, headY - 3, 3, 1, hair);
    r(c, OX - 2, headY - 4, 3, 2, hair);
    r(c, OX - 3, headY - 1, 4, 1, hairHi);
    // front arm over the body
    const ax = OX - 2 + swing * 2;
    r(c, ax, bodyY + 1, 3, 7, topHi);
    r(c, ax, bodyY + 8, 3, 2, skin);
  }
  hat(c, look, dir, bob);
}

function outlined(src: HTMLCanvasElement): HTMLCanvasElement {
  const sil = document.createElement("canvas");
  sil.width = src.width;
  sil.height = src.height;
  const s = sil.getContext("2d");
  const out = document.createElement("canvas");
  out.width = src.width;
  out.height = src.height;
  const o = out.getContext("2d");
  if (!s || !o) return src;
  s.drawImage(src, 0, 0);
  s.globalCompositeOperation = "source-in";
  s.fillStyle = OUT;
  s.fillRect(0, 0, sil.width, sil.height);
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) o.drawImage(sil, dx, dy);
  o.drawImage(src, 0, 0);
  return out;
}

function renderFrame(look: Look, dir: Dir, pose: Pose, blink: boolean) {
  const cv = document.createElement("canvas");
  cv.width = 32;
  cv.height = 40;
  const c = cv.getContext("2d");
  if (!c) return cv;
  if (dir === "left") {
    c.translate(OX * 2, 0);
    c.scale(-1, 1);
  }
  drawBody(c, look, dir, pose, blink);
  return outlined(cv);
}

export type Sprites = Record<Dir, { idle: HTMLCanvasElement; blink: HTMLCanvasElement; walk: HTMLCanvasElement[] }>;

/** Pre-renders every pose of a character once, so drawing is just a blit. */
export function makeSprites(look: Look): Sprites {
  const dirs: Dir[] = ["up", "down", "left", "right"];
  const out = {} as Sprites;
  for (const d of dirs) {
    out[d] = {
      idle: renderFrame(look, d, IDLE, false),
      blink: renderFrame(look, d, IDLE, true),
      walk: WALK.map((p) => renderFrame(look, d, p, false)),
    };
  }
  return out;
}

export function drawPerson(
  c: Ctx,
  sp: Sprites,
  x: number,
  y: number,
  dir: Dir,
  moving: boolean,
  walkT: number,
  t: number,
  phase = 0,
) {
  r(c, x - 7, y - 4, 14, 1, "rgba(0,0,0,0.18)");
  r(c, x - 8, y - 3, 16, 3, "rgba(0,0,0,0.3)");
  let frame: HTMLCanvasElement;
  let lift = 0;
  if (moving) {
    frame = sp[dir].walk[((Math.floor(walkT * 8) % 4) + 4) % 4];
  } else {
    frame = (t + phase) % 3.4 < 0.14 ? sp[dir].blink : sp[dir].idle;
    lift = Math.sin(t * 2 + phase) > 0.85 ? -1 : 0; // a slow "breathing" bob
  }
  c.drawImage(frame, Math.round(x - OX), Math.round(y - OY + lift));
}

/** A bouncing slime pet. */
export function drawSlime(c: Ctx, x: number, y: number, t: number, moving: boolean) {
  const hop = moving ? Math.abs(Math.sin(t * 9)) : 0;
  const h = Math.round(moving ? 9 + 3 * (1 - hop) : 10 + Math.sin(t * 3) * 0.8);
  const lift = Math.round(hop * 5);
  r(c, x - 7 + lift / 2, y - 3, 14 - lift, 3, "rgba(0,0,0,0.3)");
  const top = y - h - lift;
  const half = (i: number, extra: number) =>
    Math.round(7 * Math.sqrt(Math.max(0, 1 - Math.pow((h - 1 - i) / h, 2)))) + extra;
  for (let i = -1; i <= h; i++) {
    const hw = half(Math.min(h - 1, Math.max(0, i)), 1);
    r(c, x - hw, top + i, hw * 2, 1, OUT);
  }
  for (let i = 0; i < h; i++) {
    const hw = half(i, 0);
    r(c, x - hw, top + i, hw * 2, 1, i > h - 3 ? "#0284c7" : "#38bdf8");
  }
  r(c, x - 4, top + 2, 3, 2, "#bae6fd");
  r(c, x - 5, top + 4, 1, 2, "#bae6fd");
  const ey = top + Math.round(h * 0.45);
  r(c, x - 3, ey, 2, 3, "#0c4a6e");
  r(c, x + 2, ey, 2, 3, "#0c4a6e");
  r(c, x - 3, ey, 1, 1, "#ffffff");
  r(c, x + 2, ey, 1, 1, "#ffffff");
  r(c, x - 1, ey + 4, 3, 1, "#0c4a6e");
  disc(c, x + 4, top + 1, 1, "#7dd3fc");
}
