// ---------------------------------------------------------------------------
// DevTime Mini — realistic mock dataset (no backend, all local)
// ---------------------------------------------------------------------------

export const repository = {
  name: "flask",
  fullName: "pallets/flask",
  description: "The Python web framework you actually reach for.",
  tags: ["Python", "Open Source", "Web Framework"],
  commits: 1248,
  developers: 8,
  files: 312,
  activeMonths: 14,
  since: "Aug 2025",
  status: "Analyzed",
  sparkline: [12, 18, 14, 22, 30, 26, 34, 40, 36, 44, 52, 48, 58, 64],
};

export const pulse = {
  commits: { value: 1248, delta: "+12.4%", trend: [8, 12, 10, 16, 14, 20, 18, 24, 22, 28, 26, 32] },
  developers: { value: 8, activeRecently: 3 },
  files: { value: 312, modifiedThisMonth: 42 },
  hotspots: { value: 7, highRisk: 2 },
  activeAge: { value: "14 months", since: "Aug 2025" },
};

export const developers = [
  { name: "Armin", commits: 320, pct: 25.6, color: "#6E62C4", initials: "AR" },
  { name: "David", commits: 210, pct: 16.8, color: "#4A729B", initials: "DV" },
  { name: "Rashi", commits: 142, pct: 11.3, color: "#3B9A7E", initials: "RS" },
  { name: "Aman", commits: 87, pct: 7.0, color: "#C48431", initials: "AM" },
  { name: "Sneha", commits: 76, pct: 6.1, color: "#C15F4E", initials: "SN" },
  { name: "Priya", commits: 61, pct: 4.9, color: "#8A7FD3", initials: "PR" },
  { name: "Karan", commits: 45, pct: 3.6, color: "#5C87B0", initials: "KR" },
  { name: "Vikram", commits: 33, pct: 2.6, color: "#4FAF93", initials: "VK" },
];

export const milestones = [
  { id: "v1.0", label: "Setup", commits: 42, date: "Aug 2025", developers: 2, files: 18,
    detail: "Initial project scaffolding, base routing, and the first working request/response cycle." },
  { id: "v2.0", label: "Auth", commits: 86, date: "Oct 2025", developers: 3, files: 34,
    detail: "Session handling, login flows, and the first authentication middleware landed." },
  { id: "v2.1", label: "API", commits: 143, date: "Dec 2025", developers: 4, files: 61,
    detail: "REST endpoints, request validation, and the first public API surface stabilized." },
  { id: "v3.0", label: "UI", commits: 219, date: "Feb 2026", developers: 6, files: 128,
    detail: "Templating overhaul, static asset pipeline, and a full front-of-house redesign." },
  { id: "v3.1", label: "Refactor", commits: 176, date: "May 2026", developers: 7, files: 204,
    detail: "Module boundaries cleaned up, dead code removed, test coverage pushed past 80%." },
  { id: "v4.0", label: "Stability", commits: 302, date: "Aug 2026", developers: 8, files: 312,
    detail: "Hardening pass — error handling, performance tuning, and long-term maintainability work." },
];

// Productivity heatmap — 7 days x 12 weeks of intensity (0-4)
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function seedRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rand = seedRandom(42);
export const heatmap = days.map((day) => ({
  day,
  weeks: Array.from({ length: 20 }, (_, w) => {
    const weekday = ["Sat", "Sun"].includes(day) ? 0.4 : 1;
    const intensity = Math.min(4, Math.floor(rand() * 4 * weekday + (day === "Thu" ? 0.6 : 0)));
    return {
      week: w,
      intensity,
      commits: intensity * 5 + Math.floor(rand() * 6),
      developers: Math.max(1, Math.floor(intensity * 1.4)),
      files: intensity * 9 + Math.floor(rand() * 10),
    };
  }),
}));

