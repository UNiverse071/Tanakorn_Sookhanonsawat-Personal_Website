"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { setViewMode } from "@/lib/view-mode";
import {
  drawArrow,
  drawBackground,
  drawLights,
  drawNpc,
  drawPlant,
  drawPlayer,
  drawStation,
  type Dir,
} from "./draw";
import { panelFor } from "./panels";
import {
  H,
  NPCS,
  PLANTS,
  SOLIDS,
  SPAWN,
  STATIONS,
  W,
  inReach,
  overlaps,
} from "./world";

const SPEED = 64; // logical px per second

const MOVE_KEYS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  KeyA: [-1, 0],
  ArrowRight: [1, 0],
  KeyD: [1, 0],
  ArrowUp: [0, -1],
  KeyW: [0, -1],
  ArrowDown: [0, 1],
  KeyS: [0, 1],
};
const ACTION_KEYS = new Set(["KeyE", "Enter", "Space"]);

type Player = { x: number; y: number; dir: Dir; moving: boolean; walk: number };

function tryMove(p: Player, dx: number, dy: number) {
  const nx = Math.min(W - 12, Math.max(12, p.x + dx));
  const ny = Math.min(206, Math.max(30, p.y + dy));
  const feet = { x: nx - 4, y: ny - 4, w: 8, h: 4 };
  if (!SOLIDS.some((s) => overlaps(feet, s))) {
    p.x = nx;
    p.y = ny;
  }
}

const DPAD: { code: string; label: string; cls: string }[] = [
  { code: "ArrowUp", label: "Move up", cls: "col-start-2 row-start-1" },
  { code: "ArrowLeft", label: "Move left", cls: "col-start-1 row-start-2" },
  { code: "ArrowRight", label: "Move right", cls: "col-start-3 row-start-2" },
  { code: "ArrowDown", label: "Move down", cls: "col-start-2 row-start-3" },
];
const DPAD_ARROW: Record<string, string> = { ArrowUp: "▲", ArrowLeft: "◀", ArrowRight: "▶", ArrowDown: "▼" };

