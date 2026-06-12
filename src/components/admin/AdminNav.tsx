"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin/posts", label: "글 목록" },
  { href: "/admin/posts/new", label: "새 글" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="관리자 탐색" className="flex items-center gap-4 sm:gap-6">
      {items.map((item) => {
        const current =
          item.href === "/admin/posts/new"
            ? pathname === item.href
            : pathname === item.href ||
              /^\/admin\/posts\/[^/]+\/edit$/.test(pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)] aria-[current=page]:font-medium aria-[current=page]:text-[var(--foreground)]"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
