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
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {category.name}
      </h1>
      {category.description && (
        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
          {category.description}
        </p>
      )}

      {posts.length === 0 ? (
        <p className="text-zinc-400">이 카테고리의 글이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
