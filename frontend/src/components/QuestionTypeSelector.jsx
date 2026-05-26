const QUESTION_TYPES = [
  {
    key: 'personality',
    title: '인성, 가치관 질문',
    purpose: '조직 적합성 확인',
    points: ['태도', '책임감', '협업'],
    accent: 'emerald',
  },
  {
    key: 'competency',
    title: '직무역량 질문',
    purpose: '업무 수행 능력 확인',
    points: ['경험', '기술', '직무 이해'],
    accent: 'blue',
  },
  {
    key: 'industry',
    title: '회사, 산업 이해 질문',
    purpose: '지원 동기와 준비도 확인',
    points: ['회사 분석', '산업 관심', '기여 가능성'],
    accent: 'violet',
  },
];

const ACCENT_CLASS = {
  emerald: {
    text: 'text-accent-emerald',
    bg: 'bg-accent-emerald/10',
    border: 'border-accent-emerald/25',
    dot: 'bg-accent-emerald',
  },
  blue: {
    text: 'text-accent-blue',
    bg: 'bg-accent-blue/10',
    border: 'border-accent-blue/25',
    dot: 'bg-accent-blue',
  },
  violet: {
    text: 'text-accent-violet',
    bg: 'bg-accent-violet/10',
    border: 'border-accent-violet/25',
    dot: 'bg-accent-violet',
  },
};

export default function QuestionTypeSelector({ formData, onSelect, onBack }) {
  return (
    <div className="w-full space-y-5 py-2" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
          질문 유형 선택
        </div>
        <div>
          <h4 className="text-xl font-bold text-text-main leading-snug">어떤 관점의 질문으로 연습할까요?</h4>
          {formData?.company && (
            <p className="text-xs text-text-muted mt-1">
              {formData.company} · {formData.jobRole}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {QUESTION_TYPES.map((type) => {
          const accent = ACCENT_CLASS[type.accent];
          return (
            <button
              key={type.key}
              type="button"
              onClick={() => onSelect(type.key)}
              className={`w-full text-left p-4 rounded-xl bg-dark-700 border ${accent.border} hover:bg-dark-600 transition-all duration-200 cursor-pointer group`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 w-2.5 h-2.5 rounded-full ${accent.dot} group-hover:animate-pulse flex-shrink-0`} />
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <h5 className={`text-sm font-semibold ${accent.text}`}>{type.title}</h5>
                    <p className="text-xs text-text-muted mt-1">평가목적: {type.purpose}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {type.points.map((point) => (
                      <span key={point} className={`px-2 py-1 rounded-lg text-[10px] font-medium ${accent.bg} ${accent.text} border ${accent.border}`}>
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
                <svg className={`w-4 h-4 mt-1 ${accent.text} opacity-50 group-hover:opacity-100 transition-opacity`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="w-full py-2.5 rounded-xl text-sm font-medium bg-dark-600 border border-border-glass text-text-muted hover:bg-dark-500 hover:text-text-main transition-all cursor-pointer"
      >
        입력 수정
      </button>
    </div>
  );
}
