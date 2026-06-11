import { type NextRequest, NextResponse } from "next/server";
import {
  PostInputSchema,
  updatePost,
  upsertTags,
} from "@/features/posts/post.mutations";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { tagSlugs, ...rest } = body;

  const parsed = PostInputSchema.partial().safeParse(rest);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const post = await updatePost(id, parsed.data);
  await upsertTags(id, tagSlugs ?? []);

  return NextResponse.json({ id: post.id });
}
