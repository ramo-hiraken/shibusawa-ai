"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StepProgress from "@/components/StepProgress";

interface Message {
  id: string;
  role: "user" | "assistant" | "summary";
  content: string;
  suggestions?: string[];
}

const stepIntros: Record<number, { title: string; aiGreeting: string; suggestions: string[] }> = {
  1: {
    title: "課題の特定",
    aiGreeting: "まず、あなたが「気になること」「もやもやすること」を教えてください。ニュースで見たこと、通学中の気づき、身近な人の困りごとなど、なんでもOKです。",
    suggestions: [
      "高齢者が買い物に困っている様子を見た",
      "学校給食の食べ残しがすごく多い",
      "地元の商店街がシャッター街になっている",
    ],
  },
  2: {
    title: "アイデアの発散",
    aiGreeting: "その課題、面白いですね。まずは「どんな解決策があるか」を自由に発想してみましょう。正解はありません。ぶっ飛んだアイデアも歓迎です！",
    suggestions: [
      "高校生が買い物を代行するサービス",
      "食べ残しを安く売れるマルシェ",
      "空き店舗を学生が運営するカフェ",
    ],
  },
  3: {
    title: "課題の深掘り",
    aiGreeting: "アイデアが出てきましたね。ここで一度立ち止まって「本当にその課題、重要ですか？」を問い直してみましょう。渋沢栄一も「物事の本質を見極めよ」と言いました。",
    suggestions: [
      "実際にどのくらいの人が困っているか",
      "なぜ今まで解決されてこなかったか",
      "自分が本気で取り組める理由は何か",
    ],
  },
  4: {
    title: "解決策の具体化",
    aiGreeting: "課題がより鮮明になってきました。では、「誰のために」「どんな価値を提供するか」を具体的に考えていきましょう。渋沢栄一の道徳経済合一——社会のためになり、かつ続けられる仕組みを。",
    suggestions: [
      "サービスを使う人は誰か具体的に考えてみた",
      "お金の流れはどうなるか",
      "最初の小さな実験として何ができるか",
    ],
  },
  5: {
    title: "統合・まとめ",
    aiGreeting: "ここまでの探求、すごくよかったです。最後に、これまで話してきたことを整理しましょう。あなたの言葉で「何のために、何をするか」を言語化してみてください。",
    suggestions: [
      "自分の言葉でまとめてみる",
      "一番大事にしたいことを一言で",
      "次にやること（最初の一歩）を決める",
    ],
  },
};

