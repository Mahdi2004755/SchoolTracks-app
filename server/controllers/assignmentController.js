import {
  findAllAssignments,
  findAssignmentById,
  insertAssignment,
  updateAssignment,
  deleteAssignment,
  updatePriorityScore,
} from "../db/assignmentQueries.js";
import {
  computePriorityScore,
  enrichAssignment,
  gradeImpact,
} from "../services/priorityService.js";

function normalizeBody(body) {
  const status = body.status;
  const allowed = ["not_started", "in_progress", "completed"];
  if (!allowed.includes(status)) {
    throw new Error("Invalid status");
  }
  return {
    title: String(body.title ?? "").trim(),
    course_name: String(body.course_name ?? "").trim(),
    due_date: String(body.due_date ?? "").trim(),
    weight: Number(body.weight),
    current_grade: Number(body.current_grade),
    expected_grade: Number(body.expected_grade),
    status,
    estimated_hours: Number(body.estimated_hours),
  };
}

function validateAssignment(data) {
  if (!data.title) throw new Error("Title is required");
  if (!data.course_name) throw new Error("Course name is required");
  if (!data.due_date) throw new Error("Due date is required");
  if (Number.isNaN(data.weight) || data.weight < 0 || data.weight > 100) {
    throw new Error("Weight must be between 0 and 100");
  }
  if (
    Number.isNaN(data.current_grade) ||
    data.current_grade < 0 ||
    data.current_grade > 100
  ) {
    throw new Error("Current grade must be between 0 and 100");
  }
  if (
    Number.isNaN(data.expected_grade) ||
    data.expected_grade < 0 ||
    data.expected_grade > 100
  ) {
    throw new Error("Expected grade must be between 0 and 100");
  }
  if (Number.isNaN(data.estimated_hours) || data.estimated_hours < 0) {
    throw new Error("Estimated hours must be 0 or greater");
  }
}

/** Recompute stored priority_score so the DB column matches the live algorithm */
function refreshStoredPriority(row) {
  const score = computePriorityScore(row);
  if (row.priority_score !== score) {
    updatePriorityScore(row.id, score);
  }
  return { ...row, priority_score: score };
}

export function listAssignments(_req, res) {
  try {
    const rows = findAllAssignments();
    const enriched = rows.map((row) => enrichAssignment(refreshStoredPriority(row)));
    res.json(enriched);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export function prioritiesReport(_req, res) {
  try {
    const rows = findAllAssignments().map((row) =>
      enrichAssignment(refreshStoredPriority(row))
    );
    const open = rows.filter((a) => a.status !== "completed");
    const sorted = [...open].sort((a, b) => b.priority_score - a.priority_score);
    const top = sorted[0];
    const headline = top
      ? top.recommendation
      : "You have no open assignments — add upcoming work to get tailored guidance.";

    res.json({
      headline,
      assignments: sorted,
      todays_study_plan: sorted.slice(0, 3),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export function createAssignment(req, res) {
  try {
    const data = normalizeBody(req.body);
    validateAssignment(data);
    const withScore = {
      ...data,
      priority_score: computePriorityScore(data),
    };
    const created = insertAssignment(withScore);
    res.status(201).json(enrichAssignment(created));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export function replaceAssignment(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const existing = findAssignmentById(id);
    if (!existing) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    const data = normalizeBody(req.body);
    validateAssignment(data);
    const withScore = {
      ...data,
      priority_score: computePriorityScore(data),
    };
    const updated = updateAssignment(id, withScore);
    res.json(enrichAssignment(updated));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export function removeAssignment(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const ok = deleteAssignment(id);
    if (!ok) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

/** Standalone grade impact helper for the calculator UI */
export function impactPreview(req, res) {
  try {
    const weight = Number(req.query.weight);
    const expected = Number(req.query.expected_grade);
    if (Number.isNaN(weight) || Number.isNaN(expected)) {
      return res.status(400).json({ error: "weight and expected_grade query params required" });
    }
    res.json({
      final_impact: gradeImpact(weight, expected),
      formula: "final impact ≈ assignment weight (%) × expected grade (0–100 scale)",
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
