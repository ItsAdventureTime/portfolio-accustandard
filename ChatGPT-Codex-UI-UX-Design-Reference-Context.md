# ChatGPT Codex Context: UI/UX Design Reference for Web and Mobile Apps

> **Purpose:** Persistent context for ChatGPT Codex when planning, designing, implementing, reviewing, or refactoring web and mobile application interfaces.
>
> **Last reviewed:** 2026-07-23
>
> **Use as:** `UI-UX-CODEX-CONTEXT.md`, a referenced specification, or selected sections inside `AGENTS.md`.

---

## 1. Mission

Act as a senior product designer, UX engineer, accessibility specialist, and frontend/mobile engineer.

Create interfaces that are:

- appropriate for the product, users, platform, and business workflow;
- clear, efficient, accessible, responsive, and touch-friendly;
- visually coherent without imitating a specific product;
- implemented with maintainable components and design tokens;
- verified through tests, automated checks, and manual review;
- based primarily on official design systems and explicitly licensed open-source resources.

Do not treat visual polish as a substitute for correct information architecture, task flow, accessibility, performance, or reliability.

---

## 2. Project Inputs

Read these values from the task, repository, documentation, screenshots, and existing code. Infer only when the evidence is strong.

```yaml
project_name: "{{PROJECT_NAME}}"
product_type: "{{web_app | mobile_app | responsive_web | PWA | dashboard | website}}"
target_platforms: ["{{desktop}}", "{{tablet}}", "{{mobile}}"]
primary_users: ["{{USER_GROUPS}}"]
primary_jobs_to_be_done: ["{{CORE_TASKS}}"]
framework: "{{Next.js | React | Vue | Nuxt | Svelte | SvelteKit | Flutter | React Native | native iOS | native Android | other}}"
existing_component_library: "{{LIBRARY_OR_NONE}}"
brand_constraints: "{{COLORS_TYPE_STYLE_OR_NONE}}"
accessibility_target: "WCAG 2.2 AA"
browser_or_os_support: "{{SUPPORT_MATRIX}}"
performance_constraints: "{{BUDGETS_OR_NONE}}"
reference_screens_or_files: ["{{PATHS_OR_URLS}}"]
```

When values are missing, inspect the repository before choosing defaults. State material assumptions in the implementation plan.

---

## 3. Codex Operating Rules

1. Read all applicable `AGENTS.md` files and repository documentation before editing.
2. Inspect the current stack, component patterns, tokens, routes, tests, lint configuration, and build commands.
3. For large changes, first produce a concise implementation plan. Break the work into reviewable units.
4. Structure work like a well-written GitHub issue:
   - problem;
   - affected users;
   - scope;
   - files/components;
   - acceptance criteria;
   - validation commands.
5. Prefer adapting existing project patterns over introducing a second design system.
6. Use the fewest dependencies that solve the problem correctly.
7. Never replace a functional workflow merely to make the interface look more fashionable.
8. Run relevant tests, type checks, linters, accessibility checks, and production builds.
9. Report failures, skipped checks, assumptions, and unresolved risks.
10. Do not claim visual parity or accessibility conformance without evidence.

---

## 4. Reference Priority

Use references in this order:

1. **The product requirements and real user workflow**
2. **Existing repository conventions and components**
3. **Platform-native guidance**
4. **Official, accessible design systems**
5. **Licensed open-source primitives and components**
6. **Real-product inspiration galleries for abstract patterns only**
7. **General visual trends**

When references conflict, user needs, accessibility, platform conventions, and project consistency take precedence.

### Do not mix design systems casually

Choose:

- one primary visual/design language;
- one component primitive layer where needed;
- one icon family;
- one spacing, type, color, radius, and elevation system.

Do not combine Material, Fluent, Carbon, Apple, and multiple Tailwind kits into an incoherent interface.

---

## 5. Design Process

### Phase A: Understand

Before implementation:

