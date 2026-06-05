import * as SQLite from 'expo-sqlite';

let _db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!_db) {
    _db = SQLite.openDatabaseSync('caminosanctus.db');
  }
  return _db;
}

export function initSchema(): void {
  const db = getDb();
  // Migrate existing DBs that don't have burden_text column yet
  try {
    db.execSync(`ALTER TABLE profile ADD COLUMN burden_text TEXT NOT NULL DEFAULT ''`);
  } catch (_) { /* column already exists — safe to ignore */ }

  db.execSync(`
    CREATE TABLE IF NOT EXISTS profile (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tradition TEXT NOT NULL,
      burden_text TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS intake (
      id TEXT PRIMARY KEY,
      burden_text TEXT NOT NULL,
      emotional_state TEXT NOT NULL,
      tradition TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS prayer (
      id TEXT PRIMARY KEY,
      intake_id TEXT NOT NULL,
      body TEXT NOT NULL,
      emotional_state TEXT NOT NULL,
      tradition TEXT NOT NULL,
      mood_tag TEXT,
      rating TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS plan_assignment (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      current_day INTEGER NOT NULL DEFAULT 1,
      started_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rhythm_day (
      date TEXT PRIMARY KEY,
      engaged INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS mood_checkin (
      date TEXT PRIMARY KEY,
      mood_tag TEXT NOT NULL
    );
  `);
}
