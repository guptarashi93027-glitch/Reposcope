"""
RepoScope Backend — Flask + PyDriller + GitHub API fallback
- PRIMARY  : PyDriller (full git history, deep metrics)
- FALLBACK : GitHub REST API (when git can't reach GitHub due to DNS/proxy issues)
"""

import os
import re
import socket
import subprocess
import tempfile
import shutil
import threading
from collections import defaultdict
from datetime import datetime, timezone

import requests as http
from flask import Flask, jsonify, request
from flask_cors import CORS
from pydriller import Repository


app = Flask(__name__)
CORS(app)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

PALETTE = ["#6E62C4", "#4A729B", "#3B9A7E", "#C48431", "#C15F4E", "#8A7FD3", "#5C87B0", "#4FAF93"]

BOT_PATTERNS = [
    "bot", "dependabot", "github-actions", "renovate", "greenkeeper",
    "snyk", "semantic-release", "[bot]", "noreply", "actions-user",
]

# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

def _is_bot(name: str, email: str) -> bool:
    combined = (name + " " + email).lower()
    return any(p in combined for p in BOT_PATTERNS)


def _make_initials(name: str) -> str:
    parts = (name or "?").strip().split()
    if len(parts) >= 2:
        return (parts[0][0] + parts[-1][0]).upper()
    if parts and len(parts[0]) >= 2:
        return parts[0][:2].upper()
    return "??"


def _risk(changes: int) -> str:
    if changes >= 30: return "High"
    if changes >= 15: return "Medium"
    return "Low"


def _parse_github_url(url: str):
    """Return (owner, repo) from a GitHub URL, or (None, None)."""
    m = re.search(r"github\.com[/:]([^/]+)/([^/?.#]+)", url)
    if m:
        return m.group(1), m.group(2).replace(".git", "")
    return None, None


# ---------------------------------------------------------------------------
# Network + git diagnostics
# ---------------------------------------------------------------------------

def _git_can_reach_github() -> bool:
    """Quick DNS + TCP check — does not require git itself."""
    try:
        socket.setdefaulttimeout(5)
        socket.getaddrinfo("github.com", 443)
        return True
    except OSError:
        return False


def _fix_git_windows_ssl():
    """
    On Windows, git sometimes ships its own OpenSSL that ignores the system
    proxy / cert store.  Switching to the native 'schannel' backend fixes
    most DNS and SSL issues without disabling security.
    """
    try:
        subprocess.run(
            ["git", "config", "--global", "http.sslBackend", "schannel"],
            capture_output=True, timeout=5,
        )
    except Exception:
        pass


# ---------------------------------------------------------------------------
# Strategy A — PyDriller (full data, requires git clone)
# ---------------------------------------------------------------------------

