import type { Metadata } from "next";
import type { PostWithRelations } from "@/lib/supabase/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = "jae.tech";

export function generatePostMetadata(post: PostWithRelations): Metadata {
  const title = post.meta_title ?? post.title;
  const description = post.meta_description ?? post.excerpt ?? "";
  const url = `${SITE_URL}/posts/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: SITE_NAME,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      ...(post.thumbnail_url ? { images: [{ url: post.thumbnail_url }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function generateListMetadata(options: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${SITE_URL}${options.path}`;
  return {
    title: `${options.title} | ${SITE_NAME}`,
    description: options.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: options.title,
      description: options.description,
      url,
      siteName: SITE_NAME,
    },
  };
}
