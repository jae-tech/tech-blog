"use client";

import { useRouter } from "next/navigation";
import type { PostEditorValues } from "@/components/admin/PostEditor";
import { PostEditor } from "@/components/admin/PostEditor";
import type { Category, PostStatus, Tag } from "@/lib/supabase/types";

interface EditPostFormProps {
  postId: string;
  initialValues: PostEditorValues;
  categories: Category[];
  allTags: Tag[];
}

export function EditPostForm({
  postId,
  initialValues,
  categories,
  allTags,
}: EditPostFormProps) {
  const router = useRouter();

  async function handleSave(values: PostEditorValues, status: PostStatus) {
    const res = await fetch(`/api/admin/posts/${postId}`, {
      method: "PATCH",
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
    router.refresh();
  }

  return (
    <PostEditor
      initialValues={initialValues}
      categories={categories}
      allTags={allTags}
      onSave={handleSave}
    />
  );
}
