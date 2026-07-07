# Architecture Record

This document records architecture decisions, operational lessons, and follow-up suggestions for this project.

Keep entries short, dated, and factual. Prefer recording decisions that affect future work instead of documenting every small implementation detail.

## Project Constraints

- Keep generated files, caches, and temporary work inside `G:\GUI-oilpalm` where possible.
- Avoid using `C:` for project work because available space is limited.
- Apply YAGNI: implement only what the project currently needs.
- Prefer existing project patterns before adding new tools, abstractions, or dependencies.
- Prefer codebase-memory MCP graph tools for code discovery when they are available.

## Decision Log

### 2026-07-07: Add Lightweight Architecture Record

**Decision:** Use a single Markdown file at `docs/ARCHITECTURE_RECORD.md` to record decisions, rationale, error details, fixes, and architecture suggestions.

**Why:** The project needs a durable place to capture context for future agents and developers without introducing extra tooling or process overhead.

**Care points:**

- Add new decisions as dated entries.
- Include the reason and tradeoffs, not only the final choice.
- Link to relevant files when code exists.
- Keep suggestions separate from accepted decisions.

### 2026-07-07: Store Tailwind Dark Theme Tokens

**Decision:** Store the provided Tailwind theme stylesheet at `src/styles/theme.css`.

**Why:** There is not yet an application source tree or existing Tailwind entry file to patch. Keeping the theme in a single stylesheet preserves the requested dark theme without inventing app structure.

**Care points:**

- Import `src/styles/theme.css` from the future app's main stylesheet or entry point.
- Dark mode is class-based; apply `.dark` to an ancestor such as `html`.
- Keep generated build caches inside `G:\GUI-oilpalm` when adding frontend tooling.

### 2026-07-07: Update Light Theme Tokens

**Decision:** Replace the `:root` light theme tokens in `src/styles/theme.css` with the provided light theme values.

**Why:** The requested light theme should be the default token set while the existing `.dark` override remains available for dark mode.

**Care points:**

- Treat `:root` as the light theme and `.dark` as the dark override.
- If a future paste is intended to replace both modes, update both blocks together.

### 2026-07-07: Require Test Planning And Verification Agents

**Decision:** Future implementation tasks should use one subagent to define test cases, including edge cases, and another subagent to run or verify those tests.

**Why:** The project owner wants each task to include explicit edge-case thinking and independent verification before moving on.

**Care points:**

- Write a short plan before fixing failures so the missed behavior is clear.
- Do not proceed to the next task while relevant tests are failing.
- If no test tooling exists, perform the narrowest useful verification and state the limitation.
- Keep this workflow lightweight and proportional to the task.

**Follow-up:** Added `AGENTS.md` so the workflow is visible to future agents at the project root.

### 2026-07-07: Implement Prototype-First Next.js App

**Decision:** Build a clickable Next.js prototype using mock repositories before wiring live Supabase.

**Why:** The requested product is broad. A production-shaped prototype proves navigation, roles, workflows, table/map/report surfaces, and schema direction before introducing backend coupling.

**Care points:**

- Keep mock data behind repository functions so Supabase can replace it module by module.
- Keep npm cache under `.tool-cache/npm-cache` to avoid C: drive pressure.
- Do not run broad dependency upgrades or `npm audit fix --force` without a separate plan.
- Treat `supabase/migrations/0001_oil_palm_blueprint.sql` and `supabase/storage.sql` as the backend blueprint, not an applied migration.

## Error And Fix Log

Use this section for recurring issues, build failures, runtime errors, or environment problems.

### Template

**Date:** YYYY-MM-DD

**Error:** What failed, including the exact command or user action when useful.

**Cause:** What caused the issue, if known.

**Fix:** What changed to resolve it.

**Verification:** How the fix was checked.

## Architecture Suggestions

Use this section for ideas that are not yet accepted decisions.

### Template

**Date:** YYYY-MM-DD

**Suggestion:** Describe the proposed change.

**Why it may help:** Explain the concrete benefit.

**Risks or tradeoffs:** Note complexity, migration cost, dependencies, or maintenance concerns.

**Status:** Proposed, accepted, rejected, or deferred.

## Review Checklist For Future Changes

- Does this change solve a current need?
- Can it be done with the existing structure?
- Does it avoid unnecessary dependencies?
- Are generated files and caches kept inside the workspace?
- Are decisions, errors, and fixes recorded here when they affect future work?
