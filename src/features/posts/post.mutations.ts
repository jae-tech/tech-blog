import { z } from "zod/v4";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils/slug";

export const PostInputSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/),
  content: z.string(),
  excerpt: z.string().max(500).nullable().optional(),
  status: z.enum(["draft", "published", "archived"]),
  category_id: z.string().uuid().nullable().optional(),
  thumbnail_url: z.string().url().nullable().optional(),
  meta_title: z.string().max(70).nullable().optional(),
  meta_description: z.string().max(160).nullable().optional(),
});

export type PostInput = z.infer<typeof PostInputSchema>;

export async function createPost(input: PostInput) {
  const supabase = await createClient();
  const validated = PostInputSchema.parse(input);

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      ...validated,
      published_at: validated.status === "published" ? now : null,
    })
    .select("id, slug")
    .single();

  if (error) throw error;
  return data;
}

export async function updatePost(id: string, input: Partial<PostInput>) {
  const supabase = await createClient();
  const validated = PostInputSchema.partial().parse(input);

  const updates: Record<string, unknown> = {
    ...validated,
    updated_at: new Date().toISOString(),
  };

  if (validated.status === "published") {
    const { data: existing } = await supabase
      .from("posts")
      .select("published_at, status")
      .eq("id", id)
      .single();
    if (existing && existing.status !== "published") {
      updates.published_at = new Date().toISOString();
    }
  }

  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select("id, slug")
    .single();

  if (error) throw error;
  return data;
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

export async function upsertTags(postId: string, tagSlugs: string[]) {
  const supabase = await createClient();

  await supabase.from("post_tags").delete().eq("post_id", postId);

  if (tagSlugs.length === 0) return;

  const { data: existingTags } = await supabase
    .from("tags")
    .select("id, slug")
    .in("slug", tagSlugs);

  const existing = existingTags ?? [];
  const existingSlugs = existing.map((t) => t.slug);
  const newSlugs = tagSlugs.filter((s) => !existingSlugs.includes(s));

  let allTagIds = existing.map((t) => t.id);

  if (newSlugs.length > 0) {
    const { data: created, error } = await supabase
      .from("tags")
      .insert(newSlugs.map((slug) => ({ name: slug, slug })))
      .select("id");
    if (error) throw error;
    allTagIds = allTagIds.concat((created ?? []).map((t) => t.id));
  }

  const { error } = await supabase
    .from("post_tags")
    .insert(allTagIds.map((tag_id) => ({ post_id: postId, tag_id })));

  if (error) throw error;
}

export function suggestSlug(title: string): string {
  return generateSlug(title);
}
