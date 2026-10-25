import { guests, type Guest } from "./seating";

export type SeatMatch = {
  guest: Guest;
  fullName: string;
};

type IndexedGuest = SeatMatch & {
  normalizedFirst: string;
  normalizedLast: string;
  normalizedFull: string;
};

export function normalizeName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function displayName(guest: Guest): string {
  return [guest.firstName, guest.lastName].filter(Boolean).join(" ");
}

const roster: IndexedGuest[] = [];
const seen = new Set<string>();

for (const guest of guests) {
  const key = `${guest.firstName}|${guest.lastName}|${guest.table}`;
  if (seen.has(key)) continue;
  seen.add(key);

  const fullName = displayName(guest);
  roster.push({
    guest,
    fullName,
    normalizedFirst: normalizeName(guest.firstName),
    normalizedLast: normalizeName(guest.lastName),
    normalizedFull: normalizeName(fullName),
  });
}

export function searchGuests(query: string): SeatMatch[] {
  const normalizedQuery = normalizeName(query);
  if (!normalizedQuery) return [];

  const tokens = normalizedQuery.split(" ");

  const matches = roster
    .filter((entry) => tokens.every((token) => entry.normalizedFull.includes(token)))
    .map((entry) => {
      const { normalizedFirst, normalizedLast, normalizedFull } = entry;
      let score = 0;

      if (normalizedFull === normalizedQuery) score -= 100;
      if (normalizedFull.startsWith(normalizedQuery)) score -= 20;

      for (const token of tokens) {
        if (normalizedFirst.startsWith(token)) score -= 8;
        else if (normalizedLast.startsWith(token)) score -= 6;
        else if (normalizedFirst.includes(token)) score -= 3;
        else if (normalizedLast.includes(token)) score -= 2;
        if (normalizedFirst === token) score -= 12;
        if (normalizedLast === token) score -= 10;
      }

      return { entry, score };
    })
    .sort(
      (a, b) =>
        a.score - b.score ||
        a.entry.guest.table - b.entry.guest.table ||
        a.entry.fullName.localeCompare(b.entry.fullName),
    );

  return matches.map(({ entry }) => ({
    guest: entry.guest,
    fullName: entry.fullName,
  }));
}
