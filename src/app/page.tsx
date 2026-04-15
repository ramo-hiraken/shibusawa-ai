"use client";

import Link from "next/link";
import StepProgress from "@/components/StepProgress";

const explorationCards = [
  {
    id: "social-issue",
    title: "社会課題を見つける",
    description: "身の回りや地域で「困っていること」「もっとよくなればいいのに」と感じることを一緒に探そう。",
    icon: "🔍",
    step: 1,
  },
  {
    id: "deep-dive",
    title: "課題を深く掘り下げる",
    description: "見つけた課題の「なぜ？」を一緒に考えよう。渋沢栄一も常に物事の本質を追求しました。",
    icon: "🧐",
    step: 2,
  },
  {
    id: "solution",
    title: "解決策をビジネスで考える",
    description: "渋沢栄一の「道徳経済合一」の精神で、社会に貢献しながら持続可能な解決策を構想しよう。",
    icon: "💡",
    step: 3,
  },
  {
    id: "validate",
    title: "実現可能性を検証する",
    description: "誰のため？本当に求められている？実現できる？顧客視点でアイデアを磨こう。",
    icon: "✅",
    step: 4,
  },
];

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
        <h1 className="text-lg font-bold">アントレプレナーシップ探求</h1>
        <p className="text-xs text-[var(--muted)]">渋沢栄一の志に学び、社会課題をビジネスで解決する探求の旅</p>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6 space-y-8">
        {/* Step Progress */}
        <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
          <h2 className="text-sm font-bold mb-4 text-center">探求のステップ</h2>
          <StepProgress currentStep={1} />
        </div>

        {/* Welcome message */}
        <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-lg shrink-0">
              渋
            </div>
            <div>
              <p className="text-sm font-medium mb-2">渋沢AIアシスタント</p>
              <p className="text-sm leading-relaxed">
                ようこそ！私は渋沢栄一の思想をもとに、あなたの探求をサポートするAIアシスタントです。
              </p>
              <p className="text-sm leading-relaxed mt-2">
                渋沢栄一は「志を立てて以て万事の源となす」と語りました。
                あなたが関心を持つ社会の課題を見つけ、ビジネスの力で解決策を考えていきましょう。
              </p>
              <p className="text-sm leading-relaxed mt-2 font-medium text-[var(--primary)]">
                まずは、あなたが気になる「社会の課題」から始めてみませんか？
              </p>
            </div>
          </div>
        </div>

        {/* Exploration Cards */}
        <div>
          <h2 className="text-sm font-bold mb-3">探求のステップを選ぶ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {explorationCards.map((card) => (
              <Link
                key={card.id}
                href={`/chat?step=${card.step}`}
                className="bg-[var(--card-bg)] rounded-xl p-5 shadow-sm border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{card.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold group-hover:text-[var(--primary)] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
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
