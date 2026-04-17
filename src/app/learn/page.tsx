"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

const initialGreeting =
  "こんにちは！渋沢栄一AIアシスタントです。\n\n私は渋沢栄一の生涯・思想・業績について幅広く学んでいます。「渋沢栄一ってどんな人？」「道徳経済合一って何？」「どうやって500社もの会社を作ったの？」など、気になることを何でも聞いてください。\n\nまた、渋沢の言葉があなた自身の挑戦にどう活かせるかも一緒に考えていきます。";

const initialSuggestions = [
  "渋沢栄一ってどんな人？",
  "道徳経済合一って何ですか？",
  "どうして500社も会社を作れたの？",
  "今の時代に活かせる渋沢の教えは？",
];

const learnScenarios = [
  {
    keywords: ["どんな人", "どういう人", "どんな方", "人物"],
    content:
      "渋沢栄一（1840-1931）は埼玉県深谷市出身の実業家です。\n\n農家の息子として生まれながら、幕末に武士となり、フランスへの渡航で近代資本主義を学びました。帰国後は「道徳と経済を両立させた日本型資本主義」を構築し、約500社の企業・480以上の社会事業の設立に関わりました。\n\n「論語と算盤」が有名な言葉です——道徳（論語）と経済（算盤）は対立するものではなく、両立させるべきものだという考えです。\n\nあなたが特に興味を持ったのはどの部分ですか？",
    suggestions: ["フランスでの経験をもっと知りたい", "論語と算盤について詳しく", "どんな会社を作ったの？"],
  },
  {
    keywords: ["道徳経済合一", "論語", "算盤"],
    content:
      "「道徳経済合一」は渋沢栄一の中心思想です。\n\n当時の日本では「お金を稼ぐこと」と「道徳的であること」は相反するものと思われていました。しかし渋沢は「社会に貢献しながらお金を稼ぐことこそ本物のビジネスだ」と説きました。\n\n現代で言えば「社会的企業（ソーシャルエンタープライズ）」や「CSV（共有価値の創造）」に近い考え方です。\n\nあなたが今考えている挑戦やアイデアに、この考え方を当てはめてみるとどうなりそうですか？",
    suggestions: [
      "自分のアイデアに当てはめて考えたい",
      "具体的にどんな会社でこれを実践したの？",
      "現代のCSVとの違いは？",
    ],
  },
  {
    keywords: ["500社", "会社", "設立", "どうやって"],
    content:
      "渋沢栄一が関わった企業は多岐にわたります。\n\n・金融: 第一国立銀行（現みずほ銀行）\n・鉄道: 東武鉄道\n・ホテル: 帝国ホテル\n・紙: 王子製紙\n・保険・教育・社会福祉…など\n\nすべて「日本の近代化に必要なインフラ」という視点で選んでいます。\n\n渋沢は「一人でやろうとしない」ことも特徴でした。株式会社という仕組みを使って、多くの人の資金と知恵を集める——これが500社を実現した秘訣です。\n\nあなたも「誰かと一緒にやること」で実現できることはありますか？",
    suggestions: [
      "株式会社という仕組みの話を詳しく",
      "どんな人と一緒にやったの？",
      "今の自分に置き換えて考えたい",
    ],
  },
  {
    keywords: ["今の時代", "現代", "活かせる", "教え", "ヒント"],
    content:
      "渋沢栄一の教えで、今の時代に特に活かせるものをいくつか挙げます。\n\n① 「まず志を立てよ」\n  何のために何をするか——目的を明確にすることが全ての出発点\n\n② 「独りよがりになるな」\n  自分だけが得するビジネスは長続きしない。関わる人全員にメリットを\n\n③ 「失敗を恐れるな」\n  渋沢自身も多くの失敗を経験し、すべてを学びに変えた\n\n④ 「仲間を大切にせよ」\n  一人でできることには限りがある。志を共にする仲間を集めよ\n\nこの4つのうち、今のあなたに一番刺さるものはどれですか？",
    suggestions: [
      "「志を立てよ」についてもっと聞きたい",
      "「仲間を集める」具体的な方法は？",
      "渋沢が失敗した話を知りたい",
    ],
  },
  {
    keywords: ["深谷", "生まれ", "出身", "故郷"],
    content:
      "渋沢栄一は1840年、現在の埼玉県深谷市血洗島で生まれました。\n\n農家（藍の栽培・藍玉製造・養蚕）を営む家の息子でしたが、幼少期から学問に熱心で、父親から論語を学びました。\n\n「血洗島」という地名が示すように、当時は農業と商業が盛んな地域でした。農家出身でありながら、後に「日本資本主義の父」になった——この背景が渋沢の「道徳経済合一」思想の原点にもなっています。\n\n深谷市には今も渋沢栄一記念館があり、彼の生涯を詳しく学べます。",
    suggestions: [
      "フランス留学で何を学んだの？",
      "武士になった経緯を知りたい",
      "記念館にはどんなものが展示されてる？",
    ],
  },
  {
    keywords: ["フランス", "渡航", "留学", "海外"],
    content:
      "渋沢栄一は1867年、徳川昭武の随行員としてパリ万博に渡りました。\n\nフランスで約2年間滞在し、近代的な銀行・産業・社会制度を目の当たりにしました。この経験が後の「株式会社による日本近代化」の構想につながります。\n\n「欧米では人々が協力してお金と知恵を出し合い、大きな事業を起こしている」という気づきが、帰国後の行動の原動力になりました。\n\nあなたが海外で経験したこと、または経験してみたいことはありますか？",
    suggestions: ["株式会社の仕組みをもっと詳しく", "明治時代の日本がどう変わったか", "渋沢の帰国後の行動は？"],
  },
];

