import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[672px] items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-[1.125rem] font-semibold tracking-tight text-[var(--foreground)] transition-colors duration-150 hover:text-[var(--accent)]"
          >
            jae.tech
          </Link>
          <nav>
            <ul className="flex items-center gap-6 list-none">
              <li>
                <Link
                  href="/posts"
                  className="text-sm text-[var(--muted)] transition-colors duration-150 hover:text-[var(--foreground)]"
                >
                  글
                </Link>
              </li>
              <li>
                <Link
                  href="/tags"
                  className="text-sm text-[var(--muted)] transition-colors duration-150 hover:text-[var(--foreground)]"
                >
                  태그
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}
