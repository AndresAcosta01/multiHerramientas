---
name: MultiHerramientas
description: Calm, ruled operate-surface for small web tools (nomina, descansos y almuerzos); colour lives only on data.
colors:
  ground: "#f5f8fc"
  surface: "#ffffff"
  raised: "#f0f4fa"
  active: "#e7edf7"
  border: "#e1e7f0"
  rule: "#edf1f7"
  control: "#cdd5e2"
  text: "#151b2b"
  muted: "#566074"
  faint: "#5f6a80"
  primary: "#1b2335"
  primary-hover: "#2a3550"
  accent: "#3c669a"
  accent-soft: "#eaf1fa"
  negative: "#b3262c"
  negative-pill: "#ffedea"
  salario-c: "#dcebfa"
  salario-d: "#a3cbf0"
  recNocturno-c: "#e9e4fa"
  recNocturno-d: "#bfb2ee"
  domDiurno-c: "#fde4d8"
  domDiurno-d: "#f6b79b"
  domNocturno-c: "#fbdfe8"
  domNocturno-d: "#f1a6c0"
  extDiurna-c: "#dcf2e6"
  extDiurna-d: "#9bd9b7"
  extNocturna-c: "#d8f0f2"
  extNocturna-d: "#92d2d8"
  extDomDiurna-c: "#fbf3b9"
  extDomDiurna-d: "#f2e68c"
  extDomNocturna-c: "#f4e2f7"
  extDomNocturna-d: "#d9aae3"
  incGeneral-c: "#e5eaf3"
  incGeneral-d: "#b1bfd8"
  incLaboral-c: "#e8f2d9"
  incLaboral-d: "#b9d78d"
  licencia-c: "#fbded9"
  licencia-d: "#f0aaa3"
  comision-c: "#fcdcb4"
  comision-d: "#f6c48a"
  transporte-c: "#efe6d8"
  transporte-d: "#d9c8a8"
  bono-c: "#e1e5fb"
  bono-d: "#aab6ee"
  deduccion-c: "#ebe9e6"
  deduccion-d: "#c9c4bd"
  cumple-c: "#dcf2e6"
  cumple-d: "#9bd9b7"
  revisar-c: "#fcebc2"
  revisar-d: "#f3cf7f"
  deficit-c: "#fbd9d6"
  deficit-d: "#f1a29b"
  descanso-c: "#dcebfa"
  descanso-d: "#a3cbf0"
  almuerzo-c: "#fde4d8"
  almuerzo-d: "#f6b79b"
  turno-c: "#eef2f8"
  turno-d: "#d3dbe8"
typography:
  title:
    fontFamily: "Figtree Variable, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "38px"
    letterSpacing: "-0.02em"
  section:
    fontFamily: "Figtree Variable, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "24px"
  total:
    fontFamily: "Figtree Variable, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "26px"
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  body:
    fontFamily: "Figtree Variable, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "Figtree Variable, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
rounded:
  inner: "4px"
  control: "6px"
  card: "8px"
  dialog: "12px"
  full: "50%"
spacing:
  gap: "24px"
  pad: "24px"
  gutter: "29px"
  control-height: "36px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    height: "36px"
    padding: "0 14px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    height: "36px"
    padding: "0 14px"
  button-secondary-hover:
    backgroundColor: "{colors.raised}"
  button-text:
    textColor: "{colors.accent}"
    rounded: "{rounded.inner}"
    height: "28px"
  chip:
    backgroundColor: "{colors.salario-c}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    height: "28px"
    padding: "0 8px"
  status-chip:
    backgroundColor: "{colors.cumple-c}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    height: "24px"
    padding: "0 8px"
  coverage-input:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.control}"
    height: "28px"
    width: "64px"
  timeline-mark:
    backgroundColor: "{colors.descanso-d}"
    rounded: "{rounded.inner}"
    height: "20px"
  timeline-shift:
    backgroundColor: "{colors.turno-c}"
    rounded: "{rounded.inner}"
    height: "24px"
  selection-bar:
    backgroundColor: "{colors.accent-soft}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "20px"
  field:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.control}"
    height: "32px"
  field-modal:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    height: "40px"
  nav-item:
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    height: "40px"
  nav-item-active:
    backgroundColor: "{colors.active}"
    textColor: "{colors.text}"
  dialog:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.dialog}"
    width: "720px"
  dialog-descansos:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.dialog}"
    width: "560px"
  toast:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.card}"