export const hotspots = [
  { file: "auth.py", changes: 42, risk: "High", contributors: 4, added: 1240, removed: 812,
    note: "Frequently modified core files may require additional testing or refactoring attention." },
  { file: "payment.py", changes: 37, risk: "High", contributors: 3, added: 980, removed: 540,
    note: "High churn around payment logic — consider isolating side effects behind clearer interfaces." },
  { file: "app.py", changes: 28, risk: "Medium", contributors: 5, added: 640, removed: 410,
    note: "Central entry point with moderate churn — a natural home for shared regressions." },
  { file: "utils.py", changes: 14, risk: "Low", contributors: 3, added: 210, removed: 96,
    note: "Stable utility module with low change frequency." },
  { file: "config.py", changes: 12, risk: "Low", contributors: 2, added: 160, removed: 58,
    note: "Configuration surface is stable and rarely contested." },
];

export const recentCommits = [
  { hash: "a7f32c", message: "Improve auth token handling", author: "Rashi", time: "2h ago", added: 142, removed: 36 },
  { hash: "d4c91e", message: "Update API documentation", author: "Armin", time: "5h ago", added: 78, removed: 12 },
  { hash: "9e7b1a", message: "Fix login redirect issue", author: "David", time: "1d ago", added: 54, removed: 20 },
  { hash: "9c3bf80", message: "Refactor session logic", author: "Aman", time: "2d ago", added: 98, removed: 31 },
  { hash: "fe91ab", message: "Improve error handling", author: "Sneha", time: "3d ago", added: 63, removed: 18 },
  { hash: "b21f0d", message: "Add rate limiting to API routes", author: "Priya", time: "4d ago", added: 112, removed: 9 },
  { hash: "1a4e77", message: "Clean up dead config flags", author: "Karan", time: "5d ago", added: 21, removed: 87 },
];

export const thenVsNow = {
  then: { commits: 86, developers: 2, files: 42, hotspots: 1, architecture: "Basic" },
  now: { commits: 1248, developers: 8, files: 312, hotspots: 7, architecture: "Modular" },
  growth: { commits: "+1,351%", developers: "+300%", files: "+643%", hotspots: "+600%" },
};

export const growthSeries = [
  { month: "Aug '25", commits: 42, files: 18 },
  { month: "Sep '25", commits: 64, files: 26 },
  { month: "Oct '25", commits: 128, files: 40 },
  { month: "Nov '25", commits: 210, files: 55 },
  { month: "Dec '25", commits: 353, files: 78 },
  { month: "Jan '26", commits: 430, files: 96 },
  { month: "Feb '26", commits: 572, files: 128 },
  { month: "Mar '26", commits: 660, files: 154 },
  { month: "Apr '26", commits: 748, files: 178 },
  { month: "May '26", commits: 924, files: 204 },
  { month: "Jun '26", commits: 1040, files: 236 },
  { month: "Jul '26", commits: 1152, files: 274 },
  { month: "Aug '26", commits: 1248, files: 312 },
];

export const aiStory = {
  body: [
    "The repository evolved from a lightweight microframework into a robust Python web framework. Authentication and routing modules became central areas of development during the major growth phases.",
    "Recent activity shows increased focus on performance, security, and refactoring for long-term maintainability.",
  ],
  keyInsight: "Authentication accounts for 34% of total commits in the last 3 months.",
};

export const timeTravelPoints = [
  { date: "Aug 2025", commits: 86, files: 42, developers: 2 },
  { date: "Oct 2025", commits: 210, files: 55, developers: 3 },
  { date: "Dec 2025", commits: 520, files: 140, developers: 5 },
  { date: "Feb 2026", commits: 748, files: 178, developers: 6 },
  { date: "May 2026", commits: 1040, files: 236, developers: 7 },
  { date: "Aug 2026", commits: 1248, files: 312, developers: 8 },
];

export const suggestedQuestions = [
  "What changed recently?",
  "Which files are hotspots?",
  "Who worked most on authentication?",
  "What was the biggest development phase?",
];

export const mockAnswers = {
  "What changed recently?":
    "In the last week, activity centered on auth.py and app.py — mostly error handling and token refresh fixes, plus a documentation pass on the API routes.",
  "Which files are hotspots?":
    "auth.py and payment.py carry the most churn and are flagged High risk. app.py is Medium — worth watching as the API surface grows.",
  "Who worked most on authentication?":
    "Rashi and Armin account for most of the recent authentication commits, with David contributing the original session-handling groundwork back in v2.0.",
  "What was the biggest development phase?":
    "v4.0 'Stability' is the largest single phase by commit volume — 302 commits focused on hardening, performance, and error handling.",
};
