import { useState, useEffect } from 'react';

const PIPELINE_STEPS = [
  { key: 'collecting', label: '뉴스 데이터 수집 중...', duration: 5 },
  { key: 'scripting', label: '면접 질문 생성 중...', duration: 8 },
];

const TOTAL_ESTIMATED = PIPELINE_STEPS.reduce((sum, step) => sum + step.duration, 0);

export default function LoadingSpinner({ currentStep, progress }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeIndex = PIPELINE_STEPS.findIndex((step) => step.key === currentStep);
  const remaining = Math.max(0, TOTAL_ESTIMATED - elapsed);

  return (
    <div className="flex flex-col items-center gap-6 py-8" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      <div className="relative w-28 h-28">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#6366f1', borderRightColor: '#8b5cf6', animation: 'spin-slow 1.5s linear infinite' }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent"
          style={{ borderBottomColor: '#22d3ee', borderLeftColor: '#34d399', animation: 'spin-slow 2s linear infinite reverse' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-accent-blue">AI</span>
        </div>
      </div>

      <div className="w-full max-w-xs">
        <div className="h-1.5 rounded-full bg-dark-600 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-blue via-accent-violet to-accent-cyan transition-all duration-500"
            style={{ width: `${Math.min(progress || 0, 50)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-text-muted">
          <span>{Math.round(Math.min(progress || 0, 50))}%</span>
          <span>약 {remaining}초 남음</span>
        </div>
      </div>

      <div className="w-full space-y-2">
        {PIPELINE_STEPS.map((step, index) => {
          const isActive = index === activeIndex;
          const isDone = index < activeIndex;
          return (
            <div
              key={step.key}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                isActive ? 'bg-accent-blue/10 text-text-main' : isDone ? 'text-text-muted opacity-60' : 'text-text-muted opacity-30'
              }`}
            >
              <span className="w-5 text-center">
                {isDone ? (
                  <svg className="w-4 h-4 text-accent-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : isActive ? (
                  <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse mx-auto" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-accent-blue mx-auto opacity-30" />
                )}
              </span>
              <span className={isDone ? 'line-through' : ''}>{step.label}</span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-text-muted text-center opacity-60">질문이 준비되면 바로 화면에 표시됩니다.</p>
    </div>
  );
}
