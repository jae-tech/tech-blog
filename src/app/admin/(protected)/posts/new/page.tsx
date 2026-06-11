import { createClient } from "@/lib/supabase/server";
import { NewPostForm } from "./NewPostForm";

async function getFormData() {
  const supabase = await createClient();
  const [{ data: categories }, { data: tags }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("tags").select("*").order("name"),
  ]);
  return { categories: categories ?? [], tags: tags ?? [] };
}

export default async function NewPostPage() {
  const { categories, tags } = await getFormData();

  return (
    <div>
      <h1 className="text-xl font-semibold text-[var(--foreground)] mb-8">
        새 글 작성
      </h1>
      <NewPostForm categories={categories} allTags={tags} />
    </div>
  );
}
