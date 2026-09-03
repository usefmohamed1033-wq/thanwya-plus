import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Trash2,
  Plus,
  Play,
  RotateCcw,
  Pause,
  TrendingUp,
  BookOpen,
  Calendar,
  Layers,
  ChevronLeft,
  Flame,
  Share2,
  Trophy,
  LogIn,
  GraduationCap,
  Compass,
  AlertTriangle,
  Sparkles,
  Bot,
  Heart,
  Timer,
  BookA,
  Quote,
  FileText,
  FolderLock,
  Brain
} from 'lucide-react';
import { TaskItem, TrackConfig, UserProgressData, UserProfile, AppState } from '../types';
import { MOTIVATIONAL_QUOTES } from '../data/curriculumData';
import { StudyCalendar } from './StudyCalendar';
import { getTodaysQuranPageNumber, fetchQuranPage, QuranPageData } from '../data/quranData';
import { DreamCollegeVisionBoard } from './DreamCollegeVisionBoard';
import { useLanguage } from '../utils/i18n';

interface HomeViewProps {
  currentTrack: TrackConfig;
  tasks: TaskItem[];
  onAddTask: (text: string, subject?: string, priority?: 'high' | 'medium' | 'low', dueDate?: string) => void;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  progress: UserProgressData;
  onNavigate: (tab: AppState['activeTab']) => void;
  onPrefetch?: (tab: AppState['activeTab']) => void;
  soundEnabled: boolean;
  currentUser?: UserProfile | null;
  onOpenShare?: () => void;
  onOpenAuth?: () => void;
  dreamCollegeId?: string;
  targetUniversityId?: string;
  onOpenDreamCollege?: () => void;
  onSelectUniversity?: (id: string) => void;
  onUpdateStudentName?: (name: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentTrack,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  progress,
  onNavigate,
  onPrefetch,
  soundEnabled,
  currentUser,
  onOpenShare,
  onOpenAuth,
  dreamCollegeId = 'medicine',
  targetUniversityId,
  onOpenDreamCollege,
  onSelectUniversity,
  onUpdateStudentName,
}) => {
  const { lang, t } = useLanguage();
  const [taskInput, setTaskInput] = useState('');
  const [taskSubject, setTaskSubject] = useState(currentTrack.subjects[0]?.name || '');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Quick Pomodoro state
  const [quickPomoSeconds, setQuickPomoSeconds] = useState(25 * 60);
  const [isQuickPomoRunning, setIsQuickPomoRunning] = useState(false);
  const [quickPomoToast, setQuickPomoToast] = useState<string | null>(null);

  // Motivational Quote
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Daily Quran state
  const todayPageNum = getTodaysQuranPageNumber();
  const [todayQuranData, setTodayQuranData] = useState<QuranPageData | null>(null);
  const [quranStreak, setQuranStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('thanawy_quran_streak');
      if (saved) return parseInt(saved, 10);
    } catch (e) {}
    return 3;
  });

  const isQuranReadToday = (() => {
    try {
      const lastCompletedDate = localStorage.getItem('thanawy_quran_last_completed_date');
      const todayStr = new Date().toISOString().split('T')[0];
      return lastCompletedDate === todayStr;
    } catch (e) {}
    return false;
  })();

  useEffect(() => {
    fetchQuranPage(todayPageNum).then((data) => {
      setTodayQuranData(data);
    });
  }, [todayPageNum]);

  useEffect(() => {
    let timer: any = null;
    if (isQuickPomoRunning && quickPomoSeconds > 0) {
      timer = setInterval(() => {
        setQuickPomoSeconds((prev) => prev - 1);
      }, 1000);
    } else if (quickPomoSeconds === 0 && isQuickPomoRunning) {
      setIsQuickPomoRunning(false);
      if (soundEnabled) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.6);
        } catch (e) {}
      }
      setQuickPomoToast(lang === 'ar' ? 'انتهت جلسة التركيز! خذ استراحة قصيرة.' : 'Focus session complete! Take a short break.');
      setQuickPomoSeconds(25 * 60);
    }
    return () => clearInterval(timer);
  }, [isQuickPomoRunning, quickPomoSeconds, soundEnabled, lang]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    onAddTask(taskInput.trim(), taskSubject, taskPriority);
    setTaskInput('');
  };

  // Calculate Overall Progress
  let totalChapters = 0;
  let completedChapters = 0;
  currentTrack.subjects.forEach((subj) => {
    totalChapters += subj.chapters.length;
    const subjProg = progress[subj.name] || [];
    completedChapters += subjProg.filter(Boolean).length;
  });

  const overallPercent = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  const strokeDashoffset = 283 - (283 * overallPercent) / 100;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div id="home-view-container" className="space-y-5 sm:space-y-7 animate-fadeIn pb-12">
      
      {/* Student Workspace Header - Native App Card Hero */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] sm:text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                {lang === 'ar' ? 'الثانوية العامة المصرية' : 'Egyptian General Secondary'} • 2027
              </span>
              <span className="text-[11px] sm:text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs">
                {currentTrack.totalMarks} {lang === 'ar' ? 'درجة' : 'Marks'}
              </span>
              {currentUser && (
                <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  {currentUser.targetCollege ? `${lang === 'ar' ? 'الهدف:' : 'Target:'} ${currentUser.targetCollege}` : ''}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
              {currentUser
                ? (lang === 'ar' ? `مرحباً بك، ${currentUser.name}` : `Welcome back, ${currentUser.name}`)
                : (lang === 'ar' ? 'مرحباً بك في منصة ثانوي بلس' : 'Welcome to Thanawy Plus')}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              {lang === 'ar'
                ? `الشعبة الحالية: ${currentTrack.titleArabic}. خطتك المنظمة لإدارة المنهج، تتبع الفصول، ومراجعة كتيب المفاهيم الوزاري.`
                : `Current Track: ${currentTrack.titleEnglish}. Your structured workspace for curriculum tracking, formula reference, and past exam preparation.`}
            </p>
          </div>

          {/* Quick Action Navigation Buttons (Optimized for Mobile Touch & Tablet) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('curriculum')}
              onMouseEnter={() => onPrefetch?.('curriculum')}
              onTouchStart={() => onPrefetch?.('curriculum')}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm transition-all active:scale-[0.97] cursor-pointer shadow-sm hover:shadow min-h-[46px]"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>{lang === 'ar' ? 'خطة المنهج' : 'Curriculum'}</span>
            </button>

            <button
              onClick={() => onNavigate('exams')}
              onMouseEnter={() => onPrefetch?.('exams')}
              onTouchStart={() => onPrefetch?.('exams')}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm transition-all active:scale-[0.97] cursor-pointer shadow-sm hover:shadow-md hover:shadow-emerald-600/20 min-h-[46px]"
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>{lang === 'ar' ? 'الامتحانات السابقة' : 'Past Exams'}</span>
            </button>

            {onOpenShare && (
              <button
                id="btn-hero-share-achievement"
                onClick={onOpenShare}
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm transition-all active:scale-[0.97] cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs min-h-[46px]"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                <span>{t('btn.share', 'مشاركة')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dream College Interactive Sanctuary & Theme Board */}
      <DreamCollegeVisionBoard
        collegeId={dreamCollegeId}
        targetUniversityId={targetUniversityId}
        onOpenSelector={onOpenDreamCollege || (() => {})}
        onSelectUniversity={onSelectUniversity}
        currentUser={currentUser || null}
        currentTrack={currentTrack}
        soundEnabled={soundEnabled}
        onUpdateStudentName={onUpdateStudentName}
      />

      {/* Top 3 Core Widgets Grid (Native App Cards with Spacious Padding & Soft Shadows) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

        {/* 1. Daily Tasks Manager */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-all">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-base">
                  {lang === 'ar' ? 'مهام اليوم' : 'Daily Tasks'}
                </span>
              </div>
              <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-xl border border-slate-200/70 dark:border-slate-700/70 shadow-2xs">
                {tasks.filter((t) => !t.done).length} {lang === 'ar' ? 'متبقية' : 'left'}
              </span>
            </div>

            {/* Task list with no cutoff for long tasks & generous spacing */}
            <div id="home-tasks-scroll" className="space-y-3 max-h-72 overflow-y-auto pr-0.5 custom-scrollbar">
              {tasks.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  {lang === 'ar' ? 'لا توجد مهام حالياً. أضف مهمتك اليومية أدناه.' : 'No tasks yet. Add a task below.'}
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start justify-between p-3.5 sm:p-4 rounded-2xl border transition-all text-xs ${
                      task.done
                        ? 'bg-slate-50/80 dark:bg-slate-950/40 border-slate-100 dark:border-slate-800/80 text-slate-400'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        aria-label={task.done ? 'Unmark task' : 'Mark task done'}
                        className={`w-6 h-6 rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer mt-0.5 shadow-2xs ${
                          task.done
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-600 dark:hover:border-emerald-400'
                        }`}
                      >
                        {task.done && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={`font-medium break-words leading-relaxed whitespace-pre-wrap ${task.done ? 'line-through text-slate-400' : ''}`}>
                          {task.text}
                        </p>
                        {task.subject && (
                          <span className="inline-block mt-1.5 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium px-2.5 py-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                            {task.subject}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 mr-1.5 ltr:mr-0 ltr:ml-1.5 mt-0.5">
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        aria-label="حذف المهمة"
                        className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-2 transition-colors cursor-pointer rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add task input */}
          <form onSubmit={handleCreateTask} className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex gap-2">
              <input
                id="home-new-task-input"
                name="newTask"
                type="text"
                aria-label="أضف مهمة جديدة"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder={lang === 'ar' ? 'أضف مهمة (مثال: حل 20 مسألة فيزياء)...' : 'Add task (e.g., solve 20 drills)...'}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 shadow-2xs"
              />
              <button
                type="submit"
                aria-label="إضافة مهمة جديدة"
                className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 p-3 px-4 rounded-2xl transition-all active:scale-[0.97] shrink-0 cursor-pointer font-bold text-xs flex items-center justify-center min-w-[46px] shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* 2. Overall Progress Gauge */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-between text-center transition-all">
          <div className="w-full flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white text-base">
              {lang === 'ar' ? 'إجمالي إنجاز المنهج' : 'Curriculum Progress'}
            </span>
            <button
              onClick={() => onNavigate('progress')}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold flex items-center gap-1 cursor-pointer py-1.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span>{lang === 'ar' ? 'التفاصيل' : 'Details'}</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative w-36 h-36 my-3">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                className="text-slate-100 dark:text-slate-800"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                className="text-emerald-600 dark:text-emerald-500 transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {overallPercent}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {lang === 'ar' ? 'مكتمل' : 'Completed'}
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed shadow-2xs">
            {lang === 'ar'
              ? `أنجزت ${completedChapters} من أصل ${totalChapters} فصلاً في المنهج الكلي.`
              : `Completed ${completedChapters} of ${totalChapters} chapters total.`}
          </div>
        </div>

        {/* 3. Quick Focus Timer */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between text-center transition-all">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white text-base">
              {lang === 'ar' ? 'مؤقت التركيز السريع' : 'Quick Focus Timer'}
            </span>
            <button
              onClick={() => onNavigate('pomodoro')}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold flex items-center gap-1 cursor-pointer py-1.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span>{lang === 'ar' ? 'المؤقت المتقدم' : 'Advanced'}</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="my-auto py-3">
            {quickPomoToast ? (
              <div className="p-2.5 mb-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-2xs">
                <span>{quickPomoToast}</span>
                <button
                  onClick={() => setQuickPomoToast(null)}
                  className="text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2.5 py-1 rounded-lg cursor-pointer font-bold"
                >
                  OK
                </button>
              </div>
            ) : null}
            <div className="text-5xl font-mono font-black text-slate-900 dark:text-white tracking-tight mb-1.5">
              {formatTime(quickPomoSeconds)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isQuickPomoRunning
                ? (lang === 'ar' ? 'جلسة التركيز جارية...' : 'Focus session in progress...')
                : (lang === 'ar' ? 'جلسة مذاكرة 25 دقيقة' : 'Standard 25 min Pomodoro')}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setIsQuickPomoRunning(!isQuickPomoRunning)}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all active:scale-[0.97] cursor-pointer min-h-[46px] ${
                isQuickPomoRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
              }`}
            >
              {isQuickPomoRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إيقاف مؤقت' : 'Pause'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'ابدأ التركيز' : 'Start'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsQuickPomoRunning(false);
                setQuickPomoSeconds(25 * 60);
              }}
              aria-label="إعادة تعيين مؤقت التركيز السريع"
              className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl transition-all active:scale-[0.97] cursor-pointer min-h-[46px] min-w-[46px] flex items-center justify-center shadow-2xs"
              title="إعادة تعيين"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Daily Quran Wird Card (Spacious Native Card & Touch Friendly) */}
      <div className="bg-slate-950 text-slate-100 rounded-3xl p-5 sm:p-7 md:p-8 border border-slate-800/90 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{lang === 'ar' ? 'الورد القرآني اليومي' : 'Daily Quran Portion'}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 tracking-tight">
            <span>{lang === 'ar' ? `صفحة اليوم (${todayPageNum}): سورة ${todayQuranData?.surahName || 'المباركة'}` : `Today's Page (${todayPageNum}): Surah ${todayQuranData?.surahName || 'Al-Quran'}`}</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            {todayQuranData?.reflectionPoint || (lang === 'ar' ? '«اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ» — صفحة يومية تجلب السكينة والبركة لوقتك.' : 'A daily page for spiritual clarity and peace during high school.')}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl text-center font-mono min-h-[46px] shadow-2xs">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-bold text-amber-400">{quranStreak} {lang === 'ar' ? 'أيام' : 'days'}</span>
          </div>

          <button
            id="btn-open-daily-quran-wird"
            onClick={() => onNavigate('wird')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all active:scale-[0.97] cursor-pointer min-h-[46px] ${
              isQuranReadToday
                ? 'bg-slate-900 text-emerald-400 border border-emerald-800 hover:bg-slate-800 shadow-sm'
                : 'bg-white text-slate-950 hover:bg-slate-100 font-black shadow-md'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isQuranReadToday ? (lang === 'ar' ? 'تمت القراءة اليوم' : 'Read Today') : (lang === 'ar' ? 'قراءة ورد اليوم' : 'Read Portion')}</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Monthly Study Calendar & Tasks Planner */}
      <StudyCalendar
        tasks={tasks}
        currentTrack={currentTrack}
        onAddTask={onAddTask}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
      />

      {/* Subject Quick Progress Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-slate-500" />
              <span>{lang === 'ar' ? `مقررات شعبة ${currentTrack.name} — نسب الإنجاز` : `${currentTrack.name} Subject Progress`}</span>
            </h3>
          </div>

          <button
            onClick={() => onNavigate('curriculum')}
            className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold cursor-pointer py-1.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {lang === 'ar' ? 'تعديل تقدم الفصول ←' : 'Edit Chapters Progress →'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentTrack.subjects.map((subj) => {
            const subjProg = progress[subj.name] || [];
            const doneCount = subjProg.filter(Boolean).length;
            const pct = Math.round((doneCount / subj.chapters.length) * 100);

            return (
              <div
                key={subj.id}
                onClick={() => onNavigate('curriculum')}
                className="cursor-pointer group p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-2xs hover:shadow-sm transition-all active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {subj.name}
                    </h4>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium">
                      {subj.mark} {lang === 'ar' ? 'درجة' : 'marks'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    {pct}%
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>
                    {lang === 'ar' ? `أنجزت ${doneCount} من ${subj.chapters.length} فصول` : `${doneCount} of ${subj.chapters.length} chapters`}
                  </span>
                  <span className="group-hover:underline text-slate-700 dark:text-slate-300 font-semibold">
                    {lang === 'ar' ? 'استعراض' : 'View'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Student Tools & Features Hub (Spacious Native Cards with Shadows) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'ar' ? 'أدوات التفوق والمصادر الأكاديمية' : 'Study & Academic Tools'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'ar' ? 'أدوات ذكية متكاملة مصممة خصيصاً لطلاب الثانوية العامة دفعة 2027' : 'Integrated smart tools designed for Egyptian high school curriculum'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Past Exams */}
          <div
            onClick={() => onNavigate('exams')}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500/80 shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3.5 border border-emerald-200/80 dark:border-emerald-800 shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {lang === 'ar' ? 'بنك الامتحانات السابقة الكاملة' : 'Past Exams Bank'}
                </h3>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-lg font-bold">
                  2022-2025
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'نماذج امتحانات الوزارة الرسمية بكامل الأسئلة والمقالي ونماذج الإجابة المعتمدة.'
                  : 'Official past ministerial exam papers with full questions, bable sheet, and answers.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <span>{lang === 'ar' ? 'بدء الحل والتدريب' : 'Start Solving'}</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Pomodoro Focus */}
          <div
            onClick={() => onNavigate('pomodoro')}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-3.5 shadow-2xs">
                <Timer className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {lang === 'ar' ? 'مؤقت التركيز Pomodoro' : 'Pomodoro Study Timer'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'جلسات مذاكرة مع أصوات الطبيعة والمطر لمضاعفة التركيز وتجنب التشتت.'
                  : 'Structured study intervals with ambient nature sounds to deepen focus.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
              <span>{lang === 'ar' ? 'بدء جلسة' : 'Start Session'}</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Duaa & Athkar */}
          <div
            onClick={() => onNavigate('duaa')}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-3.5 shadow-2xs">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {lang === 'ar' ? 'أدعية وأذكار المذاكرة' : 'Study Prayers & Supplications'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'أدعية تيسير الفهم وتثبيت الحفظ مع مسبحة إلكترونية للاطمئنان.'
                  : 'Authentic study supplications for focus, peace of mind, and digital tasbih.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
              <span>{lang === 'ar' ? 'قراءة الأدعية' : 'Read Prayers'}</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Minshawi Quran & Wird */}
          <div
            onClick={() => onNavigate('quran')}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3.5 border border-emerald-200/80 dark:border-emerald-800 shadow-2xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {lang === 'ar' ? 'المصحف وتلاوات المنشاوي' : 'Minshawi Recitations'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'استماع وتلاوة المصحف المرتل والمجود بصوت الشيخ محمد صديق المنشاوي.'
                  : 'Listen and recite along with Sheikh Mohamed Siddiq Al-Minshawi.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
              <span>{lang === 'ar' ? 'فتح المصحف' : 'Open Quran'}</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: IQ Test (Standard International) */}
          <div
            onClick={() => onNavigate('iq_test')}
            className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50/50 to-indigo-50/30 dark:from-slate-900 dark:to-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 hover:border-amber-500 dark:hover:border-amber-500 shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3.5 border border-amber-200/80 dark:border-amber-800 shadow-2xs">
                <Brain className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {lang === 'ar' ? 'اختبار الذكاء المعتمد (IQ)' : 'International IQ Test'}
                </h3>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-lg font-bold">
                  {lang === 'ar' ? 'معتمد 🌍' : 'Standard'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? '3 مستويات متدرجة (سهل، صعب، صعب جداً / Mensa) معتمدة على مصفوفات رافن وسلم ويكسلر الدولي.'
                  : '3 calibrated tiers (Easy, Hard, Very Hard / Mensa) based on Raven progressive matrices.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-100 dark:border-amber-800/60 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
              <span>{lang === 'ar' ? 'بدء اختبار الذكاء' : 'Start IQ Test'}</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Under Development Vault */}
          <div
            onClick={() => onNavigate('dev')}
            className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-slate-900 dark:to-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-3.5 border border-indigo-200/80 dark:border-indigo-800 shadow-2xs">
                <FolderLock className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {lang === 'ar' ? 'تحت التطوير (ملف خاص)' : 'Under Development'}
                </h3>
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded-lg font-bold font-mono">
                  🔒 128
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'ملف سري محمي بكلمة مرور مخصص للتحديثات البرمجية والرسائل الخاصة.'
                  : 'Encrypted password-protected vault for developer files and special notes.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-800/60 flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-400">
              <span>{lang === 'ar' ? 'فتح الملف المشفر' : 'Unlock Vault'}</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Quote Banner (Spacious Native Card) */}
      <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-right ltr:text-left">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl shrink-0 shadow-2xs">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 font-mono">
              {MOTIVATIONAL_QUOTES[quoteIndex].author}
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed mt-0.5">
              "{MOTIVATIONAL_QUOTES[quoteIndex].text}"
            </p>
          </div>
        </div>

        <button
          onClick={() => setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length)}
          className="w-full sm:w-auto shrink-0 text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-5 py-3 rounded-2xl transition-all active:scale-[0.97] cursor-pointer text-center shadow-2xs"
        >
          {lang === 'ar' ? 'اقتباس آخر' : 'Next Quote'}
        </button>
      </div>

    </div>
  );
};

