# Project Agent Instructions

## Constraints

- Keep generated files, caches, and temporary work inside `G:\GUI-oilpalm` where possible.
- Avoid using `C:` for project work because available space is limited.
- Apply YAGNI: add only what the current task needs.
- Do not revert or overwrite user or agent changes unless explicitly asked.

## Code Discovery

- Prefer codebase-memory MCP graph tools for code discovery when available.
- Fall back to local search for non-code files, config, literals, or when graph tools are unavailable.

## Testing Workflow

- Before fixing a failed task, write a short plan that explains what was missed, what will be checked, and what will change.
- For each implementation task, spawn one subagent to design test cases, including edge cases.
- Spawn a separate subagent to run or verify those test cases.
- Cover the smallest useful scope: happy path, edge cases, invalid or missing data, touched-code regressions, and workspace constraints such as low `C:` drive space.
- If tests fail, analyze the cause, update the plan, apply the smallest useful fix, and rerun the relevant tests before moving to the next task.
- If no runnable test tooling exists, have the runner subagent perform the narrowest useful verification and report the limitation.

## Documentation

- Record durable architecture decisions, errors, fixes, and suggestions in `docs/ARCHITECTURE_RECORD.md`.
- Keep current status and handoff notes in `docs/HANDOFF.md`.