def _mine_via_pydriller(repo_url: str) -> dict:
    """Clone the repo into a temp dir and mine with PyDriller."""

    tmpdir = tempfile.mkdtemp(prefix="reposcope_")
    try:
        commits_raw = []
        file_changes = defaultdict(
            lambda: {"changes": 0, "contributors": set(), "added": 0, "removed": 0}
        )
        dev_by_email: dict[str, dict] = {}
        monthly = defaultdict(lambda: {"commits": 0, "files": set()})

        for commit in Repository(repo_url, clone_repo_to=tmpdir).traverse_commits():
            dt: datetime = commit.committer_date
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)

            raw_name  = (commit.author.name  or "").strip()
            raw_email = (commit.author.email or "unknown@unknown").lower().strip()
            identity  = raw_email if raw_email != "unknown@unknown" else raw_name or "unknown"
            display   = raw_name or raw_email.split("@")[0] or "Unknown"

            month_key = dt.strftime("%b '%y")
            monthly[month_key]["commits"] += 1

            if identity not in dev_by_email:
                dev_by_email[identity] = {
                    "name": display, "email": raw_email,
                    "commits": 0, "is_bot": _is_bot(display, raw_email),
                }
            if len(display) > len(dev_by_email[identity]["name"]):
                dev_by_email[identity]["name"] = display
            dev_by_email[identity]["commits"] += 1

            commits_raw.append({
                "hash":    commit.hash[:7],
                "message": commit.msg.split("\n")[0][:80],
                "author":  display,
                "date":    dt.isoformat(),
                "added":   commit.insertions,
                "removed": commit.deletions,
            })

            for mod in commit.modified_files:
                fname = mod.new_path or mod.old_path or "unknown"
                fc = file_changes[fname]
                fc["changes"] += 1
                fc["contributors"].add(identity)
                fc["added"]   += mod.added_lines
                fc["removed"] += mod.deleted_lines
                monthly[month_key]["files"].add(fname)

        # ── Developers ──────────────────────────────────────────────────────
        human_devs = {k: v for k, v in dev_by_email.items() if not v["is_bot"]}
        bot_devs   = {k: v for k, v in dev_by_email.items() if v["is_bot"]}
        sorted_devs = sorted(human_devs.items(), key=lambda x: x[1]["commits"], reverse=True)
        total_commits = sum(v["commits"] for v in dev_by_email.values())

        developers = []
        for idx, (_, info) in enumerate(sorted_devs[:12]):
            developers.append({
                "name":     info["name"],
                "email":    info["email"],
                "commits":  info["commits"],
                "pct":      round(info["commits"] / total_commits * 100, 1) if total_commits else 0,
                "color":    PALETTE[idx % len(PALETTE)],
                "initials": _make_initials(info["name"]),
            })

        # ── Hotspots ────────────────────────────────────────────────────────
        hotspots = sorted(
            [{
                "file":         f,
                "changes":      d["changes"],
                "risk":         _risk(d["changes"]),
                "contributors": len(d["contributors"]),
                "added":        d["added"],
                "removed":      d["removed"],
                "note": (
                    "Frequently modified — may need refactoring attention." if d["changes"] >= 30
                    else "Moderate churn — watch for hidden coupling." if d["changes"] >= 15
                    else "Stable module with low change frequency."
                ),
            } for f, d in file_changes.items()],
            key=lambda x: x["changes"], reverse=True,
        )[:10]

        # ── Growth series ────────────────────────────────────────────────────
        sorted_months = sorted(
            monthly.keys(), key=lambda m: datetime.strptime(m, "%b '%y")
        )
        cumulative_commits, cumulative_files = 0, set()
        growth_series = []
        for m in sorted_months:
            cumulative_commits += monthly[m]["commits"]
            cumulative_files   |= monthly[m]["files"]
            growth_series.append({
                "month":   m,
                "commits": cumulative_commits,
                "files":   len(cumulative_files),
            })

        recent = sorted(commits_raw, key=lambda c: c["date"], reverse=True)[:10]
        unique_files = len(file_changes)
        first_date   = commits_raw[-1]["date"][:7] if commits_raw else "N/A"

        return {
            "source":     "pydriller",
            "repository": {
                "url":          repo_url,
                "commits":      total_commits,
                "developers":   len(human_devs),
                "files":        unique_files,
                "activeMonths": len(monthly),
                "since":        first_date,
                "sparkline":    [g["commits"] for g in growth_series[-14:]],
            },
            "developers":    developers,
            "hotspots":      hotspots,
            "recentCommits": recent,
            "growthSeries":  growth_series,
            "stats": {
                "totalDevelopers": len(dev_by_email),
                "humanDevelopers": len(human_devs),
                "botAccounts":     len(bot_devs),
            },
            "pulse": {
                "commits":    {"value": total_commits, "trend": [g["commits"] for g in growth_series[-12:]]},
                "developers": {"value": len(human_devs), "activeRecently": min(3, len(human_devs))},
                "files":      {"value": unique_files,
                               "modifiedThisMonth": len(monthly[sorted_months[-1]]["files"]) if sorted_months else 0},
                "hotspots":   {"value": len(hotspots),
                               "highRisk": sum(1 for h in hotspots if h["risk"] == "High")},
                "activeAge":  {"value": f"{len(monthly)} months", "since": first_date},
            },
        }
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


# ---------------------------------------------------------------------------
# Strategy B — GitHub REST API (no git clone, works when git has DNS issues)
# ---------------------------------------------------------------------------

def _github_session() -> http.Session:
    sess = http.Session()
    sess.headers.update({
        "Accept":     "application/vnd.github.v3+json",
        "User-Agent": "RepoScope/1.0",
    })
    token = os.environ.get("GITHUB_TOKEN", "")
    if token:
        sess.headers["Authorization"] = f"Bearer {token}"
    return sess


