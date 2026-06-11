import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/PostCard";
import { getPublishedPosts } from "@/features/posts/post.queries";
import { getTagBySlug } from "@/features/tags/tag.queries";
import { generateListMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) return {};
  return generateListMetadata({
    title: `#${tag.name}`,
    description: `${tag.name} 태그가 달린 글 목록`,
    path: `/tags/${slug}`,
  });
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const posts = await getPublishedPosts({ tagSlug: slug });

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        #{tag.name}
      </h1>

      {posts.length === 0 ? (
        <p className="text-zinc-400">이 태그의 글이 없습니다.</p>
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
