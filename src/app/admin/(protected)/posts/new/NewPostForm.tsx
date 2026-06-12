"use client";

import { useRouter } from "next/navigation";
import type { PostEditorValues } from "@/components/admin/PostEditor";
import { PostEditor } from "@/components/admin/PostEditor";
import type { Category, PostStatus, Tag } from "@/lib/supabase/types";

interface NewPostFormProps {
  categories: Category[];
  allTags: Tag[];
}

export function NewPostForm({ categories, allTags }: NewPostFormProps) {
  const router = useRouter();

  async function handleSave(values: PostEditorValues, status: PostStatus) {
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        status,
        category_id: values.category_id || null,
      }),
    });
    if (!res.ok) {
      const body: { error?: string } = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `저장 실패 (${res.status})`);
    }
    const { id } = await res.json();
    router.push(`/admin/posts/${id}/edit`);
  }

  return (
    <PostEditor
      categories={categories}
      allTags={allTags}
      lockDuringSave
      onSave={handleSave}
    />
  );
}
