import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/blog/PostCard";
import { getPublishedPosts } from "@/features/posts/post.queries";

export const metadata: Metadata = {
  title: "jae.tech",
  description: "개발 경험과 기술을 기록하는 블로그",
};

export default async function HomePage() {
  const posts = await getPublishedPosts({ limit: 6 });

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <section className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          jae.tech
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          개발 경험과 기술을 기록합니다.
        </p>
      </section>

      {posts.length === 0 ? (
        <p className="text-zinc-400">아직 게시된 글이 없습니다.</p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/posts"
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              모든 글 보기 →
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
