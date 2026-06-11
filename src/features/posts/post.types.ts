import type { PostWithRelations } from "@/lib/supabase/types";

export type { PostWithRelations };

export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  category: { name: string; slug: string } | null;
  tags: { name: string; slug: string }[];
}
