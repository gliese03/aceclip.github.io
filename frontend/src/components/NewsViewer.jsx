import { useState } from 'react';

export default function NewsViewer({ news }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!news || news.length === 0) return null;

  return (
    <div className="w-full mt-4 border border-border-glass rounded-xl overflow-hidden glass-card glow-blue" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-dark-700/50 hover:bg-dark-600/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-accent-blue">NEWS</span>
          <span className="text-sm font-medium text-text-main">AI가 참고한 주요 뉴스</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-accent-blue/20 text-accent-blue px-2 py-0.5 rounded-full border border-accent-blue/30 font-semibold">
            {news.length}건
          </span>
          <svg
            className={`w-5 h-5 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="p-3 bg-dark-800/80 border-t border-border-glass space-y-3 max-h-[250px] overflow-y-auto">
          {news.map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-dark-700/50 border border-border-glass hover:border-accent-blue/30 transition-colors">
              <h4 className="text-sm font-semibold text-text-main leading-snug mb-1.5">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue hover:underline">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </h4>
              <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
