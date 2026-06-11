# Task 001 — 기술블로그 CMS 아키텍처 설계

## 현재 상태

프로젝트 기본 세팅은 이미 완료된 상태다.

이 프로젝트는 개인 기술블로그이면서, 직접 만든 블로그 CMS 프로젝트다.
WordPress, Ghost 같은 기성 CMS는 사용하지 않는다.

## 프로젝트 목표

Next.js와 Supabase를 사용해서 기술블로그를 만든다.

핵심 목표는 다음과 같다.

1. 방문자는 기술블로그 글을 읽을 수 있다.
2. 관리자는 웹 관리자 화면에서 글을 작성, 수정, 임시저장, 발행할 수 있다.
3. 글은 파일이 아니라 Supabase DB에 저장한다.
4. 글 본문은 Markdown 문자열로 저장한다.
5. 공개 블로그 페이지는 SEO에 유리한 구조로 만든다.
6. 별도 백엔드 서버는 두지 않는다.
7. 나중에 OCI에 있는 개인 LLM 서버를 연결해서 글쓰기 보조 기능을 추가할 수 있게 설계한다.
8. 나중에 방문자에게도 “현재 글 요약”, “현재 글 기반 Q&A”, “에러 해결 힌트” 같은 AI 기능을 제공할 수 있게 확장 가능해야 한다.

## 기술 스택

- Next.js App Router
- TypeScript
- Supabase
  - Auth
  - Database
  - Storage optional

- Tailwind CSS
- Markdown rendering
- Vitest
- ESLint
- TypeScript typecheck
- No separate backend server

## 중요한 제약

반드시 지켜야 한다.

1. NestJS, Express 같은 별도 백엔드 서버를 만들지 않는다.
2. 글은 `.md` 파일로 저장하지 않는다.
3. 글은 Supabase `posts` 테이블에 저장한다.
4. 본문은 `content` 컬럼에 Markdown 문자열로 저장한다.
5. 방문자 브라우저에서 OCI LLM 서버를 직접 호출하지 않는다.
6. 향후 AI 기능은 Next.js Route Handler를 통해 OCI LLM 서버를 호출하는 구조로 설계한다.
7. 관리자 기능은 로그인한 관리자만 접근할 수 있어야 한다.
8. 공개 글 상세 페이지는 SEO metadata를 생성할 수 있어야 한다.
9. MVP에서는 기능을 과하게 추상화하지 말고 단순하고 확장 가능한 구조를 우선한다.

## 우선 설계해야 할 범위

아직 개발을 바로 시작하지 말고, 먼저 현재 프로젝트 구조를 파악한 뒤 아키텍처를 설계해라.

다음 항목을 설계해라.

### 1. 디렉토리 구조

Next.js App Router 기준으로 다음 영역을 나눠라.

- 공개 블로그 영역
- 관리자 영역
- Supabase client/server 유틸
- Markdown 렌더링 유틸
- SEO 유틸
- 공통 UI
- AI 확장 예정 영역
- 테스트 영역

예상 라우트는 다음과 같다.

```txt
/
 /posts
 /posts/[slug]
 /tags/[slug]
 /categories/[slug]

 /admin
 /admin/posts
 /admin/posts/new
 /admin/posts/[id]/edit

 /api/ai/*
 /api/rss
 /sitemap.xml
 /robots.txt
```

단, 실제 Next.js App Router 구조에 맞게 더 나은 구조가 있으면 제안해도 된다.

### 2. Supabase DB 스키마

최소한 다음 테이블을 설계해라.

- posts
- categories
- tags
- post_tags
- ai_drafts
- ai_requests optional
- post_views optional

`posts`에는 최소 다음 필드가 필요하다.

- id
- title
- slug
- content
- excerpt
- status: draft | published | archived
- category_id
- thumbnail_url
- meta_title
- meta_description
- published_at
- created_at
- updated_at

나중에 AI 기능을 붙일 수 있도록 `ai_drafts` 테이블도 설계해라.

### 3. 권한 설계

Supabase Auth와 RLS 기준으로 권한을 설계해라.

원칙은 다음과 같다.

- published 글은 누구나 읽을 수 있다.
- draft 글은 관리자만 읽을 수 있다.
- 글 작성/수정/삭제는 관리자만 가능하다.
- 관리자 판별 방식은 처음에는 단순하게 시작해도 된다.
- RLS policy 방향을 설명해라.

### 4. 데이터 접근 구조

Next.js에서 Supabase를 사용할 때 다음을 구분해라.

- browser client
- server client
- admin/server-only client가 필요한 경우
- 공개 페이지에서 글 조회하는 방식
- 관리자 페이지에서 글 작성/수정하는 방식

가능하면 Supabase 접근 로직은 직접 컴포넌트에 흩뿌리지 말고, 도메인별 함수로 분리해라.

예상 예시:

```txt
lib/supabase/client.ts
lib/supabase/server.ts
features/posts/post.queries.ts
features/posts/post.mutations.ts
```

### 5. 공개 블로그 SEO 설계

다음 기능을 고려해라.

- 글 상세 페이지 metadata
- canonical URL
- Open Graph
- Article JSON-LD
- sitemap.xml
- robots.txt
- RSS feed
- slug 기반 URL
- published 글만 색인 대상

### 6. 관리자 글쓰기 설계

관리자 글쓰기 화면의 초기 MVP를 설계해라.

필수 기능은 다음과 같다.

- 제목 입력
- slug 입력 또는 자동 생성
- Markdown 본문 입력
- Markdown preview
- excerpt 입력 또는 자동 생성
- meta title
- meta description
- 태그 선택
- 카테고리 선택
- draft 저장
- published 발행

