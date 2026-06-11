import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <a
          href="/admin/posts"
          className="font-mono text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          admin
        </a>
        <nav className="flex items-center gap-6">
          <a
            href="/admin/posts"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            글 목록
          </a>
          <a
            href="/admin/posts/new"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            새 글
          </a>
          <a
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            블로그 보기 →
          </a>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              로그아웃
            </button>
          </form>
        </nav>
      </header>
      <main className="px-6 py-8 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
