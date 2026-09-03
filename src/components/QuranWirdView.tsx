import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sparkles,
  Heart,
  Bookmark,
  Share2,
  Flame,
  Calendar,
  Bell,
  Check,
  Search,
  BookMarked,
  Layers,
  Copy
} from 'lucide-react';
import {
  SURAH_LIST,
  QURAN_RECITERS,
  STUDY_DUAAS,
  QuranPageData,
  QuranAyah,
  Reciter,
  getTodaysQuranPageNumber,
  fetchQuranPage,
} from '../data/quranData';
import { notificationService } from '../utils/notificationService';

interface QuranWirdViewProps {
  soundEnabled: boolean;
}

export const QuranWirdView: React.FC<QuranWirdViewProps> = ({ soundEnabled }) => {
  const [currentPageNum, setCurrentPageNum] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('thanawy_quran_current_page');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 1 && parsed <= 604) return parsed;
      }
    } catch (e) {}
    return getTodaysQuranPageNumber();
  });

  const [pageData, setPageData] = useState<QuranPageData | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);
  
  // Reciter & Audio State
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(QURAN_RECITERS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Daily Streak & Completion State
  const [streakCount, setStreakCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('thanawy_quran_streak');
      if (saved) return parseInt(saved, 10);
    } catch (e) {}
    return 3; // Default warm starting streak
  });

  const [completedPages, setCompletedPages] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('thanawy_quran_completed_pages');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [1, 2, 596];
  });

  const [isCompletedToday, setIsCompletedToday] = useState<boolean>(() => {
    try {
      const lastCompletedDate = localStorage.getItem('thanawy_quran_last_completed_date');
      const todayStr = new Date().toISOString().split('T')[0];
      return lastCompletedDate === todayStr;
    } catch (e) {}
    return false;
  });

  // Font Size Settings
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [copiedDuaaIndex, setCopiedDuaaIndex] = useState<number | null>(null);
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(() => {
    return notificationService.getSettings().quranWirdReminder;
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch page data whenever currentPageNum changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingPage(true);
    setAudioError(null);
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    fetchQuranPage(currentPageNum).then((data) => {
      if (isMounted) {
        setPageData(data);
        setIsLoadingPage(false);
      }
    });

    localStorage.setItem('thanawy_quran_current_page', String(currentPageNum));

    return () => {
      isMounted = false;
    };
  }, [currentPageNum]);

  // Audio setup for the page
  useEffect(() => {
    if (!pageData || !pageData.ayahs || pageData.ayahs.length === 0) return;

    // Generate audio URL for the first ayah or full page audio
    // Format: reciter base + 3-digit surah + 3-digit ayah .mp3
    const firstAyah = pageData.ayahs[0];
    const surahPadded = String(firstAyah.surahNumber).padStart(3, '0');
    const ayahPadded = String(firstAyah.numberInSurah).padStart(3, '0');
    const audioUrl = `${selectedReciter.serverUrl}/${surahPadded}${ayahPadded}.mp3`;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
    } else {
      audioRef.current.src = audioUrl;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setAudioCurrentTime(audio.currentTime);
      setAudioDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlayingAudio(false);
      setAudioCurrentTime(0);
    };

    const handleError = () => {
      setAudioError('تعذر تحميل تلاوة هذه الآية مباشرة، جاري المحاولة مع قارئ آخر');
      setIsPlayingAudio(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [pageData, selectedReciter]);

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      setAudioError(null);
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((err) => {
        console.warn('Audio playback error', err);
        setAudioError('الرجاء الضغط مرة أخرى لبدء التلاوة');
      });
    }
  };

  const handleMarkAsCompleted = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newCompleted = Array.from(new Set([...completedPages, currentPageNum]));
    setCompletedPages(newCompleted);
    localStorage.setItem('thanawy_quran_completed_pages', JSON.stringify(newCompleted));
    localStorage.setItem('thanawy_quran_last_completed_date', todayStr);
    setIsCompletedToday(true);

    const newStreak = streakCount + 1;
    setStreakCount(newStreak);
    localStorage.setItem('thanawy_quran_streak', String(newStreak));

    // Play chime & celebrate
    notificationService.playNotificationSound();
    setToastMessage('🎉 تقبل الله طاعتكم! تم تسجيل ورد اليوم بنجاح ورفع سلسلة أيامك المتواصلة.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleNextPage = () => {
    if (currentPageNum < 604) {
      setCurrentPageNum((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageNum > 1) {
      setCurrentPageNum((prev) => prev - 1);
    }
  };

  const handleJumpToSurah = (surahNumber: number) => {
    const surah = SURAH_LIST.find((s) => s.number === surahNumber);
    if (surah) {
      setCurrentPageNum(surah.startPage);
    }
  };

  const handleCopyDuaa = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedDuaaIndex(index);
    setTimeout(() => setCopiedDuaaIndex(null), 2000);
  };

  const handleToggleNotification = async () => {
    const current = notificationEnabled;
    if (!current) {
      const perm = await notificationService.requestPermission();
      if (perm === 'granted') {
        notificationService.saveSettings({ quranWirdReminder: true });
        setNotificationEnabled(true);
        setToastMessage('🔔 تم تفعيل تذكير الورد القرآني اليومي بنجاح!');
      } else {
        setToastMessage('⚠️ يُرجى السماح بالإشعارات من إعدادات المتصفح.');
      }
    } else {
      notificationService.saveSettings({ quranWirdReminder: false });
      setNotificationEnabled(false);
      setToastMessage('تم إيقاف تذكير الورد القرآني.');
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const khatmaPercent = Math.min(100, Math.round((completedPages.length / 604) * 100));

  const fontClass =
    fontSize === 'normal'
      ? 'text-lg sm:text-xl leading-loose'
      : fontSize === 'large'
      ? 'text-xl sm:text-2xl leading-[2.5rem]'
      : 'text-2xl sm:text-3xl leading-[3rem]';

  return (
    <div id="quran-wird-container" className="space-y-6 animate-fadeIn">
      
      {/* Toast message alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header: Daily Quran Wird */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-500/30">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>الورد القرآني اليومي لطلاب الثانوية العامة</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>صفحة كل يوم بركة في الوقت وراحة للقلب</span>
              <Sparkles className="w-6 h-6 text-amber-400" />
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              «مَا قُرِئَ القُرْآنُ فِي عَمَلٍ إِلَّا بُورِكَ فِيهِ» — خصص 3 دقائق يومياً لقراءة صفحة واحدة بتدبر واستمع لتلاوتها المباركة قبل بدء رحلة مذاكرتك.
            </p>
          </div>

          {/* Quick Streak & Khatma Counters */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 font-extrabold text-lg">
                <Flame className="w-5 h-5 fill-amber-400" />
                <span>{streakCount} أيام</span>
              </div>
              <span className="text-[11px] text-slate-300">سلسلة الالتزام</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl text-center">
              <div className="text-emerald-400 font-extrabold text-lg">
                <span>{completedPages.length}</span>
                <span className="text-xs text-slate-400">/604</span>
              </div>
              <span className="text-[11px] text-slate-300">صفحات مقروءة</span>
            </div>
          </div>
        </div>

        {/* Khatma Progress Bar */}
        <div className="mt-6 pt-4 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <div className="w-full sm:flex-1">
            <div className="flex justify-between mb-1.5 font-medium">
              <span>تقدم ختمة القرآن لعام 2027</span>
              <span className="text-emerald-300 font-bold">{khatmaPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${khatmaPercent}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={handleToggleNotification}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              notificationEnabled
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{notificationEnabled ? 'التذكير اليومي مفعل' : 'تفعيل تذكير الورد'}</span>
          </button>
        </div>
      </div>

      {/* Main Quran Reader Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column (3/4 on desktop): The Quran Page Display */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Top Page Toolbar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
            
            {/* Page info tag */}
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800">
                صفحة رقم {currentPageNum} من 604
              </span>
              {pageData && (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  الجزء {pageData.juz} • الحزب {pageData.hizb}
                </span>
              )}
            </div>

            {/* Reciter Selector & Font controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Reciter select */}
              <div className="flex items-center gap-1 text-xs">
                <label htmlFor="quran-reciter-select" className="sr-only">
                  اختيار القارئ الصوتي
                </label>
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <select
                  id="quran-reciter-select"
                  name="quranReciter"
                  aria-label="اختيار القارئ الصوتي"
                  value={selectedReciter.id}
                  onChange={(e) => {
                    const r = QURAN_RECITERS.find((rec) => rec.id === e.target.value);
                    if (r) setSelectedReciter(r);
                  }}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                >
                  {QURAN_RECITERS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font size toggles */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setFontSize('normal')}
                  aria-label="حجم خط عادي"
                  className={`px-2 py-1 text-xs rounded-lg font-bold transition-all ${
                    fontSize === 'normal' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title="خط عادي"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  aria-label="حجم خط كبير"
                  className={`px-2 py-1 text-xs rounded-lg font-bold transition-all ${
                    fontSize === 'large' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title="خط كبير"
                >
                  A+
                </button>
                <button
                  onClick={() => setFontSize('xlarge')}
                  aria-label="حجم خط فائق الوضوح"
                  className={`px-2 py-1 text-xs rounded-lg font-bold transition-all ${
                    fontSize === 'xlarge' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title="خط فائق الوضوح"
                >
                  A++
                </button>
              </div>
            </div>
          </div>

          {/* Authentic Quran Page Canvas */}
          <div className="bg-[#fcfaf2] dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-md border-2 border-amber-200/70 dark:border-slate-700 relative overflow-hidden transition-colors">
            
            {/* Ornamental Frame Corner Accents */}
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/60 dark:border-emerald-500/40 rounded-tr-xl pointer-events-none"></div>
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/60 dark:border-emerald-500/40 rounded-tl-xl pointer-events-none"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/60 dark:border-emerald-500/40 rounded-br-xl pointer-events-none"></div>
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/60 dark:border-emerald-500/40 rounded-bl-xl pointer-events-none"></div>

            {/* Surah Header Ornamental Banner */}
            {pageData && (
              <div className="mb-6 text-center">
                <div className="inline-block relative">
                  <div className="bg-amber-100 dark:bg-emerald-950/80 border border-amber-300 dark:border-emerald-800/80 text-amber-900 dark:text-emerald-200 px-8 py-2 rounded-2xl shadow-xs">
                    <span className="font-extrabold text-base sm:text-lg tracking-wide">
                      سُورَةُ {pageData.surahName}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoadingPage ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  جاري جلب صفحة المصحف الشريف بدقة عثمانية...
                </p>
              </div>
            ) : (
              /* Quran Text with Uthmani typography */
              <div className="text-center font-['Amiri',serif] leading-relaxed text-slate-900 dark:text-amber-50">
                <p className={`${fontClass} text-justify [text-align-last:center] font-normal tracking-wide`}>
                  {pageData?.ayahs.map((ayah) => (
                    <React.Fragment key={ayah.number}>
                      <span className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                        {ayah.text}{' '}
                      </span>
                      <span className="inline-flex items-center justify-center w-7 h-7 mx-1 my-0.5 rounded-full border border-amber-400/70 dark:border-emerald-600/70 bg-amber-50 dark:bg-slate-800 text-[11px] font-sans font-bold text-amber-800 dark:text-emerald-300 align-middle shadow-xs">
                        {ayah.numberInSurah}
                      </span>
                    </React.Fragment>
                  ))}
                </p>
              </div>
            )}

            {/* Bottom Page Number Ornament */}
            <div className="mt-8 pt-4 border-t border-amber-200/50 dark:border-slate-800 flex items-center justify-between text-xs text-amber-800 dark:text-slate-400 font-medium">
              <span>الجزء {pageData?.juz || 1}</span>
              <span className="font-bold text-sm bg-amber-100/60 dark:bg-slate-800 px-3 py-1 rounded-full border border-amber-300/60 dark:border-slate-700">
                — {currentPageNum} —
              </span>
              <span>الحزب {pageData?.hizb || 1}</span>
            </div>
          </div>

          {/* Bottom Controls Bar: Audio Player & Next/Prev Navigation */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            
            {/* Audio Recitation Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/70 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  id="btn-quran-play-audio"
                  onClick={togglePlayAudio}
                  aria-label={isPlayingAudio ? 'إيقاف تلاوة الصفحة مؤقتاً' : 'استماع لتلاوة الصفحة'}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0 ${
                    isPlayingAudio
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                  title={isPlayingAudio ? 'إيقاف مؤقت' : 'استماع للتلاوة'}
                >
                  {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 mr-0.5" />}
                </button>

                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <span>تلاوة الصفحة بصوت {selectedReciter.name}</span>
                    {isPlayingAudio && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {selectedReciter.style}
                  </span>
                </div>
              </div>

              {audioError && (
                <span className="text-[11px] text-amber-600 dark:text-amber-400">
                  {audioError}
                </span>
              )}
            </div>

            {/* Page Navigation & Mark Completed Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              
              {/* Prev / Next buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleNextPage}
                  disabled={currentPageNum >= 604}
                  className="flex items-center gap-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 disabled:opacity-40 rounded-xl text-xs font-bold transition-all"
                >
                  <span>الصفحة التالية</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handlePrevPage}
                  disabled={currentPageNum <= 1}
                  className="flex items-center gap-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 disabled:opacity-40 rounded-xl text-xs font-bold transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>الصفحة السابقة</span>
                </button>
              </div>

              {/* Mark as Completed Button */}
              <button
                id="btn-mark-quran-read"
                onClick={handleMarkAsCompleted}
                disabled={isCompletedToday && completedPages.includes(currentPageNum)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md ${
                  completedPages.includes(currentPageNum)
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedPages.includes(currentPageNum)
                    ? 'تمت قراءة ورد هذه الصفحة ✨'
                    : 'أتممت قراءة ورد اليوم بحمد الله ✨'}
                </span>
              </button>
            </div>
          </div>

          {/* Reflection & Tafsir Card */}
          {pageData && (
            <div className="bg-gradient-to-r from-amber-50/80 to-emerald-50/80 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl p-5 border border-amber-200/80 dark:border-slate-700 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
                <Heart className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>تأملات ونفحات الصفحة لطالب الثانوية العامة</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {pageData.reflectionPoint || pageData.tafsirBrief}
              </p>
            </div>
          )}

        </div>

        {/* Right Column (1/4 on desktop): Surah Index, Jump Selector & Study Duaas */}
        <div className="space-y-6">
          
          {/* Quick Surah Jump Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>فهرس السور والانتقال السريع</span>
            </h3>

            {/* Page number jump input */}
            <div className="flex gap-2">
              <label htmlFor="quran-page-number-input" className="sr-only">
                رقم صفحة المصحف
              </label>
              <input
                id="quran-page-number-input"
                name="quranPageNumber"
                type="number"
                aria-label="رقم صفحة المصحف للانتقال إليها"
                min="1"
                max="604"
                value={currentPageNum}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (val >= 1 && val <= 604) setCurrentPageNum(val);
                }}
                className="w-20 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-center text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => setCurrentPageNum(getTodaysQuranPageNumber())}
                className="flex-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold py-1.5 transition-colors"
              >
                ورد اليوم التلقائي
              </button>
            </div>

            {/* Scrollable Surah List */}
            <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
              {SURAH_LIST.map((surah) => {
                const isCurrentSurah =
                  pageData?.surahName?.includes(surah.name) ||
                  (currentPageNum >= surah.startPage &&
                    (!SURAH_LIST[surah.number] || currentPageNum < SURAH_LIST[surah.number].startPage));

                return (
                  <button
                    key={surah.number}
                    onClick={() => handleJumpToSurah(surah.number)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-right transition-all ${
                      isCurrentSurah
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-center text-[10px] text-slate-400 font-mono">
                        {surah.number}
                      </span>
                      <span>سورة {surah.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      صـ {surah.startPage}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inspirational Study Duaas */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>أدعية تيسير المذاكرة والامتحان</span>
              </h3>
            </div>

            <div className="space-y-3">
              {STUDY_DUAAS.map((duaa, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {duaa.title}
                    </span>
                    <button
                      onClick={() => handleCopyDuaa(duaa.arabic, index)}
                      aria-label={`نسخ نص دعاء: ${duaa.title}`}
                      className="text-slate-400 hover:text-emerald-600 transition-colors p-1"
                      title="نسخ الدعاء"
                    >
                      {copiedDuaaIndex === index ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-['Amiri',serif]">
                    {duaa.arabic}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
