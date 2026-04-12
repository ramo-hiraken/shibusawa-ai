"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "新しい探求", icon: "+" },
  { href: "/histories", label: "探求履歴", icon: "📋" },
  { href: "/settings", label: "設定", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

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
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${isActive
                    ? "bg-[var(--primary)] text-white font-medium"
                    : "text-[var(--foreground)] hover:bg-[var(--border)]"
                  }
                `}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold">
              K
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">k.hiramoto</p>
              <p className="text-[10px] text-[var(--muted)] truncate">ユーザー</p>
            </div>
          </div>
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
