import type { Metadata } from "next";
import { PostCard } from "@/components/blog/PostCard";
import { getPublishedPosts } from "@/features/posts/post.queries";
import { generateListMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateListMetadata({
  title: "글 목록",
  description: "모든 게시글을 확인하세요.",
  path: "/posts",
});

export default async function PostsPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        글 목록
      </h1>

      {posts.length === 0 ? (
        <p className="text-zinc-400">아직 게시된 글이 없습니다.</p>
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
