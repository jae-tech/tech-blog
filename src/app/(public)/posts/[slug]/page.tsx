import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TagBadge } from "@/components/blog/TagBadge";
import { ArticleJsonLd } from "@/components/seo/JsonLd";
import {
  getPostBySlug,
  getPublishedPostSlugs,
} from "@/features/posts/post.queries";
import { MarkdownRenderer } from "@/lib/markdown/render";
import { generatePostMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils/date";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 60;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return generatePostMetadata(post);
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto w-full max-w-[672px] px-6 py-20"
    >
      <ArticleJsonLd
        title={post.title}
        description={post.meta_description ?? post.excerpt ?? ""}
        url={`${SITE_URL}/posts/${post.slug}`}
        publishedAt={post.published_at}
        updatedAt={post.updated_at}
        imageUrl={post.thumbnail_url}
      />

      <article>
        {/* Header */}
        <header className="mb-12 pt-10">
          {post.category && (
            <Link
              href={`/categories/${post.category.slug}`}
              className="mb-4 inline-block font-mono text-[0.6875rem] uppercase tracking-widest text-[var(--accent)] transition-colors duration-150 hover:text-[var(--accent)]/80"
            >
              {post.category.name}
            </Link>
          )}

          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight tracking-tight text-[var(--foreground)]">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {post.published_at && (
              <time
                dateTime={post.published_at}
                className="font-mono text-[0.75rem] text-[var(--muted)]"
              >
                {formatDate(post.published_at)}
              </time>
            )}

            {post.tags.length > 0 && (
              <>
                <span className="text-[var(--border)]">·</span>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <TagBadge key={tag.slug} name={tag.name} slug={tag.slug} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="mt-6 h-px w-full bg-[var(--border)]" />
        </header>

        {/* Body */}
        {post.content && (
          <MarkdownRenderer
            content={post.content}
            className="prose max-w-none"
          />
        )}
      </article>

      {/* Back link */}
      <div className="mt-16 pt-8 border-t border-[var(--border)]">
        <Link
          href="/posts"
          className="text-sm text-[var(--muted)] transition-colors duration-150 hover:text-[var(--accent)]"
        >
          ← 글 목록으로
        </Link>
      </div>
    </main>
  );
}
