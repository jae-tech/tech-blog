# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-06-12
- Primary product surfaces: public technical blog, private admin CMS
- Evidence reviewed: `src/app`, `src/components`, `tests/e2e`, approved RALPLAN at `.omx/plans/overall-design-review-20260612-ralplan-short.md`

## Brand
- Personality: calm Korean editorial notebook with technical precision
- Trust signals: clear hierarchy, readable code, restrained accent, predictable states
- Avoid: dashboard-like public UI, decorative noise, serif title drift, hidden state changes

## Product goals
- Goals: make published technical writing easy to read and Markdown posts easy to manage
- Non-goals: WYSIWYG editing, decorative grid texture, reading-progress UI, AI features
- Success signals: consistent public reading shell, explicit admin save state, verified responsive and theme behavior

## Personas and jobs
- Primary personas: Korean-speaking technical readers and the authenticated blog owner
- User jobs: discover and read posts; draft, preview, save, and publish Markdown posts
- Key contexts of use: desktop/mobile reading and primarily desktop authoring

## Information architecture
- Primary navigation: home, posts, tags
- Core routes/screens: `/`, `/posts`, `/posts/[slug]`, `/tags`, contextual category/tag pages, `/admin/posts`, admin editor
- Content hierarchy: title → metadata/category/tags → Markdown body; categories remain secondary/contextual

## Design principles
- Content outranks decoration.
- Public and admin share one token system but use different densities.
- Pretendard provides the title/body/UI hierarchy; JetBrains Mono is limited to code and metadata.
- Documentation, runtime, accessibility, and tests must describe the same contract.
- Tradeoffs: system-following theme reduces authored mood control but respects reader preference without theme UI complexity.

## Visual language
- Color: restrained warm-neutral light and dark token sets with amber `#f97316` used sparingly
- Typography: Pretendard for title/body/UI; JetBrains Mono for code and metadata
- Spacing/layout rhythm: 8px base rhythm; public reading column max-width 672px
- Shape/radius/elevation: subtle borders, 4–12px radii, no decorative elevation
- Motion: functional color/state transitions only; reduced motion respected
- Imagery/iconography: optional and content-led; no decorative illustration requirement

## Components
- Existing components to reuse: `PostCard`, `TagBadge`, `MarkdownRenderer`, `Button`
- New/changed components: active public navigation, admin navigation state, editor status feedback
- Variants and states: focus, active/current, clean/unsaved, clean/saved, dirty, saving, saved, error
- Token/component ownership: global tokens and prose live in `src/app/globals.css`; reusable controls live in `src/components/ui`

## Accessibility
- Target standard: WCAG 2.2 AA-oriented implementation
- Keyboard/focus behavior: skip link to `#main-content`, visible focus ring, `aria-current="page"` for active navigation
- Contrast/readability: verify resolved foreground/background tokens in light and dark emulation
- Screen-reader semantics: preserve semantic headings, navigation, main, article, labels, and status announcements
- Reduced motion and sensory considerations: honor `prefers-reduced-motion`; do not rely on color alone for save state

## Responsive behavior
- Supported breakpoints/devices: Playwright desktop and mobile projects; admin authoring split at 1024px
- Layout adaptations: public remains single-column; editor/preview is side-by-side at 1024px and above, toggle below
- Touch/hover differences: controls remain visible and usable without hover

## Interaction states
- Loading: actions expose saving state and disable duplicate submission
- Empty: existing public/admin empty messages remain explicit
- Error: editor displays save/publish failure until edit or retry
- Success: editor displays saved status with a label/timestamp until the next edit
- Disabled: disabled controls remain legible and non-interactive
- Offline/slow network: saving state persists until the request resolves or rejects

## Content voice
- Tone: concise, calm, technical, Korean-first
- Terminology: use consistent Korean UI labels with English technical terms where conventional
- Microcopy rules: state what happened and what action is available; avoid decorative copy

## Implementation constraints
- Framework/styling system: Next.js App Router, TypeScript, Tailwind CSS v4, CSS custom properties
- Design-token constraints: light defaults plus dark overrides only in `@media (prefers-color-scheme: dark)`; no theme toggle, persistence, script, selector, or `dark:` utilities
- Performance constraints: preserve server-rendered public content and SEO behavior
- Compatibility constraints: preserve Supabase architecture and Markdown textarea + preview
- Test/screenshot expectations: `pnpm verify` plus four-state Playwright matrix and explicit auth-skip evidence

## Open questions
- [ ] Revisit decorative grid texture only after the core contract remains stable.
- [ ] Revisit reading progress only if long-form reader evidence supports it.

## Decisions log
| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-06-12 | Adopt system-following editorial notebook | Respect reader preference without theme UI complexity |
| 2026-06-12 | Use Pretendard for title/body/UI | Resolve typography drift and optimize Korean readability |
| 2026-06-12 | Keep categories contextual | Preserve compact primary navigation |
| 2026-06-12 | Defer grid texture and reading progress | Contract repair has higher value than decoration |
