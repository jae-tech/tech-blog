"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/posts", label: "글" },
  { href: "/tags", label: "태그" },
];

export function PublicNav() {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/"
        aria-current={pathname === "/" ? "page" : undefined}
        className="text-[1.125rem] font-semibold tracking-tight text-[var(--foreground)] transition-colors duration-150 hover:text-[var(--accent)]"
      >
        jae.tech
      </Link>
      <nav aria-label="주요 탐색">
        <ul className="flex list-none items-center gap-6">
          {items.map((item) => {
            const current =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className="text-sm text-[var(--muted)] transition-colors duration-150 hover:text-[var(--foreground)] aria-[current=page]:font-medium aria-[current=page]:text-[var(--foreground)]"
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
