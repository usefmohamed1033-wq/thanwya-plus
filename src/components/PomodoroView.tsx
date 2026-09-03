import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  CheckCircle2,
  Music,
  Wind,
  Headphones,
  Sliders,
  Radio,
  CloudRain,
  Waves,
  Zap
} from 'lucide-react';
import {
  focusAudioEngine,
  FocusSoundType,
  FOCUS_SOUND_PRESETS,
  SoundPreset
} from '../utils/focusSoundEngine';

interface PomodoroViewProps {
  completedSessions: number;
  onIncrementSession: () => void;
  soundEnabled: boolean;
}

type PomoMode = 'work' | 'short_break' | 'long_break';

export const PomodoroView: React.FC<PomodoroViewProps> = ({
  completedSessions,
  onIncrementSession,
  soundEnabled,
}) => {
  const [mode, setMode] = useState<PomoMode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSound, setSelectedSound] = useState<FocusSoundType>('rain');
  const [isSoundPlaying, setIsSoundPlaying] = useState<boolean>(false);
  const [soundVolume, setSoundVolume] = useState<number>(50);
  const [autoPlayOnTimer, setAutoPlayOnTimer] = useState<boolean>(true);
  const [soundCategoryFilter, setSoundCategoryFilter] = useState<string>('الكل');

  // Animation frame ref for visualizer
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const getDuration = (m: PomoMode) => {
    switch (m) {
      case 'work':
        return 25 * 60;
      case 'short_break':
        return 5 * 60;
      case 'long_break':
        return 15 * 60;
    }
  };

  const currentDuration = getDuration(mode);

  // Play Bell notification on complete
  const playAlarm = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.35); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.7); // C6

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  };

  // Sync volume with engine
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSoundVolume(val);
    focusAudioEngine.setVolume(val / 100);
  };

  // Toggle Sound Playback
  const toggleSound = (soundType?: FocusSoundType) => {
    const targetType = soundType !== undefined ? soundType : selectedSound;

    if (isSoundPlaying && (soundType === undefined || targetType === selectedSound)) {
      focusAudioEngine.stop();
      setIsSoundPlaying(false);
    } else {
      setSelectedSound(targetType);
      focusAudioEngine.setVolume(soundVolume / 100);
      focusAudioEngine.play(targetType);
      setIsSoundPlaying(true);
    }
  };

  const handleSelectSound = (type: FocusSoundType) => {
    setSelectedSound(type);
    if (isSoundPlaying || isRunning) {
      focusAudioEngine.setVolume(soundVolume / 100);
      focusAudioEngine.play(type);
      setIsSoundPlaying(true);
    }
  };

  // Auto-play / stop sound according to timer if enabled
  useEffect(() => {
    if (autoPlayOnTimer) {
      if (isRunning && mode === 'work' && !isSoundPlaying) {
        focusAudioEngine.setVolume(soundVolume / 100);
        focusAudioEngine.play(selectedSound);
        setIsSoundPlaying(true);
      } else if (!isRunning && isSoundPlaying && autoPlayOnTimer) {
        // Keep playing if user explicitly toggled, or let user decide
      }
    }
  }, [isRunning, mode]);

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      focusAudioEngine.stop();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Visualizer loop for canvas - only runs animation frames when sound is playing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!isSoundPlaying) {
      // Draw static idle dots once without continuous animation frames
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dotCount = 5;
      const startX = (canvas.width - dotCount * 10) / 2;
      for (let i = 0; i < dotCount; i++) {
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(startX + i * 10, canvas.height / 2, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    const renderVisualizer = () => {
      const analyser = focusAudioEngine.getAnalyser();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barCount = 18;
        const barWidth = 3.5;
        const gap = 3;
        const totalWidth = barCount * (barWidth + gap);
        const startX = (canvas.width - totalWidth) / 2;

        for (let i = 0; i < barCount; i++) {
          const dataIndex = Math.floor((i / barCount) * (bufferLength / 2));
          const value = dataArray[dataIndex] || 0;
          const barHeight = Math.max(3, (value / 255) * canvas.height * 0.85);

          const x = startX + i * (barWidth + gap);
          const y = canvas.height - barHeight;

          ctx.fillStyle = i % 2 === 0 ? '#10b981' : '#14b8a6';
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
          ctx.fill();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderVisualizer);
    };

    renderVisualizer();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isSoundPlaying]);

  // Main countdown loop
  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playAlarm();

      if (mode === 'work') {
        onIncrementSession();
        setMode('short_break');
        setTimeLeft(5 * 60);
        setAlertMessage('🎉 انتهت جلسة التركيز! أحسنت، خذ استراحة 5 دقائق.');
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
        setAlertMessage('⏰ انتهت الاستراحة! جاهز للعودة للمذاكرة بتركيز؟');
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode: PomoMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getDuration(newMode));
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // SVG progress
  const progressRatio = timeLeft / currentDuration;
  const strokeOffset = 283 * (1 - progressRatio);

  const categories = ['الكل', 'طبيعة', 'ترددات التركيز', 'عزل وتشتت'];
  const filteredPresets =
    soundCategoryFilter === 'الكل'
      ? FOCUS_SOUND_PRESETS
      : FOCUS_SOUND_PRESETS.filter((p) => p.category === soundCategoryFilter);

  const currentPresetInfo = FOCUS_SOUND_PRESETS.find((p) => p.id === selectedSound);

  return (
    <div id="pomodoro-view-container" className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {alertMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 flex items-center justify-between shadow-xs">
          <div className="font-bold text-sm">{alertMessage}</div>
          <button
            onClick={() => setAlertMessage(null)}
            className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
          >
            حسناً
          </button>
        </div>
      )}

      {/* Timer Main Box */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-700/80 text-center relative overflow-hidden">
        {/* Mode Selector Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold">
            <button
              onClick={() => switchMode('work')}
              className={`flex items-center gap-1.5 px-4 sm:px-6 py-2 rounded-xl transition-all ${
                mode === 'work'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>مذاكرة وتركيز (25 د)</span>
            </button>

            <button
              onClick={() => switchMode('short_break')}
              className={`flex items-center gap-1.5 px-4 sm:px-6 py-2 rounded-xl transition-all ${
                mode === 'short_break'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>راحة قصيرة (5 د)</span>
            </button>

            <button
              onClick={() => switchMode('long_break')}
              className={`flex items-center gap-1.5 px-4 sm:px-6 py-2 rounded-xl transition-all ${
                mode === 'long_break'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>راحة طويلة (15 د)</span>
            </button>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              className="text-slate-100 dark:text-slate-700/60"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={strokeOffset}
              className={`transition-all duration-1000 ${
                mode === 'work' ? 'text-emerald-500' : 'text-teal-400'
              }`}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <div className="text-5xl sm:text-6xl font-mono font-black text-slate-900 dark:text-white tracking-widest">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
              {isRunning
                ? mode === 'work'
                  ? '🔥 جلسة تركيز جارية...'
                  : '☕ وقت الراحة والاسترخاء'
                : 'جاهز للانطلاق'}
            </div>

            {/* Visualizer inside circle */}
            <div className="mt-2 h-6 flex items-center justify-center">
              <canvas ref={canvasRef} width={100} height={24} className="opacity-90" />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>بدء الجلسة</span>
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            aria-label="إعادة تعيين المؤقت للوضع الافتراضي"
            className="p-3.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-2xl transition-colors cursor-pointer"
            title="إعادة التعيين"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Focus Audio Soundscapes Studio */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  أصوات خلفية لتعزيز التركيز والانغماس
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                  مكتبة صوتية تفاعلية
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                تساعدك على عزل مشتتات المكان وزيادة سرعة الاستيعاب وتثبيت الحفظ.
              </p>
            </div>
          </div>

          {/* Master sound switch */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleSound()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isSoundPlaying
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              {isSoundPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>إيقاف الصوت</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>تشغيل الصوت</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sound Controls Bar: Category Filter + Volume + AutoPlay */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">
              النوع:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSoundCategoryFilter(cat)}
                className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                  soundCategoryFilter === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Volume Control Slider */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <label htmlFor="pomodoro-volume-slider" className="sr-only">
              مستوى صوت الخلفية
            </label>
            <Volume2 className="w-4 h-4 text-slate-400" />
            <input
              id="pomodoro-volume-slider"
              name="volumeSlider"
              type="range"
              min="0"
              max="100"
              aria-label="مستوى صوت الخلفية"
              value={soundVolume}
              onChange={handleVolumeChange}
              className="w-28 sm:w-36 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              title="مستوى الصوت"
            />
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 w-8">
              {soundVolume}%
            </span>
          </div>

          {/* Auto-play toggle */}
          <label htmlFor="pomodoro-autoplay-checkbox" className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              id="pomodoro-autoplay-checkbox"
              name="autoPlay"
              type="checkbox"
              aria-label="تشغيل صوت الخلفية تلقائياً عند بدء المؤقت"
              checked={autoPlayOnTimer}
              onChange={(e) => setAutoPlayOnTimer(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span>تشغيل تلقائي مع المؤقت</span>
          </label>
        </div>

        {/* Sound Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredPresets.map((preset) => {
            const isSelected = selectedSound === preset.id;
            const isCurrentPlaying = isSelected && isSoundPlaying;

            return (
              <div
                key={preset.id}
                onClick={() => handleSelectSound(preset.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none relative overflow-hidden ${
                  isCurrentPlaying
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                    : isSelected
                    ? 'bg-slate-50 dark:bg-slate-900 border-emerald-400 dark:border-emerald-600'
                    : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                {/* Active Indicator Ribbon */}
                {isCurrentPlaying && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/80 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>يعمل الآن</span>
                  </div>
                )}

                <div className="flex items-start gap-3 mb-2">
                  <div className="text-2xl p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    {preset.emoji}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {preset.name}
                    </h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {preset.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {preset.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {isSelected ? 'محدد للاستخدام' : 'اضغط للتحديد'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSound(preset.id);
                    }}
                    aria-label={isCurrentPlaying ? `إيقاف صوت ${preset.name}` : `تشغيل صوت ${preset.name}`}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                      isCurrentPlaying
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900'
                    }`}
                  >
                    {isCurrentPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Sound Status Card */}
        {currentPresetInfo && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentPresetInfo.emoji}</span>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">الصوت المختار حالياً:</span>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentPresetInfo.name} ({isSoundPlaying ? 'قيد التشغيل' : 'متوقف'})
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleSound()}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isSoundPlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isSoundPlaying ? 'إيقاف الخلفية الصوتية' : 'تشغيل الخلفية الصوتية الآن'}
            </button>
          </div>
        )}
      </div>

      {/* Stats Widget */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">الجلسات المكتملة</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {completedSessions}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">جلسة مذاكرة</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">ساعات التركيز الإجمالية</div>
          <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
            {(completedSessions * 0.42).toFixed(1)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">ساعة مذاكرة نقية</div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">معدل الإنجاز اليومي</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 flex items-center justify-center gap-1">
            <Flame className="w-6 h-6 fill-amber-500" />
            <span>{completedSessions >= 4 ? 'ممتاز' : 'جيد'}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">الهدف: 6 جلسات يومياً</div>
        </div>
      </div>
    </div>
  );
};
