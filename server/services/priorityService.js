/**
 * Priority scoring for Smart Assignment Tracker
 * ---------------------------------------------
 * We combine several signals so students see a single "priority_score" (0–100).
 *
 * Signals:
 * 1) Due date urgency — due sooner → higher score (past due is treated as maximum urgency).
 * 2) Weight — heavier assignments usually move the final grade more → higher score.
 * 3) Current grade risk — lower course average → student is "at risk" → higher score.
 * 4) Estimated study hours — larger effort needs earlier attention → modest boost.
 * 5) Completion status — "not_started" > "in_progress" > "completed" (completed → 0).
 *
 * Weights below are tuned so no single factor dominates; adjust MAX_* constants to taste.
 */

const MAX_URGENCY = 40;
const MAX_WEIGHT = 25;
const MAX_RISK = 25;
const MAX_HOURS = 10;
const STATUS_NOT_STARTED = 5;
const STATUS_IN_PROGRESS = 2;

/** Days from now until due (can be negative if overdue) */
function daysUntilDue(dueDateIso) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDateIso);
  due.setHours(0, 0, 0, 0);
  return (due - now) / (1000 * 60 * 60 * 24);
}

/**
 * Urgency grows as the due date approaches. Past due = full urgency slice.
 * Soft decay over ~30 days so far-future work is still visible but lower urgency.
 */
function urgencyPoints(dueDateIso) {
  const days = daysUntilDue(dueDateIso);
  if (days <= 0) return MAX_URGENCY;
  const t = Math.min(1, days / 30);
  return MAX_URGENCY * (1 - t);
}

/** Weight is stored as a percentage (e.g. 25 = 25%) */
function weightPoints(weightPercent) {
  const w = Math.max(0, Math.min(100, Number(weightPercent) || 0));
  return (w / 100) * MAX_WEIGHT;
}

/**
 * Grade risk: prioritize courses where the student is struggling.
 * Below 60% is treated as highest risk; above ~85% tapers to a small baseline.
 */
function gradeRiskPoints(currentGrade) {
  const g = Number(currentGrade);
  if (Number.isNaN(g)) return MAX_RISK * 0.5;
  if (g < 60) return MAX_RISK;
  if (g < 70) return MAX_RISK * 0.72;
  if (g < 80) return MAX_RISK * 0.4;
  if (g < 85) return MAX_RISK * 0.2;
  return MAX_RISK * 0.08;
}

function hoursPoints(estimatedHours) {
  const h = Math.max(0, Number(estimatedHours) || 0);
  return Math.min(MAX_HOURS, h * 1.5);
}

function statusPoints(status) {
  if (status === "not_started") return STATUS_NOT_STARTED;
  if (status === "in_progress") return STATUS_IN_PROGRESS;
  return 0;
}

export function computePriorityScore(assignment) {
  if (assignment.status === "completed") return 0;

  const score =
    urgencyPoints(assignment.due_date) +
    weightPoints(assignment.weight) +
    gradeRiskPoints(assignment.current_grade) +
    hoursPoints(assignment.estimated_hours) +
    statusPoints(assignment.status);

  return Math.round(Math.min(100, Math.max(0, score)) * 10) / 10;
}

/** Grade impact: weight% × expected grade (as specified) */
export function gradeImpact(weightPercent, expectedGrade) {
  const w = Number(weightPercent) || 0;
  const e = Number(expectedGrade) || 0;
  return Math.round(w * e * 100) / 100;
}

/**
 * One-line coaching message for a single assignment (used on dashboard + priorities API).
 */
export function buildRecommendation(assignment) {
  if (assignment.status === "completed") {
    return `Nice work finishing "${assignment.title}" — focus energy on what's still open.`;
  }

  const days = Math.round(daysUntilDue(assignment.due_date));
  const duePhrase =
    days < 0
      ? `was due ${Math.abs(days)} day(s) ago`
      : days === 0
        ? "is due today"
        : days === 1
          ? "is due tomorrow"
          : `is due in ${days} days`;

  const weight = assignment.weight;
  const course = assignment.course_name;
  const title = assignment.title;
  const grade = assignment.current_grade;

  if (grade < 60 && weight >= 15) {
    return `You are currently at risk in ${course} because your grade is ${grade}%. Prioritize "${title}" worth ${weight}% ${duePhrase} for the biggest GPA lift.`;
  }

  if (weight >= 20 && days <= 7) {
    return `Your ${course} assignment "${title}" is worth ${weight}% and ${duePhrase}. Studying this gives some of the biggest grade impact right now.`;
  }

  if (days <= 3) {
    return `"${title}" in ${course} ${duePhrase}. Tackle this soon before deadlines stack up.`;
  }

  return `"${title}" (${course}) is worth ${weight}% of the course and ${duePhrase}. Keep momentum if your course grade is ${grade}%.`;
}

export function enrichAssignment(assignment) {
  const priority_score = computePriorityScore(assignment);
  const recommendation = buildRecommendation({ ...assignment, priority_score });
  const grade_impact = gradeImpact(assignment.weight, assignment.expected_grade);
  return {
    ...assignment,
    priority_score,
    recommendation,
    grade_impact,
  };
}
