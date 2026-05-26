export const COMPANY_PROFILES = [
  {
    aliases: ['posco', '포스코'],
    domain: 'posco.co.kr',
    scale: '대기업',
    industry: '철강, 소재, 친환경 인프라',
    location: '경북 포항, 서울 등',
  },
  {
    aliases: ['samsung', '삼성전자'],
    domain: 'samsung.com',
    scale: '대기업',
    industry: '반도체, 모바일, 가전, 디스플레이',
    location: '경기 수원, 화성, 평택 등',
  },
  {
    aliases: ['hyundai', '현대자동차', '현대차'],
    domain: 'hyundai.com',
    scale: '대기업',
    industry: '자동차, 모빌리티, 수소 에너지',
    location: '서울, 울산, 경기 화성 등',
  },
  {
    aliases: ['lg', 'lg전자'],
    domain: 'lg.com',
    scale: '대기업',
    industry: '가전, 전장, IT 솔루션',
    location: '서울, 경남 창원, 경기 평택 등',
  },
  {
    aliases: ['sk', 'sk하이닉스'],
    domain: 'skhynix.com',
    scale: '대기업',
    industry: '반도체, 메모리, AI 인프라',
    location: '경기 이천, 충북 청주 등',
  },
  {
    aliases: ['naver', '네이버'],
    domain: 'navercorp.com',
    scale: '대기업',
    industry: '검색, 플랫폼, 커머스, AI',
    location: '경기 성남',
  },
  {
    aliases: ['kakao', '카카오'],
    domain: 'kakaocorp.com',
    scale: '대기업',
    industry: '플랫폼, 콘텐츠, 핀테크, AI',
    location: '경기 성남, 제주 등',
  },
  {
    aliases: ['한국전력', '한전', 'kepco'],
    domain: 'kepco.co.kr',
    scale: '공기업',
    industry: '전력 공급, 에너지 인프라',
    location: '전남 나주',
  },
  {
    aliases: ['한국수자원공사', '수자원공사', 'kwater', 'k-water'],
    domain: 'kwater.or.kr',
    scale: '공기업',
    industry: '수자원, 수도, 물 인프라',
    location: '대전',
  },
  {
    aliases: ['국민연금공단', '국민연금', 'nps'],
    domain: 'nps.or.kr',
    scale: '준정부기관',
    industry: '연금, 복지 행정, 기금 운용',
    location: '전북 전주',
  },
];

export const TYPE_LABELS = {
  private: '민간기업',
  public: '공공기관/준정부기관',
};

function normalize(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, '');
}

export function findProfile(company) {
  const normalizedCompany = normalize(company);
  if (!normalizedCompany) return null;

  return (
    COMPANY_PROFILES.find((profile) =>
      profile.aliases.some((alias) => normalizedCompany.includes(normalize(alias)))
    ) || null
  );
}

export function inferIndustry(jobRole, news) {
  const text = `${jobRole || ''} ${(news || [])
    .slice(0, 2)
    .map((item) => `${item.title || ''} ${item.description || ''}`)
    .join(' ')}`;

  if (/AI|IT|개발|전산|소프트웨어|플랫폼/i.test(text)) return 'IT, 디지털, AI 관련 분야';
  if (/연구|R&D|소재|화학|기술/i.test(text)) return '연구개발, 기술/소재 분야';
  if (/전력|전기|에너지|환경|수자원/i.test(text)) return '에너지, 인프라, 공공 서비스';
  if (/금융|회계|재무|연금|기금/i.test(text)) return '금융, 재무, 공공 기금';
  if (/영업|마케팅|고객|브랜드/i.test(text)) return '영업, 마케팅, 고객 접점';
  return '입력 직무와 최신 뉴스 기반 확인 필요';
}

export function getInitials(company) {
  const compact = String(company || 'C').replace(/\s+/g, '');
  return compact.slice(0, 2).toUpperCase();
}