// Scenario-based mock conversation engine
const stepScenarios: Record<number, Array<{
  keywords?: string[];
  content: string;
  suggestions: string[];
  autoAdvance?: boolean;
}>> = {
  1: [
    {
      keywords: ["お年寄り", "高齢者", "おじいちゃん", "おばあちゃん", "通学路"],
      content: "通学路で高齢者の方が困っている場面を見たんですね。渋沢栄一も「他人の利益を図りながら自己の利益も忘れない」という考えを持っていました。\n\nもう少し具体的に聞かせてください。どんな場面でしたか？",
      suggestions: ["買い物袋を持って歩くのが大変そうだった", "バス停で長時間待っていた", "坂道で荷物を運べなかった"],
    },
    {
      keywords: ["買い物", "荷物", "重い", "持って", "運べ"],
      content: "買い物の負担ですね。実はこれ「買い物難民」という社会問題として知られています。\n\n全国で約700万人が日常の買い物に困難を感じているというデータもあります。あなたの地域でも同じような方は他にもいそうですか？",
      suggestions: ["近所のスーパーが閉店してから増えた気がする", "自分のおばあちゃんも同じことを言っていた", "友達の地域でも聞いたことがある"],
    },
    {
      keywords: ["スーパー", "閉店", "閉まった", "なくなった", "おばあちゃん", "近所"],
      content: "地域のお店が減ることで、高齢者の生活に大きな影響が出ているんですね。とてもいい気づきです！\n\n渋沢栄一は「一人ひとりが社会のために何ができるかを考えよ」と説きました。\n\nこの課題について、もう少し深く掘り下げてみませんか？",
      suggestions: ["なぜお店が減っているのか知りたい", "他にどんな影響があるか考えたい", "次のステップに進みたい"],
      autoAdvance: true,
    },
    {
      keywords: ["バス", "待って", "交通"],
      content: "交通の問題ですね。高齢者にとってバスが唯一の移動手段という地域は多いです。\n\nバスの本数が減ったり、バス停まで遠かったりすると、病院や買い物にも行けなくなります。あなたの地域の交通事情はどうですか？",
      suggestions: ["バスは1時間に1本しかない", "最寄り駅まで歩くのが大変そう", "タクシーは高くて使えないと聞いた"],
    },
    {
      keywords: ["給食", "食べ残し", "もったいない", "残し", "フードロス", "食品ロス"],
      content: "給食の食べ残し、よく気づきましたね！実は日本では年間約523万トンの食品が廃棄されています。学校給食だけでも年間約5万トンと言われています。\n\nあなたの学校ではどのくらい残っていますか？",
      suggestions: ["クラスの半分くらいが残している", "特定のメニューの時にたくさん残る", "量が多すぎるという声をよく聞く"],
    },
    {
      keywords: ["商店街", "お店", "シャッター", "減って"],
      content: "商店街の衰退は日本全国で起きている課題ですね。渋沢栄一が設立に関わった多くの企業も、地域経済の発展を目指したものでした。\n\nあなたの地域の商店街はどんな様子ですか？",
      suggestions: ["シャッターが閉まっている店が多い", "お客さんがほとんどいない", "昔は賑やかだったらしい"],
    },
    {
      keywords: ["シャッター", "客", "賑やか", "閉まって"],
      content: "寂しい状況ですね。でも、その問題に気づいたことが大事な一歩です。\n\n商店街が衰退する原因は何だと思いますか？いくつか考えてみましょう。",
      suggestions: ["大型スーパーやネット通販に客を取られた？", "若い人が街を出ていった？", "駐車場がなくて不便？"],
      autoAdvance: true,
    },
  ],
  2: [
    // Step 2: アイデアの発散
    {
      keywords: ["代行", "届ける", "サービス"],
      content: "買い物代行、いいですね！\n\nちょっと膨らませてみましょう。誰が届けるのか、どうやって注文するのか、お金はどうするのか——3つの視点で考えてみてください。",
      suggestions: ["高校生が放課後に届ける", "LINEで注文を受ける", "少額の手数料で運営する"],
    },
    {
      keywords: ["カフェ", "空き店舗", "マルシェ"],
      content: "空間活用のアイデア、素晴らしい！渋沢栄一も「場所を作ることで人が集まり、新しい価値が生まれる」という考え方を持っていました。\n\nそのカフェやマルシェ、誰が一番喜びそうですか？",
      suggestions: ["高齢者の居場所になる", "若者が地域とつながるきっかけ", "両方の世代が混ざれる場所"],
    },
    {
      keywords: ["アプリ", "LINE", "デジタル", "システム"],
      content: "テクノロジーを使ったアイデア！面白いですね。\n\nただ、使う人のことを考えましょう。高齢者の方でも使えるでしょうか？どうすればハードルを下げられそうですか？",
      suggestions: ["電話でも使えるようにする", "家族がサポートする仕組み", "地域の窓口でサポートしてもらう"],
    },
  ],
  3: [
    // Step 3: 課題の深掘り
    {
      keywords: ["人数", "規模", "どのくらい"],
      content: "規模感を考えるのは大事ですね。\n\n渋沢栄一は「まず一人の人を助けることから始めよ」と言いました。あなたの地域で、この課題で困っている人を3人、具体的に思い浮かべられますか？",
      suggestions: ["近所のおばあちゃんが思い浮かぶ", "クラスの友達の家族の話を聞いた", "自分の祖父母も同じ状況"],
    },
    {
      keywords: ["なぜ", "解決されない", "理由"],
      content: "「なぜ解決されてこなかったか」——これを考えると、課題の本質が見えてきます。\n\n大きく3つの可能性があります：\n① お金にならないと思われてきた\n② 誰かがやるだろうと思われてきた\n③ そもそも課題として認識されていなかった\n\nどれが一番近そうですか？",
      suggestions: ["お金にならないと思われてきた", "見えにくい課題だった", "全部当てはまる気がする"],
    },
    {
      keywords: ["本気", "取り組む", "理由", "自分"],
      content: "「なぜ自分がやるか」——これを明確にすると、困難にぶつかった時に踏ん張れます。\n\n渋沢栄一も、農家の息子が「なぜ日本を変えようとするのか」という問いを自分に問い続けました。\n\nあなたにとって、この課題は「他人ごと」ですか？「自分ごと」ですか？",
      suggestions: ["実は自分や家族も困っている", "見て見ぬふりをしたくない", "自分にしかできないと感じる"],
    },
  ],
  4: [
    // Step 4: 解決策の具体化
    {
      keywords: ["誰", "ユーザー", "お客さん", "ターゲット"],
      content: "「誰のため」を具体化するのは一番大事なステップです。\n\n渋沢栄一は「お客様の立場に立て」と繰り返しました。\n\n使ってくれそうな人を、一人だけ具体的に描いてみてください。年齢・状況・どんな気持ちでいるか。",
      suggestions: ["70代の一人暮らしの女性", "子育て中で時間がない30代の親", "地元を盛り上げたい20代の若者"],
    },
    {
      keywords: ["お金", "収益", "手数料", "費用"],
      content: "お金の流れを考えるのは「続けられる仕組みか」を確かめるためです。\n\nシンプルに考えると：\n・誰がお金を払うか\n・いくらなら払ってもらえるか\n・最初にかかるコストはいくらか\n\nざっくりでいいので試算してみましょう。",
      suggestions: ["利用者から少額の手数料", "地元企業からスポンサー", "行政の補助金を活用"],
    },
    {
      keywords: ["実験", "小さく", "最初", "試す"],
      content: "MVP（最小限の実験）から始めるのは賢い方法です。\n\n「完璧にやろうとするより、まず試してみる」——渋沢栄一も小さな一歩を積み重ねました。\n\n来週できる最小のアクションは何ですか？",
      suggestions: ["3人にインタビューしてみる", "簡単なチラシを作る", "仲間を2人見つける"],
      autoAdvance: true,
    },
  ],
  5: [
    // Step 5: 統合・まとめ
    {
      keywords: ["まとめ", "整理", "言語化"],
      content: "では、これまでの探求を一つの文にまとめてみましょう。\n\n「（誰）が（どんな課題）に困っている。私は（解決策）で（こんな価値）を提供したい。なぜなら（自分の想い）から。」\n\nこの型で書いてみてください。",
      suggestions: ["高齢者の買い物難を、高校生の代行で解決したい", "食品ロスを、学校マルシェで価値に変えたい", "まだうまく言葉にできない"],
    },
    {
      keywords: ["次", "一歩", "やること", "行動"],
      content: "「千里の道も一歩から」——渋沢栄一も農家の息子から始まりました。\n\n来週、できる一番小さなアクションを1つ決めましょう：\n① 課題を抱えている人3人に話を聞く\n② 仲間を2人見つける\n③ アイデアを紙1枚にまとめる",
      suggestions: ["まず3人にインタビューする", "チームを作るところから始める", "この探求をNotebookLMでまとめてみる"],
    },
    {
      keywords: ["大事", "一言", "キーワード"],
      content: "大事にしたいことを一言で——それが「志」になります。\n\n渋沢栄一の志は「道徳と経済の両立で日本を豊かにすること」でした。\n\nあなたの探求の中で、一番大切にしたい価値観や想いは何でしょう？",
      suggestions: ["「誰も取り残さない」", "「楽しくなければ続かない」", "「地域を誇れるものにしたい」"],
    },
  ],
};

