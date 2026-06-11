# Architecture — jae-tech-blog

## 전체 아키텍처 개요

```
방문자 브라우저
  └─ Next.js App Router (SSR/SSG)
       ├─ 공개 블로그 페이지 (/ /posts /posts/[slug] /tags /categories)
       ├─ 관리자 페이지 (/admin/*) — Supabase Auth 필수
       ├─ Route Handlers (/api/rss  /api/ai/*)
       └─ Supabase Client (@supabase/ssr)
            ├─ browser client  (Client Components)
            └─ server client   (Server Components / Route Handlers)

Supabase (BaaS)
  ├─ PostgreSQL + RLS
  ├─ Auth (Email/Password)
  └─ Storage (optional — 이미지)

OCI LLM Server (향후)
  └─ Next.js Route Handler 경유만 허용
       Browser → /api/ai/* → OCI LLM
```

별도 백엔드 서버(NestJS, Express 등)는 도입하지 않는다.

---

## 라우팅 구조

### 공개 블로그

| 경로 | 설명 |
|---|---|
| `/` | 최신 글 목록 |
| `/posts` | 전체 글 목록 (페이지네이션) |
| `/posts/[slug]` | 글 상세 (SSG + ISR) |
| `/tags/[slug]` | 태그별 글 목록 |
| `/categories/[slug]` | 카테고리별 글 목록 |
| `/sitemap.xml` | Next.js sitemap Route |
| `/robots.txt` | Next.js robots Route |
| `/api/rss` | RSS 2.0 feed |

### 관리자 (인증 필수)

| 경로 | 설명 |
|---|---|
| `/admin` | 관리자 대시보드 |
| `/admin/posts` | 글 목록 (draft 포함) |
| `/admin/posts/new` | 새 글 작성 |
| `/admin/posts/[id]/edit` | 글 수정 |
| `/admin/login` | 로그인 (Supabase Auth) |

### API Route Handlers

| 경로 | 설명 |
|---|---|
| `/api/rss` | RSS feed 생성 |
| `/api/ai/title` | (향후) 제목 추천 |
| `/api/ai/outline` | (향후) 목차 생성 |
| `/api/ai/summary` | (향후) 글 요약 |
| `/api/ai/tags` | (향후) 태그 추천 |
| `/api/ai/rewrite` | (향후) 문장 다듬기 |
| `/api/ai/post-qa` | (향후) 글 기반 Q&A |
| `/api/ai/error-help` | (향후) 에러 힌트 |

---

## 디렉토리 구조

```
src/
├── app/
│   ├── layout.tsx                  # 루트 레이아웃
│   ├── page.tsx                    # 홈 (최신 글 목록)
│   ├── posts/
│   │   ├── page.tsx                # 전체 글 목록
│   │   └── [slug]/
│   │       └── page.tsx            # 글 상세 (generateMetadata 포함)
│   ├── tags/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── categories/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx              # 관리자 레이아웃 (인증 guard)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── posts/
│   │   │   ├── page.tsx            # 글 목록
│   │   │   ├── new/
│   │   │   │   └── page.tsx        # 새 글
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx    # 글 수정
│   │   └── page.tsx                # 대시보드
│   ├── api/
│   │   ├── rss/
│   │   │   └── route.ts
│   │   └── ai/
│   │       ├── title/route.ts      # (향후)
│   │       ├── outline/route.ts    # (향후)
│   │       ├── summary/route.ts    # (향후)
│   │       └── ...
│   ├── sitemap.ts                  # Next.js MetadataRoute.Sitemap
│   └── robots.ts                   # Next.js MetadataRoute.Robots
│
├── components/
│   ├── ui/                         # 범용 UI (Button, Input 등)
│   ├── blog/                       # 블로그 전용 (PostCard, TagBadge 등)
│   └── admin/                      # 관리자 전용 (PostEditor 등)
│
├── features/
│   ├── posts/
│   │   ├── post.queries.ts         # Supabase 조회 함수
│   │   ├── post.mutations.ts       # Supabase 수정 함수
│   │   └── post.types.ts           # 타입 정의
│   ├── categories/
│   │   └── category.queries.ts
│   └── tags/
│       └── tag.queries.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # browser client
│   │   ├── server.ts               # server client (cookies)
│   │   └── types.ts                # generated DB 타입
│   ├── markdown/
│   │   ├── render.ts               # react-markdown 설정
│   │   └── utils.ts                # heading 추출, excerpt 생성
│   ├── seo/
│   │   └── metadata.ts             # generateMetadata 헬퍼
│   └── utils/
│       ├── slug.ts                 # slug 생성
│       ├── date.ts                 # 날짜 포맷
│       └── string.ts               # 문자열 유틸
│
└── middleware.ts                   # Supabase 인증 세션 갱신

tests/
├── unit/
│   ├── lib/
│   │   ├── slug.test.ts
│   │   ├── date.test.ts
│   │   ├── markdown.test.ts
│   │   └── seo.test.ts
│   └── features/
│       └── posts/
└── e2e/                            # (향후 Playwright)
```

---

## 데이터 흐름

### 공개 글 상세 페이지 (SSG + ISR)

```
1. Next.js build → generateStaticParams() → slug 목록 수집
2. 빌드 시 각 slug에 대해 getPostBySlug() 호출 (server Supabase client)
3. 페이지 정적 생성 (revalidate: 60초)
4. generateMetadata() → Open Graph / JSON-LD 포함 메타 생성
5. 클라이언트: 정적 HTML + hydration
```

### 관리자 글 작성

```
1. /admin/login → Supabase Auth (email/password)
2. middleware.ts → 세션 유효성 검사 → /admin/* 접근 허용
3. /admin/posts/new → PostEditor (Client Component)
4. 저장: browser Supabase client → posts 테이블 INSERT/UPDATE
5. 발행: status = 'published' + published_at 설정
```

### AI 호출 흐름 (향후)

```
Browser (fetch) → /api/ai/* (Route Handler)
                     ↓
              환경변수로 OCI LLM 엔드포인트 참조
                     ↓
              OCI LLM Server (private network)
                     ↓
              Route Handler → Browser (streaming 또는 JSON)
```

브라우저가 OCI LLM 서버를 직접 호출하는 구조는 금지한다.

---

## 공개 페이지 vs 관리자 페이지 분리

| 구분 | 공개 블로그 | 관리자 |
|---|---|---|
| 인증 | 불필요 | Supabase Auth 필수 |
| Supabase client | server client (SSR/SSG) | browser + server client |
| 글 접근 범위 | status = 'published'만 | 전체 (draft 포함) |
| 렌더링 | SSG + ISR | CSR (Client Components) |
| RLS | anon key 허용 | auth user 필요 |

---

## AI 확장 구조 (향후)

Route Handler 파일 규약:
- `src/app/api/ai/[action]/route.ts`
- 요청: `POST /api/ai/{action}` with `{ postId?, content?, context? }`
- 응답: `{ result: string }` 또는 streaming

공통 OCI 클라이언트는 `lib/ai/oci-client.ts`에서 관리한다 (향후 생성).
브라우저에서 직접 import 불가 — `server-only` 패키지로 강제한다.