초기에는 복잡한 WYSIWYG 에디터를 붙이지 말고, textarea + preview 방식으로 시작한다.

### 7. AI 확장 설계

아직 AI 기능을 구현하지 않는다.
하지만 나중에 OCI LLM 서버를 연결할 수 있게 구조를 설계한다.

예상 기능은 다음과 같다.

관리자용 AI 기능:

- 제목 추천
- 목차 생성
- meta description 생성
- 태그 추천
- 글 요약
- 섹션별 초안 생성
- 문장 다듬기

방문자용 AI 기능:

- 현재 글 3줄 요약
- 현재 글 기반 Q&A
- 에러 메시지 해결 힌트
- 체크리스트 생성
- 관련 글 추천

AI 호출 구조는 다음과 같아야 한다.

```txt
Browser
→ Next.js Route Handler
→ OCI LLM Server
```

다음 구조는 금지한다.

```txt
Browser
→ OCI LLM Server
```

AI 관련 Route Handler는 향후 다음처럼 확장 가능하게 설계한다.

```txt
/api/ai/title
/api/ai/outline
/api/ai/summary
/api/ai/tags
/api/ai/rewrite
/api/ai/post-qa
/api/ai/error-help
```

### 8. 테스트 전략

작업 완료 조건에 다음 검증을 포함한다.

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

가능하면 `pnpm verify` 스크립트로 묶는다.

E2E 테스트는 아직 필수로 넣지 않는다.
초기에는 단위 테스트 중심으로 간다.

초기 테스트 대상은 다음과 같다.

- slug 생성 함수
- excerpt 생성 함수
- 날짜 포맷 함수
- Markdown heading 추출 함수
- SEO metadata 생성 함수
- 태그 normalize 함수

E2E는 관리자 로그인, 글 작성, 발행 플로우가 안정된 뒤 Playwright로 최소 도입한다.

### 9. 완료 기준

이번 작업에서는 실제 구현을 무리하게 진행하지 말고, 먼저 아키텍처 문서를 만들어라.

다음 파일을 생성하거나 갱신해라.

```txt
docs/architecture.md
docs/database-schema.md
docs/roadmap.md
AGENTS.md
CLAUDE.md
```

각 문서에는 다음 내용이 포함되어야 한다.

#### docs/architecture.md

- 전체 아키텍처
- 라우팅 구조
- 디렉토리 구조
- 데이터 흐름
- 공개 페이지와 관리자 페이지 분리
- AI 확장 구조

#### docs/database-schema.md

- Supabase 테이블 설계
- 컬럼 설명
- 관계 설명
- RLS policy 방향
- 초기 SQL 초안

#### docs/roadmap.md

- Phase 1: 블로그 공개 페이지
- Phase 2: 관리자 글쓰기
- Phase 3: SEO/RSS/sitemap
- Phase 4: AI 관리자 보조 기능
- Phase 5: 방문자용 AI 도우미
- Phase 6: 테스트/E2E/최적화

#### AGENTS.md

Claude와 Codex가 공통으로 참고할 프로젝트 규칙을 작성한다.

포함할 내용:

- 프로젝트 목표
- 기술 스택
- 금지 사항
- 작업 완료 조건
- 테스트 명령
- 코드 스타일
- 아키텍처 원칙

#### CLAUDE.md

Claude Code 전용 작업 메모를 작성한다.

포함할 내용:

- 작업 방식
- 변경 전 계획 제시
- 큰 변경 전 현재 구조 파악
- 작업 후 `pnpm verify` 실행
- 실패 시 원인과 수정 내용 보고
- 별도 백엔드 서버 금지
- 글은 Supabase DB에 Markdown으로 저장

## 작업 방식

다음 순서로 진행해라.

1. 현재 프로젝트 구조를 먼저 확인한다.
2. package.json, app 구조, 설정 파일을 확인한다.
3. 이미 설치된 패키지와 스크립트를 파악한다.
4. 부족한 스크립트가 있으면 제안한다.
5. 바로 대규모 구현하지 말고, 먼저 아키텍처 문서를 작성한다.
6. 문서 작성 후 필요한 최소 설정 파일만 수정한다.
7. 마지막에 변경된 파일 목록과 다음 작업 추천 순서를 보고한다.

## 절대 하지 말 것

- 별도 백엔드 서버를 추가하지 마라.
- NestJS를 추가하지 마라.
- WordPress/Ghost 같은 CMS를 제안하지 마라.
- 글을 로컬 md 파일 기반으로 저장하는 구조로 바꾸지 마라.
- OCI LLM 서버를 브라우저에서 직접 호출하는 구조를 만들지 마라.
- 처음부터 E2E 테스트를 강제하지 마라.
- 처음부터 복잡한 WYSIWYG 에디터를 붙이지 마라.
- AI 기능을 지금 바로 구현하지 마라.

## 최종 응답 형식

작업이 끝나면 다음 형식으로 보고해라.

```txt
## 완료 내용

- 작성/수정한 문서
- 정리한 아키텍처
- 추가/수정한 스크립트

## 주요 결정

- 글 저장 방식
- 인증/권한 방향
- SEO 방향
- AI 확장 방향

## 검증 결과

- pnpm lint 결과
- pnpm typecheck 결과
- pnpm test 결과
- pnpm build 결과

## 다음 작업 제안

1. Supabase schema 적용
2. 공개 글 목록/상세 구현
3. 관리자 글 작성 화면 구현
```