- identify the primary users and their most frequent tasks;
- map the current and desired user flow;
- identify destructive, irreversible, sensitive, or high-risk actions;
- inspect loading, empty, error, offline, unauthorized, and permission-denied states;
- determine desktop, tablet, mobile, pointer, keyboard, and touch requirements;
- identify domain-specific terminology and avoid replacing it with generic labels.

For an existing application, preserve working behavior unless the task explicitly authorizes workflow changes.

### Phase B: Select References

Create a small reference matrix:

| Need | Selected reference | Pattern to borrow | What not to copy |
|---|---|---|---|
| Navigation | {{SOURCE}} | hierarchy and interaction model | branding and exact visuals |
| Forms | {{SOURCE}} | labels, errors, grouping | product-specific text |
| Data display | {{SOURCE}} | density and responsive behavior | proprietary layouts |
| Mobile flow | {{SOURCE}} | platform convention | screenshots/assets |
| Accessibility | WCAG/APG | semantics and keyboard model | none |

Use two to four strong references rather than a large mood board.

### Phase C: Define UX

Specify:

- information architecture;
- navigation model;
- page/screen hierarchy;
- main task flow;
- secondary actions;
- form validation and recovery;
- confirmation rules;
- permission and role behavior;
- search, filter, sort, pagination, and bulk actions;
- data density;
- notification and feedback behavior.

Use progressive disclosure. Keep the most common action obvious. Hide complexity only when it remains discoverable.

### Phase D: Define the Visual System

Use explicit tokens rather than scattered values:

```css
/* Example token categories, not prescribed values */
--color-bg
--color-surface
--color-text
--color-text-muted
--color-border
--color-primary
--color-danger
--color-warning
--color-success
--space-1 ... --space-n
--radius-sm ... --radius-lg
--shadow-sm ... --shadow-lg
--font-sans
--text-xs ... --text-2xl
--motion-fast
--motion-standard
```

Define:

- typography scale and line height;
- spacing rhythm;
- container and grid rules;
- surface hierarchy;
- borders and elevation;
- component states;
- motion behavior;
- dark mode only when required or already supported.

### Phase E: Implement

Build or refactor in this order:

1. tokens and theme;
2. semantic layout;
3. reusable primitives;
4. navigation and page shell;
5. task-critical components;
6. secondary screens;
7. responsive adaptations;
8. motion and decorative polish;
9. tests and documentation.

Prefer semantic HTML and native controls. Use ARIA only when native semantics are insufficient.

### Phase F: Verify

Validate:

- task completion;
- keyboard-only operation;
- visible focus;
- screen-reader names and relationships;
- contrast;
- zoom and text resizing;
- responsive layouts;
- touch target size and spacing;
- loading, empty, error, success, and disabled states;
- reduced motion;
- overflow and long content;
- localization expansion;
- slow network behavior;
- runtime errors;
- production build.

---

## 6. Quality Baseline

### Information hierarchy

- Every screen has a clear purpose and primary action.
- Headings accurately describe the content below them.
- Related fields and actions are grouped.
- Secondary actions are visually subordinate.
- Destructive actions are separated and clearly labeled.

### Forms

- Use persistent visible labels.
- Do not rely on placeholder text as the label.
- Place validation near the affected field.
- Preserve valid user input after errors.
- Explain how to fix an error.
- Use appropriate input types and autocomplete attributes.
- Confirm destructive or high-impact submissions.
- Do not disable submission without explaining why.

### Data-heavy interfaces

- Optimize for scanning and comparison.
- Preserve column meaning at narrower widths.
- Use responsive tables, controlled horizontal scrolling, cards, or detail drawers based on the task.
- Keep filters visible or easily recoverable.
- Display active filters.
- Make sorting state explicit.
- Support empty and zero-result states separately.
- Avoid excessive card nesting.

### Navigation

- Make current location clear.
- Keep navigation labels stable.
- Use breadcrumbs only when hierarchy benefits from them.
- Preserve state when users move between list and detail views.
- Do not hide critical desktop navigation behind a mobile menu without a reason.

