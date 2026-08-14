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

### Shell and responsive composition

- The shared workspace uses the available desktop width up to
  `--content-max-width: 1680px`, with responsive gutters rather than a fixed
  1,440px rail.
- At 1,280px and above, the header uses filtered horizontal navigation. Below
  that threshold, the mobile menu remains available so tablet layouts do not
  force primary navigation labels into the role and utility controls.
- The overview action center uses one primary priority card with two stacked
  secondary cards. Preserve this hierarchy when adding role-specific actions;
  do not revert to three equal metric tiles.
- Body copy and labels use regular or medium weight by default. Reserve 600–650
  weight for headings, active controls, and critical status text; do not use
  bold weight as a substitute for spacing or hierarchy.
- Mobile bottom navigation keeps the scanner as the single elevated action and
  uses sentence-case labels with a minimum 44px touch target.
- The header Operations & tools control follows the WAI-ARIA menu-button
  pattern: it exposes stable IDs and `aria-haspopup="menu"`,
  `aria-expanded`, and `aria-controls`; Enter/Space and Arrow Up/Down open it,
  Arrow Up/Down/Home/End move among menuitems, and Escape or outside-pointer
  input closes it. Keyboard close and menuitem activation return focus to the
  trigger.

## Interaction contract

- Action-center cards are role-specific and data-backed. Never expose an
  approval action to a role that cannot perform it.
- Feature headers use one filled primary action, restrained supporting or
  attention treatment, and quiet controls for secondary work. Group infrequent
  actions under a visible `More actions` disclosure so capability stays
  discoverable without making every control compete for attention.
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

### Modal and popup contract

- Use `AccessibleModal` for every blocking dialog, bottom sheet, document
  preview, and inspector. Do not add a new hand-built `fixed ... z-50`
  overlay. Choose `center`, `sheet`, or `fullscreen` based on the task and
  keep module-specific workflow content inside the shared shell.
- The shared shell provides Radix modal behavior: inert background content,
  focus containment and restoration, Escape close, safe-area padding, and a
  scrollable viewport. Every dialog has an accessible title, a concise
  description when useful, and a visible 44px close or cancel action.
- Use the shared `modal-panel`, `modal-header`, `modal-body`, and `modal-footer`
  tokens. Keep headings sentence case and medium/semibold; reserve heavier
  emphasis for the primary action and critical status. Limit each dialog to
  one visually dominant action and a quieter cancel/close action.
- Long forms use an internal `modal-body` scroll region and preserve the
  footer action row on narrow screens. Document print preview may use the
  `fullscreen` variant, but its controls still use the same branded tokens.
- SmoothUI is a visual and motion reference only. Reuse its responsive,
  deliberate, accessible interaction principles with the existing Radix and
  CSS stack; do not add a second component framework for a modal.

### Notification contract

- Use `NotificationCenter` for non-blocking feedback. Every call supplies an
  explicit `severity` (`info`, `success`, `warning`, or `error`), a concise
  message, and an optional title; severity is never inferred from message text.
- Routine success, preview, role, scan, access, and unavailable messages remain
  non-blocking toasts. User-action results use Radix foreground announcements;
  low-urgency informational updates default to background announcements.
  Blocking workflow validation stays inline beside the affected control.
  Offline mode is communicated by the persistent page status region, not by a
  repeated popup.
- The shared queue deduplicates identical messages, keeps up to 20 pending
  items, shows four at a time, supports Radix close and swipe dismissal, and
  uses predictable severity durations. Radix pauses closing on hover, focus,
  and window blur. The viewport clears the mobile bottom navigation and the
  device safe area. Toast animation is reduced-motion safe.
- Inline validation uses a pre-existing or injected `role="alert"`
  / `aria-live="assertive"` region and points the affected input to it with
  `aria-describedby`; set `aria-invalid="true"` while the error applies.
- Use an `alertdialog` only when the user must address an interruption. It
  needs a visible title, a concise `aria-describedby` message, modal focus
  containment, focus restoration, and a visible close or cancel action. Do not
  use a global Enter handler to dismiss it.

References: [Radix Toast](https://www.radix-ui.com/primitives/docs/components/toast),
[WAI-ARIA Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/),
[WAI-ARIA Alert and Message Dialogs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/),
and [WAI-ARIA Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

### Motion and component references

- [SmoothUI](https://github.com/educlopez/smoothui) is a selective reference
  for restrained React/Tailwind interaction patterns, not a replacement for
  the existing Radix primitives or a reason to add decorative components.
- If Motion is introduced later, follow its [accessibility guidance](https://motion.dev/docs/react-accessibility)
  and wrap the smallest useful surface with
  [`MotionConfig reducedMotion="user"`](https://motion.dev/docs/react-motion-config).
  Prefer opacity/background feedback; do not animate tables, totals, approval
  controls, or other audit-sensitive values.
- The current pass uses CSS transitions and the existing reduced-motion media
  query, so it adds no animation dependency or runtime network requirement.

### Permission and authentication boundary

- `src/lib/permissions.ts` is the shared typed client-side permission model.
  It owns allowed tabs, operation helpers, approval selectors, reviewable PO
  targets, and role/action-specific navigation counts.
- The role selector is a demo simulation. UI filtering is not backend security;
  the Go API accepts a valid `X-Demo-Role` only while `APP_ENV=demo`; requests
  outside demo mode fail closed until a real identity provider is configured.
  The demo header is routing context, not proof of identity. Real
  authentication, session identity, and server-enforced production
  authorization remain release prerequisites.

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
- [Next.js CSS guidance](https://nextjs.org/docs/app/getting-started/css)
- [Next.js accessibility guidance](https://nextjs.org/docs/architecture/accessibility)
- [Tailwind responsive design](https://tailwindcss.com/docs/responsive-design)
- [Tailwind hover and focus states](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [WAI-ARIA Authoring Practices: Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
- [WAI-ARIA Authoring Practices: Disclosure Navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)
- [WCAG 2.2: Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
- [WCAG 2.2: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [WCAG 2.2: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance)

WCAG 2.2 is the conformance target for new UI work. Automated checks are only
one part of review; keyboard, responsive, visual, and assistive-technology
testing still require human verification.
