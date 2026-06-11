import type { Metadata } from "next";
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
    // 빌드 환경에서 Supabase 접근 불가 시 빈 배열 — dynamicParams=true로 런타임 생성
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
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <ArticleJsonLd
        title={post.title}
        description={post.meta_description ?? post.excerpt ?? ""}
        url={`${SITE_URL}/posts/${post.slug}`}
        publishedAt={post.published_at}
        updatedAt={post.updated_at}
        imageUrl={post.thumbnail_url}
      />
      <article>
        <header className="mb-10">
          {post.category && (
            <a
              href={`/categories/${post.category.slug}`}
              className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400"
            >
              {post.category.name}
            </a>
          )}

          <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
            {post.title}
          </h1>

          {post.published_at && (
            <time
              dateTime={post.published_at}
              className="mt-3 block text-sm text-zinc-400 dark:text-zinc-500"
            >
              {formatDate(post.published_at)}
            </time>
          )}

          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <TagBadge key={tag.slug} name={tag.name} slug={tag.slug} />
              ))}
            </div>
          )}
        </header>

        {post.content && (
          <MarkdownRenderer
            content={post.content}
            className="prose prose-zinc max-w-none dark:prose-invert"
          />
        )}
      </article>
    </main>
  );
}