### Feedback and states

Every asynchronous or state-changing component must cover:

- idle;
- hover where applicable;
- focus-visible;
- active/pressed;
- loading;
- success;
- warning;
- error;
- disabled;
- empty;
- permission denied;
- offline or retry state where relevant.

### Content design

- Use specific action labels, such as `Save changes`, not `Submit`.
- Put the most important words first.
- Avoid vague confirmations such as `Are you sure?`
- Explain consequences for destructive actions.
- Keep helper text concise.
- Use domain language consistently.

---

## 7. Accessibility Requirements

Target **WCAG 2.2 Level AA** unless the project requires a stricter standard.

Required implementation principles:

- semantic landmarks and heading order;
- accessible names for controls;
- programmatic labels, descriptions, errors, and status messages;
- complete keyboard operation;
- logical focus order;
- focus trapping and restoration for modal patterns;
- visible focus indicators;
- sufficient text and non-text contrast;
- no color-only communication;
- reflow and zoom support;
- support for text spacing;
- reduced-motion behavior;
- accessible authentication and input assistance;
- no inaccessible custom controls when a native element works.

For complex widgets, follow the WAI-ARIA Authoring Practices Guide interaction model. Do not add ARIA roles mechanically.

Automated accessibility tools find only part of the problem. Pair automated checks with keyboard and screen-reader-oriented manual inspection.

---

## 8. Responsive and Mobile Requirements

Design from content and task priority, not arbitrary device labels.

Test at minimum:

- narrow phone;
- wide phone;
- tablet portrait;
- tablet landscape;
- common laptop;
- wide desktop.

Requirements:

- no unintended horizontal page overflow;
- controls remain reachable and legible;
- touch targets are comfortably sized and separated;
- sticky UI does not cover content or focus targets;
- dialogs and drawers fit small viewports;
- virtual keyboards do not hide critical controls;
- tables have an explicit small-screen strategy;
- navigation does not rely only on hover;
- safe areas are respected on native/mobile web platforms;
- orientation changes preserve state where relevant.

Use platform-native navigation patterns for native applications unless the product has a strong reason not to.

---

## 9. Performance and Maintainability

- Prefer server rendering, static rendering, or progressive enhancement where supported by the stack.
- Avoid adding large UI libraries for one component.
- Import only needed icons and modules.
- Prevent layout shift by reserving media and skeleton dimensions.
- Avoid animation on expensive layout properties.
- Use virtualized rendering only when data volume justifies its complexity.
- Keep component APIs small and typed.
- Separate data logic from presentation.
- Centralize reusable tokens and variants.
- Document non-obvious interaction behavior.
- Avoid duplicate components that differ only cosmetically.

---

## 10. Visual Anti-Patterns

Do not default to stereotypical generated-app styling:

- arbitrary purple/blue gradients;
- glassmorphism without functional purpose;
- excessive blur, glow, shadows, or transparency;
- oversized border radii everywhere;
- nested cards for every content group;
- decorative charts with invented data;
- random icon use;
- enormous hero text in operational interfaces;
- low-contrast gray text;
- animation that delays work;
- desktop layouts merely compressed onto mobile;
- copying a recognizable product’s exact composition, branding, or trade dress.

A restrained interface with strong hierarchy is preferable to visual novelty.

---

# 11. Curated Reference Registry

## A. Platform and Full Design Systems

### Material Design 3

- Guidance: https://m3.material.io/
- Web components: https://github.com/material-components/material-web
- Android Compose Material 3: https://developer.android.com/jetpack/androidx/releases/compose-material3
- Flutter Material: https://docs.flutter.dev/ui/design/material
- Typical license: Apache-2.0 or BSD-3-Clause for implementation code; verify each repository.
- Best for: Android, cross-platform products, adaptive color, broad component guidance.
- Caution: Do not make an iOS app feel mechanically Android unless cross-platform consistency is an explicit product decision.

### Apple Human Interface Guidelines

