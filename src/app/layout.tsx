import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "jae.tech",
    template: "%s — jae.tech",
  },
  description: "개발 경험과 기술을 기록하는 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
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
      </body>
    </html>
  );
}
