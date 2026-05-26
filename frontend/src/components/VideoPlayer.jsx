import CompanyInfoCard from './CompanyInfoCard';
import NewsViewer from './NewsViewer';
import useVideoControls from '../hooks/useVideoControls';

function PlayIcon() {
  return (
    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function MuteIcon({ muted }) {
  if (muted) {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.53.41-1.13.72-1.75.91v2.05c1.17-.24 2.25-.73 3.18-1.39l2.55 2.55L21 19.73 4.27 3z" />
      </svg>
    );
  }

  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  );
}

function VideoOverlayControls({ controls }) {
  const progressBackground =
    'linear-gradient(to right, #6366f1 ' +
    controls.progressPercent +
    '%, rgba(255,255,255,0.3) ' +
    controls.progressPercent +
    '%)';
  const volumeBackground =
    'linear-gradient(to right, #6366f1 ' +
    controls.volumePercent +
    '%, rgba(255,255,255,0.3) ' +
    controls.volumePercent +
    '%)';

  return (
    <div
      className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-3"
      onClick={controls.stopControlEvent}
      onPointerDown={controls.stopControlEvent}
    >
      <div className="flex items-center gap-2 text-[10px] text-white font-medium">
        <span>{controls.formatTime(controls.currentTime)}</span>
        <input
          type="range"
          min="0"
          max={controls.duration || 100}
          step="0.01"
          value={controls.currentTime}
          onChange={controls.handleSeek}
          className="flex-1 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
          style={{ background: progressBackground }}
          aria-label="재생 위치"
        />
        <span>{controls.formatTime(controls.duration)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button type="button" onClick={controls.toggleMute} className="text-white hover:text-accent-blue transition-colors" aria-label="음소거">
            <MuteIcon muted={controls.isMuted || controls.volume === 0} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={controls.isMuted ? 0 : controls.volume}
            onChange={controls.handleVolumeChange}
            className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
            style={{ background: volumeBackground }}
            aria-label="볼륨"
          />
        </div>

        <button type="button" onClick={controls.toggleFullscreen} className="text-white hover:text-accent-blue transition-colors cursor-pointer" title="전체 화면">
          <FullscreenIcon />
        </button>
      </div>
    </div>
  );
}

function VideoShell({ videoUrl, shellRef, videoRef, controls }) {
  return (
    <div
      ref={shellRef}
      data-video-shell
      className="relative mx-auto rounded-2xl overflow-hidden glass-card glow-violet group"
      style={{ maxWidth: '280px', aspectRatio: '9/16' }}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain bg-black cursor-pointer"
        onPlay={() => controls.setIsPlaying(true)}
        onPause={() => controls.setIsPlaying(false)}
        onEnded={() => controls.setIsPlaying(false)}
        onTimeUpdate={(event) => controls.setCurrentTime(event.currentTarget.currentTime || 0)}
        onLoadedMetadata={controls.handleLoadedMetadata}
        onClick={controls.togglePlay}
        preload="metadata"
        playsInline
      />

      {!controls.isPlaying && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            controls.togglePlay();
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/40 cursor-pointer"
          aria-label="재생"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <PlayIcon />
          </div>
        </button>
      )}

      <VideoOverlayControls controls={controls} />
    </div>
  );
}

function PlayerActions({ controls, videoUrl, onRegenerate }) {
  return (
    <>
      <div className="flex gap-2" onClick={controls.stopControlEvent} onPointerDown={controls.stopControlEvent}>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            controls.togglePlay();
          }}
          className="flex-[2] py-2.5 rounded-xl text-sm font-medium bg-dark-600 border border-border-glass text-text-muted hover:bg-dark-500 hover:text-text-main transition-all cursor-pointer"
        >
          {controls.isPlaying ? '일시정지' : '재생'}
        </button>

        <div className="relative flex-[1.5]">
          <select
            value={controls.playbackRate}
            onChange={controls.changePlaybackRate}
            onClick={controls.stopControlEvent}
            onPointerDown={controls.stopControlEvent}
            className="w-full h-full py-2.5 px-2 rounded-xl text-sm font-medium bg-dark-600 border border-border-glass text-text-muted hover:bg-dark-500 hover:text-text-main transition-all cursor-pointer appearance-none text-center"
            aria-label="재생 배속"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1.0x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2.0x</option>
          </select>
        </div>

        <button
          type="button"
          onClick={(event) => controls.handleDownload(event, videoUrl)}
          className="flex-[2] py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-accent-blue to-accent-violet text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all cursor-pointer"
        >
          다운로드
        </button>
      </div>

      {onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          className="w-full py-2.5 rounded-xl text-sm font-medium bg-accent-blue/10 border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/15 hover:text-text-main transition-all cursor-pointer"
        >
          같은 조건으로 다시 생성
        </button>
      )}
    </>
  );
}

