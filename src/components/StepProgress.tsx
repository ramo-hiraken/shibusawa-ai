"use client";

const steps = [
  { id: 1, label: "社会課題の発見", description: "身の回りの課題を見つけよう" },
  { id: 2, label: "課題の深掘り", description: "なぜその課題が存在するのか" },
  { id: 3, label: "解決策の構想", description: "ビジネスで解決する方法" },
  { id: 4, label: "実現可能性の検討", description: "本当に実現できるか考えよう" },
];

interface StepProgressProps {
  currentStep: number;
}

export default function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <div className="flex items-center gap-1 w-full max-w-2xl mx-auto">
      {steps.map((step, index) => {
        const isDone = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isPending = step.id > currentStep;

        return (
          <div key={step.id} className="flex-1 flex items-center">
            <div className="flex flex-col items-center flex-1">
              {/* Circle */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${isDone ? "bg-[var(--step-done)] text-white" : ""}
                  ${isActive ? "bg-[var(--step-active)] text-white ring-4 ring-[var(--step-active)]/20" : ""}
                  ${isPending ? "bg-[var(--step-pending)] text-white" : ""}
                `}
              >
                {isDone ? "✓" : step.id}
              </div>
              {/* Label */}
              <p
                className={`
                  text-[10px] mt-1 text-center leading-tight
                  ${isActive ? "font-bold text-[var(--step-active)]" : "text-[var(--muted)]"}
                `}
              >
                {step.label}
              </p>
            </div>
            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-full mx-1 mt-[-16px] ${
                  isDone ? "bg-[var(--step-done)]" : "bg-[var(--step-pending)]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
