import PriorityBadge from "./PriorityBadge.jsx";
import AtRiskBadge from "./AtRiskBadge.jsx";
import { daysRemaining, formatDue, statusLabel } from "../utils/dates.js";

export default function AssignmentTable({ rows, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 shadow-lg shadow-black/20">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-950/80 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Days</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {rows.map((a) => {
              const dr = daysRemaining(a.due_date);
              return (
                <tr key={a.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-medium text-white">{a.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span>{a.course_name}</span>
                      <AtRiskBadge grade={a.current_grade} />
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDue(a.due_date)}</td>
                  <td className="px-4 py-3">{dr}</td>
                  <td className="px-4 py-3">{a.weight}%</td>
                  <td className="px-4 py-3">{a.current_grade}%</td>
                  <td className="px-4 py-3">{statusLabel(a.status)}</td>
                  <td className="px-4 py-3">
                    <PriorityBadge score={a.priority_score} />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onEdit(a)}
                      className="mr-2 rounded-lg bg-indigo-600 px-2 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(a)}
                      className="rounded-lg border border-slate-700 px-2 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                  No assignments match your filters. Try adjusting filters or add a new assignment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
