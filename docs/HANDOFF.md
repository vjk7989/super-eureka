# Handoff

## Current Status

- Workspace: `G:\GUI-oilpalm`.
- The workspace is a valid Git repository with local uncommitted prototype, theme, map, and documentation changes.
- The workspace contains a prototype-first Next.js app with mock data, role-aware routes, tree grid, Leaflet/OpenStreetMap disease map, uploads, inspections, AI feedback, reports, and Supabase blueprint SQL.
- `DESIGN.md` defines the operational GIS design system, and shared UI surfaces have been visually tightened around that language.
- The latest map workflow work links Leaflet farm/field/tree selection to an embedded tree grid and adds in-memory session map grids with reopen, export, and delete actions.
- The map grid now keeps all currently visible rows when a tree is selected, adds heatmap-style row cues and probability/latest-scan columns, and shows a richer selected-tree detail panel with image, model probability, risk, scan, treatment, and health history.
- The admin overview now includes a compact Leaflet operational map plus highest-risk farms/blocks, severe-stage queue, recent scan activity, and AI feedback summary panels.
- ESN LABS is now the visible prototype brand. The supplied logo is stored at `public/brand/esn-labs-logo.png` and rendered through the shared brand lockup component.
- Playwright E2E coverage now verifies the map-grid workflow against a production server on port `3100` using installed Chrome.
- Recent UI recovery work fixed the plain-HTML map regression by cleaning stale local Next output and verifying the built app through a single production server on port `3001`.

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
- Product context: `PRODUCT.md`.
- Design system: `DESIGN.md`.
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

## Current Verification Notes

- Use installed Chrome through Playwright when browser verification is needed; do not download Playwright browsers to `C:`.
- If `/_next/static/css/app/layout.css` returns `404` and the page renders as plain HTML, stop duplicate servers on ports `3000` and `3001`, clear only workspace-local `.next`, then either restart one clean dev server or run a fresh build and verify with `next start`.
- Running `next dev` after a production build can mix `.next` output and cause missing vendor chunk errors. For final smoke checks, prefer `npm run build` followed by `npm run start -- --port 3001`.
- Verification completed on 2026-07-08: `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- Production browser smoke passed for `/map`, `/farms/farm-ap-1/map`, `/fields/field-ap-b12/map`, `/trees/GAVL-AP-01-B12-000342/map`, `/admin/tree-grid`, and `/admin/drone-scans/scan-1`.
- Subagents were used for edge-case planning and independent verification. The runner also observed dev-server instability, which is why production-mode smoke verification is the current trusted result.
- Map-grid implementation note: saved map grids are intentionally in-memory only; they capture visible tree IDs, active filters, selected scope, and creation time without writing to Supabase.
- Map-grid E2E verification completed on 2026-07-08: `npm run lint`, `npm run typecheck`, and `npm run test:e2e` passed locally. The E2E suite covers initial render, create/delete saved grids, farm/field map selection, grid row selection, reopen, CSV export, empty results/reset, and mobile overflow.
- Playwright uses `playwright.config.ts`, `npm run test:e2e`, and the Chrome channel. Reports/results are ignored via `.gitignore`.
- Playwright video recording is disabled because the restricted Windows sandbox can block video finalization with `browserContext.close: spawn EPERM`; screenshots and traces remain enabled on failure.
- Verification completed on 2026-07-09 for the user-friendly map/overview pass: `npm run lint`, `npm run typecheck`, `npm run build`, focused row-selection E2E, and full `npm run test:e2e` after fixes.
- ESN LABS branding checks should verify `/login`, `/map`, `/admin/overview`, and `/admin/tree-grid` for logo rendering, visible ESN LABS text, and no mobile horizontal overflow.
- ESN LABS branding verification completed on 2026-07-13: `npm run lint`, `npm run typecheck`, focused `tests/e2e/branding.spec.ts`, and full `npm run test:e2e` passed with 14 tests.

## Open Questions

- Confirm whether the current local changes should be committed and pushed to `vjk7989/super-eureka` after verification.
