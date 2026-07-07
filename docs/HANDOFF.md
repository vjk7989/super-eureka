# Handoff

## Current Status

- Workspace: `G:\GUI-oilpalm`.
- The workspace now contains a prototype-first Next.js app with mock data, role-aware routes, tree grid, map fallback, uploads, inspections, AI feedback, reports, and Supabase blueprint SQL.
- `git status --short` failed with `fatal: not a git repository`, so future agents should verify repository setup before relying on Git history or branch state.

## Project Constraints

- Keep all generated output inside `G:\GUI-oilpalm`; avoid writing to `C:` because disk space is low.
- Follow YAGNI: add only files and process that are required for the active task.
- Do not revert, overwrite, or clean up edits made by other agents or users unless explicitly asked.
- If existing project files or docs appear later, adapt to them instead of replacing their conventions.
- Prefer the codebase-memory MCP graph tools for code discovery when code exists; fall back to filesystem search only when graph results are insufficient or for non-code files.

## Documentation Locations

- Project agent instructions: `AGENTS.md`.
- Primary handoff: `docs/HANDOFF.md`.
- Architecture decisions, operational lessons, errors, fixes, and suggestions: `docs/ARCHITECTURE_RECORD.md`.
- Supabase blueprint: `supabase/migrations/0001_oil_palm_blueprint.sql` and `supabase/storage.sql`.
- Add future docs only when they directly support current work.
- If architecture, setup, or decision docs are introduced later, link them from this file rather than duplicating their content.

## Recording Work

- Record durable decisions, reproducible errors, fixes, and architecture suggestions in `docs/ARCHITECTURE_RECORD.md`.
- Keep handoff notes here focused on current status, constraints, verification, and open questions for the next agent.
- Keep entries concise and update existing sections before creating new ones.

## Required Task Workflow

- Before fixing a failed task, write a short plan that explains what is missed, what will be checked, and what will change.
- For each implementation task, use one subagent to define test cases, including edge cases.
- Use a separate subagent to run or verify those test cases.
- If tests fail, analyze the failure, update the plan, fix the issue, and rerun the relevant tests before moving to the next task.
- If no runnable test tooling exists, have the runner subagent perform the narrowest useful verification and record that limitation in the final response.

## Verification Expectations

- Before editing, check for existing files and uncommitted work relevant to the task.
- After editing, run the narrowest useful verification available for the changed surface.
- If verification cannot run because the workspace is incomplete, dependencies are missing, or Git is unavailable, state that clearly in the final response.
- Do not add broad test scaffolding until the project structure and tooling are known.

## Open Questions

- Is `.git` intentionally incomplete, or is this workspace expected to become a normal Git repository?
- What application stack, build commands, and test commands should future agents use once source files are present?
