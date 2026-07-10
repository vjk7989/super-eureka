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

### 2026-07-07: Implement Leaflet Operational Disease Map

**Decision:** Replace the placeholder map canvas with a Leaflet/OpenStreetMap disease map and Godrej-style demo operating data.

**Why:** The product needs real farm, block, tree, filter, in-charge, and heatmap interactions before Supabase/PostGIS integration.

**Care points:**

- Use `react-leaflet@4` because the project is on React 18.
- Keep OpenStreetMap as the no-token default map source.
- Treat the Godrej context as operational reference only; do not add official branding unless approved assets are provided.
- Keep demo map data behind repositories so real GIS data can replace it later.
- Do not rely on a global Leaflet minimum height; each map shell should own its responsive height.

### 2026-07-08: Add Operational GIS Design System

**Decision:** Add `DESIGN.md` as the semantic design source for the Oil Palm Health Command Center and align shared UI surfaces to an operational GIS style.

**Why:** The app needs a durable design language for map-first, dense, repeated operational workflows before broader feature work continues.

**Care points:**

- Keep design changes visual-only unless a task explicitly requests behavior changes.
- Use `DESIGN.md` for colors, typography, component styling, and map-panel hierarchy.
- Preserve command-center density; avoid marketing-style hero layouts or decorative UI.
- Keep status badges distinguishable beyond color where practical.

### 2026-07-08: Link Map Selection To Tree Grids

**Decision:** Add a client-side map-grid workspace where Leaflet farm, field, and tree selections drive a synchronized tree grid, and temporary map grids can be created, reopened, exported, or deleted during the session.

**Why:** Operators need to move between GIS selection and tabular tree review without leaving the map. Keeping saved grids in memory proves the workflow before adding Supabase persistence.

**Care points:**

- Keep saved map grids client-only until a persistence task defines storage, ownership, and sharing rules.
- Preserve role-scoped tree data passed into the map; saved grids should only capture currently visible tree IDs.
- Keep standalone tree-grid routes compatible by making row selection optional.
- Use the existing Leaflet/OpenStreetMap setup and avoid new map dependencies for this pass.

### 2026-07-08: Add Playwright Map-Grid E2E Coverage

**Decision:** Add Playwright E2E tests for the map-grid workflow only, using a production Next server on port `3100` and the installed Chrome channel.

**Why:** The linked map/grid behavior depends on browser state, Leaflet SVG layers, downloads, and responsive layout, so E2E coverage gives more confidence than isolated unit tests.

**Care points:**

- Keep Playwright artifacts in workspace-local `test-results/` and `playwright-report/`.
- Do not download Playwright browsers to `C:`; use the system Chrome channel.
- Dense Leaflet SVG layers may overlap visually, so tests use stable layer hooks and dispatch map-layer clicks for deterministic selection checks.
- Keep this suite scoped to the map-grid workflow unless a future task explicitly broadens app smoke coverage.

### 2026-07-09: Keep Tree Detail Selection Separate From Map Scope

**Decision:** Tree detail selection now highlights and focuses the selected tree while keeping the full current visible tree set in the map grid. Farm and block selections remain the only map interactions that narrow scope outside explicit filter controls.

**Why:** Operators need to inspect one tree without losing surrounding rows, heat cues, saved-grid context, or current filter results.

**Care points:**

- Treat `currentConfidence` as the displayed probability until a separate probability field is introduced.
- Keep heatmap-style grid cues as row-level severity/probability/status affordances, not a replacement for the tabular grid.
- Keep selected-tree detail rich but compact: latest image, health, disease stage, probability, risk, scan date, inspection/treatment status, and recent history.
- Overview maps should stay compact and operational, using role-scoped farms, fields, and trees instead of embedding the full map-grid workspace.

## Error And Fix Log

Use this section for recurring issues, build failures, runtime errors, or environment problems.

### 2026-07-08: Plain HTML UI Regression From Missing CSS Asset

**Error:** The map route rendered as unstyled plain HTML and Chrome reported `/_next/static/css/app/layout.css` returning `404`.

**Cause:** Duplicate or stale Next dev server state on ports `3000` and `3001` caused the browser to request a CSS asset that was not available after local `.next` output changed.

**Fix:** Stop duplicate local Next dev servers, clear only workspace-local `.next`, restart one clean dev server on port `3001`, and keep npm/cache work under `G:\GUI-oilpalm\.tool-cache`.

**Verification:** Browser verification with installed Chrome showed the CSS asset returning `200`, theme tokens applying, Leaflet rendering, and no horizontal overflow at `1366x768` or `390x844`.

### 2026-07-08: Production Build Failed On Stale `_document` Page Output

**Error:** `npm run build` compiled successfully but failed during page data collection with `PageNotFoundError: Cannot find module for page: /_document`.

**Cause:** The project has no source `pages/_document`; the failure came from stale generated `.next/server/pages` output.

**Fix:** Clear only workspace-local `.next` after verifying the resolved path stays inside `G:\GUI-oilpalm`, then rerun the build.

**Verification:** `npm run build` completed successfully after clearing `.next`.

### 2026-07-08: Dev Smoke Tests Failed After Production Build

**Error:** Browser smoke tests against `next dev` degraded into missing chunk errors such as `Cannot find module './vendor-chunks/@swc.js'` and `404` responses for `_next/static` assets.

**Cause:** Development and production Next processes reused the same `.next` directory during verification, causing incompatible generated artifacts to be read by the active server.

**Fix:** Stop all local Next servers before switching modes. For final smoke checks, use a clean production sequence: clear `.next` only when needed, run `npm run build`, then run `npm run start -- --port 3001`.

**Verification:** Production-mode browser smoke on port `3001` returned `200` for the map routes, tree grid, and drone scan detail, with CSS assets returning `200`.

### 2026-07-08: Production Build Failed During Shared Dev Output Contention

**Error:** `npm run build` compiled successfully but failed during page data collection with `PageNotFoundError: Cannot find module for page: /admin/drone-scans/upload`.

**Cause:** Multiple Next dev servers were running against the same workspace-local `.next` output while the production build was collecting page data.

**Fix:** Stop only `G:\GUI-oilpalm` Next dev-server processes, clear `G:\GUI-oilpalm\.next` after confirming the resolved path, rerun the build, then restart a single dev server on port `3001`.

**Verification:** `npm run build` completed successfully and representative routes returned `200` from `http://localhost:3001`.

### 2026-07-09: Playwright Video Teardown Failed In Restricted Sandbox

**Error:** Focused Playwright runs passed assertions but failed or hung during teardown with `browserContext.close: spawn EPERM`.

**Cause:** The restricted Windows sandbox blocked Playwright helper process spawning during video finalization and child process cleanup.

**Fix:** Disable Playwright video recording in `playwright.config.ts`; keep screenshots and traces for failure artifacts under workspace-local `test-results/` and `playwright-report/`.

**Verification:** Focused map-grid E2E reruns completed after disabling video. Full E2E verification should be run with process permissions that allow Playwright to start and stop Chrome and the production Next server.

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
