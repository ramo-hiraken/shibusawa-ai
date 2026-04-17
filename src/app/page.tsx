"use client";

import Link from "next/link";

const quickStarters = [
  "おばあちゃんが病院に行くのにバスが1日3本しかない",
  "コンビニ弁当の廃棄が毎晩すごい量出てるのを見た",
  "部活の後輩が制服代が高くて困っていると言っていた",
  "駅前の商店街が半分シャッター閉まってて寂しい",
  "外国人の転校生が日本語の壁で授業についていけてない",
];

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-6 py-4">
        <h1 className="text-lg font-bold">渋沢栄一AI</h1>
        <p className="text-xs text-[var(--muted)]">アントレプレナーシップ支援AIアシスタント</p>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6 space-y-8">
        {/* AI Greeting Card */}
        <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-lg shrink-0">
              渋
            </div>
            <div>
              <p className="text-sm font-medium mb-2">渋沢AIアシスタント</p>
              <p className="text-sm leading-relaxed">
                渋沢栄一の思想を軸に、あなたの挑戦をサポートします。
              </p>
              <p className="text-sm leading-relaxed mt-1 font-medium text-[var(--primary)]">
                まず何をしたいですか？
              </p>
            </div>
          </div>
        </div>

        {/* 2 Mode Cards */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: 渋沢栄一を学ぶ */}
            <Link
              href="/learn"
              className="bg-[var(--card-bg)] rounded-xl p-6 shadow-sm border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">📖</span>
                <div>
                  <h2 className="text-sm font-bold group-hover:text-[var(--primary)] transition-colors mb-1">
                    渋沢栄一を学ぶ
                  </h2>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    渋沢栄一はどんな人物？どんな考え方をした人？
                    知りたいことを何でも聞いてみましょう。
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 2: 課題を探求する */}
            <Link
              href="/chat?step=1"
              className="bg-[var(--card-bg)] rounded-xl p-6 shadow-sm border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">🚀</span>
                <div>
                  <h2 className="text-sm font-bold group-hover:text-[var(--primary)] transition-colors mb-1">
                    課題を探求する
                  </h2>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    社会課題を見つけ、ビジネスで解決するアイデアを
                    AIとの対話で深めていきます。
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Starters */}
        <div>
          <h2 className="text-sm font-bold mb-3">こんな問いから始めよう</h2>
          <div className="flex flex-wrap gap-2">
            {quickStarters.map((q, i) => (
              <Link
                key={i}
                href={`/chat?q=${encodeURIComponent(q)}`}
                className="bg-[var(--card-bg)] rounded-full px-4 py-2 text-xs border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
