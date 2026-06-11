import { notFound } from "next/navigation";
import { getAdminPostById } from "@/features/posts/post.admin-queries";
import { createClient } from "@/lib/supabase/server";
import { EditPostForm } from "./EditPostForm";

async function getFormData() {
  const supabase = await createClient();
  const [{ data: categories }, { data: tags }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("tags").select("*").order("name"),
  ]);
  return { categories: categories ?? [], tags: tags ?? [] };
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, { categories, tags }] = await Promise.all([
    getAdminPostById(id),
    getFormData(),
  ]);

  if (!post) notFound();

  const initialValues = {
    title: post.title,
    slug: post.slug,
    content: post.content ?? "",
    excerpt: post.excerpt ?? "",
    status: post.status,
    category_id: post.category_id ?? "",
    meta_title: post.meta_title ?? "",
    meta_description: post.meta_description ?? "",
    tagSlugs: (post.tags ?? []).map((t: { slug: string }) => t.slug),
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-100 mb-8">글 수정</h1>
      <EditPostForm
        postId={id}
        initialValues={initialValues}
        categories={categories}
        allTags={tags}
      />
    </div>
  );
}
