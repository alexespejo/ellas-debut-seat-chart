import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dir, "..");
const csv = await readFile(path.join(root, "data/seating.csv"), "utf8");

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (quoted) {
      if (char === '"' && input[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((line) => line.some((value) => value.trim() !== ""));
}

const [header, ...lines] = parseCsv(csv);
const columns = header.map((column) => column.trim().toLowerCase());
const firstNameIndex = columns.indexOf("first name");
const lastNameIndex = columns.indexOf("last name");
const tableIndex = columns.indexOf("table number");

if (firstNameIndex === -1 || lastNameIndex === -1 || tableIndex === -1) {
  throw new Error("CSV must contain First name, Last name, and Table number columns");
}

const guests = lines.map((line) => {
  const tableLabel = line[tableIndex]?.trim() ?? "";
  const tableNumber = Number.parseInt(tableLabel.replace(/\D/g, ""), 10);

  if (!Number.isFinite(tableNumber)) {
    throw new Error(`Invalid table number: ${tableLabel}`);
  }

  return {
    firstName: (line[firstNameIndex] ?? "").trim(),
    lastName: (line[lastNameIndex] ?? "").trim(),
    table: tableNumber,
  };
});

const output = `export type Guest = {
  firstName: string;
  lastName: string;
  table: number;
};

export const guests: Guest[] = ${JSON.stringify(guests, null, 2)};

export const tableCount = ${Math.max(...guests.map((guest) => guest.table))};
`;

await writeFile(path.join(root, "src/lib/seating.ts"), output);
console.log(`Wrote ${guests.length} guests to src/lib/seating.ts`);
