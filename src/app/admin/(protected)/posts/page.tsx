import Link from "next/link";
import { getAdminPosts } from "@/features/posts/post.admin-queries";
import { formatDate } from "@/lib/utils/date";

const STATUS_LABEL: Record<string, string> = {
  published: "발행됨",
  draft: "초안",
  archived: "보관됨",
};

const STATUS_COLOR: Record<string, string> = {
  published: "text-green-400",
  draft: "text-zinc-500",
  archived: "text-zinc-600",
};

export default async function AdminPostsPage() {
  const posts = await getAdminPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-zinc-100">글 목록</h1>
        <Link
          href="/admin/posts/new"
          className="bg-orange-500 text-zinc-950 text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-400 transition-colors"
        >
          새 글 작성
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-zinc-500 text-sm">작성된 글이 없습니다.</p>
      ) : (
        <div className="flex flex-col divide-y divide-zinc-800">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between py-4 gap-4"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="text-zinc-100 hover:text-orange-400 transition-colors truncate text-sm font-medium"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-3 font-mono text-xs text-zinc-500">
                  <span className={STATUS_COLOR[post.status]}>
                    {STATUS_LABEL[post.status] ?? post.status}
                  </span>
                  {post.category && <span>{post.category.name}</span>}
                  <span>{formatDate(post.updated_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {post.status === "published" && (
                  <Link
                    href={`/posts/${post.slug}`}
                    target="_blank"
                    className="font-mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    보기 →
                  </Link>
                )}
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="font-mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  수정
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
