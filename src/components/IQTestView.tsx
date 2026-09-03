import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Award,
  Sparkles,
  Timer,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Share2,
  Printer,
  ShieldCheck,
  Zap,
  TrendingUp,
  BarChart3,
  Check,
  Flame,
  Layers,
  Sparkle
} from 'lucide-react';
import {
  ALL_IQ_QUESTIONS,
  IQQuestion,
  MatrixCellData,
  IQDifficultyLevel,
  IQ_LEVEL_CONFIGS,
  calculateIQScoreByLevel,
  IQResultMetrics
} from '../data/iqTestData';
import { useLanguage } from '../utils/i18n';
import { UserProfile } from '../types';

interface IQTestViewProps {
  userProfile?: UserProfile | null;
}

export const IQTestView: React.FC<IQTestViewProps> = ({ userProfile }) => {
  const { lang } = useLanguage();
  
  // Difficulty Level State
  const [selectedLevel, setSelectedLevel] = useState<IQDifficultyLevel>('hard');

  // Test Flow State
  const [testState, setTestState] = useState<'intro' | 'testing' | 'results' | 'review'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(18 * 60);
  const [isTimed, setIsTimed] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [results, setResults] = useState<IQResultMetrics | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Get active questions for the chosen difficulty level
  const activeQuestions = ALL_IQ_QUESTIONS.filter((q) => q.level === selectedLevel);
  const levelConfig = IQ_LEVEL_CONFIGS[selectedLevel];

  // Start test for selected difficulty
  const handleStartTest = (lvl?: IQDifficultyLevel) => {
    const levelToUse = lvl || selectedLevel;
    if (lvl) setSelectedLevel(lvl);
    
    const config = IQ_LEVEL_CONFIGS[levelToUse];
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentIndex(0);
    setTimeRemaining(config.durationMinutes * 60);
    setStartTime(Date.now());
    setTestState('testing');
  };

  // Timer countdown effect
  useEffect(() => {
    if (testState === 'testing' && isTimed) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testState, isTimed, selectedLevel]);

  // Submit test and evaluate
  const handleSubmitTest = () => {
    const totalDurationSeconds = levelConfig.durationMinutes * 60;
    const elapsedSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : totalDurationSeconds - timeRemaining;
    setTimeSpent(elapsedSeconds);
    const scoreMetrics = calculateIQScoreByLevel(selectedLevel, activeQuestions, userAnswers, elapsedSeconds);
    setResults(scoreMetrics);
    setTestState('results');
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleToggleFlag = (questionId: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQ: IQQuestion | undefined = activeQuestions[currentIndex] || activeQuestions[0];
  const isLastQuestion = currentIndex === activeQuestions.length - 1;
  const answeredCount = activeQuestions.filter((q) => userAnswers[q.id] !== undefined).length;
  const progressPercent = activeQuestions.length > 0 ? Math.round((answeredCount / activeQuestions.length) * 100) : 0;

  // Render visual cells for matrices
  const renderCellGraphic = (cell: MatrixCellData | null, sizeClass = 'w-full h-full') => {
    if (!cell) {
      return (
        <div className={`${sizeClass} flex flex-col items-center justify-center bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border-2 border-dashed border-amber-500/80 text-amber-600 dark:text-amber-400 font-mono font-black text-2xl animate-pulse`}>
          <span>?</span>
        </div>
      );
    }

    if (cell.type === 'dots') {
      const count = cell.dotsCount || 1;
      return (
        <div className={`${sizeClass} flex items-center justify-center p-2`}>
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[70px]">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-xs ring-2 ring-indigo-200 dark:ring-indigo-900"
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <svg className={`${sizeClass} p-1`} viewBox="0 0 100 100">
        {cell.shapes?.map((shape, idx) => {
          const fill = shape.fill || 'none';
          const stroke = shape.stroke || shape.color || '#3b82f6';
          const strokeWidth = shape.strokeWidth || (shape.fill && shape.fill !== 'none' ? 0 : 3);
          const rotation = shape.rotation || 0;
          const transform = rotation ? `rotate(${rotation} 50 50)` : undefined;

          if (shape.kind === 'circle') {
            const r = (shape.size || 60) / 2;
            const cx = shape.x || 50;
            const cy = shape.y || 50;
            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r={r}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
          }

          if (shape.kind === 'rect') {
            const s = shape.size || 60;
            const x = shape.x !== undefined ? shape.x - s / 2 : 50 - s / 2;
            const y = shape.y !== undefined ? shape.y - s / 2 : 50 - s / 2;
            return (
              <rect
                key={idx}
                x={x}
                y={y}
                width={s}
                height={s}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                rx={4}
                transform={transform}
              />
            );
          }

          if (shape.kind === 'triangle') {
            const s = shape.size || 60;
            const points = `50,${50 - s / 1.7} ${50 + s / 1.7},${50 + s / 2.5} ${50 - s / 1.7},${50 + s / 2.5}`;
            return (
              <polygon
                key={idx}
                points={points}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                transform={transform}
              />
            );
          }

          if (shape.kind === 'polygon' && shape.points) {
            return (
              <polygon
                key={idx}
                points={shape.points}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                transform={transform}
              />
            );
          }

          if (shape.kind === 'arrow') {
            return (
              <g key={idx} transform={transform}>
                <line x1="50" y1="80" x2="50" y2="25" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
                <polygon points="50,15 35,35 65,35" fill={stroke} />
              </g>
            );
          }

          if (shape.kind === 'cross') {
            return (
              <g key={idx} transform={transform}>
                <line x1="50" y1="20" x2="50" y2="80" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
                <line x1="20" y1="50" x2="80" y2="50" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
              </g>
            );
          }

          if (shape.kind === 'diamond') {
            return (
              <polygon
                key={idx}
                points="50,20 80,50 50,80 20,50"
                fill={fill !== 'none' ? fill : stroke}
                stroke={stroke}
                strokeWidth={strokeWidth}
                transform={transform}
              />
            );
          }

          if (shape.kind === 'star') {
            return (
              <polygon
                key={idx}
                points="50,15 61,38 85,42 68,58 72,82 50,70 28,82 32,58 15,42 39,38"
                fill={fill !== 'none' ? fill : stroke}
                stroke={stroke}
                strokeWidth={strokeWidth}
                transform={transform}
              />
            );
          }

          if (shape.kind === 'line') {
            return (
              <g key={idx} transform={transform}>
                <line
                  x1={shape.x || 15}
                  y1={shape.y || 50}
                  x2={(shape.x || 15) + 70}
                  y2={shape.y || 50}
                  stroke={stroke}
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </g>
            );
          }

          return null;
        })}
      </svg>
    );
  };

  return (
    <div id="iq-test-main-view" className="space-y-6 animate-fadeIn pb-16">
      
      {/* 1. INTRO / DIFFICULTY SELECTOR SCREEN */}
      {testState === 'intro' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 p-6 sm:p-10 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-right">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                  <Brain className="w-9 h-9 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                      {lang === 'ar'
                        ? 'اختبار الذكاء المعتمد (3 مستويات صعوبة)'
                        : 'Standardized IQ Assessment (3 Difficulty Levels)'}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      معايير مصفوفات رافن & منسا 🌟
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    {lang === 'ar'
                      ? 'اختر مستوى الصعوبة المناسب لك: سهل للمبتدئين، صعب للتفكير التحليلي المتقدم، أو صعب جداً لاختبار نوابغ منسا.'
                      : 'Select your preferred challenge level: Easy for fundamentals, Hard for analytical matrix logic, or Very Hard for Mensa Genius Tier.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Difficulty Level Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Level 1: Easy */}
            <div
              onClick={() => setSelectedLevel('easy')}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                selectedLevel === 'easy'
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 scale-[1.02]'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-emerald-400 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    🟢 سهل (Easy)
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    8 أسئلة • 12 دقيقة
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                  المستوى القياسي / السهل
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  تدرج الأنماط والأشكال الأساسية، تتابع الألوان، والدوران الهندسي المباشر بزاوية 90°.
                </p>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  نطاق القياس: IQ 75 - 115
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartTest('easy');
                }}
                className="mt-6 w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
              >
                <span>بدء المستوى السهل</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Level 2: Hard */}
            <div
              onClick={() => setSelectedLevel('hard')}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                selectedLevel === 'hard'
                  ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10 scale-[1.02]'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-amber-400 opacity-90'
              }`}
            >
              <div className="absolute -top-3 -left-3">
                <span className="bg-amber-500 text-white text-[10px] font-black px-4 py-1 rotate-[-15deg] shadow-sm uppercase">
                  شائع
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    🟡 صعب (Hard)
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    6 أسئلة • 18 دقيقة
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                  المستوى المتقدم / الصعب
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  مصفوفات المربعات اللاتينية، تراكب الأشكال متعددة الأبعاد، وبوابات إلغاء الخطوط (XOR Logic).
                </p>
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-bold text-amber-800 dark:text-amber-300">
                  نطاق القياس: IQ 100 - 138
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartTest('hard');
                }}
                className="mt-6 w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
              >
                <span>بدء المستوى الصعب</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Level 3: Very Hard / Mensa */}
            <div
              onClick={() => setSelectedLevel('very_hard')}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                selectedLevel === 'very_hard'
                  ? 'border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/10 scale-[1.02]'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-rose-400 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-rose-500" />
                    <span>صعب جداً 🔴 🌟</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    4 أسئلة • 25 دقيقة
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                  المستوى النخبوي (Mensa Genius)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  أعلى درجات الصعوبة: الجبر البولياني المتداخل، الدوران الفراغي 3D، ومجالات المتجهات الطوبولوجية.
                </p>
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-bold text-rose-800 dark:text-rose-300">
                  نطاق القياس: IQ 125 - 160+ (Mensa Tier)
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartTest('very_hard');
                }}
                className="mt-6 w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
              >
                <span>بدء اختبار النوابغ (Mensa)</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Test Guidelines & Instructions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>إرشادات وتعليمات الاختبار المعتمد</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">1. منطق المصفوفة</span>
                <p className="text-slate-600 dark:text-slate-400">كل مصفوفة تتبع قاعدة منطقية واحدة وثابتة عبر الصفوف أو الأعمدة أو الأقطار.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">2. استبعاد الخيارات</span>
                <p className="text-slate-600 dark:text-slate-400">استبعد الإجابات الخاطئة ذات الأنماط المتناقضة للوصول للقطعة الصحيحة بدقة.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-amber-600 dark:text-amber-400">3. إدارة الوقت</span>
                <p className="text-slate-600 dark:text-slate-400">لا تتوقف طويلاً عند سؤال واحد؛ يمكنك تمييز السؤال بالعلامة (🚩) والعودة له لاحقاً.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-purple-600 dark:text-purple-400">4. التقرير والشهادة</span>
                <p className="text-slate-600 dark:text-slate-400">تحصل فوراً على تقرير مفصل للأبعاد المعرفية مع شهادة معتمدة بنسبة الذكاء.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE TEST SCREEN */}
      {testState === 'testing' && currentQ && (
        <div className="space-y-6">
          {/* Top Bar: Progress & Timer */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                {currentIndex + 1}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    السؤال {currentIndex + 1} من {activeQuestions.length}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    selectedLevel === 'easy'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : selectedLevel === 'hard'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {levelConfig.badge}
                  </span>
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {lang === 'ar' ? currentQ.categoryLabelAr : currentQ.categoryLabelEn}
                </h2>
              </div>
            </div>

            {/* Timer and Quick Action Buttons */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                timeRemaining < 180
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}>
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>{formatTimer(timeRemaining)}</span>
              </div>

              <button
                type="button"
                onClick={() => handleToggleFlag(currentQ.id)}
                className={`p-2 rounded-xl border transition-all ${
                  flaggedQuestions[currentQ.id]
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 border-amber-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:text-amber-500'
                }`}
                title="تمييز السؤال للمراجعة لاحقاً"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleSubmitTest}
                className="px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                إنهاء الاختبار
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Main Question & Matrix Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 3x3 Matrix Puzzle Board */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
              <div className="w-full mb-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {currentQ.titleAr}
                </span>
                <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-lg">
                  مصفوفة 3×3
                </span>
              </div>

              {/* 3x3 Grid Matrix Box */}
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 w-full max-w-[380px] aspect-square">
                {currentQ.cells.map((cell, idx) => (
                  <div
                    key={idx}
                    className="p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center shadow-2xs aspect-square"
                  >
                    {renderCellGraphic(cell)}
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  حدد القطعة الهندسية المناسبة لملء علامة الاستفهام <strong>(؟)</strong>
                </p>
              </div>
            </div>

            {/* Answer Options Grid (6 Choices) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>اختر الإجابة الصحيحة من الخيارات الستة:</span>
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = userAnswers[currentQ.id] === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, idx)}
                        className={`p-2 rounded-2xl border-2 transition-all flex flex-col items-center justify-center aspect-square relative ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 ring-2 ring-indigo-500/20 scale-[1.03]'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-indigo-300 dark:hover:border-indigo-800'
                        }`}
                      >
                        <span className="absolute top-1.5 right-2 text-[10px] font-bold text-slate-400">
                          {idx + 1}
                        </span>
                        <div className="w-14 h-14 flex items-center justify-center">
                          {renderCellGraphic(opt, 'w-12 h-12')}
                        </div>
                        {isSelected && (
                          <div className="absolute bottom-1.5 left-2 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs disabled:opacity-40 flex items-center gap-1.5"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                {isLastQuestion ? (
                  <button
                    type="button"
                    onClick={handleSubmitTest}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>تسليم وتقييم النتيجة</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Grid Navigator */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-3 flex items-center justify-between">
              <span>خريطة التنقل السريع بين الأسئلة:</span>
              <span>{answeredCount} من {activeQuestions.length} تمت الإجابة</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeQuestions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;
                const isFlagged = flaggedQuestions[q.id];

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all relative flex items-center justify-center ${
                      isCurrent
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-500/40 shadow-sm'
                        : isAnswered
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-1 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. RESULTS & CERTIFICATE SCREEN */}
      {testState === 'results' && results && (
        <div className="space-y-6">
          {/* Certificate & Main Score Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-400/40 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                <Award className="w-4 h-4" />
                <span>شهادة التقييم المعرفي للذكاء ({levelConfig.titleAr})</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {userProfile?.displayName || 'المتقدم للاختبار'}
                </h1>
                <p className="text-xs text-slate-300 mt-1 font-mono">
                  تاريخ الإنجاز: {results.date} • المستوى: {levelConfig.badge}
                </p>
              </div>

              {/* Huge IQ Score Display */}
              <div className="flex flex-col items-center justify-center my-4">
                <div className="text-6xl sm:text-7xl font-black text-amber-300 tracking-tighter drop-shadow-md">
                  {results.score}
                </div>
                <div className="text-sm font-bold text-slate-300 mt-1 uppercase tracking-widest">
                  Standard IQ Score (Wechsler Scale)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 max-w-lg mx-auto">
                <div className="text-sm font-bold text-amber-200">
                  {results.classificationAr}
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  أعلى من <strong>{results.percentile}%</strong> من عموم السكان وفق منحنى التوزيع الطبيعي لمنسا.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الشهادة الرسمية</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTestState('review')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>مراجعة الحلول والشروحات</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTestState('intro')}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all border border-slate-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>اختيار مستوى آخر</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cognitive Domains Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">الاستدلال السائل والتجريدي</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{results.domainScores.fluid}%</div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full" style={{ width: `${results.domainScores.fluid}%` }} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">العلاقات المكانية والدوران</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{results.domainScores.spatial}%</div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full" style={{ width: `${results.domainScores.spatial}%` }} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400">الأنماط والتسلسل المنطقي</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{results.domainScores.pattern}%</div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full" style={{ width: `${results.domainScores.pattern}%` }} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400">العمليات المصفوفية والجبرية</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{results.domainScores.matrix}%</div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-600 h-full" style={{ width: `${results.domainScores.matrix}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. REVIEW SOLUTIONS SCREEN */}
      {testState === 'review' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                مراجعة الحلول والشروحات المنطقية ({levelConfig.titleAr})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                توضيح القواعد الهندسية لكل مصفوفة والإجابات النموذجية.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTestState('results')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              العودة للنتيجة
            </button>
          </div>

          <div className="space-y-6">
            {activeQuestions.map((q, qIdx) => {
              const userChoice = userAnswers[q.id];
              const isCorrect = userChoice === q.correctOptionIndex;

              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-3xl border-2 bg-white dark:bg-slate-900 shadow-sm space-y-4 ${
                    isCorrect
                      ? 'border-emerald-200 dark:border-emerald-900/60'
                      : 'border-rose-200 dark:border-rose-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-xs">
                        {qIdx + 1}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {q.titleAr}
                      </h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{isCorrect ? 'إجابة صحيحة' : 'إجابة غير صحيحة'}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* Matrix View */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-w-[260px] aspect-square mx-auto">
                      {q.cells.map((cell, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center aspect-square"
                        >
                          {renderCellGraphic(cell)}
                        </div>
                      ))}
                    </div>

                    {/* Explanation details */}
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                          القاعدة المنطقية:
                        </span>
                        <p className="text-emerald-900 dark:text-emerald-200">{q.explanationAr}</p>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        <span>إجابتك: </span>
                        <strong>{userChoice !== undefined ? `الخيار (${userChoice + 1})` : 'لم تتم الإجابة'}</strong>
                        {' • '}
                        <span>الإجابة النموذجية: </span>
                        <strong className="text-emerald-600 dark:text-emerald-400">الخيار ({q.correctOptionIndex + 1})</strong>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
