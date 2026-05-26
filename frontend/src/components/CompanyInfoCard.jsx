import { useMemo, useState } from 'react';
import { TYPE_LABELS, findProfile, getInitials, inferIndustry } from '../lib/companyInfo';

export default function CompanyInfoCard({ formData, news = [] }) {
  const [logoFailed, setLogoFailed] = useState(false);

  const info = useMemo(() => {
    const company = formData?.company || '';
    const profile = findProfile(company);
    const fallbackScale = TYPE_LABELS[formData?.companyType] || '기업 유형 확인 필요';

    return {
      company,
      logoUrl:
        profile?.domain && !logoFailed
          ? `https://www.google.com/s2/favicons?domain=${profile.domain}&sz=128`
          : '',
      scale: profile?.scale || fallbackScale,
      industry: profile?.industry || inferIndustry(formData?.jobRole, news),
      location: profile?.location || '공식 채용공고에서 확인 필요',
      jobRole: formData?.jobRole || '지원 직무',
      known: Boolean(profile),
    };
  }, [formData, news, logoFailed]);

  if (!info.company) return null;

  return (
    <section className="p-4 rounded-xl bg-dark-700 border border-border-glass space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-dark-800 border border-border-glass flex items-center justify-center overflow-hidden shrink-0">
          {info.logoUrl ? (
            <img
              src={info.logoUrl}
              alt={`${info.company} logo`}
              className="w-9 h-9 object-contain"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="text-sm font-bold text-accent-blue">{getInitials(info.company)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-text-main truncate">{info.company}</h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
              {info.scale}
            </span>
          </div>
          <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
            {info.jobRole} 답변을 준비할 때 함께 볼 기업 맥락
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 text-xs">
        <div className="flex items-start gap-2 rounded-lg bg-dark-800 border border-border-glass px-3 py-2">
          <span className="text-text-muted shrink-0">분야</span>
          <span className="text-text-main leading-relaxed">{info.industry}</span>
        </div>
        <div className="flex items-start gap-2 rounded-lg bg-dark-800 border border-border-glass px-3 py-2">
          <span className="text-text-muted shrink-0">위치</span>
          <span className="text-text-main leading-relaxed">{info.location}</span>
        </div>
      </div>

      {!info.known && (
        <p className="text-[10px] text-text-muted leading-relaxed">
          정확한 로고, 본사 위치, 사업 분야는 기업명이 공식 DB와 연결되면 자동 보강할 수 있습니다.
        </p>
      )}
    </section>
  );
}
