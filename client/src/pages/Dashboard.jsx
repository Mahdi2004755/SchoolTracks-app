import React from "react";
import {
  fetchAssignments,
  fetchPriorities,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../api/assignmentsApi.js";
import AssignmentTable from "../components/AssignmentTable.jsx";
import AssignmentCard from "../components/AssignmentCard.jsx";
import AssignmentForm from "../components/AssignmentForm.jsx";
import GradeImpactCalculator from "../components/GradeImpactCalculator.jsx";
import { daysRemaining, statusLabel } from "../utils/dates.js";

const statusOrder = { not_started: 0, in_progress: 1, completed: 2 };

function sortRows(rows, sortBy) {
  const copy = [...rows];
  if (sortBy === "due_date") {
    copy.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  } else if (sortBy === "course") {
    copy.sort((a, b) => a.course_name.localeCompare(b.course_name));
  } else if (sortBy === "weight") {
    copy.sort((a, b) => b.weight - a.weight);
  } else if (sortBy === "priority") {
    copy.sort((a, b) => b.priority_score - a.priority_score);
  } else if (sortBy === "status") {
    copy.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }
  return copy;
}

export default function Dashboard() {
  const [assignments, setAssignments] = React.useState([]);
  const [priorities, setPriorities] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [view, setView] = React.useState("table");
  const [sortBy, setSortBy] = React.useState("priority");
  const [courseFilter, setCourseFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [urgentOnly, setUrgentOnly] = React.useState(false);
  const [highWeightOnly, setHighWeightOnly] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);

  async function loadAll() {
    setError("");
    setLoading(true);
    try {
      const [list, prio] = await Promise.all([fetchAssignments(), fetchPriorities()]);
      setAssignments(list);
      setPriorities(prio);
    } catch (e) {
      setError(e.message || "Could not reach the API. Is the server running on port 4000?");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadAll();
  }, []);

  const courses = React.useMemo(() => {
    const set = new Set(assignments.map((a) => a.course_name));
    return Array.from(set).sort();
  }, [assignments]);

  const filtered = React.useMemo(() => {
    return assignments.filter((a) => {
      if (courseFilter !== "all" && a.course_name !== courseFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (urgentOnly) {
        const dr = daysRemaining(a.due_date);
        if (!(dr <= 7 && dr >= 0)) return false;
      }
      if (highWeightOnly && a.weight < 20) return false;
      return true;
    });
  }, [assignments, courseFilter, statusFilter, urgentOnly, highWeightOnly]);

  const visible = sortRows(filtered, sortBy);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(a) {
    setEditing({
      ...a,
      due_date: a.due_date.slice(0, 10),
    });
    setModalOpen(true);
  }

  async function handleSubmit(payload) {
    if (editing?.id) {
      await updateAssignment(editing.id, payload);
    } else {
      await createAssignment(payload);
    }
    setModalOpen(false);
    setEditing(null);
    await loadAll();
  }

  async function handleDelete(a) {
    if (!window.confirm(`Delete "${a.title}"?`)) return;
    await deleteAssignment(a.id);
    await loadAll();
  }

  const studyPlan = priorities?.todays_study_plan ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 max-w-2xl text-slate-400">
            Track assignments, see urgency and GPA risk together, and let SchoolTracks highlight what
            deserves your next study block.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 hover:bg-indigo-500"
        >
          + Add assignment
        </button>
      </header>

      {error && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      {priorities?.headline && (
        <section className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600/25 via-slate-900 to-slate-900 p-5 shadow-xl shadow-indigo-900/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200">Smart recommendation</p>
          <p className="mt-2 text-lg text-white">{priorities.headline}</p>
        </section>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Today&apos;s study plan</h2>
            <p className="text-sm text-slate-400">Top three open assignments by live priority score.</p>
          </div>
        </div>
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {studyPlan.length === 0 && (
            <li className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400 md:col-span-3">
              {loading ? "Loading your plan…" : "Add assignments to see your top three picks for today."}
            </li>
          )}
          {studyPlan.map((a, idx) => (
            <li
              key={a.id}
              className="flex flex-col rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-300">
                Focus #{idx + 1}
              </span>
              <span className="mt-1 text-base font-semibold text-white">{a.title}</span>
              <span className="text-slate-400">{a.course_name}</span>
              <span className="mt-2 text-xs text-slate-500">
                Priority {a.priority_score.toFixed(1)} · {statusLabel(a.status)}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 lg:col-span-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Filters</h2>
          <label className="block text-sm text-slate-300">
            Course
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500/40 focus:ring-2"
            >
              <option value="all">All courses</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-slate-300">
            Status
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500/40 focus:ring-2"
            >
              <option value="all">All statuses</option>
              <option value="not_started">Not started</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={urgentOnly}
              onChange={(e) => setUrgentOnly(e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
            Due within 7 days
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={highWeightOnly}
              onChange={(e) => setHighWeightOnly(e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
            High weight (≥ 20%)
          </label>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-300">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-500/40 focus:ring-2"
              >
                <option value="due_date">Due date</option>
                <option value="course">Course</option>
                <option value="weight">Weight</option>
                <option value="priority">Priority score</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setView("table")}
                className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                  view === "table"
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-700 text-slate-200 hover:bg-slate-800"
                }`}
              >
                Table
              </button>
              <button
                type="button"
                onClick={() => setView("cards")}
                className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                  view === "cards"
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-700 text-slate-200 hover:bg-slate-800"
                }`}
              >
                Cards
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-400">Loading assignments…</p>
          ) : view === "table" ? (
            <AssignmentTable rows={visible} onEdit={openEdit} onDelete={handleDelete} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {visible.map((a) => (
                <AssignmentCard key={a.id} assignment={a} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </section>

      <GradeImpactCalculator />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl shadow-black/60">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">
                {editing ? "Edit assignment" : "New assignment"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setEditing(null);
                }}
                className="rounded-lg border border-slate-700 px-2 py-1 text-sm text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>
            <AssignmentForm
              initial={editing}
              onCancel={() => {
                setModalOpen(false);
                setEditing(null);
              }}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
