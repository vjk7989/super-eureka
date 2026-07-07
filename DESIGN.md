# Design System: Oil Palm Health Command Center
**Project ID:** GUI-oilpalm

## 1. Visual Theme & Atmosphere
The interface is an operational GIS command center: precise, grounded, and calm under pressure. It should feel like a daily work surface for plantation teams, not a marketing site. The visual density is moderate-high, with map views, filters, tabular records, and status signals arranged for quick scanning and repeated use.

The mood is field-operational and analytical. Surfaces are quiet and light, borders are crisp, and color is reserved for hierarchy, risk, task state, and geographic signals. The app should help users answer: where is the issue, how severe is it, who owns it, and what action is next.

## 2. Color Palette & Roles
- **Command Canopy Green (#075E54):** Primary navigation, main actions, active states, and chart strokes. It communicates authority without feeling decorative.
- **Signal Growth Green (#25D366):** Positive health, successful completion, and healthy tree markers. Use sparingly so it remains a meaningful status signal.
- **Survey Sky Blue (#34B7F1):** Informational emphasis, pending work, secondary chart series, and map-adjacent context.
- **Disease Alert Red (#EA4335):** Destructive actions, severe disease states, confirmed positives, and urgent risk markers.
- **Inspection Amber (#FACC15):** Suspected disease, early-stage risk, and attention-needed states that are not yet severe.
- **Field Canvas (#F0F2F5):** App background and muted panel fills. It keeps dense data screens readable for long sessions.
- **Instrument White (#FFFFFF):** Cards, form panels, sidebars, and table bodies. It creates clean, inspectable work zones.
- **Survey Line (#E9EDEF):** Borders, table dividers, panel separators, and map chrome. It should be visible but never heavy.
- **Ink Black-Green (#111B21):** Primary text and data values. It anchors the interface with high contrast.
- **Muted Slate (#667781):** Labels, helper text, metadata, and secondary descriptions.

## 3. Typography Rules
Use the system sans stack led by Segoe UI for a familiar operations-console feel. Headings are semibold, compact, and functional; reserve large type for page titles and key metrics only. Body and table text should stay readable at small sizes, with normal letter spacing and clear line height.

Labels use small uppercase text only for metadata categories and shell-level context. Avoid decorative display typography. Numeric values and coordinates should align visually through consistent spacing, weight, and restrained color.

## 4. Component Stylings
* **Buttons:** Use compact, gently rounded rectangles. Primary buttons use Command Canopy Green (#075E54) with white text. Secondary buttons are white with Survey Line borders. Focus states must be visible with a Signal Growth Green (#25D366) ring.
* **Cards/Containers:** Use Instrument White (#FFFFFF), Survey Line (#E9EDEF), and subtle diffused shadows. Corners are gently rounded, not pill-like, so dense dashboards feel precise.
* **Inputs/Forms:** Inputs use white or Field Canvas backgrounds with clear borders, compact padding, and visible focus rings. Filter panels should group related controls with light dividers and concise labels.
* **Badges:** Status badges combine color, border, and a compact leading mark so disease and inspection states are not communicated by color alone.
* **Tables:** Headers use Field Canvas (#F0F2F5), semibold labels, and crisp row dividers. Row hover states may use a faint green wash to support scanning without distracting from values.
* **Maps:** Map panels should prioritize geographic content. Legends are compact, color chips are labeled, and side panels explain filtered scope, affected ranking, and selected-tree details.

## 5. Layout Principles
Navigation is persistent on desktop and compact on smaller screens. Page content should sit in constrained operational bands with consistent gaps rather than decorative hero sections.

Map-first workflows use a left filter rail, central map, and right insight panel where space allows. On smaller screens these collapse into a vertical order: filters, map, insights. Cards, tables, and forms should preserve stable dimensions and avoid text overlap at mobile and desktop widths.
