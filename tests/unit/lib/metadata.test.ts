import { describe, expect, it } from "vitest";
import { generateListMetadata, generatePostMetadata } from "@/lib/seo/metadata";
import type { PostWithRelations } from "@/lib/supabase/types";

const basePost: PostWithRelations = {
  id: "1",
  title: "테스트 글 제목",
  slug: "test-post",
  content: "본문 내용",
  excerpt: "짧은 설명",
  status: "published",
  category_id: null,
  thumbnail_url: null,
  meta_title: null,
  meta_description: null,
  published_at: "2024-01-01T00:00:00Z",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
  category: null,
  tags: [],
};

describe("generatePostMetadata", () => {
  it("title과 description이 post 값으로 채워진다", () => {
    const meta = generatePostMetadata(basePost);
    expect(meta.title).toBe("테스트 글 제목");
    expect(meta.description).toBe("짧은 설명");
  });

  it("meta_title이 있으면 title을 덮어쓴다", () => {
    const meta = generatePostMetadata({ ...basePost, meta_title: "SEO 제목" });
    expect(meta.title).toBe("SEO 제목");
  });

  it("meta_description이 있으면 description을 덮어쓴다", () => {
    const meta = generatePostMetadata({
      ...basePost,
      meta_description: "SEO 설명",
    });
    expect(meta.description).toBe("SEO 설명");
  });

  it("canonical URL이 slug 기반으로 설정된다", () => {
    const meta = generatePostMetadata(basePost);
    expect(meta.alternates?.canonical).toContain("/posts/test-post");
  });

  it("openGraph type이 article이다", () => {
    const meta = generatePostMetadata(basePost);
    const og = meta.openGraph as Record<string, unknown>;
    expect(og.type).toBe("article");
  });

  it("thumbnail_url이 있으면 OG image가 포함된다", () => {
    const meta = generatePostMetadata({
      ...basePost,
      thumbnail_url: "https://example.com/image.jpg",
    });
    const og = meta.openGraph as Record<string, unknown>;
    expect(og.images).toBeDefined();
  });

  it("excerpt가 없으면 description이 빈 문자열이다", () => {
    const meta = generatePostMetadata({ ...basePost, excerpt: null });
    expect(meta.description).toBe("");
  });
});

describe("generateListMetadata", () => {
  it("title에 사이트명이 붙는다", () => {
    const meta = generateListMetadata({
      title: "글 목록",
      description: "모든 글",
      path: "/posts",
    });
    expect(String(meta.title)).toContain("글 목록");
    expect(String(meta.title)).toContain("jae.tech");
  });

  it("canonical URL이 path 기반으로 설정된다", () => {
    const meta = generateListMetadata({
      title: "글 목록",
      description: "모든 글",
      path: "/posts",
    });
    expect(meta.alternates?.canonical).toContain("/posts");
  });

  it("openGraph type이 website이다", () => {
    const meta = generateListMetadata({
      title: "글 목록",
      description: "모든 글",
      path: "/posts",
    });
    const og = meta.openGraph as Record<string, unknown>;
    expect(og.type).toBe("website");
  });
});
