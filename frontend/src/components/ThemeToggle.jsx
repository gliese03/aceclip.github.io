import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('aceclip-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aceclip-theme', theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      className="relative p-2 rounded-xl bg-dark-700 border border-border-glass hover:bg-dark-600 transition-all duration-300 cursor-pointer overflow-hidden group"
      aria-label="테마 변경"
    >
      <div className="flex items-center gap-2">
        <div className="relative w-5 h-5">
          <svg
            className={`absolute inset-0 w-5 h-5 text-accent-blue transition-all duration-500 transform ${
              theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg
            className={`absolute inset-0 w-5 h-5 text-yellow-400 transition-all duration-500 transform ${
              theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-text-muted group-hover:text-text-main transition-colors">
          {theme === 'dark' ? '다크 모드' : '라이트 모드'}
        </span>
      </div>
    </button>
  );
}
