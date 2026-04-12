"use client";

import Link from "next/link";

const mockHistories = [
  {
    id: "1",
    title: "商店街活性化プロジェクト",
    step: 3,
    stepLabel: "解決策の構想",
    updatedAt: "2026年4月10日(金) 15:30",
    summary: "地元商店街の空き店舗を高校生のポップアップストアに活用するアイデア",
  },
  {
    id: "2",
    title: "食品ロス削減チャレンジ",
    step: 2,
    stepLabel: "課題の深掘り",
    updatedAt: "2026年4月8日(水) 10:15",
    summary: "学校給食の食べ残し問題から地域全体の食品ロスへ視野を拡大",
  },
  {
    id: "3",
    title: "高齢者の移動サポート",
    step: 1,
    stepLabel: "社会課題の発見",
    updatedAt: "2026年4月5日(日) 14:00",
    summary: "通学路で見かける高齢者の買い物難民問題",
  },
];

const stepColors: Record<number, string> = {
  1: "bg-blue-100 text-blue-700",
  2: "bg-amber-100 text-amber-700",
  3: "bg-purple-100 text-purple-700",
  4: "bg-green-100 text-green-700",
};

export default function HistoriesPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-[var(--border)] px-6 py-4">
        <h1 className="text-lg font-bold">探求履歴</h1>
        <p className="text-xs text-[var(--muted)]">これまでの探求プロジェクトの一覧</p>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-3 max-w-2xl">
          {mockHistories.map((item) => (
            <Link
              key={item.id}
              href={`/chat?step=${item.step}`}
              className="block bg-[var(--card-bg)] rounded-xl p-5 shadow-sm border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold truncate">{item.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${stepColors[item.step]}`}>
                      {item.stepLabel}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{item.summary}</p>
                </div>
                <p className="text-[10px] text-[var(--muted)] shrink-0 whitespace-nowrap">{item.updatedAt}</p>
              </div>
            </Link>
          ))}
        </div>

        {mockHistories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--muted)]">
            <p className="text-sm">まだ探求履歴がありません</p>
            <Link href="/" className="mt-2 text-xs text-[var(--primary)] hover:underline">
              新しい探求を始める
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
