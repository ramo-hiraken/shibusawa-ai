"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  const learnActive = pathname === "/learn";
  const chatActive = pathname.startsWith("/chat");
  const topActive = pathname === "/";

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white rounded-lg p-2 shadow-md"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="#2c2c2c" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <aside
        className={`
          fixed md:static z-40 h-full w-64 border-r border-[var(--border)]
          bg-[var(--sidebar-bg)] flex flex-col transition-transform duration-200
          ${collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-[var(--border)]">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[var(--primary)]">渋</span>
            <div>
              <h1 className="text-sm font-bold leading-tight">渋沢栄一AI</h1>
              <p className="text-[10px] text-[var(--muted)]">アントレプレナーシップ探求</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Section: 渋沢栄一を学ぶ */}
          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider px-3 py-2">
            渋沢栄一を学ぶ
          </p>
          <Link
            href="/learn"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
              ${learnActive
                ? "bg-[var(--primary)] text-white font-medium"
                : "text-[var(--foreground)] hover:bg-[var(--border)]"
              }
            `}
          >
            <span className="text-base">📖</span>
            渋沢について聞く
          </Link>

          <div className="pt-2">
            <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider px-3 py-2">
              アントレプレナーシップ探求
            </p>
            <Link
              href="/"
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${topActive
                  ? "bg-[var(--primary)] text-white font-medium"
                  : "text-[var(--foreground)] hover:bg-[var(--border)]"
                }
              `}
            >
              <span className="text-base font-bold">＋</span>
              新しい探求を始める
            </Link>
            <Link
              href="/chat"
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mt-1
                ${chatActive
                  ? "bg-[var(--primary)] text-white font-medium"
                  : "text-[var(--foreground)] hover:bg-[var(--border)]"
                }
              `}
            >
              <span className="text-base">💬</span>
              探求チャット
            </Link>
          </div>
        </nav>

        {/* Settings */}
        <div className="p-3 border-t border-[var(--border)]">
          <Link
            href="/settings"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
              ${pathname === "/settings"
                ? "bg-[var(--primary)] text-white font-medium"
                : "text-[var(--foreground)] hover:bg-[var(--border)]"
              }
            `}
          >
            <span className="text-base">⚙</span>
            設定
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}
