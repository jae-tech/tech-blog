import { createClient } from "@/lib/supabase/server";
import type { PostStatus } from "@/lib/supabase/types";
import type { PostListItem } from "./post.types";

const ADMIN_LIST_SELECT = `
  id, title, slug, excerpt, thumbnail_url, published_at, status, created_at, updated_at,
  category:categories(name, slug),
  tags:post_tags(tag:tags(name, slug))
` as const;

interface TagJoin {
  tag: { name: string; slug: string }[];
}

interface RawAdminPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  status: PostStatus;
  created_at: string;
  updated_at: string;
  category: { name: string; slug: string }[] | null;
  tags: TagJoin[];
}

export interface AdminPostListItem extends PostListItem {
  status: PostStatus;
  created_at: string;
  updated_at: string;
}

export async function getAdminPosts(): Promise<AdminPostListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(ADMIN_LIST_SELECT)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(normalizeAdminPost);
}

export async function getAdminPostById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(`*, category:categories(*), tags:post_tags(tag:tags(*))`)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return {
    ...data,
    category: data.category?.[0] ?? null,
    tags: (data.tags ?? [])
      .map((t: { tag: unknown[] }) => t.tag[0])
      .filter(Boolean),
  };
}

function normalizeAdminPost(raw: RawAdminPost): AdminPostListItem {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt,
    thumbnail_url: raw.thumbnail_url,
    published_at: raw.published_at,
    status: raw.status,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    category: raw.category?.[0] ?? null,
    tags: raw.tags
      .map((t) => t.tag[0])
      .filter((t): t is NonNullable<typeof t> => t !== null),
  };
}