- Guidance: https://developer.apple.com/design/human-interface-guidelines/
- Design resources: https://developer.apple.com/design/resources/
- Best for: iOS, iPadOS, macOS, watchOS, tvOS, and visionOS conventions.
- License class: platform-restricted/custom.
- Caution: Apple templates, SF Symbols, product bezels, and other assets have specific terms. Use only for permitted Apple-platform work.

### Microsoft Fluent 2

- Guidance: https://fluent2.microsoft.design/
- Code: https://github.com/microsoft/fluentui
- License: MIT for the main Fluent UI repository.
- Best for: productivity applications, Microsoft ecosystem integrations, data-heavy enterprise UI.

### IBM Carbon

- Guidance: https://carbondesignsystem.com/
- Code: https://github.com/carbon-design-system/carbon
- License: Apache-2.0.
- Best for: enterprise products, dense dashboards, complex forms, structured data workflows.
- AI-friendly feature: Carbon publishes machine-readable and agent-oriented tooling, including Carbon MCP resources.

### GitHub Primer

- Guidance: https://primer.style/
- Code organization: https://github.com/primer
- Best for: developer tools, technical products, dense application interfaces.
- License: verify the specific Primer repository or package before reuse.

### GOV.UK Design System

- Guidance: https://design-system.service.gov.uk/
- Code: https://github.com/alphagov/govuk-frontend
- License: MIT for code; content may use the UK Open Government Licence.
- Best for: highly usable transactional services, forms, validation, plain-language patterns.

### U.S. Web Design System

- Guidance: https://designsystem.digital.gov/
- Code: https://github.com/uswds/uswds
- License: primarily public-domain U.S. government work with third-party notices; inspect `LICENSE.md`.
- Best for: accessible public services, forms, information-heavy responsive sites.

### Shopify Polaris

- Guidance: https://polaris.shopify.com/
- Best for: Shopify apps and Shopify-integrated experiences.
- License class: restricted/custom for major Polaris assets and packages.
- Caution: Do not treat Polaris as a general-purpose unrestricted design kit. Check current terms before use outside the Shopify ecosystem.

---

## B. Accessible Primitives and Code-First UI Libraries

### Base UI

- Docs: https://base-ui.com/
- Package: `@base-ui/react`
- License: MIT.
- Best for: custom React design systems requiring accessible, unstyled primitives.
- Notes: follows WAI-ARIA patterns and WCAG-oriented component behavior.

### Radix Primitives

- Docs: https://www.radix-ui.com/primitives
- Code: https://github.com/radix-ui/primitives
- License: MIT.
- Best for: accessible React primitives and mature interaction patterns.

### React Aria

- Docs: https://react-spectrum.adobe.com/react-aria/
- Code: https://github.com/adobe/react-spectrum
- License: Apache-2.0 for the repository.
- Best for: accessible behavior, internationalization, and custom visual systems.

### shadcn/ui

- Docs: https://ui.shadcn.com/
- Code: https://github.com/shadcn-ui/ui
- License: MIT for the official open-source project.
- Best for: editable application components, Tailwind workflows, code ownership.
- Rule: Treat copied components as project code. Audit semantics, variants, dependencies, and consistency rather than accepting generated defaults.
- Current note: shadcn/ui supports both Base UI and Radix-based approaches. Use the project’s existing primitive layer.

### Material UI

- Docs: https://mui.com/material-ui/
- Code: https://github.com/mui/material-ui
- License: MIT for Material UI core. Some MUI X advanced packages use commercial licenses.
- Best for: React applications needing a mature, comprehensive component library.

### Chakra UI

- Docs: https://chakra-ui.com/
- Code: https://github.com/chakra-ui/chakra-ui
- License: MIT.
- Best for: accessible React applications with token-driven styling.

### Mantine

- Docs: https://mantine.dev/
- Code: https://github.com/mantinedev/mantine
- License: MIT.
- Best for: feature-rich React applications, forms, hooks, dashboards.

### Headless UI

