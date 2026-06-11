import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/PostCard";
import { getCategoryBySlug } from "@/features/categories/category.queries";
import { getPublishedPosts } from "@/features/posts/post.queries";
import { generateListMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return generateListMetadata({
    title: category.name,
    description: category.description ?? `${category.name} 카테고리의 글 목록`,
    path: `/categories/${slug}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = await getPublishedPosts({ categorySlug: slug });

  return (
    <main className="mx-auto w-full max-w-[672px] px-6 py-20">
      <h1 className="mb-1 text-[2rem] font-semibold tracking-tight text-[var(--foreground)]">
        {category.name}
      </h1>
      {category.description && (
        <p className="mb-10 text-sm text-[var(--muted)]">
          {category.description}
        </p>
      )}

      {posts.length === 0 ? (
        <p className="text-[var(--muted)] text-sm">
          이 카테고리의 글이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
