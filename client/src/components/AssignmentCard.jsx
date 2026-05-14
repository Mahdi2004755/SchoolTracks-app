import PriorityBadge from "./PriorityBadge.jsx";
import AtRiskBadge from "./AtRiskBadge.jsx";
import { daysRemaining, formatDue, statusLabel } from "../utils/dates.js";

export default function AssignmentCard({ assignment, onEdit, onDelete }) {
  const dr = daysRemaining(assignment.due_date);
  const urgent = dr <= 7 && assignment.status !== "completed";

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-4 shadow-md shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{assignment.course_name}</p>
          <h3 className="text-lg font-semibold text-white">{assignment.title}</h3>
        </div>
        <PriorityBadge score={assignment.priority_score} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <AtRiskBadge grade={assignment.current_grade} />
        {urgent && (
          <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-xs font-semibold text-rose-200 ring-1 ring-inset ring-rose-500/35">
            Due within 7 days
          </span>
        )}
        {assignment.weight >= 20 && (
          <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-xs font-semibold text-violet-200 ring-1 ring-inset ring-violet-500/35">
            High weight (≥20%)
          </span>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
        <div>
          <dt className="text-slate-500">Due</dt>
          <dd className="font-medium text-white">{formatDue(assignment.due_date)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Days left</dt>
          <dd className="font-medium text-white">{dr}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Weight</dt>
          <dd className="font-medium text-white">{assignment.weight}%</dd>
        </div>
        <div>
          <dt className="text-slate-500">Status</dt>
          <dd className="font-medium text-white">{statusLabel(assignment.status)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Course grade</dt>
          <dd className="font-medium text-white">{assignment.current_grade}%</dd>
        </div>
        <div>
          <dt className="text-slate-500">Study hours</dt>
          <dd className="font-medium text-white">{assignment.estimated_hours}h</dd>
        </div>
      </dl>

      {assignment.recommendation && (
        <p className="mt-3 rounded-xl bg-slate-950/70 p-3 text-sm text-slate-300 ring-1 ring-slate-800">
          {assignment.recommendation}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(assignment)}
          className="flex-1 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(assignment)}
          className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
