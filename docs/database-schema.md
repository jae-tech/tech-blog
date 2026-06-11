# Database Schema — jae-tech-blog

## 테이블 관계도

```
categories
  └─< posts (category_id FK)
        └─< post_tags >─ tags
        └─< ai_drafts (post_id FK)
        └─< post_views (post_id FK, optional)
```

---

## 테이블 정의

### posts

블로그 글 본문 및 메타데이터 저장. 본문은 Markdown 문자열로 저장한다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | `uuid` PK | 자동 생성 |
| `title` | `text` NOT NULL | 글 제목 |
| `slug` | `text` UNIQUE NOT NULL | URL용 식별자 (예: `nextjs-app-router-tips`) |
| `content` | `text` | Markdown 본문 |
| `excerpt` | `text` | 목록 페이지용 요약 (직접 입력 또는 content 앞 160자 자동 생성) |
| `status` | `text` NOT NULL DEFAULT `'draft'` | `draft` \| `published` \| `archived` |
| `category_id` | `uuid` FK → categories.id | 카테고리 (nullable) |
| `thumbnail_url` | `text` | 대표 이미지 URL (Supabase Storage 또는 외부) |
| `meta_title` | `text` | SEO용 title (없으면 title 사용) |
| `meta_description` | `text` | SEO용 description (없으면 excerpt 사용) |
| `published_at` | `timestamptz` | 발행 시각 (status → published 시 설정) |
| `created_at` | `timestamptz` DEFAULT `now()` | 생성 시각 |
| `updated_at` | `timestamptz` DEFAULT `now()` | 수정 시각 |

### categories

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | `uuid` PK | |
| `name` | `text` UNIQUE NOT NULL | 카테고리명 |
| `slug` | `text` UNIQUE NOT NULL | URL용 식별자 |
| `description` | `text` | 카테고리 설명 |
| `created_at` | `timestamptz` DEFAULT `now()` | |

### tags

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | `uuid` PK | |
| `name` | `text` UNIQUE NOT NULL | 태그명 |
| `slug` | `text` UNIQUE NOT NULL | URL용 식별자 |
| `created_at` | `timestamptz` DEFAULT `now()` | |

### post_tags (N:M 연결 테이블)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `post_id` | `uuid` FK → posts.id | |
| `tag_id` | `uuid` FK → tags.id | |
| PK | (`post_id`, `tag_id`) | 복합 PK |

### ai_drafts

관리자 AI 보조 기능에서 생성된 초안을 저장한다. AI 기능 구현 전에도 스키마만 준비해 둔다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | `uuid` PK | |
| `post_id` | `uuid` FK → posts.id | 연관 글 (nullable — 새 글 작성 중 생성 가능) |
| `action` | `text` NOT NULL | `title` \| `outline` \| `summary` \| `tags` \| `rewrite` 등 |
| `prompt` | `text` | AI에 전송한 프롬프트 |
| `result` | `text` | AI 응답 결과 |
| `created_at` | `timestamptz` DEFAULT `now()` | |

### post_views (optional)

조회수 집계용. 초기 MVP에서는 생략 가능.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | `uuid` PK | |
| `post_id` | `uuid` FK → posts.id | |
| `viewed_at` | `timestamptz` DEFAULT `now()` | |
| `ip_hash` | `text` | 중복 집계 방지용 (raw IP 저장 금지) |

---

## RLS Policy 방향

### 원칙

- anon(비로그인) 사용자는 `status = 'published'` 글만 읽을 수 있다.
- 인증된 관리자(auth.role = 'authenticated')는 전체 CRUD 가능하다.
- 초기에는 "로그인한 사용자 = 관리자" 단순 정책으로 시작한다.
  - 이후 `profiles` 테이블에 `role` 컬럼을 추가해 세분화 가능.

### posts RLS 예시

```sql
-- 공개 읽기: published 글만
CREATE POLICY "public read published posts"
  ON posts FOR SELECT
  TO anon
  USING (status = 'published');

-- 관리자 전체 읽기
CREATE POLICY "admin read all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

-- 관리자 insert
CREATE POLICY "admin insert posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 관리자 update
CREATE POLICY "admin update posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 관리자 delete
CREATE POLICY "admin delete posts"
  ON posts FOR DELETE
  TO authenticated
  USING (true);
```

### categories / tags / post_tags RLS

```sql
-- 공개 읽기 허용
CREATE POLICY "public read categories" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "public read tags"       ON tags       FOR SELECT TO anon USING (true);
CREATE POLICY "public read post_tags"  ON post_tags  FOR SELECT TO anon USING (true);

-- 관리자 전체 권한
CREATE POLICY "admin all categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all tags"       ON tags       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all post_tags"  ON post_tags  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

### ai_drafts RLS

```sql
-- 관리자만 접근
CREATE POLICY "admin all ai_drafts"
  ON ai_drafts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

---

## 초기 SQL 전체 초안

```sql
-- UUID 확장
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- categories
CREATE TABLE categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text UNIQUE NOT NULL,
  slug        text UNIQUE NOT NULL,
  description text,
  created_at  timestamptz DEFAULT now()
);

-- tags
CREATE TABLE tags (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text UNIQUE NOT NULL,
  slug       text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- posts
CREATE TABLE posts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL,
  slug             text UNIQUE NOT NULL,
  content          text,
  excerpt          text,
  status           text NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft', 'published', 'archived')),
  category_id      uuid REFERENCES categories(id) ON DELETE SET NULL,
  thumbnail_url    text,
  meta_title       text,
  meta_description text,
  published_at     timestamptz,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- post_tags
CREATE TABLE post_tags (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  uuid REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- ai_drafts
CREATE TABLE ai_drafts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid REFERENCES posts(id) ON DELETE SET NULL,
  action     text NOT NULL,
  prompt     text,
  result     text,
  created_at timestamptz DEFAULT now()
);

-- post_views (optional)
CREATE TABLE post_views (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id   uuid REFERENCES posts(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now(),
  ip_hash   text
);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS 활성화
ALTER TABLE posts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags       ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_drafts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- posts policies
CREATE POLICY "public read published posts" ON posts FOR SELECT TO anon      USING (status = 'published');
CREATE POLICY "admin read all posts"        ON posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin insert posts"          ON posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin update posts"          ON posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin delete posts"          ON posts FOR DELETE TO authenticated USING (true);

-- categories policies
CREATE POLICY "public read categories" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "admin all categories"   ON categories FOR ALL   TO authenticated USING (true) WITH CHECK (true);

-- tags policies
CREATE POLICY "public read tags" ON tags FOR SELECT TO anon USING (true);
CREATE POLICY "admin all tags"   ON tags FOR ALL   TO authenticated USING (true) WITH CHECK (true);

-- post_tags policies
CREATE POLICY "public read post_tags" ON post_tags FOR SELECT TO anon USING (true);
CREATE POLICY "admin all post_tags"   ON post_tags FOR ALL   TO authenticated USING (true) WITH CHECK (true);

-- ai_drafts policies
CREATE POLICY "admin all ai_drafts" ON ai_drafts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- post_views policies
CREATE POLICY "public insert post_views" ON post_views FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "admin read post_views"    ON post_views FOR SELECT TO authenticated USING (true);
```

---

## 인덱스 권장

```sql
CREATE INDEX idx_posts_slug        ON posts(slug);
CREATE INDEX idx_posts_status      ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_categories_slug   ON categories(slug);
CREATE INDEX idx_tags_slug         ON tags(slug);
```
