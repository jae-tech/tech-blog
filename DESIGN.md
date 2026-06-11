# Design System — jae-tech-blog

## Product Context

- **What this is:** 개인 기술 블로그 CMS — 마크다운으로 작성하고 관리자가 직접 발행
- **Who it's for:** 풀스택·AI 개발자 독자, 한국어 기반
- **Space/industry:** 개인 기술 블로그 (기술 메모·튜토리얼·경험 공유)
- **Project type:** Editorial blog + Admin CMS

## Aesthetic Direction

- **Direction:** Editorial Minimal with Dark Bias
- **Decoration level:** Intentional (배경 grid texture 정도, 그 외 장식 없음)
- **Mood:** 밤의 코딩 세션. 조용하고 집중된 느낌. 읽는 데 방해가 없고, 콘텐츠가 전부다.
- **Reference sites:** overreacted.io (극도 최소주의), leerob.io (단일 컬럼 집중)

## Typography

- **Display/Hero:** Pretendard — 한글+영문 동시 최적화, 가독성 우선
- **Body:** Pretendard — 동일 폰트 패밀리로 통일, weight로 위계 구분
- **UI/Labels:** Pretendard (same as body)
- **Data/Tables:** Pretendard (tabular-nums 옵션 사용)
- **Code:** JetBrains Mono — 코드 블록 및 인라인 코드
- **Loading:** CDN (cdnfonts.com/pretendard 또는 GitHub Releases direct link)
- **Scale:**
  - `display`: 3rem / 48px — 홈 히어로
  - `h1`: 2rem / 32px — 글 제목
  - `h2`: 1.375rem / 22px — 섹션 헤딩
  - `h3`: 1.125rem / 18px — 서브 섹션
  - `body`: 1rem / 16px — 본문
  - `small`: 0.875rem / 14px — 메타, 캡션
  - `xs`: 0.6875rem / 11px — 태그, 모노 레이블
- **Weight hierarchy:**
  - Heading: `font-weight: 600`
  - Body: `font-weight: 400`
  - UI labels / semibold: `font-weight: 500`

## Color

- **Approach:** Restrained — accent는 희소하게, 의미 있을 때만
- **Background:** `#0e0e10` — 거의 검정, 순수 검정보다 눈에 편함
- **Surface:** `#17171a` — 카드, 코드 블록 배경
- **Surface 2:** `#1f1f24` — 코드 블록 헤더, hover 배경
- **Border:** `#2a2a30` — 구분선, 카드 테두리
- **Primary text:** `#f0eee8` — 따뜻한 화이트 (차가운 흰색보다 눈 피로 적음)
- **Muted text:** `#6b6a72` — 날짜, 메타, 레이블
- **Accent:** `#f97316` — amber, 링크 hover·태그 hover·강조에만 사용
- **Semantic:**
  - success: `#4ade80`
  - warning: `#fbbf24`
  - error: `#f87171`
  - info: `#60a5fa`
- **Dark mode:** 기본값 (위 색상이 다크 모드)
- **Light mode strategy:** bg `#fafaf9`, surface `#f4f4f0`, text `#1a1a1c`, muted `#888880`, accent 동일

## Spacing

- **Base unit:** 8px
- **Density:** Comfortable
- **Scale:**
  - `2xs`: 2px
  - `xs`: 4px
  - `sm`: 8px
  - `md`: 16px
  - `lg`: 24px
  - `xl`: 32px
  - `2xl`: 48px
  - `3xl`: 64px
  - `4xl`: 80px
  - `5xl`: 96px

## Layout

- **Approach:** Grid-disciplined (단일 컬럼 중심)
- **Content max-width:** 672px (`max-w-2xl` in Tailwind)
- **Alignment:** 좌정렬 (중앙 정렬 금지)
- **Grid:** 단일 컬럼 — 사이드바 없음
- **Border radius:**
  - `sm`: 4px — 태그, 인라인 코드
  - `md`: 8px — 버튼, 인풋, 카드
  - `lg`: 12px — 코드 블록
  - `full`: 9999px — pill 태그, 토글
- **Post list style:** 제목 + 날짜 텍스트 리스트 (카드 그리드 없음)
- **Page padding:** `px-6` (24px)

## Motion

- **Approach:** Minimal-functional
- **Easing:**
  - enter: `ease-out`
  - exit: `ease-in`
  - move: `ease-in-out`
- **Duration:**
  - micro: 50–100ms — hover 색상 전환
  - short: 150ms — 버튼 상태, 링크 색상
  - medium: 250ms — 페이지 전환 fade
  - long: 400ms — (현재 미사용)
- **Rules:**
  - 색상 전환 외 애니메이션은 최소화
  - `prefers-reduced-motion` 미디어 쿼리 반드시 적용
  - 스크롤 기반 애니메이션 없음

## Implementation Notes

- **Font loading:** `<link rel="preconnect">` + `font-display: swap`
- **CSS variables:** 모든 색상·간격을 CSS custom property로 관리 (`--bg`, `--accent` 등)
- **Dark/light toggle:** `data-theme` attribute on `<html>`, CSS variables 교체
- **Code syntax highlight:** Pretendard + JetBrains Mono, 다크 테마 기반
- **읽기 진행 바:** 글 상세 페이지 상단, accent 색상 (`#f97316`), 2px 높이
- **Tailwind 사용 시:** `@theme` 블록에 위 토큰 등록, `prose` 커스터마이징 필요

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-11 | 디자인 시스템 초기 생성 | /design-consultation 기반, 기술 블로그 리서치 포함 |
| 2026-06-11 | 헤딩 폰트 Instrument Serif → Pretendard | 개성보다 가독성 우선, 한글 최적화 |
| 2026-06-11 | Accent: amber (#f97316) | 보라/파랑 넘치는 기술 블로그 생태계에서 식별 용이 |
| 2026-06-11 | 목록 페이지 카드 없음 | 콘텐츠 자신감, Overreacted 스타일 텍스트 리스트 |
| 2026-06-11 | 다크 모드 기본값 | 개발자 독자 타깃, 코딩 세션 맥락 |
