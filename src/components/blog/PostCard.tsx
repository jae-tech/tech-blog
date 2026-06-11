import Link from "next/link";
import type { PostListItem } from "@/features/posts/post.types";
import { formatDate } from "@/lib/utils/date";
import { truncate } from "@/lib/utils/string";
import { TagBadge } from "./TagBadge";

interface PostCardProps {
  post: PostListItem;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-6 transition-shadow hover:shadow-md dark:border-zinc-800">
      {post.category && (
        <Link
          href={`/categories/${post.category.slug}`}
          className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400"
        >
          {post.category.name}
        </Link>
      )}

      <Link href={`/posts/${post.slug}`} className="group">
        <h2 className="text-xl font-semibold leading-snug text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
          {post.title}
        </h2>
      </Link>

      {post.excerpt && (
        <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {truncate(post.excerpt, 120)}
        </p>
      )}

      <div className="flex items-center justify-between">
        {post.published_at && (
          <time
            dateTime={post.published_at}
            className="text-xs text-zinc-400 dark:text-zinc-500"
          >
            {formatDate(post.published_at)}
          </time>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag.slug} name={tag.name} slug={tag.slug} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