// Fallback responses per step when no keyword matches
const stepFallbacks: Record<number, Array<{ content: string; suggestions: string[] }>> = {
  1: [
    {
      content: "興味深い視点ですね。それはどんな場面で気づきましたか？日常生活の中で感じた「違和感」が、社会課題発見の第一歩です。",
      suggestions: ["学校生活の中で感じた", "地域を歩いていて気づいた", "ニュースで見て気になった"],
    },
    {
      content: "いい着眼点です！その問題で、具体的に誰が一番困っていると思いますか？渋沢栄一は「まず人を知ることから始めよ」と説きました。",
      suggestions: ["高齢者が困っていると思う", "子育て中の親が大変そう", "同世代の学生にも影響がある"],
    },
    {
      content: "その課題、あなたの周りではどのくらいの人が影響を受けていそうですか？身近な範囲から考えてみましょう。",
      suggestions: ["家族や親戚で思い当たる人がいる", "クラスメートにも聞いてみたい", "地域全体の問題だと思う"],
    },
  ],
  2: [
    {
      content: "面白いアイデアですね！もう少し具体化してみましょう。\n\n「誰が」「誰のために」「どうやって」を3行で書いてみてください。",
      suggestions: ["もう少し自由に発想したい", "渋沢の時代にもこんな発想はあった？", "別のアイデアも出してみる"],
    },
    {
      content: "そのアイデア、素敵ですね。渋沢栄一が言ったように「夢は大きく、行動は小さく」——まず最小版から考えてみましょう。",
      suggestions: ["最小版のアイデアを考える", "似たサービスを調べてみる", "チームで実現できそうか考える"],
    },
  ],
  3: [
    {
      content: "それは重要なポイントですね。もう一段深く考えてみましょう。\n\nその状況の「根本原因」は何だと思いますか？表面的な問題の奥にある本当の原因を探ってみましょう。",
      suggestions: ["社会の仕組みに問題がある？", "テクノロジーの変化が影響している？", "人々の意識や行動が変わった？"],
    },
    {
      content: "いい分析です！渋沢栄一は「事の成否は、志の有無にあり」と言いました。\n\nこの課題の全体像が見えてきましたか？整理してみましょう：\n・誰が困っている？\n・なぜ解決されていない？\n・どのくらい深刻？",
      suggestions: ["まだもう少し調べたい", "だいぶ理解が深まった", "解決策を考え始めたい"],
    },
  ],
  4: [
    {
      content: "実現に向けて具体的に考えていますね！\n\nまずは「MVP（最小限の実験）」から始めましょう。完璧でなくてもいいんです。渋沢栄一も最初は小さな一歩から始めました。\n\n来週中にできる一番小さなアクションは何ですか？",
      suggestions: ["3人にインタビューしてみる", "チラシを作って反応を見る", "SNSで発信してみる"],
    },
    {
      content: "いい考えです。実行する前に、もう一つ考えてほしいことがあります。\n\n「失敗したらどうする？」ではなく「失敗から何を学べる？」という視点です。渋沢栄一も多くの失敗を経験しましたが、すべてを学びに変えました。\n\nまずは行動してみましょう！",
      suggestions: ["小さく始めて改善していきたい", "チームで役割分担を決めたい", "発表に向けてまとめたい"],
    },
  ],
  5: [
    {
      content: "ここまでの探求を振り返ると、あなたは大きく成長しています。\n\n渋沢栄一の言葉「一日一善」——毎日少しずつ前に進むことが、大きな変化を生みます。\n\n今日の探求で、一番印象に残ったことは何ですか？",
      suggestions: ["課題の深さに気づいた", "自分にもできることがある", "仲間と一緒にやりたいと思った"],
    },
    {
      content: "素晴らしい探求でした！「論語と算盤」——道徳と経済を両立させる。これがあなたの挑戦のコアになりそうですね。\n\n最後に、この探求を誰かに話してみてください。話すことで、自分の考えがより明確になります。",
      suggestions: ["友達に話してみる", "家族に相談してみる", "先生や地域の大人に聞いてみる"],
    },
  ],
};