---

# Design System: MultiHerramientas

## Overview

**Creative North Star: "The Ruled Ledger"**

A pale blue-white ground divided by 1px rules into a T-frame, with near-black type and one muted steel-blue accent used only on tiny marks (focus ring, active nav icon, text links, caret). Everything structural is monochrome. Colour is reserved for data: each payroll concept owns one hue (fifteen pairs; the three deductions share one), and the second tool adds six more pairs for coverage status and break types, all shown as a pale tint and a deep tone. The screen is quiet so the numbers and their colours are the only things that speak.

The build is an operate surface: dense but unhurried, 14px body, tabular figures everywhere a number can change, controls 32-40px tall. Cards are white on the tinted ground with a 1px border and no shadow. Motion is feedback only.

**Key Characteristics:**
- Ruled T-frame: 232px sidebar and 64px top bar share the ground and are separated only by 1px rules.
- Colour lives only on data; chrome is neutral.
- One signature: the colour-composition bar, echoed by the legend chips and the table-row highlight.
- Figtree Variable with tabular numerals.
- Flat at rest; shadow only on elements that float (toast, dialog).

## Colors

Cool-tinted neutrals plus one steel accent; twenty-one paired data hues carry all the chroma.

### Primary
- **Ink Navy** (`primary`): primary button fill, toast fill, selected commission segment. The only large dark mass.

### Secondary
- **Steel Accent** (`accent`): focus ring (2px, 2px offset), active nav icon, text-button colour, input caret. Small marks only. `accent-soft` is defined for tints.

### Neutral
- **Ground** (`ground`): page, sidebar, top bar, modal footer, hover of an accordion header.
- **Surface** (`surface`): cards, inputs, dialog.
- **Raised / Active** (`raised`, `active`): hover fill and selected-nav fill.
- **Border / Rule / Control** (`border`, `rule`, `control`): `border` frames cards and the T-frame; `rule` divides inside a card (table rows, parameter rows); `control` outlines inputs and buttons.
- **Text / Muted / Faint** (`text`, `muted`, `faint`): primary text, secondary labels, placeholders.
- **Negative** (`negative`, `negative-pill`): validation errors and destructive text button only.

### Data hues (one per concept)
Each concept has a pale `-c` tint (chip, row highlight, salary data cell) and a deep `-d` tone (bar segment, pressed-chip border): salario, recNocturno, domDiurno, domNocturno, extDiurna, extNocturna, extDomDiurna, extDomNocturna, incGeneral, incLaboral, licencia, comision, transporte (warm sand), bono (periwinkle) and deduccion (warm grey). Salud, pension and fondo de solidaridad all use the single `deduccion` pair, so deductions read as one family distinct from earnings. Components receive them by a `data-t` attribute that sets local `--c` and `--d`; unknown concepts fall back to `raised` / `muted`.

### Descansos y almuerzos hues
Six more `-c` / `-d` pairs in `styles.css`, same Pair Rule. Coverage status: `cumple` (green), `revisar` (amber), `deficit` (red-pink). Break types: `descanso` (blue, same values as `salario`) and `almuerzo` (peach, same values as `domDiurno`). `turno` (cool grey-blue) is the neutral pair for an agent's shift. Chip, table stripe, timeline mark and "Fuera" cell all read from these pairs. `accent-soft` fills the selection bar; `accent` itself never fills.

### Named Rules
**The Colour-On-Data Rule.** Chroma appears only where it names a concept. Chrome, headings, buttons and borders stay neutral.
**The Small Accent Rule.** The steel accent is never a fill or a surface; it marks focus, the active item and links.
**The Pair Rule.** A concept is always shown with its tint for areas and its deep tone for bars and borders; never the reverse.

## Typography

**Display / Body / Label Font:** Figtree Variable (self-hosted via `@fontsource-variable/figtree`, fallback `system-ui, sans-serif`). One family; hierarchy comes from size and weight.

