import { useState, useEffect } from 'react';
import NewsViewer from './NewsViewer';

const THINKING_TIPS = [
  '답변의 첫 문장을 미리 정리해 보세요.',
  'STAR 기법으로 경험을 구조화해 보세요.',
  '구체적인 수치와 결과를 떠올려 보세요.',
  '회사 뉴스와 내 경험의 연결점을 찾아보세요.',
  '30초 안에 핵심이 드러나도록 연습해 보세요.',
];

export default function QuestionDisplay({ question, progress, news }) {
  const [tipIndex, setTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setShowTip(false);
      setTimeout(() => {
        setTipIndex((prev) => (prev + 1) % THINKING_TIPS.length);
        setShowTip(true);
      }, 400);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const renderProgress = Math.max(50, Math.min(progress || 50, 99));

  return (
    <div className="flex flex-col items-center gap-6 w-full py-4" style={{ animation: 'fade-in-up 0.6s ease-out' }}>
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-accent-violet/15 text-accent-violet border border-accent-violet/25">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        면접 예상 질문
      </div>

      <div className="relative w-full">
        <div
          className="absolute inset-0 rounded-2xl opacity-30 blur-2xl"
          style={{ background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.3), transparent 70%)' }}
        />
        <div className="relative glass-card rounded-2xl p-8 glow-violet">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl mt-0.5 text-accent-violet">Q</span>
            <p className="text-xl lg:text-2xl font-bold leading-relaxed text-text-main" style={{ wordBreak: 'keep-all', lineHeight: '1.6' }}>
              {question}
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-accent-violet/30 to-transparent my-5" />

          <div className="flex items-center gap-3 min-h-[28px]">
            <div className="w-5 h-5 rounded-full bg-accent-emerald/20 flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
            </div>
            <p className={`text-sm text-text-muted transition-all duration-400 ${showTip ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
              {THINKING_TIPS[tipIndex]}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full space-y-3 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-5">
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent"
                style={{ borderTopColor: '#6366f1', borderRightColor: '#8b5cf6', animation: 'spin-slow 1.2s linear infinite' }}
              />
            </div>
            <span className="text-sm font-medium text-text-muted">답변 전략 영상 제작 중...</span>
          </div>
          <span className="text-xs text-text-muted font-mono">{Math.round(renderProgress)}%</span>
        </div>

        <div className="h-1.5 rounded-full bg-dark-600 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${renderProgress}%`,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #22d3ee)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite',
            }}
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
          <span className="flex items-center gap-1.5 text-accent-emerald">뉴스 수집 완료</span>
          <span className="flex items-center gap-1.5 text-accent-emerald">스크립트 완료</span>
          <span className="flex items-center gap-1.5">음성 합성</span>
          <span className="flex items-center gap-1.5">영상 렌더링</span>
        </div>
      </div>

      <div className="text-center mt-2 space-y-1">
        <p className="text-xs text-text-muted">
          영상이 완성되는 동안 <span className="text-accent-violet font-semibold">나만의 답변</span>을 준비해 보세요.
        </p>
      </div>

      <NewsViewer news={news} />
    </div>
  );
}
