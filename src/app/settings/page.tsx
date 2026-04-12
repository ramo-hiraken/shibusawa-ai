"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [name, setName] = useState("k.hiramoto");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-[var(--border)] px-6 py-4">
        <h1 className="text-lg font-bold">設定</h1>
      </header>

      <div className="flex-1 overflow-auto p-6 space-y-6 max-w-xl">
        {/* User info */}
        <div className="bg-[var(--card-bg)] rounded-xl p-5 shadow-sm border border-[var(--border)]">
          <p className="text-xs text-[var(--muted)]">ログイン中</p>
          <p className="text-sm font-bold mt-1">k.hiramoto</p>
          <p className="text-xs text-[var(--muted)]">k.hiramoto@kolumoana.com</p>
          <p className="text-xs text-[var(--muted)] mt-1">ロール: ユーザー</p>
        </div>

        {/* Profile */}
        <div className="bg-[var(--card-bg)] rounded-xl p-5 shadow-sm border border-[var(--border)]">
          <h2 className="text-sm font-bold mb-1">プロフィール</h2>
          <p className="text-xs text-[var(--muted)] mb-4">表示名を更新できます。</p>
          <form onSubmit={handleSave}>
            <label className="text-xs font-medium block mb-1">表示名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
            />
            <button
              type="submit"
              className="mt-3 w-full py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
            >
              {saved ? "保存しました！" : "保存する"}
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="bg-[var(--card-bg)] rounded-xl p-5 shadow-sm border border-[var(--border)]">
          <h2 className="text-sm font-bold mb-1">パスワード変更</h2>
          <p className="text-xs text-[var(--muted)] mb-4">現在のパスワードを入力し、新しいパスワードに更新します。</p>
          <form className="space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1">現在のパスワード</label>
              <input type="password" className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]" />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">新しいパスワード</label>
              <input type="password" className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]" />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">確認用パスワード</label>
              <input type="password" className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]" />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
            >
              パスワードを変更
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
