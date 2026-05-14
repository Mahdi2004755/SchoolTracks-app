export default function AtRiskBadge({ grade }) {
  const g = Number(grade);
  if (Number.isNaN(g) || g >= 60) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-orange-500/15 px-2 py-0.5 text-xs font-semibold text-orange-200 ring-1 ring-inset ring-orange-500/40">
      At risk ({g}%)
    </span>
  );
}
