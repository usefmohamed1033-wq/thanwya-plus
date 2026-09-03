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
  VolumeX,
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
  Copy,
  Music,
  Radio,
  Clock,
  Download,
  Headphones,
  Sliders,
  CloudRain,
  Wind,
  Info,
  Award,
  RefreshCw,
  FastForward,
  Rewind,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import {
  MINSHAWI_FULL_SURAHS,
  MINSHAWI_MASTERPIECES,
  MINSHAWI_BIOGRAPHY,
  MinshawiSurahItem,
  MinshawiRecitationItem,
} from '../data/minshawiData';
import {
  SURAH_LIST,
  STUDY_DUAAS,
  QuranPageData,
  getTodaysQuranPageNumber,
  fetchQuranPage,
} from '../data/quranData';
import { notificationService } from '../utils/notificationService';
import { useLanguage } from '../utils/i18n';
import { useQuranAudio } from '../context/QuranAudioContext';

interface MinshawiQuranViewProps {
  soundEnabled: boolean;
}

export const MinshawiQuranView: React.FC<MinshawiQuranViewProps> = ({ soundEnabled }) => {
  const { lang, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<'wird' | 'full_surahs' | 'masterpieces' | 'study_radio'>('wird');

  // Shared Global Audio Engine
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
    activeRecitingAyahNumber,
    toastMessage,
    togglePlayAudio,
    handleSeek,
    handlePlayPageWirdMinshawi,
    handlePlaySingleAyah,
    handlePlaySurah,
    handlePlayMasterpiece,
    handlePlayNextSurah,
    handlePlayPrevSurah,
    handleSetSleepTimer,
    handleSwitchMirror,
    setPlaybackSpeed,
    setIsLooping,
    setToastMessage,
  } = useQuranAudio();

  // Daily Quran Page state
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
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [copiedDuaaIndex, setCopiedDuaaIndex] = useState<number | null>(null);

  // Daily Streak & Completion
  const [streakCount, setStreakCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('thanawy_quran_streak');
      if (saved) return parseInt(saved, 10);
    } catch (e) {}
    return 4;
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
      const lastDate = localStorage.getItem('thanawy_quran_last_completed_date');
      const todayStr = new Date().toISOString().split('T')[0];
      return lastDate === todayStr;
    } catch (e) {}
    return false;
  });

  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(() => {
    return notificationService.getSettings().quranWirdReminder;
  });

  // Search & Filter in Full Surahs
  const [surahSearchQuery, setSurahSearchQuery] = useState<string>('');
  const [surahFilterType, setSurahFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all');

  // 1. Fetch Page Data for Daily Quran Page
  useEffect(() => {
    let isMounted = true;
    setIsLoadingPage(true);

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

    notificationService.playNotificationSound();
    setToastMessage('🎉 تقبل الله طاعتكم! تم تسجيل ورد اليوم بنجاح ورفع سلسلة أيامك المتواصلة.');
    setTimeout(() => setToastMessage(null), 4000);
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

  // Filtered surahs
  const filteredSurahs = MINSHAWI_FULL_SURAHS.filter((surah) => {
    const matchesSearch =
      surah.name.includes(surahSearchQuery) ||
      surah.englishName.toLowerCase().includes(surahSearchQuery.toLowerCase()) ||
      String(surah.number) === surahSearchQuery;
    const matchesType =
      surahFilterType === 'all' ? true : surah.revelationType === surahFilterType;
    return matchesSearch && matchesType;
  });

  const fontClass =
    fontSize === 'normal'
      ? 'text-lg sm:text-xl leading-loose'
      : fontSize === 'large'
      ? 'text-xl sm:text-2xl leading-[2.6rem]'
      : 'text-2xl sm:text-3xl leading-[3.2rem]';

  const khatmaPercent = Math.min(100, Math.round((completedPages.length / 604) * 100));

  const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb6adbHJkK7Aj6Jcdx0t';

  return (
    <div id="minshawi-quran-sanctuary" className="space-y-6 animate-fadeIn pb-16">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* WhatsApp Channel Card for Sheikh Mohamed Siddiq El-Minshawi */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-green-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-emerald-400/50 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-[#25D366]/20 border-2 border-[#25D366] flex items-center justify-center text-[#25D366] shadow-lg shrink-0">
            <MessageCircle className="w-8 h-8 fill-[#25D366]/20" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] text-[11px] font-extrabold border border-[#25D366]/40 mb-1">
              <span>قناة واتساب الرسمية</span>
              <span>⭐</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              قناة تلاوات الشيخ محمد صديق المنشاوي على واتساب
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              انضم للقناة لتصلك روائع ونوادر التلاوات الخاشعة والمقاطع اليومية للشيخ المنشاوي مباشرة على هاتفك.
            </p>
          </div>
        </div>

        <a
          id="btn-join-minshawi-whatsapp-channel"
          href={WHATSAPP_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95 shrink-0 border border-emerald-200 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>انضم لقناة الواتساب الآن</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Hero Header: Sheikh Mohamed Siddiq El-Minshawi Sanctuary */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 shadow-2xl border-2 border-emerald-500/40">
        
        {/* Subtle Islamic Calligraphic Watermark */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-bold border border-emerald-400/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>واحة تلاوات الشيخ محمد صديق المنشاوي حصرياً • الصوت الباكي الخاشع</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-3">
              <span>المصحف المرتل والمجود وروائع التلاوات لفضيلة الشيخ المنشاوي</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              «القرآن نزل بمكة وقُرئ بمصر» — استمع للمصحف الكامل والتلاوات الإذاعية الخالدة، واقرأ وردك اليومي بصوت الشيخ محمد صديق المنشاوي. <strong className="text-emerald-300 font-bold">التلاوة مستمرة في الخلفية حتى أثناء تنقلك بين أقسام وجداول المذاكرة!</strong>
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] bg-slate-800/80 text-emerald-300 border border-emerald-700/60 px-2.5 py-1 rounded-lg font-bold">
                🎙️ {MINSHAWI_BIOGRAPHY.titleAr}
              </span>
              <span className="text-[11px] bg-slate-800/80 text-amber-300 border border-amber-700/60 px-2.5 py-1 rounded-lg font-bold">
                📖 114 سورة مرتلة ومجودة
              </span>
              <span className="text-[11px] bg-slate-800/80 text-teal-300 border border-teal-700/60 px-2.5 py-1 rounded-lg font-bold">
                🕊️ تشغيل مستمر مع التنقل
              </span>
            </div>
          </div>

          {/* Quick Streak & Reading Stats Counters */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl text-center shadow-md">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 font-extrabold text-lg">
                <Flame className="w-5 h-5 fill-amber-400" />
                <span>{streakCount} أيام</span>
              </div>
              <span className="text-[11px] text-slate-300 font-semibold">سلسلة الالتزام</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl text-center shadow-md">
              <div className="text-emerald-400 font-extrabold text-lg">
                <span>{completedPages.length}</span>
                <span className="text-xs text-slate-400">/604</span>
              </div>
              <span className="text-[11px] text-slate-300 font-semibold">صفحات الورد</span>
            </div>
          </div>
        </div>

        {/* Khatma Progress Bar */}
        <div className="mt-6 pt-4 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <div className="w-full sm:flex-1">
            <div className="flex justify-between mb-1.5 font-medium">
              <span>نسبة تقدم ختمة القرآن لعام 2027</span>
              <span className="text-emerald-300 font-bold">{khatmaPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${khatmaPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleToggleNotification}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              notificationEnabled
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{notificationEnabled ? 'تذكير الورد مفعل' : 'تفعيل تذكير الورد'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sections Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveSection('wird')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeSection === 'wird'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الورد القرآني اليومي (صفحة المصحف)</span>
        </button>

        <button
          onClick={() => setActiveSection('masterpieces')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeSection === 'masterpieces'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>روائع التلاوات الخاشعة والمجودة النادرة</span>
        </button>

        <button
          onClick={() => setActiveSection('full_surahs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeSection === 'full_surahs'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>المصحف المرتل الكامل (114 سورة)</span>
        </button>

        <button
          onClick={() => setActiveSection('study_radio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeSection === 'study_radio'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Headphones className="w-4 h-4 text-amber-400" />
          <span>راديو السكينة والمذاكرة الهادئة</span>
        </button>
      </div>

      {/* SECTION 1: DAILY QURAN WIRD (الورد اليومي) */}
      {activeSection === 'wird' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fadeIn">
          
          {/* Main Page Area */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Top Toolbar */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
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

              {/* Minshawi Exclusive Audio trigger & Font Controls */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-play-minshawi-page"
                  onClick={() => handlePlayPageWirdMinshawi(currentPageNum, pageData)}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>تلاوة الصفحة كاملة بصوت المنشاوي 🎙️</span>
                </button>

                <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setFontSize('normal')}
                    className={`px-2 py-1 text-xs rounded-lg font-bold ${
                      fontSize === 'normal' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`px-2 py-1 text-xs rounded-lg font-bold ${
                      fontSize === 'large' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize('xlarge')}
                    className={`px-2 py-1 text-xs rounded-lg font-bold ${
                      fontSize === 'xlarge' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    A++
                  </button>
                </div>
              </div>
            </div>

            {/* Authentic Quran Page Canvas */}
            <div className="bg-[#fcfaf2] dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-md border-2 border-amber-200/70 dark:border-slate-700 relative overflow-hidden transition-colors">
              
              {/* Corner Ornaments */}
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/60 dark:border-emerald-500/40 rounded-tr-xl pointer-events-none" />
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/60 dark:border-emerald-500/40 rounded-tl-xl pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/60 dark:border-emerald-500/40 rounded-br-xl pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/60 dark:border-emerald-500/40 rounded-bl-xl pointer-events-none" />

              {/* Surah Header Banner */}
              {pageData && (
                <div className="mb-6 text-center">
                  <div className="inline-block relative">
                    <div className="bg-amber-100 dark:bg-emerald-950/80 border border-amber-300 dark:border-emerald-800/80 text-amber-900 dark:text-emerald-200 px-8 py-2 rounded-2xl shadow-xs">
                      <span className="font-extrabold text-base sm:text-lg tracking-wide font-['Amiri',serif]">
                        سُورَةُ {pageData.surahName}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quran Text with Interactive Ayah Click & Recitation Highlighting */}
              {isLoadingPage ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    جاري جلب صفحة المصحف الشريف بدقة عثمانية...
                  </p>
                </div>
              ) : (
                <div className="text-center font-['Amiri',serif] leading-relaxed text-slate-900 dark:text-amber-50">
                  <p className={`${fontClass} text-justify [text-align-last:center] font-normal tracking-wide`}>
                    {pageData?.ayahs.map((ayah, idx) => {
                      const isReciting = activeRecitingAyahNumber === ayah.number;
                      return (
                        <React.Fragment key={ayah.number}>
                          <span
                            onClick={() => handlePlaySingleAyah(ayah, idx, currentPageNum, pageData)}
                            className={`cursor-pointer rounded-lg px-1 py-0.5 transition-all duration-300 ${
                              isReciting
                                ? 'bg-amber-300/40 dark:bg-emerald-600/40 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-500'
                                : 'hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-amber-100/50 dark:hover:bg-slate-800'
                            }`}
                            title="انقر للاستماع لهذه الآية بصوت الشيخ المنشاوي"
                          >
                            {ayah.text}{' '}
                          </span>
                          <span
                            onClick={() => handlePlaySingleAyah(ayah, idx, currentPageNum, pageData)}
                            className={`inline-flex items-center justify-center w-7 h-7 mx-1 my-0.5 rounded-full border text-[11px] font-sans font-bold align-middle shadow-xs cursor-pointer transition-transform hover:scale-110 ${
                              isReciting
                                ? 'bg-emerald-600 text-white border-emerald-400 scale-110'
                                : 'border-amber-400/70 dark:border-emerald-600/70 bg-amber-50 dark:bg-slate-800 text-amber-800 dark:text-emerald-300'
                            }`}
                          >
                            {ayah.numberInSurah}
                          </span>
                        </React.Fragment>
                      );
                    })}
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

            {/* Bottom Controls Bar: Next/Prev Navigation & Mark Completed */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPageNum((p) => Math.min(604, p + 1))}
                  disabled={currentPageNum >= 604}
                  className="flex items-center gap-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 disabled:opacity-40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <span>الصفحة التالية</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
                  disabled={currentPageNum <= 1}
                  className="flex items-center gap-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 disabled:opacity-40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>الصفحة السابقة</span>
                </button>
              </div>

              <button
                id="btn-mark-quran-read"
                onClick={handleMarkAsCompleted}
                disabled={isCompletedToday && completedPages.includes(currentPageNum)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md cursor-pointer ${
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

          {/* Sidebar: Biography & Study Duaas */}
          <div className="space-y-4">
            
            {/* WhatsApp Channel Card in Sidebar */}
            <div className="bg-[#25D366]/10 dark:bg-[#25D366]/5 rounded-2xl p-4 border border-[#25D366]/40 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>قناة تلاوات المنشاوي على واتساب</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                انضم لأكبر قناة تلاوات خاشعة لفضيلة الشيخ محمد صديق المنشاوي لتصلك التلاوات يومياً.
              </p>
              <a
                href={WHATSAPP_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 text-xs font-bold py-2 rounded-xl transition-all shadow-xs"
              >
                <span>انضمام عبر واتساب</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Quick Surah Jump selector */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>الانتقال السريع لسور القرآن</span>
              </div>
              <select
                aria-label="الانتقال المباشر لسورة في المصحف"
                onChange={(e) => {
                  const targetPage = parseInt(e.target.value, 10);
                  if (targetPage) setCurrentPageNum(targetPage);
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="">اختر سورة للانتقال لصفحتها...</option>
                {SURAH_LIST.map((s) => (
                  <option key={s.number} value={s.startPage}>
                    {s.number}. {s.name} (صفحة {s.startPage})
                  </option>
                ))}
              </select>
            </div>

            {/* Study Duaas Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Heart className="w-4 h-4 text-amber-500" />
                <span>أدعية التوفيق وتثبيت الحفظ</span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {STUDY_DUAAS.map((duaa, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/70 dark:border-slate-700/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      <span>{duaa.title}</span>
                      <button
                        onClick={() => handleCopyDuaa(duaa.arabic, idx)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                        title="نسخ الدعاء"
                      >
                        {copiedDuaaIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-['Amiri',serif]">
                      {duaa.arabic}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 2: MASTERPIECES (روائع التلاوات الخاشعة) */}
      {activeSection === 'masterpieces' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>نوادر وروائع التلاوات الخالدة لفضيلة الشيخ محمد صديق المنشاوي</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                تسجيلات نادرة ومقاطع خاشعة بأعلى جودة صوتية مأخوذة من إذاعة القرآن الكريم والمحافل الكبرى.
              </p>
            </div>
            <a
              href={WHATSAPP_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-transform hover:scale-105 shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>قناة نوادر المنشاوي على واتساب</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MINSHAWI_MASTERPIECES.map((item) => {
              const isCurrent = currentPlayingItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border transition-all duration-300 shadow-xs hover:shadow-md space-y-3 ${
                    isCurrent
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-300/60 dark:border-amber-800">
                        {item.type === 'mujawwad' ? 'تلاوة مجودة' : item.type === 'historical' ? 'محفل تاريخي' : 'تلاوة نادرة'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                        {item.titleAr}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.locationAr} • {item.durationText}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePlayMasterpiece(item)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm shrink-0 cursor-pointer ${
                        isCurrent && isPlaying
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-emerald-100 dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white'
                      }`}
                      title={isCurrent && isPlaying ? 'إيقاف' : 'تشغيل التلاوة'}
                    >
                      {isCurrent && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 mr-0.5" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    {item.descriptionAr}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: FULL SURAHS (المصحف المرتل الكامل 114 سورة) */}
      {activeSection === 'full_surahs' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Filter and Search */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث باسم السورة أو رقمها..."
                value={surahSearchQuery}
                onChange={(e) => setSurahSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
              <button
                onClick={() => setSurahFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  surahFilterType === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                جميع السور (114)
              </button>
              <button
                onClick={() => setSurahFilterType('Meccan')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  surahFilterType === 'Meccan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                مكية
              </button>
              <button
                onClick={() => setSurahFilterType('Medinan')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  surahFilterType === 'Medinan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                مدنية
              </button>
            </div>
          </div>

          {/* Surahs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredSurahs.map((surah) => {
              const murattalId = `surah-${surah.number}-murattal`;
              const isCurrentMurattal = currentPlayingItem?.id === murattalId;

              return (
                <div
                  key={surah.number}
                  className={`bg-white dark:bg-slate-800 rounded-2xl p-3.5 border transition-all shadow-xs flex items-center justify-between gap-2 ${
                    isCurrentMurattal
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                      {surah.number}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                        سورة {surah.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {surah.ayahCount} آية • {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlaySurah(surah, 'murattal')}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xs shrink-0 cursor-pointer ${
                      isCurrentMurattal && isPlaying
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white'
                    }`}
                    title={`تشغيل سورة ${surah.name} كاملة`}
                  >
                    {isCurrentMurattal && isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 mr-0.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: STUDY RADIO (راديو السكينة والمذاكرة الهادئة) */}
      {activeSection === 'study_radio' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-teal-500/40 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-500/20 rounded-2xl border border-teal-400/40 text-teal-300">
                <Headphones className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  راديو السكينة والتركيز أثناء المذاكرة
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  بث متواصل لتلاوات خاشعة بصوت الشيخ محمد صديق المنشاوي، مع مؤقت إيقاف ذكي لضبط جلسات المذاكرة.
                </p>
              </div>
            </div>

            {/* Quick Sleep Timer preset buttons */}
            <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-300 font-bold flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>مؤقت الإيقاف التلقائي:</span>
              </span>

              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleSetSleepTimer(mins)}
                  className="px-3 py-1.5 bg-slate-800/90 hover:bg-teal-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                >
                  {mins} دقيقة
                </button>
              ))}

              <button
                onClick={() => handleSetSleepTimer(null)}
                className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold border border-rose-800 transition-all cursor-pointer"
              >
                إلغاء المؤقت
              </button>
            </div>
          </div>

          {/* Minshawi Spiritual Biography Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xl">
                📖
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  {MINSHAWI_BIOGRAPHY.fullNameAr}
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {MINSHAWI_BIOGRAPHY.titleAr} • {MINSHAWI_BIOGRAPHY.birthAr}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {MINSHAWI_BIOGRAPHY.legacyAr}
            </p>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              💡 {MINSHAWI_BIOGRAPHY.famousQuoteAr}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