def _mine_via_github_api(repo_url: str) -> dict:
    """Mine a GitHub repo using the REST API (no git required)."""
    owner, repo_name = _parse_github_url(repo_url)
    if not owner or not repo_name:
        raise ValueError(f"Cannot parse GitHub URL: {repo_url}")

    BASE = f"https://api.github.com/repos/{owner}/{repo_name}"
    sess = _github_session()

    # 1. Repo info ─────────────────────────────────────────────────────────
    r = sess.get(BASE, timeout=15)
    if not r.ok:
        raise RuntimeError(f"GitHub API {r.status_code}: {r.json().get('message', r.text)}")
    repo_info = r.json()

    # 2. Contributors ───────────────────────────────────────────────────────
    contribs = []
    for page in range(1, 5):   # up to 400 contributors
        r = sess.get(f"{BASE}/contributors?per_page=100&page={page}&anon=false", timeout=15)
        if not r.ok:
            break
        batch = r.json()
        if not batch:
            break
        contribs.extend(batch)
        if len(batch) < 100:
            break

    total_contrib_commits = sum(c.get("contributions", 0) for c in contribs)

    human_contribs, bot_count = [], 0
    for c in contribs:
        login = c.get("login", "") or ""
        if _is_bot(login, f"{login}@users.noreply.github.com") or c.get("type") == "Bot":
            bot_count += 1
        else:
            human_contribs.append(c)

    developers = []
    for idx, c in enumerate(human_contribs[:12]):
        login   = c.get("login", "Unknown")
        cnt     = c.get("contributions", 0)
        developers.append({
            "name":       login,
            "email":      f"{login}@users.noreply.github.com",
            "commits":    cnt,
            "pct":        round(cnt / total_contrib_commits * 100, 1) if total_contrib_commits else 0,
            "color":      PALETTE[idx % len(PALETTE)],
            "initials":   _make_initials(login),
            "avatar":     c.get("avatar_url", ""),
            "profileUrl": c.get("html_url", ""),
        })

    # 3. Recent commits ─────────────────────────────────────────────────────
    recent_raw, monthly = [], defaultdict(lambda: {"commits": 0})
    for page in range(1, 6):   # up to 500 commits
        r = sess.get(f"{BASE}/commits?per_page=100&page={page}", timeout=30)
        if not r.ok:
            break
        batch = r.json()
        if not batch:
            break
        for commit in batch:
            a    = (commit.get("commit") or {}).get("author") or {}
            name = a.get("name", "Unknown")
            date = a.get("date", "")
            try:
                dt = datetime.fromisoformat(date.replace("Z", "+00:00"))
            except Exception:
                dt = datetime.now(timezone.utc)
            monthly[dt.strftime("%b '%y")]["commits"] += 1
            recent_raw.append({
                "hash":    (commit.get("sha") or "")[:7],
                "message": (commit.get("commit") or {}).get("message", "").split("\n")[0][:80],
                "author":  name,
                "date":    dt.isoformat(),
                "added":   0,
                "removed": 0,
            })
        if len(batch) < 100:
            break

    recent_commits = recent_raw[:10]

    # 4. Weekly commit activity for growth series ────────────────────────────
    growth_series = []
    r = sess.get(f"{BASE}/stats/commit_activity", timeout=30)
    if r.ok and isinstance(r.json(), list):
        cumulative = 0
        seen: dict[str, int] = {}
        for week in r.json():
            cumulative += week.get("total", 0)
            dt = datetime.fromtimestamp(week.get("week", 0), tz=timezone.utc)
            key = dt.strftime("%b '%y")
            seen[key] = cumulative
        growth_series = [{"month": k, "commits": v, "files": 0} for k, v in seen.items()]

    created_at = (repo_info.get("created_at") or "")[:7]
    languages  = list((sess.get(f"{BASE}/languages", timeout=10).json() or {}).keys())

    return {
        "source":     "github_api",
        "repository": {
            "url":          repo_url,
            "commits":      total_contrib_commits,
            "developers":   len(developers),
            "files":        repo_info.get("size", 0),
            "activeMonths": len(monthly),
            "since":        created_at,
            "sparkline":    [g["commits"] for g in growth_series[-14:]],
            "description":  repo_info.get("description", ""),
            "language":     repo_info.get("language", ""),
            "languages":    languages,
            "stars":        repo_info.get("stargazers_count", 0),
            "forks":        repo_info.get("forks_count", 0),
        },
        "developers":    developers,
        "hotspots":      [],          # not available without cloning
        "recentCommits": recent_commits,
        "growthSeries":  growth_series,
        "stats": {
            "totalDevelopers": len(contribs),
            "humanDevelopers": len(developers),
            "botAccounts":     bot_count,
            "dataSource":      "GitHub REST API (git clone unavailable on this machine)",
        },
        "pulse": {
            "commits":    {"value": total_contrib_commits,
                           "trend": [g["commits"] for g in growth_series[-12:]]},
            "developers": {"value": len(developers), "activeRecently": min(3, len(developers))},
            "files":      {"value": repo_info.get("size", 0), "modifiedThisMonth": 0},
            "hotspots":   {"value": 0, "highRisk": 0},
            "activeAge":  {"value": f"{len(monthly)} months", "since": created_at},
        },
    }


