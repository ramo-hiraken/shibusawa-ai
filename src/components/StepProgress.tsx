"use client";

import { Fragment } from "react";

const steps = [
  { id: 1, label: "課題の特定", description: "気になることを見つけよう" },
  { id: 2, label: "アイデアの発散", description: "自由に解決策を発想する" },
  { id: 3, label: "課題の深掘り", description: "本質を問い直す" },
  { id: 4, label: "解決策の具体化", description: "誰のために何を提供するか" },
  { id: 5, label: "統合・まとめ", description: "言語化して次の一歩へ" },
];

interface StepProgressProps {
  currentStep: number;
}

export default function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <div className="flex items-start w-full max-w-2xl mx-auto">
      {steps.map((step, index) => {
        const isDone = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isPending = step.id > currentStep;
        const connectorDone = step.id < currentStep;

        return (
          <Fragment key={step.id}>
            {/* Step (circle + label) */}
            <div className="flex flex-col items-center w-14 shrink-0">
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
              <p
                className={`
                  text-[9px] mt-2 text-center leading-tight
                  ${isActive ? "font-bold text-[var(--step-active)]" : "text-[var(--muted)]"}
                `}
              >
                {step.label}
              </p>
            </div>
            {/* Connector between circles */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mt-4 ${
                  connectorDone ? "bg-[var(--step-done)]" : "bg-[var(--step-pending)]"
                }`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