**Character:** Friendly geometric sans, tight tracking on large sizes. Chosen because its digits actually change width under `tabular-nums`.

### Hierarchy
- **Title** (700, 32px / 38px, -0.02em; 20px / 28px under 720px): page heading.
- **Section** (600, 18px / 24px): list heading.
- **Total** (600, 20px / 26px, -0.01em): person net total (header) and the dialog estimate; the "Devengado" line under the header total is 12px / 16px `muted`.
- **Person** name 600 15px / 20px; its line "Salario · valor hora · horas ordinarias" 13px / 18px `muted`, tabular.
- **Body** (400, 14px / 20px): default; subtitle 15px / 22px in `muted`, max 68ch (14px / 20px under 720px). Brand mark and the salary data cell use 16px (600).
- **Label** (400-500, 12-13px / 16-18px, `muted`): sub-labels, table headers, chip text 13px 500. The table sub-row "Deducciones del trabajador" is a 12px / 600 label spanning the row.

**The Size Scale.** Sizes in use are 12, 13, 14, 15, 16, 18, 20 and 32px; nothing else for new work. The 11px / 600 numbers in the "Fuera" cells are an outlier the build carries, not part of the scale. 24px is a spacing value (gap, padding), not a type size.

### Named Rules
**The Tabular Rule.** Any figure that can change (money, hours, percentages, counts) uses `font-variant-numeric: tabular-nums`.
**The Sentence Case Rule.** Labels are sentence case at normal tracking; no uppercase micro-labels.

## Layout

Page is a CSS grid T-frame: 232px sticky sidebar (full height, right rule) and 64px top bar (bottom rule), content canvas with 29px horizontal gutters (32px top, 72px bottom) and a tool max-width of 1320px. The tool grid is a fluid column plus a 372px right rail that shows all ten percentage rows without its own scroll. Spacing rhythm: 24px between blocks (`gap`), 20px card padding, 16px inside accordion rows, 8px between person cards, 4-12px inside controls.

Responsive: at 1100px the grid collapses to one column and the rail drops below the list (a jump link appears). At 860px the sidebar folds into a 56px top bar with a menu button and an in-flow sheet; the status text collapses to a dot. At 720px the legend becomes one horizontally scrolling line, the person header keeps the same layout, the concept table turns into stacked rows (the deductions sub-row becomes a block with `12px 0 4px` padding; the "Cálculo" column header keeps `0 16px` padding on desktop to align with its cells), inputs go to 16px, and modal/footer buttons become 44px tall. The modal becomes a bottom sheet (see Dialog).

## Elevation & Depth

Flat and tonal. Depth is conveyed by the ground-to-white step and 1px borders, never by shadow, on cards, the rail and the sidebar. Only elements that float over the page carry a soft shadow.

### Shadow Vocabulary
- **Toast** (`box-shadow: 0 8px 24px -6px rgb(21 27 43 / 0.35)`): undo toast.
- **Dialog** (`box-shadow: 0 24px 60px -12px rgb(21 27 43 / 0.3)`) over a `rgb(21 27 43 / 0.4)` backdrop.

### Named Rules
**The Flat-Until-Floating Rule.** A surface gets a shadow only if it overlays other content.

## Shapes

Soft but disciplined. The radius scale in use is 4 / 6 / 8 / 12px: 6px controls (buttons, chips, segmented control, nav items, text fields, sidebar items), 8px cards and the modal's large inputs and hour fields, 12px dialog (top corners only as a bottom sheet), 50% for the status dot. Inner segmented-control buttons and text buttons use 4px. Bar segments are 3px rounded, 2px apart; the sheet handle is 2px rounded. Dashed 1px `control` border marks the empty state. Icons are 16-20px stroke SVGs, 1.5 stroke, round caps, inheriting `currentColor`.

## Components

### Buttons
- **Shape:** 6px radius, 36px high, 14px side padding, 1px border, 500 weight.
- **Primary:** Ink Navy fill, white text; hover lightens to `primary-hover`.
- **Secondary:** white fill, `control` border; hover fills `raised`.
- **Text:** no fill, steel accent, underline on hover (3px offset); danger variant uses `negative`.
- **Press:** `transform: scale(0.97)` on `:active` for every pressable (0.92 for icon buttons); hover effects only under `(hover: hover) and (pointer: fine)`.

