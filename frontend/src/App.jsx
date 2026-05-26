import InputForm from './components/InputForm';
import LoadingSpinner from './components/LoadingSpinner';
import QuestionDisplay from './components/QuestionDisplay';
import QuestionTypeSelector from './components/QuestionTypeSelector';
import VideoPlayer from './components/VideoPlayer';
import ThemeToggle from './components/ThemeToggle';
import Logo from './components/Logo';
import { DEFAULT_QUESTION_TYPE, PANEL_TITLES, QUESTION_TYPE_LABELS } from './constants';
import useSavedResults from './hooks/useSavedResults';
import useVideoJob from './hooks/useVideoJob';

const FEATURES = [
  { icon: 'N', label: '실시간 뉴스', desc: '최신 경제 흐름' },
  { icon: 'AI', label: 'AI 스크립트', desc: '맞춤형 Q&A' },
  { icon: '30s', label: '빠른 완성', desc: '숏폼 영상 제작' },
];

function PreviewPlaceholder() {
  return (
    <div className="text-center space-y-4">
      <div className="mx-auto w-32 h-56 rounded-2xl bg-dark-600 border-2 border-dashed border-border-glass flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="text-2xl opacity-40">9:16</div>
          <p className="text-[10px] text-text-muted">Shorts Preview</p>
        </div>
      </div>
      <p className="text-xs text-text-muted">
        왼쪽에서 기업과 직무를 입력하고
        <br />
        영상 생성을 시작해 보세요.
      </p>
    </div>
  );
}

function ErrorPanel({ error, onReset }) {
  return (
    <div className="text-center space-y-4" style={{ animation: 'fade-in-up 0.4s ease-out' }}>
      <div className="text-5xl">!</div>
      <div>
        <p className="text-sm text-red-400 font-medium">영상 생성에 실패했습니다.</p>
        <p className="text-xs text-text-muted mt-1">{error}</p>
      </div>
      <button
        onClick={onReset}
        className="px-6 py-2 rounded-xl text-sm bg-dark-600 border border-border-glass text-text-main hover:bg-dark-500 transition-all cursor-pointer"
      >
        다시 시도
      </button>
    </div>
  );
}

function SavedResults({ results, onRefresh, onLoad }) {
  if (results.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-main">최근 생성 결과</h3>
        <button
          onClick={onRefresh}
          className="text-xs text-text-muted hover:text-text-main transition-colors cursor-pointer"
        >
          새로고침
        </button>
      </div>
      <div className="space-y-2">
        {results.slice(0, 3).map((item) => (
          <div key={item.job_id} className="rounded-xl bg-dark-800 border border-border-glass p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-main truncate">
                  {item.company} · {item.job_role}
                </p>
                <p className="text-[10px] text-accent-violet truncate">
                  {QUESTION_TYPE_LABELS[item.question_type || DEFAULT_QUESTION_TYPE]}
                </p>
                <p className="text-[10px] text-text-muted truncate">{item.question}</p>
              </div>
              <button
                type="button"
                onClick={() => onLoad(item.job_id)}
                className="text-[10px] text-accent-blue hover:text-text-main transition-colors"
              >
                불러오기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const { savedResults, refreshSavedResults } = useSavedResults();
  const videoJob = useVideoJob({ refreshSavedResults });
  const panelTitle = PANEL_TITLES[videoJob.state];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <header className="border-b border-border-glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
              <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
              <span>서비스 운영 중</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
                AI 기반 면접 대비 숏폼
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-text-main">
                경제 뉴스로 만드는
                <br />
                <span className="gradient-text">면접 대비 영상</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed max-w-md">
                기업과 직무를 입력하면 최신 경제 뉴스를 바탕으로 면접 질문과 답변 전략을
                짧은 영상으로 만들어 줍니다.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 glow-blue">
              <InputForm
                onSubmit={videoJob.handleSubmit}
                isLoading={videoJob.state === 'loading' || videoJob.state === 'question'}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {FEATURES.map((feature) => (
                <div key={feature.label} className="text-center p-3 rounded-xl bg-dark-800 border border-border-glass">
                  <div className="text-sm font-bold mb-1 text-accent-blue">{feature.icon}</div>
                  <div className="text-xs font-semibold text-text-main">{feature.label}</div>
                  <div className="text-[10px] text-text-muted">{feature.desc}</div>
                </div>
              ))}
            </div>

            <SavedResults
              results={savedResults}
              onRefresh={refreshSavedResults}
              onLoad={videoJob.handleLoadSavedResult}
            />
          </div>

          <div className="lg:sticky lg:top-10">
            <div className="glass-card rounded-2xl p-6 min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text-main">{panelTitle}</h3>
                {(videoJob.state === 'done' || videoJob.state === 'error') && (
                  <button
                    onClick={videoJob.handleReset}
                    className="text-xs text-text-muted hover:text-text-main transition-colors cursor-pointer"
                  >
                    다시 만들기
                  </button>
                )}
              </div>

              <div className="flex-1 flex items-center justify-center">
                {videoJob.state === 'idle' && <PreviewPlaceholder />}

                {videoJob.state === 'question_type_select' && (
                  <QuestionTypeSelector
                    formData={videoJob.pendingFormData}
                    onSelect={videoJob.handleGenerateWithType}
                    onBack={videoJob.handleBackToIdle}
                  />
                )}

                {videoJob.state === 'loading' && (
                  <LoadingSpinner currentStep={videoJob.currentStep} progress={videoJob.progress} />
                )}

                {videoJob.state === 'question' && videoJob.question && (
                  <QuestionDisplay question={videoJob.question} progress={videoJob.progress} news={videoJob.news} />
                )}

                {videoJob.state === 'done' && videoJob.result && (
                  <VideoPlayer
                    videoUrl={videoJob.result.videoUrl}
                    question={videoJob.result.question}
                    script={videoJob.result.script}
                    news={videoJob.result.news}
                    chunks={videoJob.result.chunks}
                    formData={videoJob.result.formData}
                    renderInfo={videoJob.result.renderInfo}
                    onRegenerate={videoJob.handleRegenerate}
                  />
                )}

                {videoJob.state === 'error' && (
                  <ErrorPanel error={videoJob.error} onReset={videoJob.handleReset} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border-glass mt-20">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-text-muted">
          <span>© 2026 AceClip. All rights reserved.</span>
          <span>Powered by AI · News API · FFmpeg</span>
        </div>
      </footer>
    </div>
  );
}
