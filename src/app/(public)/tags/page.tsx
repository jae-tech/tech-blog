import type { Metadata } from "next";
import { TagBadge } from "@/components/blog/TagBadge";
import { getTags } from "@/features/tags/tag.queries";
import { generateListMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateListMetadata({
  title: "태그",
  description: "모든 태그 목록",
  path: "/tags",
});

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto w-full max-w-[672px] px-6 py-16"
    >
      <h1 className="mb-10 text-[2rem] font-semibold tracking-tight text-[var(--foreground)]">
        태그
      </h1>

      {tags.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">태그가 없습니다.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagBadge key={tag.slug} name={tag.name} slug={tag.slug} />
          ))}
        </div>
      )}
    </main>
  );
}