export default function GameWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const keys = useRef(new Set<string>());
  const player = useRef<Player>({ x: SPAWN.x, y: SPAWN.y, dir: "up", moving: false, walk: 0 });
  const openRef = useRef<string | null>(null);
  const nearRef = useRef<string | null>(null);

  const [near, setNear] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const activate = useCallback((id: string) => {
    if (id === "portal") {
      setViewMode("classic");
      return;
    }
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    keys.current.clear();
    player.current.moving = false;
    openRef.current = id;
    setOpenId(id);
  }, []);

  const closePanel = useCallback(() => {
    openRef.current = null;
    setOpenId(null);
    returnFocusRef.current?.focus?.();
  }, []);

  // Move keyboard focus into the dialog when it opens.
  useEffect(() => {
    if (openId) closeRef.current?.focus();
  }, [openId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.imageSmoothingEnabled = false;

    const bg = document.createElement("canvas");
    bg.width = W;
    bg.height = H;
    const bgCtx = bg.getContext("2d");
    if (!bgCtx) return;
    drawBackground(bgCtx);

    let raf = 0;
    let last = performance.now();
    let time = 0;

    const update = (dt: number) => {
      const p = player.current;
      let dx = 0;
      let dy = 0;
      for (const k of keys.current) {
        const m = MOVE_KEYS[k];
        if (m) {
          dx += m[0];
          dy += m[1];
        }
      }
      p.moving = dx !== 0 || dy !== 0;
      if (p.moving) {
        const len = Math.hypot(dx, dy);
        if (dx !== 0) p.dir = dx < 0 ? "left" : "right";
        else p.dir = dy < 0 ? "up" : "down";
        tryMove(p, (dx / len) * SPEED * dt, 0);
        tryMove(p, 0, (dy / len) * SPEED * dt);
        p.walk += dt;
      }

      let best: string | null = null;
      let bestDist = Infinity;
      for (const s of STATIONS) {
        if (!inReach(p.x, p.y, s)) continue;
        const d = Math.hypot(p.x - s.x, p.y - (s.y - 6));
        if (d < bestDist) {
          bestDist = d;
          best = s.id;
        }
      }
      if (best !== nearRef.current) {
        nearRef.current = best;
        setNear(best);
      }
    };

    const render = () => {
      const p = player.current;
      ctx.drawImage(bg, 0, 0);

      const portal = STATIONS.find((s) => s.kind === "portal");
      if (portal) drawStation(ctx, portal, time);

      const items: { y: number; draw: () => void }[] = [];
      for (const s of STATIONS) {
        if (s.kind !== "portal") items.push({ y: s.y, draw: () => drawStation(ctx, s, time) });
      }
      for (const pl of PLANTS) items.push({ y: pl.y, draw: () => drawPlant(ctx, pl.x, pl.y) });
      for (const n of NPCS) items.push({ y: n.y, draw: () => drawNpc(ctx, n.x, n.y, n.color, time, n.phase) });
      items.push({ y: p.y, draw: () => drawPlayer(ctx, p.x, p.y, p.dir, p.moving, p.walk) });
      items.sort((a, b) => a.y - b.y);
      for (const it of items) it.draw();

      const target = STATIONS.find((s) => s.id === nearRef.current);
      if (target) drawArrow(ctx, target.x, target.y - (target.kind === "portal" ? 22 : 38), time);

      drawLights(ctx, time);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      if (!openRef.current) update(dt);
      render();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.code === "Escape") {
        if (openRef.current) closePanel();
        return;
      }
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;

      if (MOVE_KEYS[e.code]) {
        if (!openRef.current) {
          keys.current.add(e.code);
          e.preventDefault(); // stop the arrow keys from scrolling the page
        }
        return;
      }
      if (ACTION_KEYS.has(e.code)) {
        // Let Enter/Space activate a focused button or link as usual.
        if (e.code !== "KeyE" && target?.closest("button, a")) return;
        if (openRef.current || !nearRef.current) return;
        e.preventDefault();
        activate(nearRef.current);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.code);
    };
    const clearKeys = () => keys.current.clear();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);
    const pressed = keys.current;
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearKeys);
      pressed.clear();
    };
  }, [activate, closePanel]);

  const openStation = STATIONS.find((s) => s.id === openId);
  const panel = openStation ? panelFor(openStation) : null;
  const nearStation = STATIONS.find((s) => s.id === near);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6">
      <div>
        <h1 className="font-pixel text-base leading-6 sm:text-lg">Home Base</h1>
        <p className="mt-1 text-sm text-muted">
          Move with the <kbd className="rounded border border-line bg-surface-2 px-1">arrow keys</kbd> or{" "}
          <kbd className="rounded border border-line bg-surface-2 px-1">WASD</kbd>. Stand next to an object and
          press <kbd className="rounded border border-line bg-surface-2 px-1">E</kbd> to open it — or just click
          its name. Each object is one of my projects.
        </p>
      </div>

      <div
        className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-xl border-4 border-[#2a1f33] bg-black shadow-xl [container-type:inline-size]"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          role="img"
          aria-label="A pixel-art home base. Walk the knight up to an object to open one of Tanakorn's projects."
          className="pixelated absolute inset-0 h-full w-full"
        />

        {STATIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => activate(s.id)}
            style={{
              left: `${(s.x / W) * 100}%`,
              top: `${((s.y + 3) / H) * 100}%`,
              fontSize: "clamp(6px, 1cqw, 10px)",
            }}
            className={`font-pixel absolute -translate-x-1/2 whitespace-nowrap rounded px-[0.6em] py-[0.4em] leading-none transition-colors ${
              near === s.id
                ? "bg-amber-400 text-black"
                : "bg-black/55 text-amber-100/90 hover:bg-black/80"
            }`}
          >
            {s.label}
          </button>
        ))}

        {/* On-screen controls for touch devices */}
        <div className="absolute bottom-2 left-2 hidden touch-none grid-cols-3 grid-rows-3 gap-1 [@media(pointer:coarse)]:grid">
          {DPAD.map(({ code, label, cls }) => (
            <button
              key={code}
              type="button"
              aria-label={label}
              onPointerDown={() => {
                if (!openRef.current) keys.current.add(code);
              }}
              onPointerUp={() => keys.current.delete(code)}
              onPointerLeave={() => keys.current.delete(code)}
              onPointerCancel={() => keys.current.delete(code)}
              onContextMenu={(e) => e.preventDefault()}
              className={`${cls} size-10 select-none rounded-md bg-black/60 text-sm text-amber-100 active:bg-amber-400 active:text-black`}
            >
              {DPAD_ARROW[code]}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Interact"
          onClick={() => nearRef.current && !openRef.current && activate(nearRef.current)}
          className="font-pixel absolute bottom-3 right-3 hidden size-14 select-none rounded-full bg-amber-400 text-lg text-black active:bg-amber-300 [@media(pointer:coarse)]:block"
        >
          E
        </button>

        {panel && (
          <div
            className="absolute inset-0 z-20 grid place-items-center bg-black/60 p-3"
            onClick={closePanel}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="game-panel-title"
              onClick={(e) => e.stopPropagation()}
              className="max-h-full w-full max-w-md overflow-y-auto rounded-lg border-4 border-amber-500 bg-[#1a1220] p-4 text-[#f3e9dc] shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 id="game-panel-title" className="font-pixel text-[0.7rem] leading-5 text-amber-300 sm:text-xs">
                  {panel.title}
                </h2>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closePanel}
                  aria-label="Close"
                  className="rounded bg-white/10 px-2 py-0.5 text-sm hover:bg-white/20"
                >
                  ✕
                </button>
              </div>
              {panel.meta && <p className="mt-1 text-xs text-amber-100/70">{panel.meta}</p>}
              {panel.tags && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {panel.tags.map((t) => (
                    <li key={t} className="rounded bg-white/10 px-2 py-0.5 text-xs">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3 space-y-2 text-sm leading-6 text-[#e7dccf]">
                {panel.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              {panel.links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {panel.links.map((l) => {
                    const cls = `rounded px-3 py-1.5 text-sm font-semibold ${
                      l.primary
                        ? "bg-amber-400 text-black hover:bg-amber-300"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`;
                    return l.external || l.href.startsWith("mailto:") ? (
                      <a
                        key={l.label}
                        href={l.href}
                        className={cls}
                        {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link key={l.label} href={l.href} className={cls}>
                        {l.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <p aria-live="polite" className="min-h-6 text-center text-sm text-muted">
        {nearStation
          ? nearStation.id === "portal"
            ? "Press E to return to the dashboard view."
            : `Press E to open “${nearStation.label}”.`
          : "Walk up to an object to interact with it."}
      </p>
    </main>
  );
}
