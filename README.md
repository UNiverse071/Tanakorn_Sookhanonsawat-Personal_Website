# Tanakorn Sookhanonsawat — personal website

Next.js (App Router) + TypeScript + Tailwind CSS, deployed on Vercel.

Two interfaces, switchable from the header:

- **Dashboard** — a card-based layout (inspired by the BetterCanvas extension) with contact details up front and one card per project.
- **Game** — a 2D pixel-art "home base" you walk around with the arrow keys / WASD; every object is a project (press `E` or click its name).

Each project has its own page at `/projects/<slug>`.

## Editing content

- `src/data/projects.ts` — projects (set `repo` to a GitHub URL to show a source link; `null` means "source not published")
- `src/data/profile.ts` — contact info, experience, education, honors, skills
- `src/components/game/world.ts` — where each object sits in the game map

## Develop

```bash
npm install
npm run dev
```

Pushing to `main` redeploys on Vercel.
