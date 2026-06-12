import { PublicNav } from "@/components/blog/PublicNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-[var(--foreground)] px-3 py-2 text-sm font-medium text-[var(--background)] transition-transform focus:translate-y-0"
      >
        본문으로 건너뛰기
      </a>
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[672px] items-center justify-between px-6 py-4">
          <PublicNav />
        </div>
      </header>
      {children}
    </>
  );
}