### Chips
- **Style:** text only, concept tint fill, 28px high, `0 8px` padding, 6px radius, 1.5px border (transparent at rest).
- **State:** as a legend toggle, `aria-pressed=true` shows the deep-tone border (the pastel fill plus border is the only mark); hovering or pressing one dims the other bar segments to 0.28 opacity.

### Cards / Containers
- **Corner:** 8px. **Background:** white on ground. **Border:** 1px `border`. **Shadow:** none. **Padding:** 20px (16px in person rows).

### Inputs / Fields
- **Style:** white, 1px `control` border, 6px radius (32px rail fields, 7ch right-aligned numeric) or 8px / 40px in the dialog, one per hour type with the label above, in a grid of 3 columns (2 under 720px) with 16px (12px) gaps.
- **Focus:** 2px steel outline replaces the border colour. **Error:** `negative` border plus 13px 500 message.

### Navigation
- 40px items, 18px icon, `muted` text, 2px gap. Hover `raised`; active `active` fill with `text` colour and an accent-coloured icon. Breadcrumb in the top bar with a 1px-ruled status cell at the right. Mobile: menu button opens an in-flow sheet (180ms fade and 4px slide).

### Colour-composition bar (signature)
One bar language: each person's bar (6px high, 2px gaps, 3px segments flexed by value), echoed by the legend chips. The concept table rows share the same hue; hovering or focusing a concept highlights its chip, its segments and its row (`color-mix` 50% tint) and dims the rest. Always keep segments at least 4px wide.

### Parameter panel
A 20px-padded card of plain rows (label left, `%` field right, 48px min, `rule` between) covering the surcharge percentages plus salud and pension, with no group headings. Below it, after 24px and a `rule`, a "Valores vigentes" section (18px / 600 heading, 13px muted note) holds money rows whose field is the same 32px control widened (`.campo.ancho`, 10ch, `$` prefix, right-aligned tabular).

### Person accordion
Header row: name over the "Salario · valor hora · horas ordinarias" line on the left, total and chevron on the right (same on mobile), over the bar. Detail expands via `grid-template-rows 0fr to 1fr` over 260ms ease-out; rows stagger in at 35ms steps; chevron rotates 180deg. Removal collapses the card (200ms) and raises an undo toast.

### Concept table
Rows of chip, calculation text and right-aligned amount. After the earnings (including auxilio de transporte and bono extralegal when present) a "Deducciones del trabajador" sub-row (12px / 600, no fill) introduces the deduction rows, which carry the shared `deduccion` pair and show negative amounts. Row highlight and dimming follow the composition-bar rule.

### Optional-amount selector (comision, bono extralegal)
A `ground` panel with 1px `border`, 8px radius and 12px 16px padding: title (14px / 500) left, No / Si segmented control right whose pressed state is Ink Navy; the value field appears beneath at full width. The bono selector reuses the commission pattern exactly.

### Auxilio de transporte block
A fieldset in the modal: legend, 12px muted help line, then a 3-column row (16px gap, bottom-aligned) of days with auxilio, days attended and the computed result in a tinted data cell. Under 720px it becomes 2 columns (12px gap) with the result spanning the full width.

### Dialog
720px max, 12px radius, 220ms scale-and-fade entrance from `0.97` (150ms exit), header / scrolling body / footer split by a 1px rule on a `ground` footer showing the live estimate.

The Descansos modal is 560px max with the same entrance and no `ground` footer fill; below 720px it shares the sheet behaviour.

At 720px and below it is a bottom sheet: full width, max 90dvh, 12px radius on the top corners only, a 36x4 `control` handle centred 8px from the top, rising from `translateY(100%)` on the drawer curve. Footer wraps with the estimate on its own line and 44px buttons.

### Day selector
A segmented group: 1px `control` border, 6px radius, white, buttons 34px high (40px and full width under 720px), 500 weight, 16px side padding. The pressed day fills Ink Navy with white text; unpressed hover fills `raised`.

