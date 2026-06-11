import { type NextRequest, NextResponse } from "next/server";
import {
  createPost,
  PostInputSchema,
  upsertTags,
} from "@/features/posts/post.mutations";
import { createClient } from "@/lib/supabase/server";
import type { PostStatus } from "@/lib/supabase/types";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { tagSlugs, status, ...rest } = body;

  const parsed = PostInputSchema.safeParse({ ...rest, status });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const post = await createPost({
    ...parsed.data,
    status: status as PostStatus,
  });
  await upsertTags(post.id, tagSlugs ?? []);

  return NextResponse.json({ id: post.id }, { status: 201 });
}
