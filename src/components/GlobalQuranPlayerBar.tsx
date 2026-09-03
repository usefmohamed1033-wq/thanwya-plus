import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  FastForward,
  Rewind,
  BookOpen,
  Headphones,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useQuranAudio } from '../context/QuranAudioContext';

interface GlobalQuranPlayerBarProps {
  onOpenQuran?: () => void;
  onNavigateToQuran?: () => void;
  isQuranTabActive?: boolean;
}

export const GlobalQuranPlayerBar: React.FC<GlobalQuranPlayerBarProps> = ({
  onOpenQuran,
  onNavigateToQuran,
  isQuranTabActive = false,
}) => {
  const navigateFn = onNavigateToQuran || onOpenQuran || (() => {});
  const {
    currentPlayingItem,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    playbackSpeed,
    isLooping,
    audioError,
    sleepTimerSecondsLeft,
    togglePlayAudio,
    handleSeek,
    handlePlayNextSurah,
    handlePlayPrevSurah,
    handleSwitchMirror,
    setPlaybackSpeed,
    setIsLooping,
    stopAudio,
  } = useQuranAudio();

  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  if (!currentPlayingItem) return null;

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Minimized pill state
  if (isMinimized) {
    return (
      <div className="fixed bottom-16 lg:bottom-4 left-3 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-teal-800 text-white px-3.5 py-2 rounded-full shadow-2xl border-2 border-emerald-400/60 hover:scale-105 transition-all text-xs font-bold cursor-pointer"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <Headphones className="w-4 h-4 text-amber-300" />
          <span className="max-w-[100px] truncate">{currentPlayingItem.title}</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      id="global-quran-player-bar"
      className={`fixed bottom-16 lg:bottom-4 left-2 right-2 sm:left-6 sm:right-6 lg:left-8 lg:right-8 z-50 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl text-white p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border-2 ${
        isPlaying ? 'border-emerald-500/80 ring-2 ring-emerald-500/30' : 'border-slate-700'
      } transition-all animate-fadeIn`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title, Reciter Name & Animated Soundwave */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Play/Pause Main Button */}
            <button
              id="btn-global-play-pause-toggle"
              onClick={togglePlayAudio}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-lg transition-transform shrink-0 cursor-pointer"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل التلاوة'}
            >
              {isBuffering ? (
                <RefreshCw className="w-5 h-5 animate-spin text-amber-300" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-0.5" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[200px] sm:max-w-xs">
                  {currentPlayingItem.title}
                </span>
                {isPlaying && (
                  <div className="flex items-center gap-0.5 h-3.5 shrink-0">
                    <span className="w-0.5 sm:w-1 bg-emerald-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2.5 sm:h-3" />
                    <span className="w-0.5 sm:w-1 bg-teal-400 rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-3.5 sm:h-4" />
                    <span className="w-0.5 sm:w-1 bg-amber-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-2 sm:h-2.5" />
                    <span className="w-0.5 sm:w-1 bg-emerald-400 rounded-full animate-[pulse_1.1s_ease-in-out_infinite] h-3 sm:h-3.5" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-emerald-300 truncate">
                <span>{currentPlayingItem.subTitle}</span>
                {currentPlayingItem.audioUrls.length > 1 && (
                  <button
                    onClick={handleSwitchMirror}
                    className="text-[9px] bg-slate-800 hover:bg-slate-700 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40 cursor-pointer shrink-0"
                    title="تبديل خادم الصوت"
                  >
                    خادم {currentPlayingItem.currentUrlIndex + 1}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick jump to Quran Tab on Mobile */}
          {!isQuranTabActive && (
            <button
              onClick={onNavigateToQuran}
              className="md:hidden flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shrink-0 cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3 h-3" />
              <span>المصحف</span>
            </button>
          )}
        </div>

        {/* Scrubber & Time */}
        <div className="w-full md:max-w-xs lg:max-w-md flex items-center gap-2.5 text-[11px] sm:text-xs font-mono text-slate-300">
          <span className="shrink-0">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="shrink-0">{formatTime(duration)}</span>
        </div>

        {/* Controls: Prev/Next, Speed, Loop, Sleep Timer, Jump to sanctuary, Minimize/Close */}
        <div className="flex items-center justify-end w-full md:w-auto gap-2 shrink-0">
          {/* Prev/Next Surah for full surahs */}
          {currentPlayingItem.type.startsWith('full_surah') && (
            <div className="flex items-center gap-1">
              <button
                onClick={handlePlayPrevSurah}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="السورة السابقة"
              >
                <Rewind className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handlePlayNextSurah}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="السورة التالية"
              >
                <FastForward className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Loop toggle */}
          <button
            onClick={() => setIsLooping((prev) => !prev)}
            className={`p-1.5 sm:p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              isLooping ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isLooping ? 'تكرار التلاوة مفعل' : 'تكرار التلاوة'}
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Playback speed multiplier */}
          <button
            onClick={() => {
              const speeds = [0.8, 1.0, 1.25, 1.5];
              const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
              setPlaybackSpeed(speeds[nextIdx]);
            }}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] sm:text-xs font-mono font-bold text-slate-200 cursor-pointer"
            title="سرعة التلاوة"
          >
            {playbackSpeed}x
          </button>

          {/* Sleep timer indicator */}
          {sleepTimerSecondsLeft !== null && (
            <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700/80 px-2 py-1 rounded-lg">
              ⏱️ {formatTime(sleepTimerSecondsLeft)}
            </span>
          )}

          {/* Go to Quran sanctuary tab (if not already there) */}
          {!isQuranTabActive && (
            <button
              onClick={onNavigateToQuran}
              className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-105"
              title="فتح واحة تلاوات المنشاوي والمصحف"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>محراب التلاوة</span>
            </button>
          )}

          {/* Minimize */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="تصغير الشريط"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Stop and Close */}
          <button
            onClick={stopAudio}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
            title="إيقاف وإغلاق المشغل"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {audioError && (
        <div className="mt-2 text-xs text-amber-400 text-center font-medium bg-amber-950/60 p-1.5 rounded-lg border border-amber-800">
          {audioError}
        </div>
      )}
    </div>
  );
};
