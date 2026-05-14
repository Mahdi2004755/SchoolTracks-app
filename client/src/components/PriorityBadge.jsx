export default function PriorityBadge({ score }) {
  const n = Number(score) || 0;
  let tone = "bg-slate-700 text-slate-200 ring-slate-600";
  if (n >= 75) tone = "bg-rose-500/15 text-rose-200 ring-rose-500/40";
  else if (n >= 50) tone = "bg-amber-500/15 text-amber-200 ring-amber-500/40";
  else if (n > 0) tone = "bg-emerald-500/15 text-emerald-200 ring-emerald-500/35";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tone}`}
    >
      Priority {n.toFixed(1)}
    </span>
  );
}
