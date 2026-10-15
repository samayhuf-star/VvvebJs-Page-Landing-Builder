/** Schengen-style rolling window: at most `LIMIT` days in any `WINDOW` consecutive days. */
export const LIMIT = 90;
export const WINDOW = 180;
const DAY = 86_400_000;

export type Trip = { id: string; entry: string; exit: string };

export const parseDay = (s: string): number | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const t = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const d = new Date(t);
  if (d.getUTCFullYear() !== +m[1] || d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) return null;
  return Math.round(t / DAY);
};

export const fmtDay = (n: number) => new Date(n * DAY).toISOString().slice(0, 10);
export const todayDay = () => {
  const n = new Date();
  return Math.round(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) / DAY);
};

export function tripDays(trips: Trip[]): Set<number> {
  const set = new Set<number>();
  for (const t of trips) {
    const a = parseDay(t.entry);
    const b = parseDay(t.exit);
    if (a === null || b === null || b < a) continue;
    for (let d = a; d <= b; d++) set.add(d);
  }
  return set;
}

export const usedOn = (days: Set<number>, day: number) => {
  let n = 0;
  for (let d = day - (WINDOW - 1); d <= day; d++) if (days.has(d)) n++;
  return n;
};

/** Longest stay starting `entry`, given past days, capped at LIMIT. */
export function maxStayFrom(days: Set<number>, entry: number) {
  const planned = new Set<number>();
  let allowed = 0;
  for (let i = 0; i < LIMIT; i++) {
    const day = entry + i;
    planned.add(day);
    let n = 0;
    for (let d = day - (WINDOW - 1); d <= day; d++) if (days.has(d) || planned.has(d)) n++;
    if (n > LIMIT) break;
    allowed = i + 1;
  }
  return { days: allowed, lastDay: allowed > 0 ? entry + allowed - 1 : null };
}

/** Earliest day (from `from`) when at least one day is available again. */
export function nextFreeDay(days: Set<number>, from: number) {
  for (let d = from; d < from + 400; d++) if (usedOn(days, d) + (days.has(d) ? 0 : 1) <= LIMIT) return d;
  return null;
}
