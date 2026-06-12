@AGENTS.md

# CLAUDE.md

## Working style

Before making large changes, inspect the current structure and propose a short plan.
Prefer small, reviewable commits.
After changes, run `pnpm verify` when relevant.
On failure, report the exact error and the fix applied.

## Architecture decisions

- This project intentionally avoids a separate NestJS backend.
- Supabase is the database/auth/storage layer.
- Next.js Route Handlers are allowed for admin-only server logic and future AI proxy logic.
- Blog posts are stored in Supabase as Markdown text, not as local MDX files.

## Feature priorities

1. Public blog pages
2. Admin writing flow
3. SEO essentials
4. AI writing assistant
5. Visitor-facing AI helper

## Verification

Run after every non-trivial change:

```bash
pnpm verify   # = lint + typecheck + test + build
```

If `pnpm verify` does not exist yet, run individually:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Roadmap maintenance

After completing any task or phase:

1. Open `docs/roadmap.md`.
2. Mark each finished item `[x]` and append ` ✅ 완료` to the phase heading.
3. If a new file or step was added that wasn't in the original checklist, add it as a new `[x]` line.
4. Do **not** modify future phases — only update the phase that was just finished.

## Design System

Always read `DESIGN.md` before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.

Key rules:
- Font: Pretendard (all text) + JetBrains Mono (code only)
- Theme: system-following light/dark token sets; restrained amber accent
- Max content width: 672px, left-aligned, single column
- Post list: title + date text only — no card grids
- Theme styling uses CSS tokens and `prefers-color-scheme` only; no toggle or `data-theme`
- Decorative grid texture and reading progress are deferred
- Motion: color transitions only (150ms), no scroll animations

## Constraints (never violate)

- Do not add a separate backend server.
- Do not store posts as local `.md` files.
- Do not call OCI LLM from the browser — always proxy through `/api/ai/*`.
- Do not implement AI features until explicitly requested.
