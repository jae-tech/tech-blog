"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(values: PostEditorValues, status: PostStatus) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `저장 실패 (${res.status})`);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PostEditor
      initialValues={initialValues}
      categories={categories}
      allTags={allTags}
      onSave={handleSave}
      saving={saving}
      error={error}
    />
  );
}