function getResponse(step: number, userText: string, turnIndex: number): { content: string; suggestions: string[] } {
  const scenarios = stepScenarios[step] || [];
  const fallbacks = stepFallbacks[step] || stepFallbacks[1];
  const text = userText.toLowerCase();

  // Try keyword matching first
  for (const scenario of scenarios) {
    if (scenario.keywords && scenario.keywords.some((kw) => text.includes(kw))) {
      return { content: scenario.content, suggestions: scenario.suggestions };
    }
  }

  // Fallback: cycle through fallback responses based on turn index
  const fallback = fallbacks[turnIndex % fallbacks.length];
  return fallback;
}

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
      const response = getResponse(currentStep, text.trim(), currentTurn);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);

      // 4ターンごとにサマリを挿入（Mockなので固定テキスト）
      // 実際のAI実装時には、対話内容をもとに動的に生成する
      if ((currentTurn + 1) % 4 === 0) {
        const currentStepData = stepIntros[currentStep] || stepIntros[1];
        const summaryMsg: Message = {
          id: (Date.now() + 2).toString(),
          role: "summary",
          content: `これまでの対話を整理すると：\n・探求のステップ: ${currentStepData.title}\n・対話の回数: ${currentTurn + 1}回\n・次のポイント: 引き続き対話を深めていきましょう\n\n※ここは実際のAI実装時に、対話内容をもとに動的に生成されます`,
        };
        setTimeout(() => {
          setMessages((prev) => [...prev, summaryMsg]);
        }, 1200 + 800 + Math.random() * 1200);
      }
    }, 800 + Math.random() * 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const goToNextStep = () => {
    if (currentStep < 5) {
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
          <h1 className="text-sm font-bold">{(stepIntros[currentStep] || stepIntros[1]).title}</h1>
          {currentStep < 5 && (
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
            {msg.role === "summary" ? (
              <div className="mx-2 rounded-xl border-l-4 border-[var(--accent)] bg-amber-50 px-4 py-3">
                <p className="text-[10px] font-bold text-[var(--accent)] mb-1">📝 ここまでの対話まとめ</p>
                <p className="text-xs leading-relaxed text-[var(--foreground)] whitespace-pre-wrap">{msg.content}</p>
              </div>
            ) : (
              <>
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
              </>
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
