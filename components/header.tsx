"use client";

import { useAuth } from "@/components/auth-provider";
import { Separator } from "@/components/ui/separator";
import { Loader2, TextAlignJustify } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "/introduction", label: "關於我們" },
  { href: "/organization", label: "組織人員" },
  { href: "/announcement", label: "活動公告" },
  { href: "/result", label: "活動成果" },
  { href: "/competition", label: "公司職缺" },
];

export function Header() {
  const { user, profile, isLoading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const panel = panelRef.current;
      const btn = buttonRef.current;
      const target = e.target as Node;

      if (panel?.contains(target)) return;
      if (btn?.contains(target)) return;

      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const renderAuthSection = (isMobile = false) => {
    const linkHover = isMobile ? "rounded-lg px-3 py-2 hover:bg-black/10 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]" : "inline-block transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] hover:opacity-80";

    if (user) {
      const displayLabel = profile?.display_name || user.email || "帳號";
      return (
        <div className={isMobile ? "flex flex-col" : "flex items-center gap-4"}>
          {isMobile && <Separator className="my-2 bg-black/10" />}
          <Link
            href="/account"
            className={linkHover}
            onClick={isMobile ? () => setOpen(false) : undefined}
          >
            {displayLabel}
          </Link>
          <button
            type="button"
            onClick={() => {
              signOut();
              if (isMobile) setOpen(false);
            }}
            className={isMobile ? "rounded-lg px-3 py-2 hover:bg-black/10 text-left transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]" : "inline-block transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] hover:opacity-80 cursor-pointer"}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "登出"}
          </button>
        </div>
      );
    }

    return (
      <Link
        href="/login"
        className={linkHover}
        onClick={isMobile ? () => setOpen(false) : undefined}
      >
        登入
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-transparent text-black border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-6 text-xl font-bold">
        <Link href="/" className="inline-block text-xl sm:text-2xl font-bold whitespace-nowrap transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
          人工智慧專責辦公室
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="inline-block transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] hover:opacity-80">
              {item.label}
            </Link>
          ))}
          {renderAuthSection()}
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-black/10 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          aria-label="開啟選單"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <TextAlignJustify />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-200 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div ref={panelRef} className="max-w-6xl mx-auto px-4 pb-4">
          <div className="flex flex-col text-lg font-bold">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 hover:bg-black/10 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {renderAuthSection(true)}
          </div>
        </div>
      </div>
    </header>
  );
}