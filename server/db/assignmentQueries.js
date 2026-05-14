import { db } from "./database.js";

const rowToAssignment = (row) => ({
  id: row.id,
  title: row.title,
  course_name: row.course_name,
  due_date: row.due_date,
  weight: row.weight,
  current_grade: row.current_grade,
  expected_grade: row.expected_grade,
  status: row.status,
  estimated_hours: row.estimated_hours,
  priority_score: row.priority_score,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export function findAllAssignments() {
  const stmt = db.prepare(
    `SELECT * FROM assignments ORDER BY datetime(due_date) ASC`
  );
  return stmt.all().map(rowToAssignment);
}

export function findAssignmentById(id) {
  const stmt = db.prepare(`SELECT * FROM assignments WHERE id = ?`);
  const row = stmt.get(id);
  return row ? rowToAssignment(row) : null;
}

export function insertAssignment(data) {
  const stmt = db.prepare(`
    INSERT INTO assignments (
      title, course_name, due_date, weight, current_grade, expected_grade,
      status, estimated_hours, priority_score
    ) VALUES (
      @title, @course_name, @due_date, @weight, @current_grade, @expected_grade,
      @status, @estimated_hours, @priority_score
    )
  `);
  const info = stmt.run(data);
  return findAssignmentById(info.lastInsertRowid);
}

export function updateAssignment(id, data) {
  const stmt = db.prepare(`
    UPDATE assignments SET
      title = @title,
      course_name = @course_name,
      due_date = @due_date,
      weight = @weight,
      current_grade = @current_grade,
      expected_grade = @expected_grade,
      status = @status,
      estimated_hours = @estimated_hours,
      priority_score = @priority_score,
      updated_at = datetime('now')
    WHERE id = @id
  `);
  stmt.run({ ...data, id });
  return findAssignmentById(id);
}

export function deleteAssignment(id) {
  const stmt = db.prepare(`DELETE FROM assignments WHERE id = ?`);
  const info = stmt.run(id);
  return info.changes > 0;
}

export function updatePriorityScore(id, priority_score) {
  db.prepare(
    `UPDATE assignments SET priority_score = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(priority_score, id);
}
