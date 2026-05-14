export function daysRemaining(dueDateIso) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDateIso);
  due.setHours(0, 0, 0, 0);
  return Math.round((due - now) / (1000 * 60 * 60 * 24));
}

export function formatDue(dueDateIso) {
  const d = new Date(dueDateIso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function statusLabel(status) {
  if (status === "not_started") return "Not started";
  if (status === "in_progress") return "In progress";
  if (status === "completed") return "Completed";
  return status;
}

/** Client-side mirror of server formula for the calculator UI */
export function gradeImpact(weightPercent, expectedGrade) {
  const w = Number(weightPercent) || 0;
  const e = Number(expectedGrade) || 0;
  return Math.round(w * e * 100) / 100;
}
