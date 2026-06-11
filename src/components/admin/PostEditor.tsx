"use client";

import { useCallback, useState } from "react";
import { MarkdownRenderer } from "@/lib/markdown/render";
import type { Category, PostStatus, Tag } from "@/lib/supabase/types";

export interface PostEditorValues {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: PostStatus;
  category_id: string;
  meta_title: string;
  meta_description: string;
  tagSlugs: string[];
}

interface PostEditorProps {
  initialValues?: Partial<PostEditorValues>;
  categories: Category[];
  allTags: Tag[];
  onSave: (values: PostEditorValues, status: PostStatus) => Promise<void>;
  saving?: boolean;
  error?: string | null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function PostEditor({
  initialValues,
  categories,
  allTags,
  onSave,
  saving = false,
  error,
}: PostEditorProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? "");
  const [status] = useState<PostStatus>(initialValues?.status ?? "draft");
  const [categoryId, setCategoryId] = useState(
    initialValues?.category_id ?? "",
  );
  const [metaTitle, setMetaTitle] = useState(initialValues?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initialValues?.meta_description ?? "",
  );
  const [tagSlugs, setTagSlugs] = useState<string[]>(
    initialValues?.tagSlugs ?? [],
  );
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(false);
  const [slugManual, setSlugManual] = useState(!!initialValues?.slug);

  const handleTitleChange = useCallback(
    (val: string) => {
      setTitle(val);
      if (!slugManual) {
        setSlug(slugify(val));
      }
    },
    [slugManual],
  );

  const handleSlugChange = useCallback((val: string) => {
    setSlug(val);
    setSlugManual(true);
  }, []);

  const addTag = useCallback(() => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tagSlugs.includes(t)) {
      setTagSlugs((prev) => [...prev, t]);
    }
    setTagInput("");
  }, [tagInput, tagSlugs]);

  const removeTag = useCallback((slug: string) => {
    setTagSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const getValues = (): PostEditorValues => ({
    title,
    slug,
    content,
    excerpt,
    status,
    category_id: categoryId,
    meta_title: metaTitle,
    meta_description: metaDescription,
    tagSlugs,
  });

  const inputCls =
    "w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--muted)]";
  const labelCls =
    "block font-mono text-xs text-[var(--muted)] uppercase tracking-wider mb-1.5";

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] border border-[var(--destructive)] text-[var(--destructive)] px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* 제목 */}
      <div>
        <label htmlFor="field-title" className={labelCls}>
          제목
        </label>
        <input
          id="field-title"
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={inputCls}
          placeholder="글 제목"
        />
      </div>

      {/* slug */}
      <div>
        <label htmlFor="field-slug" className={labelCls}>
          Slug
        </label>
        <input
          id="field-slug"
          type="text"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          className={inputCls}
          placeholder="url-friendly-slug"
        />
      </div>

      {/* 카테고리 */}
      <div>
        <label htmlFor="field-category" className={labelCls}>
          카테고리
        </label>
        <select
          id="field-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={inputCls}
        >
          <option value="">카테고리 없음</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 태그 */}
      <div>
        <label htmlFor="field-tag-input" className={labelCls}>
          태그
        </label>
        <div className="flex gap-2 mb-2">
          <input
            id="field-tag-input"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className={`${inputCls} flex-1`}
            placeholder="태그 입력 후 Enter"
            list="tag-suggestions"
          />
          <datalist id="tag-suggestions">
            {allTags.map((t) => (
              <option key={t.id} value={t.slug} />
            ))}
          </datalist>
          <button
            type="button"
            onClick={addTag}
            className="px-3 py-2 bg-[var(--surface-2)] text-[var(--foreground)] rounded-lg text-sm hover:bg-[var(--border)] transition-colors"
          >
            추가
          </button>
        </div>
        {tagSlugs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tagSlugs.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 bg-[var(--surface-2)] text-[var(--foreground)] font-mono text-xs px-2.5 py-1 rounded-full border border-[var(--border)]"
              >
                #{t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 본문 */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="field-content" className={`${labelCls} mb-0`}>
            본문 (Markdown)
          </label>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="font-mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {preview ? "편집" : "미리보기"}
          </button>
        </div>
        {preview ? (
          <div className="min-h-[400px] bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
            {content ? (
              <MarkdownRenderer
                content={content}
                className="prose prose-invert prose-zinc max-w-none"
              />
            ) : (
              <p className="text-[var(--muted)] text-sm">내용이 없습니다.</p>
            )}
          </div>
        ) : (
          <textarea
            id="field-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${inputCls} min-h-[400px] font-mono resize-y leading-relaxed`}
            placeholder="마크다운으로 글을 작성하세요..."
          />
        )}
      </div>

      {/* 발췌 */}
      <div>
        <label htmlFor="field-excerpt" className={labelCls}>
          발췌 (선택)
        </label>
        <textarea
          id="field-excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className={`${inputCls} resize-none`}
          rows={2}
          placeholder="목록에 표시될 짧은 설명 (비워두면 본문에서 자동 생성)"
        />
      </div>

      {/* SEO */}
      <details className="group">
        <summary className="cursor-pointer font-mono text-xs text-[var(--muted)] uppercase tracking-wider select-none list-none flex items-center gap-2">
          <span className="group-open:rotate-90 transition-transform inline-block">
            ▶
          </span>
          SEO 메타데이터
        </summary>
        <div className="mt-4 flex flex-col gap-4 pl-4 border-l border-[var(--border)]">
          <div>
            <label htmlFor="field-meta-title" className={labelCls}>
              Meta Title
            </label>
            <input
              id="field-meta-title"
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className={inputCls}
              placeholder={title || "페이지 제목 (기본: 글 제목)"}
              maxLength={70}
            />
            <p className="font-mono text-xs text-[var(--muted)] mt-1">
              {metaTitle.length}/70
            </p>
          </div>
          <div>
            <label htmlFor="field-meta-desc" className={labelCls}>
              Meta Description
            </label>
            <textarea
              id="field-meta-desc"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className={`${inputCls} resize-none`}
              rows={2}
              placeholder="검색 결과에 표시될 설명 (기본: 발췌)"
              maxLength={160}
            />
            <p className="font-mono text-xs text-[var(--muted)] mt-1">
              {metaDescription.length}/160
            </p>
          </div>
        </div>
      </details>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(getValues(), "draft")}
          className="px-4 py-2 bg-[var(--surface-2)] text-[var(--foreground)] text-sm font-medium rounded-lg hover:bg-[var(--border)] transition-colors disabled:opacity-50"
        >
          {saving ? "저장 중..." : "초안 저장"}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(getValues(), "published")}
          className="px-4 py-2 bg-[var(--accent)] text-[var(--background)] text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "저장 중..." : "발행"}
        </button>
      </div>
    </div>
  );
}