function AnswerGuide({ chunks }) {
  if (chunks.length === 0) return null;

  return (
    <div className="p-4 rounded-xl bg-dark-700 border border-border-glass space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-text-main">답변 전략</h4>
        <span className="text-[10px] text-text-muted">면접관 관점</span>
      </div>
      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
        {chunks
          .filter((chunk) => chunk.section !== 'question')
          .slice(0, 5)
          .map((chunk, idx) => (
            <div key={chunk.section + '-' + idx} className="rounded-lg bg-dark-800 border border-border-glass p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-violet/15 text-accent-violet border border-accent-violet/20">
                  {chunk.visual_keyword}
                </span>
              </div>
              <p className="text-xs text-text-main leading-relaxed">{chunk.question_intent}</p>
              <p className="text-[11px] text-text-muted leading-relaxed mt-1">{chunk.answer_strategy}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

function ScriptPanel({ interviewQuestion, sentences, activeIndex }) {
  if (!interviewQuestion && sentences.length === 0) return null;

  return (
    <div
      className="p-4 rounded-xl bg-dark-700 border border-border-glass text-sm text-text-muted leading-relaxed max-h-[200px] overflow-y-auto"
      style={{ animation: 'fade-in-up 0.3s ease-out' }}
    >
      {interviewQuestion && (
        <div className="mb-3 rounded-lg bg-accent-blue/10 border border-accent-blue/25 p-3">
          <p className="text-[10px] font-semibold text-accent-blue mb-1">면접 질문</p>
          <p className="text-sm font-semibold text-text-main leading-relaxed">{interviewQuestion}</p>
        </div>
      )}
      <div className="space-y-2">
        {sentences.map((sentence, idx) => (
          <p
            key={idx}
            className={
              'transition-all duration-300 px-2 py-1 rounded-lg ' +
              (idx === activeIndex ? 'bg-accent-blue/20 text-text-main font-semibold ring-1 ring-accent-blue/30' : 'opacity-50')
            }
          >
            {sentence.text}
          </p>
        ))}
      </div>
    </div>
  );
}

function RenderInfo({ info }) {
  if (!info?.renderer) return null;

  const rendererLabels = {
    hyperframes: 'HyperFrames',
    remotion: 'Remotion',
    ffmpeg: 'FFmpeg',
  };
  const failures = Array.isArray(info.failures) ? info.failures : [];

  return (
    <section className="p-3 rounded-xl bg-dark-700 border border-border-glass space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-text-main">렌더러</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/20">
          {rendererLabels[info.renderer] || info.renderer}
        </span>
      </div>
      {info.renderDataPath && (
        <p className="text-[10px] text-text-muted break-all">render_data: {info.renderDataPath}</p>
      )}
      {failures.length > 0 && (
        <p className="text-[10px] text-amber-300 leading-relaxed">
          fallback {failures.length}회: {failures[0].renderer} → {failures[0].fallback_renderer}
        </p>
      )}
    </section>
  );
}

export default function VideoPlayer({ videoUrl, question, script, news, chunks = [], formData, renderInfo, onRegenerate }) {
  const { shellRef, videoRef, ...controls } = useVideoControls({ script });
  const interviewQuestion = question || chunks.find((chunk) => chunk.section === 'question')?.audio_text || '';

  return (
    <div className="space-y-4" style={{ animation: 'fade-in-up 0.6s ease-out' }}>
      <VideoShell videoUrl={videoUrl} shellRef={shellRef} videoRef={videoRef} controls={controls} />
      <PlayerActions controls={controls} videoUrl={videoUrl} onRegenerate={onRegenerate} />

      <button
        type="button"
        onClick={() => controls.setShowScript(!controls.showScript)}
        className="w-full py-2.5 rounded-xl text-sm font-medium bg-dark-700 border border-border-glass text-text-muted hover:text-text-main hover:bg-dark-600 transition-all cursor-pointer"
      >
        {controls.showScript ? '스크립트 숨기기' : '스크립트 보기'}
      </button>

      {controls.showScript && (
        <ScriptPanel
          interviewQuestion={interviewQuestion}
          sentences={controls.sentences}
          activeIndex={controls.activeIndex}
        />
      )}

      <NewsViewer news={news} />
      <RenderInfo info={renderInfo} />
      <AnswerGuide chunks={chunks} />
      <CompanyInfoCard formData={formData} news={news} />
    </div>
  );
}
