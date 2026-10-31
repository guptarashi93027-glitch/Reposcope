# DevTime Mini — Frontend

"AI-Powered Git Repository Evolution Analysis System" — frontend only, fully mocked data, no backend required.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Structure

- `src/data/mockData.js` — every number/name on the dashboard lives here. Edit this to reshape the "repository."
- `src/components/layout/` — Sidebar, TopNavbar, AppShell (route wrapper + floating Ask DevTime AI button)
- `src/components/dashboard/` — one component per dashboard section (Project Pulse, Evolution Timeline, Productivity Heatmap, Developer Observatory, Code Hotspots + drawer, Recent Commits, Then vs Now, Repository Growth chart, AI Project Story, Time Travel slider, Compare Evolution modal, Ask DevTime AI panel)
- `src/pages/` — Landing, Dashboard (main, all sections), Timeline, Developers, Code Health, AI Insights

## Notes

- All data is mock — flip through Time Travel, click hotspot rows, drag the slider, it's all wired to local state.
- Repo icon uses `GitFork` from lucide-react since the library dropped brand icons (no `Github` export in this version).
