# RepoScope

**A Git repository mining and software evolution analytics platform.**

RepoScope takes a public GitHub repository URL, mines its history, and presents the results in a clean dashboard: who contributes, which files change most, how the project grows over time, and what has happened recently.

The project has two parts:

- **Frontend:** a React dashboard for exploring the results
- **Backend:** a Flask API that mines repositories with PyDriller, with an automatic GitHub REST API fallback

---

## Features

### Live repository analysis (powered by the backend)

- **Project Pulse:** total commits, developers, files, hotspots, and project age
- **Developer Observatory:** top contributors with commit counts and percentage share, with bot accounts filtered out
- **Code Hotspots:** the most frequently changed files, each rated High, Medium, or Low risk based on change count
- **Repository Growth:** cumulative commits and files tracked month by month
- **Recent Commits:** the latest commits with author, date, and lines added or removed
- **Resilient Mining:** if a git clone is not possible, the backend falls back to the GitHub REST API and returns a clear warning

### Dashboard experience

- **Evolution Timeline** and **Productivity Heatmap**
- **Then vs Now** comparison and **Compare Evolution** modal
- **AI Project Story** and **Ask RepoScope AI** panel
- **Time Travel** slider over repository history
- **Multiple pages:** Landing, Dashboard, Timeline, Developers, Code Health, and AI Insights

> Some dashboard sections currently run on mock data from `frontend/src/data/mockData.js` while the backend integration is extended. The AI features use simulated responses.

---

## Architecture

```
React Dashboard  ->  Flask API  ->  PyDriller (git clone)  ->  JSON response
                                 \->  GitHub REST API (fallback)
```

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS v3, Recharts, Framer Motion, React Router, Lucide React |
| Backend | Python, Flask, Flask-CORS |
| Mining | PyDriller, GitPython |
| Fallback data source | GitHub REST API via `requests` |

### Mining strategy

1. **Primary: PyDriller.** The repository is cloned to a temporary folder and mined for full commit history, per-file changes, and line statistics. The temporary clone is deleted afterwards.
2. **Fallback: GitHub REST API.** Used when git cannot reach GitHub (for example DNS or proxy issues) or when PyDriller fails. Hotspot data is not available in this mode, and commit sampling is limited.

Every response includes a `source` field (`pydriller` or `github_api`) so the frontend knows which mode was used.

---

## Project Structure

```
RepoScope/
├── backend/
│   ├── app.py               # Flask API and mining logic
│   ├── requirements.txt     # Python dependencies
│   └── test_pydriller.py    # Standalone PyDriller smoke test
├── frontend/                # React + Vite dashboard
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── data/            # mockData.js (mock data layer)
│       ├── components/
│       │   ├── layout/      # Sidebar, TopNavbar, AppShell
│       │   └── dashboard/   # One component per dashboard section
│       └── pages/           # Landing, Dashboard, Timeline, Developers, Code Health, AI Insights
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.9 or later
- Node.js 20.19 or later
- Git installed and available on your PATH

### 1. Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the API
python app.py
```

The API runs on `http://localhost:5000` by default. Set the `PORT` environment variable to change it.

### 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The dashboard runs on `http://localhost:5173`. Make sure the backend is running first.

Other useful commands:

```bash
npm run lint      # Lint with oxlint
npm run build     # Production build
npm run preview   # Preview the production build
```

### 3. Optional: GitHub token

The GitHub API fallback is limited to 60 requests per hour without authentication. For higher limits, set a personal access token before starting the backend:

```bash
# Windows (PowerShell)
$env:GITHUB_TOKEN = "your_token_here"

# macOS / Linux
export GITHUB_TOKEN="your_token_here"
```

---

## API Reference

### `GET /api/health`

Checks that the server is running and whether git can reach GitHub.

```json
{
  "status": "ok",
  "github_reachable": true,
  "note": "ok"
}
```

### `POST /api/analyze`

Analyzes a repository.

**Request body**

```json
{ "url": "https://github.com/pallets/flask" }
```

### `GET /api/analyze?url=<repository-url>`

Same as above, using a query parameter.

**Response shape**

| Field | Description |
| --- | --- |
| `source` | `pydriller` or `github_api` |
| `repository` | URL, commit, developer, and file counts, active months, start date, sparkline |
| `developers` | Top contributors with commits, percentage, color, and initials |
| `hotspots` | Most changed files with change count, risk level, contributors, and lines changed |
| `recentCommits` | Latest 10 commits |
| `growthSeries` | Cumulative commits and files per month |
| `stats` | Total, human, and bot developer counts |
| `pulse` | Summary metrics for the dashboard cards |
| `warning` | Present only when a fallback was used |

**Errors**

| Status | Meaning |
| --- | --- |
| `400` | Missing `url`, or the URL is not a GitHub URL |
| `500` | Mining failed (the `error` field explains why) |

---

## Design System

- **Palette:** off-white base with a soft indigo primary and teal, amber, and coral accents
- **Typography:** Newsreader (serif) for display text, Inter for UI text, JetBrains Mono for code and numbers
- **Look and feel:** light, rounded, and minimal, in the style of Linear and Notion

---

## Testing the Mining Layer

To confirm PyDriller works on your machine, run the smoke test from the `backend` folder:

```bash
python test_pydriller.py
```

It traverses the Flask repository and prints each commit hash, author, and message. Note that this walks the full history, so it can take a while.

---

## Troubleshooting

**"git cannot resolve github.com" warning (Windows)**
Run the following in a terminal, then restart the backend:

```bash
git config --global http.sslBackend schannel
```

The backend also applies this setting automatically at startup.

**GitHub API rate limit errors**
Set the `GITHUB_TOKEN` environment variable as described above.

**Hotspots are empty**
This happens when the API fallback is used, because file-level data requires a git clone. Fix the git connectivity issue and analyze again.

**Missing icon build error (frontend)**
The `lucide-react` library no longer ships brand icons such as `Github`. This project uses `GitFork` instead. Swap in an icon from the standard set if you see this error.

**Large repositories are slow**
Full mining clones and walks the entire history. Try a smaller repository first.

---

## Limitations

- Only public GitHub repositories are supported
- The GitHub API fallback samples up to 500 commits and 400 contributors
- No authentication or database; results are computed on demand

---

## Acknowledgements

Repository mining is powered by [PyDriller](https://github.com/ishepard/pydriller), an open-source Python framework for mining software repositories.

---

## License

This project is intended for academic and demonstration purposes.
