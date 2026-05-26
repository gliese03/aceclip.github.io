import { useState } from 'react';

const JOB_OPTIONS = {
  private: [
    { value: '경영지원', label: '경영지원' },
    { value: '재무/회계', label: '재무/회계' },
    { value: '영업', label: '영업' },
    { value: '마케팅', label: '마케팅' },
    { value: 'IT/개발', label: 'IT/개발' },
    { value: '연구개발(R&D)', label: '연구개발(R&D)' },
    { value: '생산/품질', label: '생산/품질' },
    { value: '기타', label: '기타' },
  ],
  public: [
    { value: '일반행정', label: '일반행정' },
    { value: '금융', label: '금융' },
    { value: '전기/전자', label: '전기/전자' },
    { value: '기계', label: '기계' },
    { value: '전산(IT)', label: '전산(IT)' },
    { value: '토목/건축', label: '토목/건축' },
    { value: '환경/화공', label: '환경/화공' },
    { value: '기타', label: '기타' },
  ],
};

export default function InputForm({ onSubmit, isLoading }) {
  const [company, setCompany] = useState('');
  const [companyType, setCompanyType] = useState('private');
  const [jobRole, setJobRole] = useState('');
  const [largeText, setLargeText] = useState(true);

  const currentJobs = JOB_OPTIONS[companyType];

  const handleTypeChange = (type) => {
    setCompanyType(type);
    setJobRole('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim() || !jobRole) return;
    onSubmit({ company: company.trim(), companyType, jobRole, largeText });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="company-name" className="block text-sm font-medium text-text-main">
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            지원 기업명
          </span>
        </label>
        <input
          id="company-name"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="예: 삼성전자, 한국전력공사"
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-border-glass text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-main">기업 형태</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'private', label: '사기업', desc: 'Private' },
            { key: 'public', label: '공기업', desc: 'Public' },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleTypeChange(opt.key)}
              disabled={isLoading}
              className={`relative flex flex-col items-center gap-1 p-4 rounded-xl border transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                companyType === opt.key
                  ? 'bg-accent-blue/10 border-accent-blue/40 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                  : 'bg-dark-700 border-border-glass hover:border-slate-600 hover:bg-dark-600'
              }`}
            >
              <span className={`text-sm font-semibold ${companyType === opt.key ? 'text-accent-blue' : 'text-text-main'}`}>
                {opt.label}
              </span>
              <span className="text-xs text-text-muted">{opt.desc}</span>
              {companyType === opt.key && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-blue animate-pulse-slow" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="job-role" className="block text-sm font-medium text-text-main">
          {companyType === 'private' ? '직무 선택' : '직렬 선택'}
        </label>
        <div className="relative">
          <select
            id="job-role"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-border-glass text-text-main appearance-none focus:outline-none focus:ring-2 focus:ring-accent-emerald/50 focus:border-accent-emerald/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <option value="" disabled>
              {companyType === 'private' ? '직무를 선택하세요' : '직렬을 선택하세요'}
            </option>
            {currentJobs.map((job) => (
              <option key={job.value} value={job.value}>
                {job.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {jobRole && (
          <div className="flex items-center gap-2 mt-2" style={{ animation: 'fade-in-up 0.3s ease-out' }}>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20">
              {jobRole}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-dark-700 border border-border-glass">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${largeText ? 'bg-accent-violet/20 text-accent-violet' : 'bg-dark-600 text-text-muted'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-text-main">큰 글자 모드</h4>
            <p className="text-xs text-text-muted">영상 자막 크기를 키워 가독성을 높입니다.</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={largeText}
            onChange={(e) => setLargeText(e.target.checked)}
            disabled={isLoading}
          />
          <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-violet" />
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading || !company.trim() || !jobRole}
        className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer bg-gradient-to-r from-accent-blue to-accent-violet hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100"
      >
        {isLoading ? '영상 생성 중...' : '질문 유형 선택하기'}
      </button>
    </form>
  );
}
