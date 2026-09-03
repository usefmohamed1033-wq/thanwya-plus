import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { TopBanner } from './components/TopBanner';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { Footer } from './components/Footer';
import { GmailInboxModal } from './components/GmailInboxModal';
import { ShareAchievementModal } from './components/ShareAchievementModal';
import { AuthModal } from './components/AuthModal';
import { DreamCollegeModal } from './components/DreamCollegeModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CollegeThemeBackground } from './components/CollegeThemeBackground';
import { CURRICULUM_DATA } from './data/curriculumData';
import { DREAM_COLLEGES_DATA, EGYPTIAN_UNIVERSITIES } from './data/collegeThemes';
import { AppState, TaskItem, TrackType, UserProgressData, LessonAppointment, UserProfile } from './types';
import { WifiOff, Wifi, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from './utils/i18n';
import { GlobalQuranPlayerBar } from './components/GlobalQuranPlayerBar';
import { onUserAuthStateChanged, logOutUser } from './firebase';

// Dynamic Loaders & Prefetch Registry
const componentLoaders = {
  curriculum: () => import('./components/CurriculumView'),
  exams: () => import('./components/ExamsView'),
  books: () => import('./components/BooksView'),
  pomodoro: () => import('./components/PomodoroView'),
  progress: () => import('./components/ProgressView'),
  lessons: () => import('./components/LessonsScheduleView'),
  formulas: () => import('./components/FormulasView'),
  duaa: () => import('./components/AthkarDuaaView'),
  wird: () => import('./components/MinshawiQuranView'),
  quran: () => import('./components/MinshawiQuranView'),
  dev: () => import('./components/UnderDevelopmentView'),
  iq_test: () => import('./components/IQTestView'),
};

// Code-split heavy views with prefetchable loaders
const LessonsScheduleView = lazy(() => componentLoaders.lessons().then(m => ({ default: m.LessonsScheduleView })));
const CurriculumView = lazy(() => componentLoaders.curriculum().then(m => ({ default: m.CurriculumView })));
const BooksView = lazy(() => componentLoaders.books().then(m => ({ default: m.BooksView })));
const ExamsView = lazy(() => componentLoaders.exams().then(m => ({ default: m.ExamsView })));
const PomodoroView = lazy(() => componentLoaders.pomodoro().then(m => ({ default: m.PomodoroView })));
const ProgressView = lazy(() => componentLoaders.progress().then(m => ({ default: m.ProgressView })));
const MinshawiQuranView = lazy(() => componentLoaders.quran().then(m => ({ default: m.MinshawiQuranView })));
const FormulasView = lazy(() => componentLoaders.formulas().then(m => ({ default: m.FormulasView })));
const AthkarDuaaView = lazy(() => componentLoaders.duaa().then(m => ({ default: m.AthkarDuaaView })));
const UnderDevelopmentView = lazy(() => componentLoaders.dev().then(m => ({ default: m.UnderDevelopmentView })));
const IQTestView = lazy(() => componentLoaders.iq_test().then(m => ({ default: m.IQTestView })));

export default function App() {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('thanawy_dark');
    if (saved !== null) return saved === 'true';
    return false;
  });

  const [activeTab, setActiveTab] = useState<AppState['activeTab']>('home');
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDreamCollegeModalOpen, setIsDreamCollegeModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Dream College Theme ID ('medicine', 'engineering', 'ai', etc.)
  const [dreamCollegeId, setDreamCollegeId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('thanawy_dream_college');
      if (saved && DREAM_COLLEGES_DATA[saved]) return saved;
    } catch (e) {}
    return 'medicine';
  });

  // Target Egyptian University ID ('cairo', 'ain_shams', 'alexandria', 'mansoura', etc.)
  const [targetUniversityId, setTargetUniversityId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('thanawy_target_university');
      if (saved && EGYPTIAN_UNIVERSITIES[saved]) return saved;
    } catch (e) {}
    return 'cairo';
  });

  // Offline / Online Status Detection
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [offlineToast, setOfflineToast] = useState<{ show: boolean; msg: string; type: 'offline' | 'online' } | null>(null);

  // Current logged in user profile (Google / Facebook / Email)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('thanawy_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [track, setTrack] = useState<TrackType>(() => {
    const saved = localStorage.getItem('thanawy_track') as TrackType;
    if (saved && CURRICULUM_DATA[saved]) return saved;
    return 'sci_math';
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('thanawy_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 1, text: 'مراجعة الباب الأول فيزياء (قانون أوم وكيرشوف)', subject: 'الفيزياء', done: false, createdAt: new Date().toISOString() },
      { id: 2, text: 'حل نموذج امتحان عربي على المشتقات وإعراب النصوص', subject: 'اللغة العربية', done: false, createdAt: new Date().toISOString() },
      { id: 3, text: 'حفظ كلمات Unit 1 & 2 في مادة الإنجليزي', subject: 'اللغة الأجنبية الأولى', done: true, createdAt: new Date().toISOString() },
    ];
  });

  const [lessons, setLessons] = useState<LessonAppointment[]>(() => {
    try {
      const saved = localStorage.getItem('thanawy_lessons');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'lesson-1',
        subject: 'الفيزياء',
        teacherName: 'أ/ محمد عبد المعبود',
        dayOfWeek: 'السبت',
        startTime: '16:00',
        endTime: '18:00',
        locationType: 'center',
        locationName: 'سنتر الأوائل - قاعة 1',
        notes: 'تسميع قوانين كيرشوف وشيت المسائل',
        monthlyFee: 350,
        reminderEnabled: true,
      },
      {
        id: 'lesson-2',
        subject: 'الكيمياء',
        teacherName: 'أ/ خالد صقر',
        dayOfWeek: 'الثلاثاء',
        startTime: '17:30',
        endTime: '19:30',
        locationType: 'online',
        locationName: 'منصة اليوتيوب والزووم',
        notes: 'الباب الأول - العناصر الانتقالية',
        monthlyFee: 300,
        reminderEnabled: true,
      },
      {
        id: 'lesson-3',
        subject: 'اللغة العربية',
        teacherName: 'أ/ رضا الفاروق',
        dayOfWeek: 'الخميس',
        startTime: '15:00',
        endTime: '17:30',
        locationType: 'center',
        locationName: 'سنتر النخبة',
        notes: 'حصة النحو الشاملة والأدب',
        monthlyFee: 350,
        reminderEnabled: true,
      },
    ];
  });

  const [progress, setProgress] = useState<UserProgressData>(() => {
    try {
      const saved = localStorage.getItem('thanawy_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  const [pomodoroSessions, setPomodoroSessions] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('thanawy_pomo_sessions');
      if (saved) return parseInt(saved, 10);
    } catch (e) {}
    return 0;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('thanawy_sound');
    return saved === null ? true : saved === 'true';
  });

  // Offline / Online Status Detection & Toast Effect
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setOfflineToast({
        show: true,
        msg: 'تمت استعادة الاتصال بالإنترنت بنجاح! جميع الميزات متصلة.',
        type: 'online',
      });
      const timer = setTimeout(() => setOfflineToast(null), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOfflineToast({
        show: true,
        msg: 'أنت الآن في وضع عدم الاتصال (Offline) - يمكنك مواصلة المذاكرة وحل الامتحانات وحفظ التقدم محلياً دون أي انقطاع.',
        type: 'offline',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Intelligent Component Prefetching: Priority to Curriculum & Exams, then secondary views
  useEffect(() => {
    const triggerPrefetching = () => {
      // 1. Immediate Prefetch for most requested & visited tabs: المنهج & الامتحانات
      componentLoaders.curriculum();
      componentLoaders.exams();

      // 2. Staged Idle Prefetch for other high-frequency tools
      const secondBatchTimer = setTimeout(() => {
        componentLoaders.books();
        componentLoaders.pomodoro();
        componentLoaders.formulas();
        componentLoaders.progress();
        componentLoaders.lessons();
        componentLoaders.duaa();
      }, 1200);

      return () => clearTimeout(secondBatchTimer);
    };

    // Use requestIdleCallback if available for zero jank, fallback to setTimeout
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleHandle = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
        triggerPrefetching,
        { timeout: 1500 }
      );
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleHandle);
        }
      };
    } else {
      const timerId = setTimeout(triggerPrefetching, 500);
      return () => clearTimeout(timerId);
    }
  }, []);

  // Hover/touch on-demand instant prefetcher
  const handlePrefetchTab = useCallback((tab: AppState['activeTab']) => {
    if (componentLoaders[tab as keyof typeof componentLoaders]) {
      componentLoaders[tab as keyof typeof componentLoaders]();
    }
  }, []);

  // Dark mode effect
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('thanawy_dark', String(dark));
  }, [dark]);

  // Track save
  useEffect(() => {
    localStorage.setItem('thanawy_track', track);
  }, [track]);

  // Dream College Global Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute('data-college', dreamCollegeId);
    localStorage.setItem('thanawy_dream_college', dreamCollegeId);
  }, [dreamCollegeId]);

  // Target Egyptian University Save
  useEffect(() => {
    localStorage.setItem('thanawy_target_university', targetUniversityId);
  }, [targetUniversityId]);

  // Tasks save
  useEffect(() => {
    localStorage.setItem('thanawy_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Lessons save
  useEffect(() => {
    localStorage.setItem('thanawy_lessons', JSON.stringify(lessons));
  }, [lessons]);

  // Progress save
  useEffect(() => {
    localStorage.setItem('thanawy_progress', JSON.stringify(progress));
  }, [progress]);

  // Pomodoro sessions save
  useEffect(() => {
    localStorage.setItem('thanawy_pomo_sessions', String(pomodoroSessions));
  }, [pomodoroSessions]);

  // Sound save
  useEffect(() => {
    localStorage.setItem('thanawy_sound', String(soundEnabled));
  }, [soundEnabled]);

  // User Profile save
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('thanawy_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('thanawy_current_user');
    }
  }, [currentUser]);

  // Listen to Firebase Auth state live
  useEffect(() => {
    const unsubscribe = onUserAuthStateChanged((firebaseProfile) => {
      if (firebaseProfile) {
        setCurrentUser(firebaseProfile);
        if (firebaseProfile.name) {
          localStorage.setItem('thanawy_custom_student_name', firebaseProfile.name);
        }
        if (firebaseProfile.track && CURRICULUM_DATA[firebaseProfile.track]) {
          setTrack(firebaseProfile.track);
          localStorage.setItem('thanawy_track', firebaseProfile.track);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.name) {
      localStorage.setItem('thanawy_custom_student_name', user.name);
    }
    if (user.track && CURRICULUM_DATA[user.track]) {
      setTrack(user.track);
      localStorage.setItem('thanawy_track', user.track);
    }
  };

  const handleLogout = async () => {
    if (confirm('هل ترغب في تسجيل الخروج من حسابك؟')) {
      await logOutUser();
      setCurrentUser(null);
    }
  };

  const handleSelectDreamCollege = (collegeId: string, updatedName?: string, updatedTargetScore?: string) => {
    setDreamCollegeId(collegeId);
    localStorage.setItem('thanawy_dream_college', collegeId);

    const theme = DREAM_COLLEGES_DATA[collegeId] || DREAM_COLLEGES_DATA.medicine;
    if (currentUser) {
      const updated: UserProfile = {
        ...currentUser,
        dreamCollegeId: collegeId,
        targetCollege: theme.nameAr,
        name: updatedName?.trim() || currentUser.name,
        targetScore: updatedTargetScore || currentUser.targetScore,
      };
      setCurrentUser(updated);
    } else if (updatedName?.trim()) {
      const newUser: UserProfile = {
        id: 'local-student',
        name: updatedName.trim(),
        email: 'student@thanawy.plus',
        provider: 'email',
        dreamCollegeId: collegeId,
        targetCollege: theme.nameAr,
        targetScore: updatedTargetScore || '98%',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(newUser);
    }
  };

  const handleSelectUniversity = (uniId: string) => {
    setTargetUniversityId(uniId);
    localStorage.setItem('thanawy_target_university', uniId);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        targetUniversityId: uniId,
      });
    }
  };

  const handleUpdateStudentName = (newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    localStorage.setItem('thanawy_custom_student_name', trimmed);
    const theme = DREAM_COLLEGES_DATA[dreamCollegeId] || DREAM_COLLEGES_DATA.medicine;
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name: trimmed,
      });
    } else {
      const newUser: UserProfile = {
        id: 'local-student',
        name: trimmed,
        email: 'student@thanawy.plus',
        provider: 'email',
        dreamCollegeId,
        targetCollege: theme.nameAr,
        targetScore: '98%',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(newUser);
    }
  };

  // Task actions
  const handleAddTask = (text: string, subject?: string, priority?: 'high' | 'medium' | 'low', dueDate?: string) => {
    const newTask: TaskItem = {
      id: Date.now(),
      text,
      subject,
      priority: priority || 'medium',
      done: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate || new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Lesson actions
  const handleAddLesson = (lessonData: Omit<LessonAppointment, 'id'>) => {
    const newLesson: LessonAppointment = {
      ...lessonData,
      id: `lesson-${Date.now()}`,
    };
    setLessons((prev) => [...prev, newLesson]);
  };

  const handleUpdateLesson = (updatedLesson: LessonAppointment) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === updatedLesson.id ? updatedLesson : l))
    );
  };

  const handleDeleteLesson = (id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  // Chapter progress toggle
  const handleToggleChapter = (subjectName: string, chapterIndex: number) => {
    setProgress((prev) => {
      const current = prev[subjectName] ? [...prev[subjectName]] : [];
      current[chapterIndex] = !current[chapterIndex];
      return { ...prev, [subjectName]: current };
    });
  };

  const handleResetProgress = () => {
    if (confirm('هل أنت متأكد من تصفير كافة درجات التقدم؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setProgress({});
    }
  };

  const handleImportProgress = (importedData: UserProgressData) => {
    setProgress(importedData);
  };

  const handleIncrementPomo = () => {
    setPomodoroSessions((prev) => prev + 1);
  };

  const currentTrackConfig = CURRICULUM_DATA[track] || CURRICULUM_DATA['sci_math'];

  // Counts for sidebar badges
  const pendingTasksCount = tasks.filter((t) => !t.done).length;
  const completedTasksCount = tasks.filter((t) => t.done).length;

  let totalFinishedChapters = 0;
  Object.values(progress).forEach((arr: boolean[] | undefined) => {
    if (Array.isArray(arr)) {
      totalFinishedChapters += arr.filter(Boolean).length;
    }
  });

  return (
    <div id="app-root" data-college={dreamCollegeId} className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-medium transition-colors duration-200 relative">
      {/* College Specific Dynamic Atmospheric Visual Theme System */}
      <CollegeThemeBackground
        collegeId={dreamCollegeId}
        onOpenSelector={() => setIsDreamCollegeModalOpen(true)}
        currentUser={currentUser}
      />

      {/* Top Banner with Countdown */}
      <TopBanner
        targetDate="2027-06-10T09:00:00"
        dreamCollegeId={dreamCollegeId}
        onOpenDreamCollege={() => setIsDreamCollegeModalOpen(true)}
      />

      {/* Offline Status Persistent Banner */}
      {!isOnline && (
        <div
          id="offline-status-banner"
          role="status"
          className="bg-amber-500/15 dark:bg-amber-500/20 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-2.5 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2.5">
              <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
              <span>
                <strong>وضع عدم الاتصال (Offline):</strong> جميع المناهج، بنك الامتحانات، القوانين والمذكرات متاحة بالكامل وتُحفظ تقدماتك محلياً على جهازك دون انقطاع.
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-amber-200/80 dark:bg-amber-900/60 px-2.5 py-0.5 rounded-full text-amber-950 dark:text-amber-100 font-bold shrink-0">
              جاهز بدون إنترنت ⚡
            </span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        dark={dark}
        onToggleDark={() => setDark(!dark)}
        track={track}
        onSelectTrack={(t) => setTrack(t)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenGmail={() => setIsGmailModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        onLogout={handleLogout}
        dreamCollegeId={dreamCollegeId}
        onOpenDreamCollege={() => setIsDreamCollegeModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Body container with Sidebar & Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 w-full min-w-0">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 min-w-0">
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(t) => {
              if (t === 'gmail') {
                setIsGmailModalOpen(true);
              } else {
                setActiveTab(t);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onPrefetchTab={handlePrefetchTab}
            pendingTasksCount={pendingTasksCount}
            completedChaptersCount={totalFinishedChapters}
            pomoSessionsCount={pomodoroSessions}
            lessonsCount={lessons.length}
            currentUser={currentUser}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
          />

          {/* Dynamic Content View with Suspense for instant transition */}
          <main className="flex-1 min-w-0">
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                  <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  <span className="text-xs font-bold text-slate-400">جاري التحميل الفوري...</span>
                </div>
              }
            >
              {activeTab === 'home' && (
                <HomeView
                  currentTrack={currentTrackConfig}
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  progress={progress}
                  onNavigate={(t) => {
                    if (t === 'gmail') {
                      setIsGmailModalOpen(true);
                    } else {
                      setActiveTab(t);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  onPrefetch={handlePrefetchTab}
                  soundEnabled={soundEnabled}
                  currentUser={currentUser}
                  onOpenShare={() => setIsShareModalOpen(true)}
                  onOpenAuth={() => setIsAuthModalOpen(true)}
                  dreamCollegeId={dreamCollegeId}
                  targetUniversityId={targetUniversityId}
                  onOpenDreamCollege={() => setIsDreamCollegeModalOpen(true)}
                  onSelectUniversity={handleSelectUniversity}
                  onUpdateStudentName={handleUpdateStudentName}
                />
              )}

              {activeTab === 'lessons' && (
                <LessonsScheduleView
                  currentTrack={currentTrackConfig}
                  lessons={lessons}
                  onAddLesson={handleAddLesson}
                  onUpdateLesson={handleUpdateLesson}
                  onDeleteLesson={handleDeleteLesson}
                />
              )}

              {activeTab === 'formulas' && (
                <FormulasView
                  currentTrack={currentTrackConfig}
                />
              )}

              {activeTab === 'duaa' && (
                <AthkarDuaaView />
              )}

              {(activeTab === 'wird' || activeTab === 'quran') && (
                <MinshawiQuranView soundEnabled={soundEnabled} />
              )}

              {activeTab === 'curriculum' && (
                <CurriculumView
                  currentTrack={currentTrackConfig}
                  allTracks={CURRICULUM_DATA}
                  onSelectTrack={(t) => setTrack(t)}
                  progress={progress}
                  onToggleChapter={handleToggleChapter}
                />
              )}

              {activeTab === 'books' && (
                <BooksView
                  currentTrack={currentTrackConfig}
                  onSelectTrack={(t) => setTrack(t)}
                />
              )}

              {activeTab === 'exams' && (
                <ExamsView
                  currentTrack={currentTrackConfig}
                  soundEnabled={soundEnabled}
                />
              )}

              {activeTab === 'pomodoro' && (
                <PomodoroView
                  completedSessions={pomodoroSessions}
                  onIncrementSession={handleIncrementPomo}
                  soundEnabled={soundEnabled}
                />
              )}

              {activeTab === 'progress' && (
                <ProgressView
                  currentTrack={currentTrackConfig}
                  progress={progress}
                  pomodoroSessions={pomodoroSessions}
                  completedTasksCount={completedTasksCount}
                  onResetProgress={handleResetProgress}
                  onImportProgress={handleImportProgress}
                />
              )}

              {activeTab === 'dev' && (
                <UnderDevelopmentView />
              )}

              {activeTab === 'iq_test' && (
                <IQTestView userProfile={currentUser} />
              )}
            </Suspense>
          </main>
        </div>
      </div>

      {/* Gmail Inbox Modal for usefmohamed1033@gmail.com */}
      <GmailInboxModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
      />

      {/* Share Achievement Modal */}
      <ShareAchievementModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentTrack={currentTrackConfig}
        progress={progress}
        completedTasksCount={completedTasksCount}
        pomodoroSessions={pomodoroSessions}
        currentUser={currentUser}
      />

      {/* Auth Modal for Google/Gmail & Facebook */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        currentTrack={track}
      />

      {/* Dream College Customizer & Interactive Theme Sanctuary Modal */}
      <DreamCollegeModal
        isOpen={isDreamCollegeModalOpen}
        onClose={() => setIsDreamCollegeModalOpen(false)}
        currentCollegeId={dreamCollegeId}
        targetUniversityId={targetUniversityId}
        onSelectCollege={handleSelectDreamCollege}
        onSelectUniversity={handleSelectUniversity}
        currentTrack={track}
        currentUser={currentUser}
        onUpdateUserTarget={(updated) => {
          if (currentUser) {
            setCurrentUser({ ...currentUser, ...updated });
          }
        }}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        currentUser={currentUser}
        onRefreshData={() => {
          // Trigger re-render or notification if needed
        }}
      />

      {/* Global Persistent Quran Audio Player Bar */}
      <GlobalQuranPlayerBar onOpenQuran={() => setActiveTab('quran')} />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={(t) => {
          setActiveTab(t);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Footer */}
      <Footer onOpenGmail={() => setIsGmailModalOpen(true)} />

      {/* Floating Offline/Online Transition Toast */}
      {offlineToast?.show && (
        <div
          id="connection-toast"
          role="alert"
          className={`fixed bottom-6 left-6 z-50 max-w-sm p-3.5 sm:p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-5 ${
            offlineToast.type === 'online'
              ? 'bg-emerald-950/95 text-emerald-100 border-emerald-500/40 shadow-emerald-950/30'
              : 'bg-amber-950/95 text-amber-100 border-amber-500/40 shadow-amber-950/30'
          }`}
        >
          {offlineToast.type === 'online' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <WifiOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs leading-relaxed text-right">
            <p className="font-bold text-sm">{offlineToast.type === 'online' ? 'تمت استعادة الاتصال 🌐' : 'وضع بدون إنترنت ⚡'}</p>
            <p className="opacity-90 mt-1">{offlineToast.msg}</p>
          </div>
          <button
            onClick={() => setOfflineToast(null)}
            className="text-white/60 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="إغلاق الإشعار"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