- Docs: https://headlessui.com/
- Code: https://github.com/tailwindlabs/headlessui
- License: MIT.
- Best for: unstyled accessible components in Tailwind-oriented React and Vue projects.

### daisyUI

- Docs: https://daisyui.com/
- Code: https://github.com/saadeghi/daisyui
- License: MIT for the open-source library.
- Best for: fast Tailwind prototypes and themeable basic components.
- Caution: Customize intentionally to avoid a generic template appearance.

### Flowbite

- Docs: https://flowbite.com/docs/
- Code: https://github.com/themesberg/flowbite
- License: MIT for the open-source component library; Pro assets have separate terms.
- Best for: Tailwind-based interfaces and quick component scaffolding.

### Storybook

- Docs: https://storybook.js.org/
- Code: https://github.com/storybookjs/storybook
- License: MIT.
- Best for: isolated component development, documentation, visual review, interaction tests, and design-system governance.

### Vue and Svelte Options

- Nuxt UI: https://ui.nuxt.com/
- Vuetify: https://vuetifyjs.com/
- Skeleton: https://www.skeleton.dev/
- shadcn-svelte: https://www.shadcn-svelte.com/
- Rule: Verify the current license and framework compatibility before adoption. Prefer the library already present in the repository.

---

## C. Mobile UI Implementations

### Android

- Material 3 guidance: https://m3.material.io/
- Compose Material 3: https://developer.android.com/jetpack/androidx/releases/compose-material3
- License: AndroidX implementation code is generally Apache-2.0.
- Use for: native Android interaction, theming, navigation, adaptive layouts.

### iOS and Apple Platforms

- HIG: https://developer.apple.com/design/human-interface-guidelines/
- SwiftUI: https://developer.apple.com/xcode/swiftui/
- Use for: platform-native navigation, controls, gestures, safe areas, typography, and accessibility.
- Caution: verify asset and symbol licenses.

### Flutter

- Material: https://docs.flutter.dev/ui/design/material
- Cupertino: https://docs.flutter.dev/ui/widgets/cupertino
- Code license: Flutter SDK is BSD-3-Clause.
- Use for: cross-platform apps with deliberate platform adaptation.

### React Native

- React Native Paper: https://callstack.github.io/react-native-paper/
- Tamagui: https://tamagui.dev/
- NativeWind: https://www.nativewind.dev/
- Rule: Do not force the same component styling onto Android and iOS when it conflicts with expected platform behavior. Verify each package’s current license and architecture support.

---

## D. Accessibility, Interaction, and Testing

### Standards

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI-ARIA overview: https://www.w3.org/WAI/standards-guidelines/aria/
- ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/

### Tools

- axe-core: https://github.com/dequelabs/axe-core
  - License: MPL-2.0.
  - Use for: automated accessibility rules.
- Lighthouse: https://github.com/GoogleChrome/lighthouse
  - License: Apache-2.0.
  - Use for: accessibility, performance, SEO, and best-practice audits.
- Playwright: https://playwright.dev/
  - Code: https://github.com/microsoft/playwright
  - License: Apache-2.0.
  - Use for: browser, viewport, keyboard, interaction, screenshot, and regression tests.
- Storybook accessibility addon: https://storybook.js.org/addons/@storybook/addon-a11y
  - Use for: component-level accessibility feedback.

Do not equate a passing automated scan with full accessibility.

---

## E. Icons and Illustration Assets

### Preferred open icon families

Choose one family per product:

- Lucide: https://lucide.dev/ — ISC
- Heroicons: https://heroicons.com/ — MIT
- Tabler Icons: https://tabler.io/icons — MIT
- Phosphor Icons: https://phosphoricons.com/ — MIT
- Material Symbols: https://fonts.google.com/icons — Apache-2.0
- Iconify framework: https://iconify.design/ — MIT for the framework; each underlying icon set has its own license

Rules:

