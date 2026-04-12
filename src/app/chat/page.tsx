"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StepProgress from "@/components/StepProgress";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

const stepIntros: Record<number, { title: string; aiGreeting: string; suggestions: string[] }> = {
  1: {
    title: "社会課題の発見",
    aiGreeting: "いい探求のスタートですね！まず、あなたの身の回りで「困っている人」や「もっとこうなればいいのに」と感じることを教えてください。小さなことでも大丈夫です。",
    suggestions: [
      "通学路でお年寄りが困っているのを見た",
      "給食の食べ残しが多い気がする",
      "商店街のお店が減っている",
    ],
  },
  2: {
    title: "課題の深掘り",
    aiGreeting: "課題を深く理解することが、良い解決策につながります。渋沢栄一も「事業の正しき道理を知る」ことを重視しました。あなたが見つけた課題について、一緒に「なぜ？」を考えていきましょう。",
    suggestions: [
      "その問題はいつから起きている？",
      "誰が一番困っている？",
      "今ある解決策は？なぜうまくいかない？",
    ],
  },
  3: {
    title: "解決策の構想",
    aiGreeting: "渋沢栄一は「道徳と経済は一体であるべき」と考えました。社会に良いことをしながら、持続可能なビジネスとして成り立つ解決策を考えましょう。どんなアイデアが浮かびますか？",
    suggestions: [
      "テクノロジーで解決できないか？",
      "既存のサービスを組み合わせたら？",
      "高校生の自分たちだからできることは？",
    ],
  },
  4: {
    title: "実現可能性の検討",
    aiGreeting: "素晴らしいアイデアですね！渋沢栄一は「実業の道は、理想と現実の調和にあり」と述べました。このアイデアを現実にするために、いくつかの視点から検証してみましょう。",
    suggestions: [
      "本当にお客さんはいる？",
      "どうやって続けていく？",
      "最初の小さな一歩は何？",
    ],
  },
};

// Mock conversation data for demo
const mockResponses: Record<string, { content: string; suggestions: string[] }> = {
  default: {
    content: "なるほど、それは面白い視点ですね。もう少し詳しく聞かせてください。具体的にどんな場面で、誰がどのように困っていますか？",
    suggestions: ["具体例を教えて", "他の人も同じように感じている？", "いつ頃から気になっていた？"],
  },
};

function ChatContent() {
  const searchParams = useSearchParams();
  const step = parseInt(searchParams.get("step") || "1");
  const initialQuery = searchParams.get("q") || "";

  const stepData = stepIntros[step] || stepIntros[1];
  const [currentStep, setCurrentStep] = useState(step);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      role: "assistant",
      content: stepData.aiGreeting,
      suggestions: initialQuery ? undefined : stepData.suggestions,
    },
  ]);
  const [input, setInput] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);
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

    // Simulate AI response
    setTimeout(() => {
      const response = mockResponses.default;
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const goToNextStep = () => {
    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const nextData = stepIntros[nextStep];
      setMessages((prev) => [
        ...prev,
        {
          id: `step-${nextStep}`,
          role: "assistant",
          content: `--- ステップ${nextStep}に進みます ---\n\n${nextData.aiGreeting}`,
          suggestions: nextData.suggestions,
        },
      ]);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header with step progress */}
      <header className="border-b border-[var(--border)] px-6 py-3">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-sm font-bold">{stepData.title}</h1>
          {currentStep < 4 && (
            <button
              onClick={goToNextStep}
              className="text-xs px-3 py-1.5 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors"
            >
              次のステップへ →
            </button>
          )}
        </div>
        <StepProgress currentStep={currentStep} />
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id}>
            <div
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
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
            {/* Suggestion chips */}
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
      <div className="border-t border-[var(--border)] p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="あなたの考えを教えてください..."
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
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-[var(--muted)]">読み込み中...</div>}>
      <ChatContent />
    </Suspense>
  );
}
