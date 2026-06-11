# AGENTS.md

## Project

This is a personal technical blog CMS built with Next.js and Supabase.

## Goals

- Public technical blog with strong SEO.
- Admin writing interface.
- Markdown-based post editing stored in Supabase.
- Future AI writing assistant using a private OCI LLM server.

## Stack

- Next.js App Router
- TypeScript
- Supabase
- Tailwind CSS
- Markdown rendering with react-markdown
- No separate backend server

## Architecture Principles

- Blog posts are stored in Supabase `posts` table as Markdown strings in the `content` column.
- No local `.md` files for posts.
- No separate backend server (NestJS, Express, etc.).
- Admin pages (`/admin/*`) require Supabase Auth.
- Public pages serve only `status = 'published'` posts.
- OCI LLM server is accessed only via Next.js Route Handlers — never from the browser directly.
- AI features are not yet implemented; the routing structure (`/api/ai/*`) is reserved.

## Directory Conventions

```
src/
├── app/                  # Next.js App Router pages and layouts
├── components/           # Shared UI components
├── features/             # Domain logic (queries, mutations, types)
│   └── posts/
│       ├── post.queries.ts
│       └── post.mutations.ts
├── lib/
│   ├── supabase/         # browser and server clients
│   ├── markdown/         # rendering and utils
│   ├── seo/              # metadata helpers
│   └── utils/            # slug, date, string utils
└── middleware.ts         # session refresh + admin auth guard
```

## Forbidden Actions

- Do not introduce a separate backend server.
- Do not store posts as local `.md` files.
- Do not call the OCI LLM server directly from the browser.
- Do not implement AI features until Phase 4 is explicitly started.
- Do not add WYSIWYG editors — use textarea + preview in admin.
- Do not force E2E tests before Phase 6.

## Rules

- Use Next.js Route Handlers for all server-side API logic.
- Keep public blog pages SEO-friendly (generateMetadata, JSON-LD, sitemap).
- Validate inputs with Zod where appropriate.
- Prefer simple implementation before abstraction.
- Supabase access logic belongs in `features/` or `lib/supabase/`, not scattered in components.

## Commands

```bash
pnpm dev          # 개발 서버
pnpm lint         # Biome lint
pnpm typecheck    # TypeScript typecheck
pnpm test         # Vitest unit tests
pnpm build        # Next.js production build
pnpm verify       # lint + typecheck + test + build (전체 검증)
```

## Task Completion Criteria

Every task is complete only when all of the following pass:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Code Style

- Formatter: Biome (space indent, width 2)
- No default exports except Next.js pages and layouts
- Use named exports for all lib and feature modules
- TypeScript strict mode
- Avoid `any` — use proper types or `unknown`
