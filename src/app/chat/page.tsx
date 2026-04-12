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

// Scenario-based mock conversation engine
// Each step has a sequence of responses that progress the conversation
const stepScenarios: Record<number, Array<{
  keywords?: string[];
  content: string;
  suggestions: string[];
  autoAdvance?: boolean; // hint to show "next step" prompt
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
    {
      keywords: ["なぜ", "原因", "理由", "どうして", "知りたい"],
      content: "いい問いですね！渋沢栄一は「物事の根本を見極めよ」と語りました。\n\n課題の原因を探るために「5回のなぜ」を試してみましょう。\n\n例えば「高齢者が買い物に困っている」→ なぜ？ → 「近くのお店がなくなった」→ なぜ？ → ...\n\nあなたの課題で最初の「なぜ？」を考えてみてください。",
      suggestions: ["人口が減って採算が取れなくなった？", "若い世代の消費行動が変わった？", "地域の交通インフラが不十分？"],
    },
    {
      keywords: ["人口", "採算", "減って", "過疎"],
      content: "人口減少は重要なポイントです。さらに掘り下げると...\n\n人口が減る → お客さんが減る → お店が閉まる → さらに不便になる → もっと人が出ていく\n\nこの「負のスパイラル」が起きているんですね。では、このスパイラルのどこを断ち切れば良いと思いますか？",
      suggestions: ["お客さんを増やす方法を考える", "お店がなくても買い物できる仕組み", "人が出ていかない魅力を作る"],
    },
    {
      keywords: ["消費", "行動", "ネット", "通販", "Amazon"],
      content: "鋭い指摘です！ネット通販の普及で、わざわざ地元のお店に行く必要がなくなったんですね。\n\nでも逆に考えると、ネット通販では得られない価値は何でしょう？地元のお店だからこそできることは？",
      suggestions: ["実際に手に取って見られる", "店員さんとの会話や相談", "地域のつながりや居場所になる"],
    },
    {
      keywords: ["交通", "インフラ", "バス", "移動"],
      content: "交通の問題は根深いですね。\n\n地方では公共交通の利用者が減る → 路線が廃止される → さらに不便に、という悪循環があります。\n\nこの課題について、誰が一番困っていて、どのくらいの人数が影響を受けているか想像してみましょう。",
      suggestions: ["免許を返納した高齢者が一番困っている", "通院が必要な人は命に関わる", "子育て世代も車がないと厳しい"],
    },
    {
      keywords: ["客", "増や", "仕組み", "魅力", "価値"],
      content: "素晴らしい思考の深まりですね！渋沢栄一も「現状に甘んじることなく、常に改善を求めよ」と言いました。\n\n今の分析を整理すると、課題の構造が見えてきましたね。次は、この課題をビジネスの力で解決する方法を考えてみませんか？",
      suggestions: ["解決策を考えたい", "もう少し調べたいことがある", "次のステップに進みたい"],
      autoAdvance: true,
    },
    {
      keywords: ["メニュー", "量", "残", "半分"],
      content: "具体的なデータが見えてきましたね。\n\nでは、なぜ食べ残しが発生するのでしょう？いくつかの観点で考えてみましょう：\n・量の問題？\n・好き嫌い？\n・時間の問題？\n\nあなたの学校ではどれが一番大きい原因だと思いますか？",
      suggestions: ["量が一律で調整できないのが原因", "苦手なものは最初から減らせない仕組み", "食べる時間が短すぎる"],
    },
  ],
  3: [
    {
      keywords: ["解決", "考え", "アイデア", "方法"],
      content: "いよいよ解決策を考えましょう！渋沢栄一の「道徳経済合一」を思い出してください。\n\n良い解決策の条件は3つ：\n① 困っている人が本当に助かる\n② 続けていける仕組みがある\n③ 関わる人みんなにメリットがある\n\nどんなアイデアが浮かびますか？自由に発想してみてください。",
      suggestions: ["高校生が買い物を届けるサービス", "空き店舗をコミュニティスペースに", "アプリで地域の助け合いをマッチング"],
    },
    {
      keywords: ["届ける", "配達", "デリバリー", "買い物代行"],
      content: "買い物お届けサービス、いいですね！\n\n渋沢栄一が第一国立銀行を作った時も「人々の生活を便利にする」ことを考えていました。\n\nこのサービスをもう少し具体的に考えてみましょう：\n・誰が届ける？\n・どうやって注文を受ける？\n・お金はどうする？",
      suggestions: ["高校生ボランティアが放課後に届ける", "LINEで注文を受け付ける", "少額の配達料で運営費を賄う"],
    },
    {
      keywords: ["空き店舗", "コミュニティ", "スペース", "カフェ"],
      content: "空き店舗の活用、素晴らしいアイデアです！\n\n例えば高校生が運営する「まちの相談カフェ」はどうでしょう？高齢者が気軽に来られて、買い物の相談や地域の情報交換ができる場所。\n\nこのアイデアのビジネスモデルを考えてみましょう。",
      suggestions: ["飲み物を提供して売上を立てる", "地元企業からスポンサーを募る", "行政の補助金を活用する"],
    },
    {
      keywords: ["アプリ", "マッチング", "LINE", "デジタル"],
      content: "テクノロジーの活用ですね！渋沢栄一も当時最先端の「株式会社」という仕組みを日本に持ち込んだイノベーターでした。\n\nただし、高齢者が使いやすいかという視点も大切です。どうすればデジタルが苦手な方にも使えるサービスにできますか？",
      suggestions: ["電話でも注文できるようにする", "家族が代わりに登録する仕組み", "地域の民生委員と連携する"],
    },
    {
      keywords: ["ボランティア", "放課後", "高校生", "自分たち"],
      content: "高校生が主体的に動く！まさにアントレプレナーシップですね。\n\n渋沢栄一は「夢なき者に成功なし」と言いました。あなたたちのやる気が一番の資源です。\n\nでは、持続可能にするために考えてみましょう。ボランティアだけだと続かないかもしれません。どう工夫しますか？",
      suggestions: ["地域通貨のポイントがもらえる仕組み", "学校の単位として認定してもらう", "地元企業と連携して報酬を得る"],
      autoAdvance: true,
    },
  ],
  4: [
    {
      keywords: ["お客さん", "ニーズ", "必要", "求め", "いる"],
      content: "大事な問いです！渋沢栄一は「お客様の立場に立って考えよ」と繰り返し述べました。\n\n実際にニーズがあるか確かめる方法を考えましょう：\n\n・近所の高齢者5人に直接聞いてみる\n・自治会の会合でアンケートを取る\n・民生委員の方に話を聞く\n\nどの方法から試してみたいですか？",
      suggestions: ["まず近所のおばあちゃんに聞いてみる", "先生に相談して自治会に紹介してもらう", "SNSでアンケートを取ってみる"],
    },
    {
      keywords: ["聞い", "インタビュー", "アンケート", "おばあちゃん"],
      content: "素晴らしい！実際に「現場」に聞きに行くのが一番です。\n\nインタビューのコツをお伝えしますね：\n① 「はい/いいえ」で答えられない質問をする\n② 「困っていること」だけでなく「今どうしているか」も聞く\n③ 相手の表情や反応もメモする\n\n例えば「日々のお買い物はどうされていますか？」から始めてみましょう。",
      suggestions: ["質問リストを作ってみたい", "何人くらいに聞けばいいの？", "インタビュー結果をどうまとめる？"],
    },
    {
      keywords: ["続け", "持続", "お金", "収益", "コスト"],
      content: "持続可能性は最も重要な視点の一つです。\n\n渋沢栄一は500以上の会社を設立しましたが、すべて「社会のためになり、かつ経済的にも成り立つ」ことを条件にしていました。\n\n簡単な収支計算をしてみましょう：\n・必要な費用は？（交通費、材料費など）\n・収入源は何がある？\n・最初は小さく始めるなら、いくらあれば十分？",
      suggestions: ["月5000円くらいから始められそう", "学校の部費として申請できるかも", "クラウドファンディングは使える？"],
    },
    {
      keywords: ["一歩", "最初", "始め", "小さく", "やってみ"],
      content: "「千里の道も一歩から」\u2014渋沢栄一も農家の息子から日本資本主義の父になりました。\n\n最初の一歩として、来週できることを1つ決めましょう：\n\n① 課題を感じている人3人にインタビューする\n② 仲間を2人見つけてチームを作る\n③ 先生や地域の大人に相談してアドバイスをもらう\n\nどれから始めますか？",
      suggestions: ["まず仲間を集めたい", "先生に相談してみる", "来週中にインタビューしてみる"],
    },
    {
      keywords: ["仲間", "チーム", "友達", "一緒"],
      content: "仲間づくり、いいですね！渋沢栄一は「一人でできることには限りがある。志を同じくする仲間と共に歩め」と語りました。\n\n良いチームの条件：\n・同じ課題に関心がある人\n・異なるスキルや視点を持つ人\n・行動力がある人\n\nあなたの探求プロジェクト、とても良いスタートが切れていますよ！",
      suggestions: ["もう一度最初から振り返りたい", "別の社会課題も探求してみたい", "発表資料にまとめたい"],
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
      content: "それは重要なポイントですね。もう一段深く考えてみましょう。\n\nその状況の「根本原因」は何だと思いますか？表面的な問題の奥にある本当の原因を探ってみましょう。",
      suggestions: ["社会の仕組みに問題がある？", "テクノロジーの変化が影響している？", "人々の意識や行動が変わった？"],
    },
    {
      content: "なるほど。では、その課題に今まで誰かが取り組んだことはありますか？うまくいった例、うまくいかなかった例を調べると、より深い理解が得られます。",
      suggestions: ["行政が何か対策をしているはず", "NPOが活動していると聞いた", "調べたことがないので調べてみたい"],
    },
    {
      content: "いい分析です！渋沢栄一は「事の成否は、志の有無にあり」と言いました。\n\nこの課題の全体像が見えてきましたか？整理してみましょう：\n・誰が困っている？\n・なぜ解決されていない？\n・どのくらい深刻？",
      suggestions: ["まだもう少し調べたい", "だいぶ理解が深まった", "解決策を考え始めたい"],
    },
  ],
  3: [
    {
      content: "面白いアイデアですね！もう少し具体的に考えてみましょう。\n\n渋沢栄一は「理想と現実の調和」を重視しました。そのアイデアを実現するために、まず何が必要ですか？",
      suggestions: ["まずは小さく試してみたい", "必要なリソースを考えたい", "似たサービスがあるか調べたい"],
    },
    {
      content: "そのアプローチ、良いですね！\n\n「道徳経済合一」の観点で確認しましょう：\n① 社会的な価値：誰がどう助かる？\n② 経済的な価値：お金の流れはどうなる？\n③ 持続性：長く続けられる仕組みは？",
      suggestions: ["社会的価値は明確にある", "お金の流れをもう少し考えたい", "持続性が課題かもしれない"],
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

    // Get contextual response based on step, keywords, and turn
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
    }, 800 + Math.random() * 1200); // Varied response time for realism
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
