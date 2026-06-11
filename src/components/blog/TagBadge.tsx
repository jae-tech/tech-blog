import Link from "next/link";

interface TagBadgeProps {
  name: string;
  slug: string;
}

export function TagBadge({ name, slug }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${slug}`}
      className="inline-block rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 font-mono text-[0.75rem] text-[var(--muted)] transition-colors duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)]"
    >
      #{name}
    </Link>
  );
}
