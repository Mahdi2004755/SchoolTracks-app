# SchoolTracks — Smart Assignment Tracker

SchoolTracks helps students **record assignments**, see **days until each due date**, and get a **priority score** plus plain-language **recommendations** so you know what to work on first. It also builds a **three-item “today’s study plan”** from your highest-priority open work.

---

### Copy into GitHub: repository “About” description

Use this short line in your repo settings (**Gear icon → General → Description** on [SchoolTracks-app](https://github.com/Mahdi2004755/SchoolTracks-app)):

> **Student assignment tracker with smart priority scoring, daily top-3 study plan, filters, sorting, and a grade-impact calculator. Run locally with Node.js: React + Tailwind frontend, Express + SQLite API.**

*(GitHub allows up to 350 characters; the line above is under that limit.)*

---

## What you need first

1. **[Node.js](https://nodejs.org/)** (LTS recommended, v18 or newer). This installs `node` and `npm`.
2. A terminal (PowerShell, Command Prompt, or the built-in terminal in your code editor).
3. This repository cloned or downloaded on your computer.

Check versions:

```bash
node -v
npm -v
```

---

## Install (one time per machine)

Open a terminal in the **project root** (the folder that contains `client/`, `server/`, and `package.json`):

```bash
npm run install:all
```

That installs dependencies for the API, the web app, and the helper script used for `npm run dev`.

---

## Run the app

From the same project root:

```bash
npm run dev
```

Leave this running. It starts:

| Service | URL | Purpose |
|--------|-----|--------|
| **Web app** | [http://localhost:5173](http://localhost:5173) | What you use in the browser |
| **API** | [http://localhost:4000](http://localhost:4000) | Saves assignments (SQLite database) |

**Health check:** open [http://localhost:4000/health](http://localhost:4000/health) — you should see JSON like `{"ok":true,"service":"SchoolTracks API"}`.

If the page says it cannot load assignments, the API is probably not running or port `4000` is blocked — fix `npm run dev` first.

**Stop the app:** in the terminal, press `Ctrl+C`.

---

## How to use SchoolTracks (for students)

### Layout

- **Left sidebar (desktop)** or **top area (mobile):** switch between **Dashboard** and **Grade impact calculator**.
- The **Dashboard** is where you manage assignments. The calculator is a separate quick tool (also duplicated at the bottom of the dashboard).

### Add an assignment

1. Click **+ Add assignment**.
2. Fill in the form:
   - **Title** — e.g. “Midterm”, “Lab report”.
   - **Course name** — e.g. “BIOL 1101”.
   - **Due date** — pick the deadline.
   - **Weight (% of final grade)** — how much this item counts (0–100).
   - **Current grade in course (%)** — your overall standing in that class (used for “at risk” and priority).
   - **Expected grade on this assignment (%)** — what you think you might get; used for the impact-style math on the dashboard.
   - **Completion status** — *Not started*, *In progress*, or *Completed*.
   - **Estimated study hours** — how long you think the work will take.
3. Click **Add assignment**. The list updates and **priority** and **recommendations** refresh automatically.

**Tip:** When something is fully done, set status to **Completed**. Completed items get **priority 0** and drop out of the “today’s study plan” so the app focuses on what is left.

### Read the dashboard

- **Smart recommendation** — one highlighted sentence based on your data (due soon, heavy weight, low course grade, etc.).
- **Today’s study plan** — the **top three** open assignments by priority score. Treat these as suggested focus blocks for today.
- **Filters**
  - **Course** — show one class only.
  - **Status** — not started / in progress / completed.
  - **Due within 7 days** — only soon deadlines.
  - **High weight (≥ 20%)** — only big pieces of the grade.
- **Sort by** — due date, course name, weight, **priority score**, or status.
- **Table vs Cards** — same data; pick the view you like.

### Priority score and badges

- **Priority** is a **0–100** score (higher = tackle sooner). **Completed** work shows **0**.
- **At risk** appears when your **current course grade** is below **60%** — a nudge to protect GPA in that class.
- Other small tags call out **due within 7 days** or **high weight** on cards when relevant.

### Edit or delete

- **Edit** opens the same form with saved values; save to update.
- **Delete** asks for confirmation, then removes the row permanently.

### Grade impact calculator

Formula used in the UI (simple planning number, not a full transcript model):

**estimated impact points ≈ assignment weight (%) × expected grade (0–100 scale)**

Example: 25% weight × 88 expected → `25 × 88 = 2200` style “points” for comparison between assignments. Adjust the two sliders/inputs to compare scenarios.

---

## Where your data is stored

SQLite file (created automatically):

`server/data/assignments.db`

It is listed in `.gitignore` so your grades and titles are **not** pushed to GitHub by default.

---

## Production build (optional)

Build the React app for static hosting:

```bash
npm run build
```

Output is in `client/dist/`. You would still need the API running somewhere and configure the frontend to call that API URL (advanced; local dev does not require this).

---

## REST API (for developers)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/assignments` | List assignments (priority scores refreshed) |
| `POST` | `/assignments` | Create assignment |
| `PUT` | `/assignments/:id` | Update assignment |
| `DELETE` | `/assignments/:id` | Delete assignment |
| `GET` | `/assignments/priorities` | Headline, sorted open work, top 3 “today’s plan” |
| `GET` | `/assignments/impact-preview?weight=&expected_grade=` | Optional impact helper |

Priority math and comments live in `server/services/priorityService.js`.

---

## Troubleshooting

| Problem | What to try |
|--------|-------------|
| `npm` is not recognized | Install Node.js from [nodejs.org](https://nodejs.org/) and reopen the terminal. |
| Blank errors in the browser | Confirm `npm run dev` is running and visit `/health` on port 4000. |
| Port 4000 or 5173 in use | Close other apps using those ports, or change `PORT` in `server/index.js` and the `proxy` in `client/vite.config.js` to match. |
| `better-sqlite3` install errors on Windows | Install **“Desktop development with C++”** in Visual Studio Build Tools, or use Node LTS; see [better-sqlite3](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/troubleshooting.md) troubleshooting. |
| **Extra names under “Contributors” on GitHub** | Contributors come from **commit metadata** (for example a `Co-authored-by:` line in the commit message). Use commits that only list you as author, or turn off your editor’s option to append co-authors to commits, then push again. |

---


## Author

[Mahdi2004755 / SchoolTracks-app on GitHub](https://github.com/Mahdi2004755/SchoolTracks-app)
