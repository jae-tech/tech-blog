"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PostEditorValues } from "@/components/admin/PostEditor";
import { PostEditor } from "@/components/admin/PostEditor";
import type { Category, PostStatus, Tag } from "@/lib/supabase/types";

interface NewPostFormProps {
  categories: Category[];
  allTags: Tag[];
}

export function NewPostForm({ categories, allTags }: NewPostFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(values: PostEditorValues, status: PostStatus) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `저장 실패 (${res.status})`);
      }
      const { id } = await res.json();
      router.push(`/admin/posts/${id}/edit`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.");
      setSaving(false);
    }
  }

  return (
    <PostEditor
      categories={categories}
      allTags={allTags}
      onSave={handleSave}
      saving={saving}
      error={error}
    />
  );
}
