async function parseJson(response) {
  return response.json().catch(() => ({}));
}

async function ensureOk(response, fallbackMessage) {
  if (response.ok) return parseJson(response);
  const data = await parseJson(response);
  throw new Error(data.detail || fallbackMessage);
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

function apiUrl(path) {
  return `${apiBaseUrl}${path}`;
}

export async function requestVideoGeneration(formData) {
  const response = await fetch(apiUrl('/api/generate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return ensureOk(response, '요청에 실패했습니다.');
}

export async function fetchJobStatus(jobId) {
  const response = await fetch(apiUrl(`/api/status/${jobId}`));
  return ensureOk(response, '상태 확인에 실패했습니다.');
}

export async function fetchSavedResults() {
  const response = await fetch(apiUrl('/api/results'));
  if (!response.ok) return { results: [] };
  return parseJson(response);
}

export async function fetchSavedResult(jobId) {
  const response = await fetch(apiUrl(`/api/results/${jobId}`));
  return ensureOk(response, '저장된 결과를 불러오지 못했습니다.');
}
