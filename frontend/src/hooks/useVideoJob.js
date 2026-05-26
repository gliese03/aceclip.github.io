import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_QUESTION_TYPE, MAX_STATUS_FAILURES, POLL_INTERVAL } from '../constants';
import { fetchJobStatus, fetchSavedResult, requestVideoGeneration } from '../lib/api';

const initialStep = 'collecting';

function buildResult(jobId, data, question, news) {
  return {
    videoUrl: `/api/video/${jobId}`,
    script: data.script || '',
    question: data.question || question,
    news: data.news || news,
    chunks: data.chunks || [],
    renderInfo: {
      renderer: data.renderer,
      renderDataPath: data.renderDataPath || data.render_data_path,
      renderPlanPath: data.renderPlanPath || data.render_plan_path,
      timelinePath: data.timelinePath || data.timeline_path,
      failures: data.renderFailures || data.render_failures || [],
    },
    formData: {
      company: data.company,
      companyType: data.companyType,
      jobRole: data.jobRole,
      largeText: data.largeText,
      questionType: data.questionType,
    },
  };
}

function buildSavedResult(item) {
  const loadedFormData = {
    company: item.company,
    companyType: item.company_type,
    jobRole: item.job_role,
    largeText: item.large_text,
    questionType: item.question_type || DEFAULT_QUESTION_TYPE,
  };

  return {
    loadedFormData,
    result: {
      videoUrl: `/api/video/${item.job_id}`,
      script: item.script || '',
      question: item.question,
      news: item.news || [],
      chunks: item.chunks || [],
      renderInfo: {
        renderer: item.renderer,
        renderDataPath: item.render_data_path,
        renderPlanPath: item.render_plan_path,
        timelinePath: item.timeline_path,
        failures: item.render_failures || [],
      },
      formData: loadedFormData,
    },
  };
}

export default function useVideoJob({ refreshSavedResults } = {}) {
  const [state, setState] = useState('idle');
  const [jobId, setJobId] = useState(null);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [progress, setProgress] = useState(0);
  const [question, setQuestion] = useState(null);
  const [news, setNews] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [, setFailCount] = useState(0);
  const [lastFormData, setLastFormData] = useState(null);
  const [pendingFormData, setPendingFormData] = useState(null);

  const resetGenerationState = useCallback(() => {
    setProgress(0);
    setCurrentStep(initialStep);
    setError(null);
    setResult(null);
    setQuestion(null);
    setNews([]);
    setFailCount(0);
  }, []);

  const handleSubmit = useCallback((formData) => {
    setLastFormData(formData);
    setPendingFormData(formData);
    setState('question_type_select');
    resetGenerationState();
  }, [resetGenerationState]);

  const handleGenerateWithType = useCallback(async (questionType, formData = pendingFormData) => {
    if (!formData) return;

    const requestData = { ...formData, questionType };
    setLastFormData(requestData);
    setPendingFormData(null);
    setState('loading');
    resetGenerationState();

    try {
      const data = await requestVideoGeneration(requestData);
      setJobId(data.job_id);
    } catch (err) {
      setError(err.message || '서버 연결에 실패했습니다.');
      setState('error');
    }
  }, [pendingFormData, resetGenerationState]);

  const pollStatus = useCallback(async () => {
    if (!jobId) return;

    try {
      const data = await fetchJobStatus(jobId);
      setFailCount(0);
      setCurrentStep(data.step || initialStep);
      setProgress(data.progress || 0);
      if ('news' in data) setNews(data.news || []);

      if (data.status === 'question_ready' && state !== 'question') {
        setQuestion(data.question);
        setState('question');
      }

      if (data.status === 'done') {
        setResult(buildResult(jobId, data, question, news));
        setState('done');
        setJobId(null);
        refreshSavedResults?.();
      } else if (data.status === 'error') {
        setError(data.error || '영상 생성 중 오류가 발생했습니다.');
        setState('error');
        setJobId(null);
      }
    } catch {
      setFailCount((prev) => {
        const nextCount = prev + 1;
        if (nextCount >= MAX_STATUS_FAILURES) {
          setError('서버 연결에 문제가 발생했습니다. 다시 시도해 주세요.');
          setState('error');
          setJobId(null);
          return 0;
        }
        return nextCount;
      });
    }
  }, [jobId, news, question, refreshSavedResults, state]);

  useEffect(() => {
    if (!jobId) return undefined;
    const initialTimer = setTimeout(pollStatus, 0);
    const intervalTimer = setInterval(pollStatus, POLL_INTERVAL);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [jobId, pollStatus]);

  const handleReset = useCallback(() => {
    setState('idle');
    setJobId(null);
    setPendingFormData(null);
    resetGenerationState();
  }, [resetGenerationState]);

  const handleBackToIdle = useCallback(() => {
    setState('idle');
    setError(null);
  }, []);

  const handleRegenerate = useCallback(() => {
    const formData = result?.formData?.company ? result.formData : lastFormData;
    if (formData) handleGenerateWithType(formData.questionType || DEFAULT_QUESTION_TYPE, formData);
  }, [handleGenerateWithType, lastFormData, result]);

  const handleLoadSavedResult = useCallback(async (jobIdToLoad) => {
    try {
      const item = await fetchSavedResult(jobIdToLoad);
      const { loadedFormData, result: loadedResult } = buildSavedResult(item);
      setLastFormData(loadedFormData);
      setQuestion(item.question);
      setNews(item.news || []);
      setResult(loadedResult);
      setError(null);
      setState('done');
    } catch (err) {
      setError(err.message || '저장된 결과를 불러오지 못했습니다.');
      setState('error');
    }
  }, []);

  return {
    state,
    currentStep,
    progress,
    question,
    news,
    result,
    error,
    pendingFormData,
    handleSubmit,
    handleGenerateWithType,
    handleReset,
    handleBackToIdle,
    handleRegenerate,
    handleLoadSavedResult,
  };
}