### Status chip
Text-only, 24px high, `0 8px` padding, 6px radius, 12px / 600, 1px border. Cumple, Revisar and Deficit set the fill to the pair's `-c` and the border to its `-d`. The same chip repeats in the rules list of the parameters panel.

### Tabs
44px-high text buttons, 600, `muted`, 24px apart, in a header with a 1px `rule` underneath. The selected tab takes `text` colour and a 2px `accent` underline. Under 720px the tab header stacks with the export buttons above the tabs (column-reverse).

### Coverage table
Fixed-layout table in a bordered card: 40px rows split by `rule`, 36px 12px `muted` headers, tabular right-aligned numbers. The first cell holds a 4px x 20px, 2px-radius stripe beside the time, coloured by row status with the `-d` tone (default `rule`). The "requeridos" cell is an editable input, 64px x 28px, 6px radius, `control` border, right-aligned 600 tabular, with a 2px accent outline on focus. Under 720px rows become stacked grid blocks (4 columns, 12px 16px padding): time and status on top, labelled values below (12px `muted` labels), input up to 72px x 32px at 16px text.

### Agent timeline
Per agent a 132px label column and a 44px-high line. The shift is a 24px-high, 4px-radius `turno-c` block; each break is a button mark 20px high, 10px minimum width, 3px radius, filled with its type's `-d` tone (descanso or almuerzo). Hover scales the mark to 1.2 vertically (hover-capable pointers only); a selected mark carries a 2px accent outline at 1px offset. A shared 20px hour axis (12px `muted`) heads the list and a legend of 16x10 swatches explains the marks.

### "Fuera" strip
A 20px row under each agent that lists who is out at each hour: absolutely positioned cells (18px high, 1px gap) of 3px-radius numbers, 11px / 600 tabular, on `descanso-c` (blue) and `almuerzo-c` (peach). Hidden under 720px, where the table shows an inline "fuera" line.

### Selection bar
`accent-soft` fill, 8px 16px padding, 1px `rule` below, actions on the right. Under 720px it is hidden and an equal-width button row inside the agent card replaces it.

### Agent card (mobile)
Under 720px the timeline and axis are hidden and each break becomes a chip: 28px high, 6px radius, 12px / 600, `-c` fill with `-d` border, selected state the same 2px accent outline. Agent rows become 12px 16px blocks with label and chips stacked. From 721px up the chips are hidden.

### Parameters panel (descansos)
Bordered 8px card: head (18px / 600 title over a 12px `muted` line), rows with 14px label left and a 32px `.campo` right (48px min, `rule` between, 6ch right-aligned tabular input, 11ch for time), then a rules list of 12px `muted` lines. At 1100px and below the panel moves above the list and becomes an accordion: the full-width head button shows a chevron that rotates 180deg over 250ms on `--ease-out`, and the body stays hidden until open. On desktop the head is inert and the chevron hidden.

### Motion
Feedback only. Easing `cubic-bezier(0.23, 1, 0.32, 1)` for movement, `cubic-bezier(0.32, 0.72, 0, 1)` (`--ease-drawer`) for the mobile sheet, `ease` 150ms for colour and opacity. Total count-up 420ms. All durations collapse to 0.01ms under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** colour only data: pair each concept's `-c` tint with its `-d` tone.
- **Do** separate regions with 1px `border` or `rule` lines, not fills or shadows.
- **Do** use tabular numerals for every changing figure.
- **Do** use 6px for controls, 8px for cards, 12px for dialogs and the sheet top; 4px only for inner buttons and text buttons.
- **Do** give every pressable a `scale(0.97)` press and a visible 2px accent focus ring.
- **Do** keep the accent to marks (focus, active icon, links).

### Don't:
- **Don't** fill chrome (headers, nav, buttons other than the Ink Navy primary) with concept hues or the accent.
- **Don't** add shadows to in-flow cards; reserve them for toast and dialog.
- **Don't** animate layout for decoration; motion confirms an action.
- **Don't** introduce a second typeface or uppercase eyebrow labels above headings.
- **Don't** hardcode a new data colour outside the twenty-one pairs; add a pair to the tokens instead.