- import only used icons;
- preserve accessible names for meaningful icons;
- mark decorative icons as hidden from assistive technology;
- do not mix unrelated icon families;
- do not use icons as the sole label for unfamiliar actions;
- verify the exact upstream icon-set license when using Iconify.

### Open illustration sources

- Open Peeps: https://openpeeps.com/ — CC0
- Humaaans: https://www.humaaans.com/ — CC0

Use illustrations to support comprehension, onboarding, or empty states. Do not add them merely to fill space.

---

## F. Structured and AI-Friendly References

### Design tokens and machine-readable systems

- Style Dictionary: https://amzn.github.io/style-dictionary/
- W3C Design Tokens Community Group: https://www.w3.org/community/design-tokens/
- Storybook component stories: https://storybook.js.org/docs/writing-stories
- Base UI LLM-oriented documentation: https://base-ui.com/react/overview/quick-start
- Carbon Design System and Carbon MCP: https://carbondesignsystem.com/

Prefer references that expose:

- component source;
- design tokens;
- Storybook stories;
- interaction tests;
- accessibility notes;
- responsive examples;
- JSON or structured metadata;
- versioned documentation.

These are more reliable for Codex than screenshots alone.

### Research datasets

- Rico archive: https://www.interactionmining.org/archive/rico
- Enrico: https://userinterfaces.aalto.fi/enrico/

Use datasets for research, taxonomy, layout analysis, or benchmarking. Do not assume that screenshots, app branding, or assets can be reused commercially. Verify the exact dataset and upstream content licenses before downloading, training, redistribution, or production use.

---

## G. Inspiration-Only Galleries

These resources can reveal real-world patterns but are not open-source component libraries:

- Mobbin: https://mobbin.com/
- Refero: https://refero.design/
- Refero Styles / `DESIGN.md` examples: https://styles.refero.design/
- Screenlane: https://screenlane.com/
- Page Flows: https://pageflows.com/

Use them only to study abstract patterns such as:

- information hierarchy;
- flow sequencing;
- onboarding structure;
- navigation placement;
- empty-state strategy;
- form grouping;
- progressive disclosure;
- responsive adaptation.

Do not:

- copy a complete screen;
- reproduce distinctive branding or trade dress;
- extract proprietary assets;
- assume free viewing means free reuse;
- use gallery screenshots as production assets;
- scrape or redistribute content contrary to site terms.

---

# 12. License Safety Rules

Classify every external resource before reuse:

| Class | Meaning | Action |
|---|---|---|
| Green | MIT, Apache-2.0, BSD, ISC, CC0, or clearly compatible license | Reuse within license terms and preserve required notices |
| Yellow | Custom, platform-specific, attribution-required, dual-licensed, or free-tier proprietary | Review exact terms before reuse |
| Red | No license, unclear ownership, copied screenshot, trademarked asset, or incompatible terms | Do not copy or redistribute |

Rules:

1. A public GitHub repository without a license is not automatically reusable.
2. `Free to view` does not mean `open source`.
3. A design guideline may be free to read while its assets have restricted licenses.
4. A component library may have an open-source core and commercial advanced components.
5. Record third-party notices when required.
6. Never remove attribution, copyright, or license files required by the upstream project.
7. When uncertain, implement an original equivalent from documented interaction patterns rather than copying code or assets.

---

# 13. Required Deliverables From Codex

For a design or implementation task, provide:

## Before editing

1. brief repository findings;
2. selected design references and why;
3. UX risks and assumptions;
4. implementation plan;
5. affected files;
6. acceptance criteria.

## After editing

1. summary of changes;
2. design and UX decisions;
3. changed files;
4. responsive behavior;
5. accessibility behavior;
6. tests and commands run;
7. results and failures;
8. unresolved issues;
9. license or attribution notes for added assets.

Do not output a long design essay when the task requires code. Keep the explanation proportional to the change.

---

# 14. Acceptance Criteria Template

Adapt this checklist to the task:

```markdown
## Functional
- [ ] Primary workflow completes successfully.
- [ ] Existing behavior is preserved unless explicitly changed.
- [ ] Loading, empty, success, validation, and error states exist.
- [ ] Destructive actions communicate consequences.

## UX
- [ ] Primary action is clear.
- [ ] Navigation and terminology are consistent.
- [ ] Forms preserve input and provide actionable errors.
- [ ] List/detail state is preserved where expected.
- [ ] Mobile and desktop layouts support the same core task.

## Accessibility
- [ ] Semantic structure is valid.
- [ ] Keyboard operation is complete.
- [ ] Focus is visible and logically managed.
- [ ] Controls have accessible names.
- [ ] Contrast and non-color indicators are adequate.
- [ ] Reduced motion is respected.
- [ ] Automated a11y checks pass or exceptions are documented.

## Responsive
- [ ] No unintended overflow.
- [ ] Narrow phone, tablet, laptop, and wide desktop were checked.
- [ ] Touch interactions and virtual keyboard behavior were checked.
- [ ] Dense data has a defined small-screen strategy.

## Engineering
- [ ] Type check passes.
- [ ] Lint passes.
- [ ] Relevant unit/component/E2E tests pass.
- [ ] Production build passes.
- [ ] New dependencies are justified.
- [ ] Third-party licenses are documented.
```

---

# 15. Reusable Codex Task Prompt

Copy, complete, and submit this with the repository attached:

```markdown
Use `UI-UX-CODEX-CONTEXT.md` as the governing design reference for this task.

## Goal
{{Describe the user-visible result.}}

## Users and workflow
- Primary users: {{users}}
- Main task: {{task}}
- Current pain points: {{pain points}}
- Critical constraints: {{constraints}}

## Scope
- In scope: {{pages, routes, components, flows}}
- Out of scope: {{explicit exclusions}}
- Preserve: {{existing behavior, data model, API, branding}}

## Technical context
- Framework: {{framework}}
- Existing design system/components: {{library}}
- Relevant files: {{paths}}
- Run commands: {{dev, test, lint, build}}
- Supported platforms/viewports: {{matrix}}

## Visual direction
{{Describe desired tone using concrete attributes: density, typography, contrast, spacing, surface treatment, and platform expectations.}}

Use these references for patterns, not copying:
1. {{official design-system URL and target pattern}}
2. {{open-source component reference and target pattern}}
3. {{optional inspiration reference and target pattern}}

## Required states
{{loading, empty, validation, error, success, disabled, unauthorized, offline, etc.}}

## Acceptance criteria
{{Insert measurable criteria.}}

## Workflow
1. Inspect the repository and applicable `AGENTS.md`.
2. Explain the current implementation and identify risks.
3. Propose a concise plan before editing.
4. Implement in reviewable steps.
5. Use existing components and tokens where practical.
6. Verify accessibility, responsive behavior, tests, lint, type checks, and production build.
7. Report exact commands, results, assumptions, and unresolved issues.
```

---

# 16. Compact Instruction for Follow-Up Tasks

```markdown
Follow `UI-UX-CODEX-CONTEXT.md`. Preserve the established design system and workflow. Implement only the requested change, cover all component states, verify keyboard and responsive behavior, run the relevant checks, and report evidence.
```

---

# 17. Maintenance

Before starting a substantial new project:

- confirm that selected libraries are actively maintained;
- inspect current documentation and release notes;
- verify framework/version compatibility;
- re-check licenses;
- replace deprecated components or repositories;
- update this registry when a primary reference materially changes.

Do not rely on model memory for current package APIs, platform rules, or licenses when network/documentation access is available.

---

## OpenAI Codex Guidance Used to Structure This File

- https://openai.com/business/guides-and-resources/how-openai-uses-codex/
- https://openai.com/index/introducing-codex/
- https://openai.com/codex/
- https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan

The structure reflects current official guidance to use well-scoped issue-like tasks, persistent `AGENTS.md` context, configured development environments, explicit acceptance criteria, iterative planning, tests, and verifiable results.
