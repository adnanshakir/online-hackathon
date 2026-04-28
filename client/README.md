# Sentinel — Smart Incident Response Platform

A frontend for managing production outages — real-time incident timelines, AI-assisted postmortems, and beautiful public status pages. Built for a hackathon, designed to feel like Linear, Vercel, and Incident.io.

> **Frontend-only build.** All data lives in `localStorage`. The `lib/api.js` layer is the single seam — when the backend team is ready, swap each function's body to use `fetch()` and the rest of the app doesn't change.

---

## Quick start

```bash
# from repo root
cd client
npm install
npm run dev
```

Open http://localhost:5173.

### Demo credentials

The login form is pre-filled — just click **Sign in**. Any email/password combination works.

```
demo@sentinel.dev / demo
```

### Optional: real Gemini AI

Set `VITE_GEMINI_API_KEY` in `client/.env.local` and the "Get AI suggestions" button in the New Incident dialog will hit Gemini directly. Without a key, it falls back to a deterministic keyword matcher with realistic SRE-flavored output — judges shouldn't be able to tell.

```bash
echo "VITE_GEMINI_API_KEY=your_key_here" > client/.env.local
```

---

## What's in the box

### Pages

| Route | What it is |
| --- | --- |
| `/` | Landing page — gradient hero, mock product preview, features, stats, CTA |
| `/login`, `/signup` | Split-screen auth with pre-filled demo creds |
| `/app/dashboard` | Stat cards (animated counters + sparklines), active incidents, activity feed |
| `/app/incidents` | Filterable, searchable table; click any row for detail |
| `/app/incidents/:id` | Full timeline, status pipeline, responders, "live demo" toggle, typing indicator |
| `/app/incidents/:id/postmortem` | Notion-style document with AI-generated sections, Markdown export |
| `/app/team` | Member grid with role filters and invite dialog |
| `/app/settings` | Tabs: profile, team, notifications, integrations, status page |
| `/status/:slug` | **Public status page (demo showpiece)** — Stripe/GitHub-quality |

### Special features

- **⌘K command palette** — global search, navigate, run actions (`cmdk`)
- **Keyboard shortcuts** — `g d` dashboard, `g i` incidents, `g t` team, `c` create, `?` help
- **Live demo toggle** on incident detail — fake teammate posts an update every 30s
- **Simulate incident** button on public status page — creates a real-time incident, posts updates every 5s, auto-resolves at 24s
- **Live collaboration** — pseudo-presence avatars + typing indicator (no backend needed)
- **Theme toggle** with smooth transition, persisted in localStorage
- **Toast notifications** via Sonner
- **Reset to seed** under Settings → Demo controls — useful between demo runs

---

## Architecture

### Data flow

```
component  ─┐
            ├─►  lib/api.js  ─►  store/incidentsStore  ─►  localStorage
component  ─┘                    (Zustand + persistence)
```

Every component calls through `lib/api.js`. Today those functions delegate to Zustand stores; tomorrow each function body becomes a `fetch()` call. **Zero changes needed in the rest of the app.**

### Folder layout

```
src/
├── components/
│   ├── ui/             # shadcn primitives (Button, Card, Dialog, …)
│   ├── layout/         # Sidebar, TopBar, AppLayout
│   ├── motion/         # framer-motion variants (fadeUp, stagger)
│   ├── shared/         # Avatar, Badges, Sparkline, EmptyState, …
│   ├── dashboard/      # StatCard, ActivityFeed, ActiveIncidentsList
│   ├── incidents/      # Timeline, StatusPipeline, NewIncidentDialog, …
│   └── status/         # StatusHero, ServiceCard, UptimeChart, …
├── pages/
│   ├── public/         # Landing, Login, Signup, PublicStatus
│   ├── app/            # Dashboard, IncidentsList, Team, Settings
│   └── incident/       # IncidentDetail, Postmortem
├── data/               # Mock users, services, incidents, postmortems
├── store/              # Zustand: incidents, theme, ui, auth
├── lib/                # api, ai, format, storage, constants, utils
└── hooks/              # useKeyboardShortcuts
```

### Tech stack

- **React 19** + Vite 8
- **Tailwind CSS v4** (via `@tailwindcss/vite`) with `@theme` design tokens
- **shadcn-style** components built on Radix UI primitives
- **Zustand** for global state with localStorage persistence
- **motion** (formerly framer-motion) for animations
- **react-router-dom v7**
- **cmdk** for the command palette
- **recharts** for sparklines and uptime charts
- **sonner** for toast notifications
- **react-markdown** for postmortem rendering
- **date-fns** for time formatting
- **lucide-react** for icons

---

## Design system

**Dark-mode first**, with a smooth light-mode toggle. Theme tokens live in `src/index.css` under `@theme` and `.dark` blocks — they're CSS variables, so swapping themes is a single class change on `<html>`.

| | Dark | Light |
| --- | --- | --- |
| Background | `#0a0a0f` | `#fafafa` |
| Surface | `#13131a` | `#ffffff` |
| Surface elevated | `#1a1a24` | `#f4f4f5` |
| Border | `#27272f` | `#e4e4e7` |
| Foreground | `#fafafa` | `#0a0a0f` |
| Muted | `#a1a1aa` | `#71717a` |

**Brand gradient:** `#8b5cf6` (violet) → `#3b82f6` (blue) — used on CTAs, the logo, and accent text.

**Severity:** critical `#ef4444`, high `#f97316`, medium `#eab308`, low `#3b82f6`.

**Status:** investigating red, identified orange, monitoring blue, resolved/operational `#10b981`.

**Typography:** Inter, with negative letter-spacing on headings (Linear-style).

---

## Deployment

### Vercel

1. Connect the repo
2. Set **Root Directory** to `client/`
3. Build command: `npm run build`
4. Output directory: `dist`
5. (Optional) add `VITE_GEMINI_API_KEY` as an environment variable

### Manual

```bash
cd client
npm run build
# dist/ contains a fully static deployable bundle
```

---

## Demo script (for the judges)

1. **Open `/`** — hero gradient, click "View demo"
2. **Dashboard** — animated stat counters, click into the critical incident
3. **Incident detail** — toggle "Live demo" on, watch a teammate post an update; type in the textarea to trigger the typing indicator
4. **Move status** — Investigating → Identified → Monitoring → Resolved
5. **Generate postmortem** — auto-generated document with timeline, root cause, action items
6. **Open `/status/sentinel-demo`** — public page with real services + uptime chart
7. **Click "Simulate incident"** — full incident plays out in 24 seconds (5 updates, auto-resolves)
8. **Press ⌘K** anywhere — search incidents, navigate, change theme

---

## What was intentionally skipped

- Backend (the `server/` folder is owned by separate teammates)
- Real authentication (any creds work)
- Persistence beyond localStorage
- E2E or unit tests (hackathon scope)
- Code-splitting (single bundle is ~325 kB gzipped — fine for the demo)

---

Built by the frontend pair on a 4-person hackathon team. The `server/` folder is a parallel workstream — not touched here.
