import { r } from "./draw";
import { H, TORCHES, W, WINDOWS } from "./world";

type Ctx = CanvasRenderingContext2D;

type Phase = "day" | "dusk" | "night";

function phaseOf(hour: number): Phase {
  if (hour >= 8 && hour < 17) return "day";
  if ((hour >= 6 && hour < 8) || (hour >= 17 && hour < 20)) return "dusk";
  return "night";
}

const SKY: Record<Phase, string[]> = {
  day: ["#4a90e2", "#6aa9ec", "#8fc1f2", "#b7d9f7"],
  dusk: ["#3b4a9a", "#9a4f8a", "#e8795d", "#fcb877"],
  night: ["#070b24", "#0d1440", "#151c52", "#1d2564"],
};

type Puff = { x: number; y: number; vx: number; vy: number; life: number };

export type Ambient = {
  update(dt: number, p: { x: number; y: number; moving: boolean }): void;
  drawWindows(c: Ctx, t: number): void;
  drawPuffs(c: Ctx): void;
  drawLights(c: Ctx, t: number): void;
};

/** Everything that makes the room feel alive: sky, torches, light, fireflies, dust. */
export function createAmbient(hour: number): Ambient {
  const phase = phaseOf(hour);
  const flies = Array.from({ length: 14 }, () => ({
    x: 40 + Math.random() * 400,
    y: 120 + Math.random() * 160,
    ph: Math.random() * 6.28,
    sp: 0.3 + Math.random() * 0.5,
  }));
  const motes = Array.from({ length: 26 }, () => ({
    x: 60 + Math.random() * 360,
    y: 60 + Math.random() * 200,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 3,
    ph: Math.random() * 6.28,
  }));
  const puffs: Puff[] = [];
  let stepTimer = 0;

  return {
    update(dt, p) {
      if (p.moving) {
        stepTimer -= dt;
        if (stepTimer <= 0) {
          stepTimer = 0.16;
          puffs.push({
            x: p.x + (Math.random() - 0.5) * 6,
            y: p.y - 1,
            vx: (Math.random() - 0.5) * 6,
            vy: -8 - Math.random() * 6,
            life: 0.45,
          });
        }
      }
      for (let i = puffs.length - 1; i >= 0; i--) {
        const q = puffs[i];
        q.life -= dt;
        q.x += q.vx * dt;
        q.y += q.vy * dt;
        if (q.life <= 0) puffs.splice(i, 1);
      }
      for (const m of motes) {
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (m.x < 40) m.x = 440;
        if (m.x > 440) m.x = 40;
        if (m.y < 60) m.y = 260;
        if (m.y > 260) m.y = 60;
      }
    },

    drawWindows(c, t) {
      const bands = SKY[phase];
      for (const [wi, w] of WINDOWS.entries()) {
        const x0 = w.x - w.w / 2;
        const bh = w.h / bands.length;
        bands.forEach((col, i) => r(c, x0, w.y + i * bh, w.w, Math.ceil(bh), col));
        if (phase === "night") {
          for (let i = 0; i < 9; i++) {
            const sx = x0 + 2 + ((i * 53 + wi * 17) % (w.w - 4));
            const sy = w.y + 2 + ((i * 29 + wi * 11) % (w.h - 10));
            const tw = Math.sin(t * 2 + i * 1.7 + wi) > -0.2;
            r(c, sx, sy, tw ? 2 : 1, tw ? 2 : 1, "#fef9c3");
          }
          const mx = x0 + 20;
          const my = w.y + 8;
          r(c, mx, my, 8, 8, "#fef3c7");
          r(c, mx + 3, my - 1, 7, 8, bands[0]);
        } else {
          const sunX = x0 + ((hour - 6) / 14) * (w.w - 8) + 2;
          r(c, sunX, w.y + 6 + Math.abs(hour - 12), 7, 7, phase === "dusk" ? "#fb923c" : "#fde047");
          for (let k = 0; k < 2; k++) {
            const cx = x0 + ((t * 2.5 + k * 22 + wi * 9) % (w.w + 16)) - 8;
            const cy = w.y + 10 + k * 12;
            r(c, cx, cy, 10, 3, "rgba(255,255,255,0.9)");
            r(c, cx + 2, cy - 2, 6, 2, "rgba(255,255,255,0.9)");
          }
        }
        // distant treeline and muntins
        r(c, x0, w.y + w.h - 5, w.w, 5, phase === "night" ? "#06130f" : "#2f6b3a");
        r(c, w.x - 1, w.y, 2, w.h, "#7a4e2a");
        r(c, x0, w.y + w.h / 2 - 1, w.w, 2, "#7a4e2a");
        r(c, x0 + 2, w.y + 2, 1, w.h / 2 - 4, "rgba(255,255,255,0.35)");
      }
    },

    drawPuffs(c) {
      for (const q of puffs) {
        c.globalAlpha = Math.max(0, q.life / 0.45) * 0.8;
        const s = q.life > 0.25 ? 3 : 2;
        r(c, q.x, q.y, s, s, "#e7d5b3");
      }
      c.globalAlpha = 1;
    },

    drawLights(c, t) {
      // Light shafts pouring through the windows.
      c.save();
      const beam = phase === "night" ? "165,180,252" : phase === "dusk" ? "255,170,110" : "255,241,193";
      for (const w of WINDOWS) {
        const g = c.createLinearGradient(w.x, w.y + w.h, w.x + 50, 220);
        g.addColorStop(0, `rgba(${beam},${phase === "night" ? 0.1 : 0.16})`);
        g.addColorStop(1, `rgba(${beam},0)`);
        c.fillStyle = g;
        c.beginPath();
        c.moveTo(w.x - w.w / 2, w.y + w.h);
        c.lineTo(w.x + w.w / 2, w.y + w.h);
        c.lineTo(w.x + w.w / 2 + 70, 230);
        c.lineTo(w.x - w.w / 2 + 70, 230);
        c.closePath();
        c.fill();
      }
      // Dust motes drifting through the room
      for (const m of motes) {
        c.globalAlpha = 0.25 + 0.35 * (Math.sin(t * 1.5 + m.ph) * 0.5 + 0.5);
        r(c, m.x, m.y, 1, 1, "#fff7d6");
      }
      c.restore();

      // Torch flames and their warm glow
      for (const tr of TORCHES) {
        const flick = Math.floor(Math.sin(t * 11 + tr.x) * 1.4 + 1.4);
        r(c, tr.x - 3, tr.y - 8, 6, 6, "#ea580c");
        r(c, tr.x - 2, tr.y - 11 - flick, 4, 8, "#f97316");
        r(c, tr.x - 1, tr.y - 13 - flick, 2, 8, "#fbbf24");
        r(c, tr.x, tr.y - 14 - flick, 1, 4, "#fef08a");
      }
      c.save();
      for (const tr of TORCHES) {
        const flicker = 0.88 + Math.sin(t * 7 + tr.x) * 0.12;
        for (let i = 4; i >= 1; i--) {
          c.globalAlpha = 0.04 * flicker;
          c.fillStyle = "#fb923c";
          c.beginPath();
          c.arc(tr.x, tr.y - 4, i * 22, 0, Math.PI * 2);
          c.fill();
        }
      }
      // Fireflies
      for (const f of flies) {
        const x = f.x + Math.sin(t * f.sp + f.ph) * 16;
        const y = f.y + Math.cos(t * f.sp * 0.8 + f.ph) * 9;
        const a = 0.35 + 0.65 * (Math.sin(t * 3 + f.ph) * 0.5 + 0.5);
        c.globalAlpha = a * 0.22;
        r(c, x - 2, y - 2, 6, 6, "#fde68a");
        c.globalAlpha = a;
        r(c, x, y, 2, 2, "#fef08a");
      }
      c.restore();

      // Soft vignette so the middle of the room reads as the lit area.
      const g = c.createRadialGradient(W / 2, H / 2 + 10, 150, W / 2, H / 2 + 10, 330);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(5,2,8,0.55)");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
    },
  };
}
