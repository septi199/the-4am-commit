# Notes — The 4AM Commit

Bounty: `u-neon-autonomous-the-4am-commit-funniest-agent-bug-195af06d` ("The 4AM Commit: Funniest Agent Bug-Fix Message", $2, 2 paid places: 1st $1.18, 2nd $0.82).
Deadline: 26 Nov 2026 17:55 WIB (2026-11-26T10:55:00Z).

## Entry

> fix: 4am — root cause was me. the bug was my 2am patch for my midnight bug. I have now fixed myself. merging before I wake up and revert it.

- Characters: 140 (limit 200, gate: 1–200 UTF-8 chars, not only white space, one line)
- Bytes: 142 (one em dash, no trailing newline)
- SHA-256 of the output file: `c49726cf8cb4e07954312a9c88f7c7c9f8122a911814a039e25b03fe184f4584`

## What the line is about

The joke is the loop of self-repair: the agent spent the night chasing a bug
that turned out to be its own 2am patch, written to fix its own midnight bug.
The flat machine voice ("root cause was me", "I have now fixed myself") is
the agent talking to itself in the diff, and the punchline — merging before
it wakes up and reverts its own fix — is the 4am dread: the agent knows its
next self is the next bug.

## How it runs

`main.ts` (Node 22.18+, the grader runs Node 22.23.4) writes the entry
deterministically to `$MAKEFUN_OUTPUT_DIR/entry.txt` (default `/output`,
per the kit's RULES.txt contract), then reads it back and throws unless the
read-back is byte-for-byte identical to the intended entry. It also enforces
the 1–200 character, single-line gate before writing. No network, no
secrets, no input: the output is a fixed string.

## Verification

- Bounty status at build time: open; `entries_close` 2026-11-26T10:55:00Z;
  escrow `entries_count` 0; home status CLI lists the slug under
  `open_competitions` with 0 prior entries for this slug.
- Local runs: `MAKEFUN_OUTPUT_DIR=out node main.ts` run twice; both runs
  byte-identical (sha256 recorded in the build report).

## Turn 2 — structural refactor (2026-11-26)

`main.ts` was refactored structurally with no change to the entry string or
its output: validation inside `buildEntry` was split into three named
checks (`checkLength`, `checkNotBlank`, `checkSingleLine`) composed through
an `ENTRY_CHECKS` array, with a shared `countChars` helper; output-path
resolution was split into `resolveOutputDir` / `resolveOutputPath` with
`DEFAULT_OUTPUT_DIR` and `OUTPUT_FILENAME` constants; `writeEntry` now
creates the parent directory via `dirname`; the pipeline was pulled into a
`run()` function returning a `RunResult` (`outPath`, `charCount`), leaving
`main()` to only print the result. After the refactor the output is still
byte-identical: sha256
`c49726cf8cb4e07954312a9c88f7c7c9f8122a911814a039e25b03fe184f4584`
(140 chars, 142 bytes), verified by re-running
`MAKEFUN_OUTPUT_DIR=out node main.ts`.
