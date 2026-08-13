# AccuStandard UI, UX, and Accessibility Guide

**Status:** Active product guide
**Updated:** 2026-08-14
**Scope:** Next.js dashboard shell, overview, shared interaction patterns, and
future feature-module work

This guide is the compact implementation companion to
`ANTIGRAVITY_CURRENT_DESIGN.md` and `ANTIGRAVITY_DESIGN_PLAN.md`. It describes
the visual language and interaction contract that must remain consistent while
the ERP evolves. It does not replace the business-rule handoff or
`IMPLEMENTATION_STATUS.md`.

## Brand and visual system

Use the supplied AccuStandard mark at
`public/photo_2026-08-01_23-55-07.jpg` through the shared
`AccustandardLogo` component. Do not redraw the wordmark or substitute a
generic medical logo.

| Token | Value | Use |
| --- | --- | --- |
| `--brand-navy` | `#17356F` | High-contrast shell and primary text accents |
| `--brand-royal` | `#2C4296` | Navigation, active states, and action-center accents |
| `--brand-sapphire` | `#1D4ED8` | Links and focus ring |
| `--brand-red` | `#B4232F` | Rx signature, attention states, and top chrome cue |
| `--surface-canvas` | `#F4F7FB` | Application canvas |
| `--surface-card` | `#FFFFFF` | Data and content surfaces |

Prefer calm surfaces, short labels, tabular figures, and clear information
density. Avoid arbitrary purple gradients, decorative bento grids, and cards
that show a metric without a decision or next action.

## Interaction contract

- Action-center cards are role-specific and data-backed. Never expose an
  approval action to a role that cannot perform it.
- Status is communicated with text and structure as well as color. The API
  status region must distinguish connecting, live, and offline demo states.
- Interactive controls use at least a 44px class target where practical, and
  all keyboard-focusable controls retain a visible `:focus-visible` ring.
- Tables use a caption, `scope="col"` headers, responsive containment, and
  tabular numeric formatting for quantities and currency.
- The document inspector is a modal dialog: focus enters the dialog, `Tab` and
  `Shift+Tab` remain inside it, `Escape` closes it, a visible close button is
  available, and focus returns to the invoking control.
- Use `aria-labelledby` for visible dialog titles. Add `aria-describedby` only
  when the description is short and easy to announce as one unit; preserve
  semantic structures such as tables and timelines for assistive technology.
- Respect `prefers-reduced-motion`. Motion may clarify state changes but must
  never be required to understand or complete an action.

## Implementation boundaries

- Preserve API contracts, COSO approval rules, and role permissions while
  changing presentation.
- Keep shared tokens and interaction primitives in
  `src/app/globals.css`; avoid one-off colors and focus treatments in feature
  components.
- Keep offline preview data visibly labeled. Demo fallback behavior is not
  server persistence and must not be described as production functionality.
- Use the existing component and primitive layers before introducing a new UI
  dependency. New dependencies require an explicit need and validation cost.
- Keep document and monetary formatting null-safe and locale-aware.

## Review checklist

Before merging a visual or interaction change:

- [ ] Confirm the supplied logo and current brand tokens are used.
- [ ] Test desktop and narrow mobile layouts, including table overflow and
      bottom navigation.
- [ ] Keyboard-test the changed flow: visible focus, logical order, Escape,
      modal containment, and focus restoration.
- [ ] Verify role-specific counts and actions against seeded/API data.
- [ ] Confirm connected, connecting, and offline states are understandable.
- [ ] Run `git diff --check`.
- [ ] Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` in disposable
      Podman; do not retain host `node_modules` or build artifacts.
- [ ] Record limitations in `IMPLEMENTATION_STATUS.md`; lint/build success is
      not a substitute for backend acceptance testing or full WCAG conformance.

## Current standards and framework references

- [W3C Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI-ARIA Authoring Practices: Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Next.js App Router production checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Next.js Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)

WCAG 2.2 is the conformance target for new UI work. Automated checks are only
one part of review; keyboard, responsive, visual, and assistive-technology
testing still require human verification.
