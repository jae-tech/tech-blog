import Link from "next/link";
import type { PostListItem } from "@/features/posts/post.types";
import { formatDate } from "@/lib/utils/date";

interface PostCardProps {
  post: PostListItem;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group py-5 border-b border-[var(--border)] last:border-0">
      <Link
        href={`/posts/${post.slug}`}
        className="flex items-baseline justify-between gap-6"
      >
        <span className="text-[var(--foreground)] text-[1.125rem] font-medium leading-snug transition-colors duration-150 group-hover:text-[var(--accent)]">
          {post.title}
        </span>
        {post.published_at && (
          <time
            dateTime={post.published_at}
            className="shrink-0 font-mono text-[0.75rem] text-[var(--muted)]"
          >
            {formatDate(post.published_at)}
          </time>
        )}
      </Link>
    </article>
  );
}