# ---------------------------------------------------------------------------
# Main mining entry-point — tries PyDriller first, falls back to API
# ---------------------------------------------------------------------------

def _mine_repo(repo_url: str) -> dict:
    is_github = "github.com" in repo_url

    # Step 1: try to fix git SSL on Windows
    _fix_git_windows_ssl()

    # Step 2: test connectivity
    can_reach = _git_can_reach_github()

    if can_reach:
        # Try PyDriller (full data)
        try:
            return _mine_via_pydriller(repo_url)
        except Exception as pydriller_err:
            if is_github:
                # PyDriller failed — try GitHub API as fallback
                try:
                    result = _mine_via_github_api(repo_url)
                    result["warning"] = f"PyDriller failed ({pydriller_err}); using GitHub API — hotspot data unavailable."
                    return result
                except Exception as api_err:
                    raise RuntimeError(
                        f"Both mining methods failed.\n"
                        f"PyDriller: {pydriller_err}\n"
                        f"GitHub API: {api_err}"
                    )
            raise
    else:
        # git can't reach github.com — go straight to API
        if is_github:
            try:
                result = _mine_via_github_api(repo_url)
                result["warning"] = (
                    "git cannot resolve github.com on this machine (DNS/proxy issue). "
                    "Using GitHub REST API instead — hotspot data unavailable. "
                    "To fix: run  git config --global http.sslBackend schannel  in a terminal."
                )
                return result
            except Exception as api_err:
                raise RuntimeError(
                    f"git cannot reach github.com AND GitHub API also failed: {api_err}"
                )
        else:
            raise RuntimeError(
                "Cannot reach github.com. Check your internet / DNS settings. "
                "Fix: git config --global http.sslBackend schannel"
            )


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health():
    can_reach = _git_can_reach_github()
    return jsonify({
        "status":        "ok",
        "github_reachable": can_reach,
        "note": "ok" if can_reach else "git cannot resolve github.com — will use GitHub API fallback",
    })


@app.post("/api/analyze")
def analyze():
    """Body: { "url": "https://github.com/owner/repo" }"""
    body = request.get_json(silent=True) or {}
    url  = (body.get("url") or "").strip()
    if not url:
        return jsonify({"error": "Missing 'url' field"}), 400
    if "github.com" not in url:
        return jsonify({"error": "Only GitHub URLs are supported"}), 400
    try:
        return jsonify(_mine_repo(url))
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.get("/api/analyze")
def analyze_get():
    """GET /api/analyze?url=https://github.com/owner/repo"""
    url = (request.args.get("url") or "").strip()
    if not url:
        return jsonify({"error": "Missing 'url' query parameter"}), 400
    try:
        return jsonify(_mine_repo(url))
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[RepoScope] Starting on http://localhost:{port}")
    _fix_git_windows_ssl()    # apply git fix at startup
    can_reach = _git_can_reach_github()
    print(f"[RepoScope] GitHub reachable via git: {can_reach}")
    if not can_reach:
        print("[RepoScope] ⚠ git cannot resolve github.com — will use GitHub API fallback")
    app.run(debug=True, port=port)
