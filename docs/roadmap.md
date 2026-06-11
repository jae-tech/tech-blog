# Roadmap — jae-tech-blog

## Phase 1 — 블로그 공개 페이지 ✅ 완료

목표: 방문자가 글을 읽을 수 있는 최소 블로그.

- [x] Supabase 프로젝트 생성 및 DB 스키마 적용 (`docs/database-schema.md` SQL 실행)
- [x] 환경변수 설정 (`.env.local` — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [x] `lib/supabase/client.ts` — browser Supabase client
- [x] `lib/supabase/server.ts` — server Supabase client (cookies 기반)
- [x] `lib/supabase/static.ts` — 빌드 타임 전용 client (generateStaticParams용)
- [x] `features/posts/post.queries.ts` — `getPublishedPosts`, `getPostBySlug`, `getPublishedPostSlugs`
- [x] `features/categories/category.queries.ts`
- [x] `features/tags/tag.queries.ts`
- [x] `/` 홈 페이지 — 최신 글 목록
- [x] `/posts` 글 목록 페이지
- [x] `/posts/[slug]` 글 상세 페이지 (SSG + ISR 60s + dynamicParams)
- [x] `/tags/[slug]` 태그별 글 목록
- [x] `/categories/[slug]` 카테고리별 글 목록
- [x] `lib/markdown/render.tsx` — react-markdown + remark-gfm + rehype-slug 설정
- [x] `lib/seo/metadata.ts` — `generatePostMetadata`, `generateListMetadata`
- [x] `lib/utils/slug.ts`, `lib/utils/date.ts`, `lib/utils/string.ts` 유틸 함수
- [x] 단위 테스트 작성 (slug, date, string, markdown utils — 21개)
- [x] `proxy.ts` — Supabase 세션 갱신 + `/admin/*` 인증 guard (Next.js 16 proxy 규칙)

완료 기준: `pnpm lint && pnpm typecheck && pnpm test && pnpm build` 통과 ✅

---

## Phase 2 — 관리자 글쓰기 ✅ 완료

목표: 관리자가 로그인 후 글을 작성·수정·발행할 수 있다.

- [x] `middleware.ts` — Supabase 세션 갱신 + `/admin/*` 인증 guard
- [x] `/admin/login` 로그인 페이지 (Supabase Auth email/password)
- [x] `/admin` 대시보드 (→ `/admin/posts` 리다이렉트)
- [x] `/admin/posts` 글 목록 (draft 포함)
- [x] `/admin/posts/new` 글 작성 페이지
  - 제목, slug (자동 생성 + 수동 수정)
  - Markdown textarea + 실시간 preview
  - excerpt (자동 생성 + 수동 수정)
  - meta title, meta description
  - 카테고리 선택
  - 태그 선택 / 추가
  - draft 저장 버튼
  - published 발행 버튼
- [x] `/admin/posts/[id]/edit` 글 수정 페이지
- [x] `features/posts/post.mutations.ts` — `createPost`, `updatePost`, `deletePost`, `upsertTags`
- [x] `features/posts/post.admin-queries.ts` — `getAdminPosts`, `getAdminPostById`
- [x] `api/admin/posts` Route Handler — POST (글 생성), PATCH (글 수정)
- [x] Zod 스키마로 입력 유효성 검사
- [x] 관리자 레이아웃 (`/admin/layout.tsx`) — 인증 확인

완료 기준: 관리자가 로그인 → 글 작성 → draft 저장 → published 발행 → 공개 페이지에서 확인

완료: `pnpm lint && pnpm typecheck && pnpm test && pnpm build` 통과 ✅

---

## Phase 3 — SEO / RSS / Sitemap ✅ 완료

목표: 검색 엔진 색인에 유리한 구조 완성.

- [x] `lib/seo/metadata.ts` — `generatePostMetadata`, `generateListMetadata` 헬퍼
- [x] 글 상세 페이지 `generateMetadata()` — title, description, canonical, Open Graph
- [x] Article JSON-LD 구조화 데이터 (`src/components/seo/JsonLd.tsx`)
- [x] `src/app/sitemap.ts` — published 글 목록 기반 동적 sitemap
- [x] `src/app/robots.ts` — robots.txt (admin 차단)
- [x] `src/app/api/rss/route.ts` — RSS 2.0 feed
- [x] OG 이미지 전략: thumbnail_url 정적 fallback (별도 서버 불필요)
- [x] 단위 테스트: SEO metadata 생성 함수 10개 (`tests/unit/lib/metadata.test.ts`)

완료: `pnpm lint && pnpm typecheck && pnpm test && pnpm build` 통과 ✅ (31 tests)

---

## Phase 4 — AI 관리자 보조 기능

목표: OCI LLM 서버를 연결해 글쓰기 보조 기능 제공.

전제 조건: OCI LLM 서버 엔드포인트 확보, API 스펙 결정.

- [ ] `lib/ai/oci-client.ts` — OCI LLM 호출 함수 (server-only)
- [ ] `/api/ai/title/route.ts` — 제목 추천
- [ ] `/api/ai/outline/route.ts` — 목차 생성
- [ ] `/api/ai/summary/route.ts` — 글 요약
- [ ] `/api/ai/tags/route.ts` — 태그 추천
- [ ] `/api/ai/rewrite/route.ts` — 문장 다듬기
- [ ] 관리자 에디터에 AI 버튼 통합
- [ ] `ai_drafts` 테이블에 AI 결과 저장

호출 구조 원칙: `Browser → /api/ai/* → OCI LLM` (브라우저 직접 호출 금지)

완료 기준: 관리자 에디터에서 AI 기능 동작 확인

---

## Phase 5 — 방문자용 AI 도우미

목표: 글 읽는 방문자에게 AI 기반 부가 기능 제공.

- [ ] `/api/ai/post-qa/route.ts` — 현재 글 기반 Q&A
- [ ] `/api/ai/error-help/route.ts` — 에러 메시지 해결 힌트
- [ ] 글 상세 페이지 — "3줄 요약" UI
- [ ] 글 상세 페이지 — Q&A 채팅 UI
- [ ] 스트리밍 응답 처리 (ReadableStream)
- [ ] Rate limiting 전략 결정 (Supabase Edge Functions 또는 미들웨어)

완료 기준: 방문자가 글 상세 페이지에서 AI 기능 이용 가능

---

## Phase 6 — 테스트 / E2E / 최적화

목표: 안정성과 성능 강화.

- [ ] Playwright E2E 도입
  - 관리자 로그인 플로우
  - 글 작성 → 발행 → 공개 페이지 확인
- [ ] 조회수 집계 (`post_views` 테이블 활성화)
- [ ] 이미지 최적화 (Supabase Storage + `next/image`)
- [ ] Core Web Vitals 측정 및 개선
- [ ] 캐시 전략 검토 (ISR revalidate 조정)
- [ ] `pnpm verify` 스크립트 확정 및 CI 연동

완료 기준: Lighthouse 성능 85+, E2E 핵심 플로우 통과
