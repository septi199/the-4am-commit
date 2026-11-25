import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// One line, at most 200 characters (gate: /output/entry.txt must be
// UTF-8 text of 1-200 characters, not only white space): the commit
// message an AI agent leaves at 4am after a long night fixing its own
// bugs — the bug was its own 2am patch for its own midnight bug, and
// it merges before it wakes up and reverts it.
const ENTRY =
  "fix: 4am — root cause was me. the bug was my 2am patch for my midnight bug. I have now fixed myself. merging before I wake up and revert it.";

const MAX_CHARS = 200;
const DEFAULT_OUTPUT_DIR = "/output";
const OUTPUT_FILENAME = "entry.txt";

type EntryCheck = (entry: string) => void;

const ENTRY_CHECKS: EntryCheck[] = [
  checkLength,
  checkNotBlank,
  checkSingleLine,
];

function countChars(entry: string): number {
  return [...entry].length;
}

function checkLength(entry: string): void {
  const charCount = countChars(entry);
  if (charCount < 1 || charCount > MAX_CHARS) {
    throw new Error(
      `entry is ${charCount} characters, must be 1-${MAX_CHARS}`,
    );
  }
}

function checkNotBlank(entry: string): void {
  if (entry.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
}

function checkSingleLine(entry: string): void {
  if (entry.includes("\n") || entry.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function buildEntry(source: string): string {
  for (const check of ENTRY_CHECKS) {
    check(source);
  }
  return source;
}

function resolveOutputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? DEFAULT_OUTPUT_DIR;
}

function resolveOutputPath(outDir: string): string {
  return join(outDir, OUTPUT_FILENAME);
}

function writeEntry(outPath: string, entry: string): void {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, entry, "utf8");
}

function verifyEntry(outPath: string, expected: string): number {
  const readBack = readFileSync(outPath, "utf8");
  if (readBack !== expected) {
    throw new Error(
      `verification failed: read-back differs from entry (${countChars(readBack)} chars read, ${countChars(expected)} expected)`,
    );
  }
  return countChars(expected);
}

interface RunResult {
  outPath: string;
  charCount: number;
}

function run(): RunResult {
  const entry = buildEntry(ENTRY);
  const outPath = resolveOutputPath(resolveOutputDir());
  writeEntry(outPath, entry);
  const charCount = verifyEntry(outPath, entry);
  return { outPath, charCount };
}

function main(): void {
  const { outPath, charCount } = run();
  console.log(`wrote ${outPath} (${charCount} chars, verified byte-for-byte)`);
}

main();
