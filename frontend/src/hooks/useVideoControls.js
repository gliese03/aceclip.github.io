import { useEffect, useMemo, useRef, useState } from 'react';
import { DOWNLOAD_FILENAME } from '../constants';

export default function useVideoControls({ script }) {
  const shellRef = useRef(null);
  const videoRef = useRef(null);
  const [showScript, setShowScript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted || volume === 0;
    }
  }, [volume, isMuted]);

  const sentences = useMemo(() => {
    if (!script || !duration) return [];

    const lines = script.split('\n').filter((line) => line.trim() !== '');
    const totalChars = lines.reduce((acc, line) => acc + line.length, 0);
    if (!totalChars) return [];

    const timePerChar = duration / totalChars;
    let startTime = 0;
    return lines.map((text) => {
      const segmentDuration = text.length * timePerChar;
      const endTime = startTime + segmentDuration;
      const segment = { text, startTime, endTime };
      startTime = endTime;
      return segment;
    });
  }, [script, duration]);

  const activeIndex = sentences.findIndex((sentence) => currentTime >= sentence.startTime && currentTime < sentence.endTime);

  const stopControlEvent = (event) => {
    event.stopPropagation();
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.playbackRate = playbackRate;
      video.play().catch((err) => console.error(err));
    } else {
      video.pause();
    }
  };

  const handleSeek = (event) => {
    event.stopPropagation();
    const newTime = Number(event.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const changePlaybackRate = (event) => {
    event.stopPropagation();
    const rate = Number(event.target.value);
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleVolumeChange = (event) => {
    event.stopPropagation();
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = (event) => {
    event.stopPropagation();
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (!nextMuted && volume === 0) setVolume(0.5);
      return nextMuted;
    });
  };

  const handleDownload = (event, videoUrl) => {
    event.stopPropagation();
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = DOWNLOAD_FILENAME;
    link.click();
  };

  const toggleFullscreen = (event) => {
    event.stopPropagation();
    const fullscreenTarget = shellRef.current || videoRef.current;
    if (!fullscreenTarget) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.error(err));
    } else {
      fullscreenTarget.requestFullscreen().catch((err) => console.error(err));
    }
  };

  const formatTime = (time) => {
    if (Number.isNaN(time)) return '0:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return min + ':' + (sec < 10 ? '0' : '') + sec;
  };

  const handleLoadedMetadata = (event) => {
    const video = event.currentTarget;
    setDuration(video.duration || 0);
    video.playbackRate = playbackRate;
    video.volume = volume;
    video.muted = isMuted || volume === 0;
  };

  return {
    shellRef,
    videoRef,
    showScript,
    setShowScript,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    sentences,
    activeIndex,
    progressPercent: (currentTime / (duration || 1)) * 100,
    volumePercent: (isMuted ? 0 : volume) * 100,
    stopControlEvent,
    togglePlay,
    handleSeek,
    changePlaybackRate,
    handleVolumeChange,
    toggleMute,
    handleDownload,
    toggleFullscreen,
    formatTime,
    handleLoadedMetadata,
  };
}