const learnFallbacks = [
  {
    content:
      "面白い視点ですね。渋沢栄一は「常に相手の立場で考えよ」と言いました。\n\nその問いを渋沢栄一の視点で考えると——彼ならどう答えるでしょうか？少し想像してみてください。",
    suggestions: ["もう少し詳しく教えてほしい", "渋沢の他の言葉も聞きたい", "これを自分の挑戦に活かすには？"],
  },
  {
    content:
      "良い質問です。渋沢栄一が生きた明治・大正時代と現代には多くの共通点があります。\n\n当時も「新しいテクノロジー（産業革命）」「社会の変化への不安」「格差の拡大」という課題がありました。渋沢はそれに「道徳と経済の両立」で向き合いました。\n\n今、あなたが向き合っている課題と重なる部分はありますか？",
    suggestions: ["もっと具体的に知りたい", "今の社会課題との比較", "自分の活動に活かしたい"],
  },
];

function getLearnResponse(userText: string, turnIndex: number): { content: string; suggestions: string[] } {
  const text = userText.toLowerCase();

  for (const scenario of learnScenarios) {
    if (scenario.keywords.some((kw) => text.includes(kw))) {
      return { content: scenario.content, suggestions: scenario.suggestions };
    }
  }

  const fallback = learnFallbacks[turnIndex % learnFallbacks.length];
  return fallback;
}

export default function LearnPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      role: "assistant",
      content: initialGreeting,
      suggestions: initialSuggestions,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [turnIndex, setTurnIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const currentTurn = turnIndex;
    setTurnIndex((prev) => prev + 1);

    setTimeout(() => {
      const response = getLearnResponse(text.trim(), currentTurn);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-6 py-4">
        <h1 className="text-sm font-bold">渋沢栄一を学ぶ</h1>
        <p className="text-xs text-[var(--muted)]">渋沢栄一について、何でも聞いてみてください</p>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id}>
            <div className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-xs shrink-0">
                  渋
                </div>
              )}
              <div
                className={`
                  max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
                  ${msg.role === "user"
                    ? "bg-[var(--user-bubble)] text-white rounded-br-sm"
                    : "bg-[var(--ai-bubble)] border border-[var(--border)] rounded-bl-sm"
                  }
                `}
              >
                {msg.content}
              </div>
            </div>
            {msg.suggestions && (
              <div className="flex flex-wrap gap-2 mt-2 ml-11">
                {msg.suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-xs shrink-0">
              渋
            </div>
            <div className="bg-[var(--ai-bubble)] border border-[var(--border)] rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border)] p-4 space-y-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="渋沢栄一について聞いてみてください..."
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)] transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        {/* 探求チャットへのリンク */}
        <Link
          href="/chat?step=1"
          className="block w-full text-center rounded-xl bg-[var(--primary)] text-white text-sm font-medium py-3 hover:bg-[var(--primary-hover)] transition-colors"
        >
          🚀 探求チャットで実践してみる
        </Link>
      </div>
    </div>
  );
}
