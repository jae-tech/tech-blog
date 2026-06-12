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
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto w-full max-w-[672px] px-6 py-16"
    >
      {/* Hero */}
      <section className="mb-14">
        <h1 className="text-[2rem] font-semibold tracking-tight text-[var(--foreground)]">
          jae.tech
        </h1>
        <p className="mt-2 text-[0.9375rem] text-[var(--muted)]">
          개발 경험과 기술을 기록합니다.
        </p>
      </section>

      {/* Post list */}
      {posts.length === 0 ? (
        <p className="text-[var(--muted)] text-sm">
          아직 게시된 글이 없습니다.
        </p>
      ) : (
        <>
          <div className="flex flex-col">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/posts"
              className="text-sm text-[var(--muted)] transition-colors duration-150 hover:text-[var(--accent)]"
            >
              모든 글 보기 →
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
