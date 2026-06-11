import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import type { Category, Post } from "@/lib/supabase/types";
import type { PostListItem, PostWithRelations } from "./post.types";

const POST_LIST_SELECT = `
  id, title, slug, excerpt, thumbnail_url, published_at,
  category:categories(name, slug),
  tags:post_tags(tag:tags(name, slug))
` as const;

const POST_DETAIL_SELECT = `
  *,
  category:categories(*),
  tags:post_tags(tag:tags(*))
` as const;

interface TagJoin {
  tag: { name: string; slug: string }[];
}

interface TagDetailJoin {
  tag: { id: string; name: string; slug: string; created_at: string }[];
}

export async function getPublishedPosts(options?: {
  limit?: number;
  offset?: number;
  categorySlug?: string;
  tagSlug?: string;
}): Promise<PostListItem[]> {
  const supabase = await createClient();

  // 태그 필터: post_tags → tags.slug로 post_id 목록을 먼저 조회
  let tagPostIds: string[] | null = null;
  if (options?.tagSlug) {
    const { data: tagData, error: tagError } = await supabase
      .from("post_tags")
      .select("post_id, tags!inner(slug)")
      .eq("tags.slug", options.tagSlug);
    if (tagError) throw tagError;
    tagPostIds = (tagData ?? []).map((r) => r.post_id);
    if (tagPostIds.length === 0) return [];
  }

  let query = supabase
    .from("posts")
    .select(POST_LIST_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  // 카테고리 필터: categories!inner(slug) 조건
  if (options?.categorySlug) {
    query = query.eq("categories.slug", options.categorySlug);
  }

  if (tagPostIds) {
    query = query.in("id", tagPostIds);
  }

  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset)
    query = query.range(
      options.offset,
      options.offset + (options.limit ?? 10) - 1,
    );

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map(normalizePostListItem);
}

export async function getPostBySlug(
  slug: string,
): Promise<PostWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_DETAIL_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return normalizePostWithRelations(data);
}

export async function getPublishedPostSlugs(): Promise<string[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");

  if (error) throw error;
  return (data ?? []).map((p) => p.slug);
}

// Supabase는 to-one join도 배열로 반환하므로 배열 타입으로 선언
interface RawPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  category: { name: string; slug: string }[] | null;
  tags: TagJoin[];
}

interface RawPostDetail extends Post {
  category: Category[] | null;
  tags: TagDetailJoin[];
}

// Supabase join 응답의 중첩 구조를 평탄화
function normalizePostListItem(raw: RawPostListItem): PostListItem {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt,
    thumbnail_url: raw.thumbnail_url,
    published_at: raw.published_at,
    category: raw.category?.[0] ?? null,
    tags: raw.tags
      .map((t) => t.tag[0])
      .filter((t): t is NonNullable<typeof t> => t !== null),
  };
}

function normalizePostWithRelations(raw: RawPostDetail): PostWithRelations {
  return {
    ...raw,
    category: raw.category?.[0] ?? null,
    tags: raw.tags
      .map((t) => t.tag[0])
      .filter((t): t is NonNullable<typeof t> => t !== null),
  };
}
