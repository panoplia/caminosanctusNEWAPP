import { getDb } from './schema';
import type { Prayer, PlanAssignment, RhythmDay } from '@/domain/types';

function randomId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function saveProfile(name: string, tradition: string): void {
  const db = getDb();
  const existing = db.getFirstSync<{ id: string }>('SELECT id FROM profile LIMIT 1');
  if (existing) {
    db.runSync('UPDATE profile SET name = ?, tradition = ? WHERE id = ?', [name, tradition, existing.id]);
  } else {
    db.runSync('INSERT INTO profile (id, name, tradition, created_at) VALUES (?, ?, ?, ?)', [
      randomId(), name, tradition, Date.now(),
    ]);
  }
}

export function getProfile(): { name: string; tradition: string } | null {
  const db = getDb();
  return db.getFirstSync<{ name: string; tradition: string }>('SELECT name, tradition FROM profile LIMIT 1');
}

export function savePrayer(prayer: Prayer): void {
  const db = getDb();
  db.runSync(
    'INSERT OR REPLACE INTO prayer (id, intake_id, body, emotional_state, tradition, mood_tag, rating, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [prayer.id, prayer.intakeId, prayer.body, prayer.emotionalState, prayer.tradition, prayer.moodTag ?? null, prayer.rating ?? null, prayer.createdAt],
  );
}

export function updatePrayerRating(id: string, rating: string): void {
  const db = getDb();
  db.runSync('UPDATE prayer SET rating = ? WHERE id = ?', [rating, id]);
}

export function getLastPrayer(): Prayer | null {
  const db = getDb();
  const row = db.getFirstSync<{ id: string; intake_id: string; body: string; emotional_state: string; tradition: string; mood_tag: string | null; rating: string | null; created_at: number }>(
    'SELECT * FROM prayer ORDER BY created_at DESC LIMIT 1',
  );
  if (!row) return null;
  return {
    id: row.id,
    intakeId: row.intake_id,
    body: row.body,
    emotionalState: row.emotional_state as Prayer['emotionalState'],
    tradition: row.tradition as Prayer['tradition'],
    moodTag: row.mood_tag ?? undefined,
    rating: row.rating as Prayer['rating'],
    createdAt: row.created_at,
  };
}

export function savePlanAssignment(planId: string): PlanAssignment {
  const db = getDb();
  const id = randomId();
  const now = Date.now();
  db.runSync('INSERT OR REPLACE INTO plan_assignment (id, plan_id, current_day, started_at) VALUES (?, ?, ?, ?)', [id, planId, 1, now]);
  return { id, planId, currentDay: 1, startedAt: now };
}

export function getPlanAssignment(): PlanAssignment | null {
  const db = getDb();
  const row = db.getFirstSync<{ id: string; plan_id: string; current_day: number; started_at: number }>(
    'SELECT * FROM plan_assignment ORDER BY started_at DESC LIMIT 1',
  );
  if (!row) return null;
  return { id: row.id, planId: row.plan_id, currentDay: row.current_day, startedAt: row.started_at };
}

export function markRhythmDay(date: string, engaged: boolean): void {
  const db = getDb();
  db.runSync('INSERT OR REPLACE INTO rhythm_day (date, engaged) VALUES (?, ?)', [date, engaged ? 1 : 0]);
}

export function getRhythmDays(limitDays = 30): RhythmDay[] {
  const db = getDb();
  const rows = db.getAllSync<{ date: string; engaged: number }>(
    'SELECT date, engaged FROM rhythm_day ORDER BY date DESC LIMIT ?', [limitDays],
  );
  return rows.map((r) => ({ date: r.date, engaged: r.engaged === 1 }));
}
