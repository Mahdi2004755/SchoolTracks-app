import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Ensure data directory exists, then open SQLite connection */
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "assignments.db");
export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

/** Create the assignments table if it does not exist */
export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      course_name TEXT NOT NULL,
      due_date TEXT NOT NULL,
      weight REAL NOT NULL,
      current_grade REAL NOT NULL,
      expected_grade REAL NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('not_started', 'in_progress', 'completed')),
      estimated_hours REAL NOT NULL,
      priority_score REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
