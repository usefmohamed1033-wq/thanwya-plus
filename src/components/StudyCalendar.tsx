import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  Zap,
  RotateCw,
  FileCheck,
  Coffee,
  Plus,
  CheckCircle2,
  Trash2,
  Flame,
  Check,
  X,
  BookOpen,
  Filter,
  Bell,
  BellRing,
  Clock,
  Settings,
  Sparkles
} from 'lucide-react';
import { StudyCalendarData, StudyDayPlan, StudyDayType, TaskItem, TrackConfig, AiSchedulePlanResult } from '../types';
import { notificationService, NotificationSettings } from '../utils/notificationService';

interface StudyCalendarProps {
  tasks: TaskItem[];
  currentTrack: TrackConfig;
  onAddTask: (text: string, subject?: string, priority?: 'high' | 'medium' | 'low', dueDate?: string) => void;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const WEEKDAYS_SHORT = ['سبت', 'أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];
const WEEKDAYS_FULL = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

const DAY_TYPES: { type: StudyDayType; label: string; icon: React.FC<{ className?: string }>; color: string; badgeBg: string; activeBorder: string }[] = [
  {
    type: 'intensive',
    label: 'مذاكرة مكثفة',
    icon: Zap,
    color: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300',
    activeBorder: 'border-amber-500 ring-2 ring-amber-500/20'
  },
  {
    type: 'revision',
    label: 'مراجعة شاملة',
    icon: RotateCw,
    color: 'text-sky-600 dark:text-sky-400',
    badgeBg: 'bg-sky-100 dark:bg-sky-950/70 border-sky-300 dark:border-sky-700 text-sky-800 dark:text-sky-300',
    activeBorder: 'border-sky-500 ring-2 ring-sky-500/20'
  },
  {
    type: 'exam_prep',
    label: 'حل امتحانات',
    icon: FileCheck,
    color: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/70 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-300',
    activeBorder: 'border-purple-500 ring-2 ring-purple-500/20'
  },
  {
    type: 'rest',
    label: 'يوم راحة',
    icon: Coffee,
    color: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300',
    activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20'
  },
  {
    type: 'normal',
    label: 'يوم عادي',
    icon: CalendarIcon,
    color: 'text-slate-600 dark:text-slate-400',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300',
    activeBorder: 'border-slate-400 ring-2 ring-slate-400/20'
  }
];

export const StudyCalendar: React.FC<StudyCalendarProps> = ({
  tasks,
  currentTrack,
  onAddTask,
  onToggleTask,
  onDeleteTask
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [calendarData, setCalendarData] = useState<StudyCalendarData>(() => {
    try {
      const saved = localStorage.getItem('thanawy_study_calendar');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    
    // Default initial seeded schedule around today
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const afterTomorrow = new Date();
    afterTomorrow.setDate(afterTomorrow.getDate() + 2);
    const afterTomorrowStr = afterTomorrow.toISOString().split('T')[0];

    return {
      [todayStr]: {
        date: todayStr,
        type: 'intensive',
        title: 'يوم حرق مناهج ومسائل',
        note: 'مراجعة الباب الأول فيزياء وحل 30 سؤال',
        targetSubjects: ['الفيزياء', 'اللغة العربية']
      },
      [tomorrowStr]: {
        date: tomorrowStr,
        type: 'revision',
        title: 'مراجعة وتثبيت',
        note: 'مراجعة كلمات الإنجليزي وحل نموذج لغة عربية',
        targetSubjects: ['اللغة الأجنبية الأولى', 'اللغة العربية']
      },
      [afterTomorrowStr]: {
        date: afterTomorrowStr,
        type: 'exam_prep',
        title: 'حل نماذج وزارية',
        note: 'حل نموذج امتحان تجريبي على التابلت',
        targetSubjects: ['الرياضيات البحتة', 'الكيمياء']
      }
    };
  });

  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  const [filterType, setFilterType] = useState<StudyDayType | 'all'>('all');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // New task input state for selected date
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState(currentTrack.subjects[0]?.name || '');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [customNoteInput, setCustomNoteInput] = useState('');
  const [customReminderTime, setCustomReminderTime] = useState('16:00');
  const [isReminderActiveForDay, setIsReminderActiveForDay] = useState(false);

  // Notification Settings Modal state
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    return notificationService.getSettings();
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Study Schedule Planner State
  const [isAiPlanModalOpen, setIsAiPlanModalOpen] = useState(false);
  const [aiPlanQuery, setAiPlanQuery] = useState('');
  const [aiPlanDaysCount, setAiPlanDaysCount] = useState(7);
  const [aiPlanDailyHours, setAiPlanDailyHours] = useState(4);
  const [aiPlanStartDate, setAiPlanStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isGeneratingAiPlan, setIsGeneratingAiPlan] = useState(false);
  const [aiPlanResult, setAiPlanResult] = useState<AiSchedulePlanResult | null>(null);
  const [autoApplyPlan, setAutoApplyPlan] = useState(true);

  // Auto-save calendar to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('thanawy_study_calendar', JSON.stringify(calendarData));
    } catch (e) {}
  }, [calendarData]);

  // Subscribe to notification settings
  useEffect(() => {
    return notificationService.subscribe((settings) => {
      setNotificationSettings(settings);
    });
  }, []);

  // Sync custom note & reminder when selected date changes
  useEffect(() => {
    const plan = calendarData[selectedDateStr];
    setCustomNoteInput(plan?.note || '');
    setCustomReminderTime(plan?.reminderTime || notificationSettings.dailyStudyTime || '16:00');
    setIsReminderActiveForDay(plan?.notifyEnabled ?? true);
  }, [selectedDateStr, calendarData, notificationSettings]);

  // Background check for scheduled study session notification
  useEffect(() => {
    const checkSchedule = () => {
      const settings = notificationService.getSettings();
      if (!settings.enabled && Notification.permission !== 'granted') return;

      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMins}`;
      const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const todayPlan = calendarData[todayYMD];
      const targetReminderTime = todayPlan?.reminderTime || settings.dailyStudyTime || '16:00';
      const lastTriggeredKey = `thanawy_notif_triggered_${todayYMD}_${targetReminderTime}`;

      if (currentTimeStr === targetReminderTime && !localStorage.getItem(lastTriggeredKey)) {
        localStorage.setItem(lastTriggeredKey, 'true');
        
        let title = '📚 حان موعد جلسة المذاكرة المقررة في تقويمك!';
        let body = 'استعن بالله وابدأ جلستك الآن. تذكر: خطوة صغيرة يومياً تصنع التفوق في 2027.';

        if (todayPlan) {
          const typeLabel = DAY_TYPES.find((t) => t.type === todayPlan.type)?.label || 'جلسة مذاكرة';
          title = `⚡ موعد ${typeLabel} - ${todayPlan.title || 'ثانوي بلس'}`;
          if (todayPlan.targetSubjects && todayPlan.targetSubjects.length > 0) {
            body = `المواد المستهدفة اليوم: ${todayPlan.targetSubjects.join(' • ')}. ${todayPlan.note || ''}`;
          } else if (todayPlan.note) {
            body = todayPlan.note;
          }
        }

        notificationService.sendNotification({
          title,
          body,
          type: 'study',
          tag: `study-session-${todayYMD}`,
        });
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkSchedule, 30000);
    checkSchedule(); // immediate check
    return () => clearInterval(interval);
  }, [calendarData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleDayReminder = (enabled: boolean, timeStr: string) => {
    setIsReminderActiveForDay(enabled);
    setCustomReminderTime(timeStr);
    setCalendarData((prev) => {
      const existing = prev[selectedDateStr] || { date: selectedDateStr, type: 'normal' };
      return {
        ...prev,
        [selectedDateStr]: {
          ...existing,
          reminderTime: timeStr,
          notifyEnabled: enabled,
        },
      };
    });
    showToast(enabled ? `🔔 تم تفعيل التنبيه ليوم ${selectedDateStr} الساعة ${timeStr}` : 'تم إلغاء التنبيه لهذا اليوم');
  };

  const handleTestNotification = async () => {
    if (Notification.permission !== 'granted') {
      const perm = await notificationService.requestPermission();
      if (perm !== 'granted') {
        showToast('⚠️ يرجى السماح بالإشعارات من إعدادات المتصفح أولاً.');
        return;
      }
    }

    notificationService.sendNotification({
      title: '🔔 إشعار تجريبي: حان وقت المذاكرة!',
      body: 'جلسة المذاكرة المقررة في تقويمك تبدأ الآن. جهز كتبك وركز بهمة عالية ✨',
      type: 'study',
      tag: 'test-notification',
    });
    showToast('🎉 تم إرسال الإشعار التجريبي بنجاح!');
  };

  const handleRequestPermission = async () => {
    const perm = await notificationService.requestPermission();
    if (perm === 'granted') {
      notificationService.saveSettings({ enabled: true });
      showToast('🔔 تم تفعيل تنبيهات المتصفح بنجاح!');
    } else {
      showToast('⚠️ تم رفض الإذن أو حظره في المتصفح.');
    }
  };

  const applyPlanDataToCalendar = (plan: AiSchedulePlanResult) => {
    if (!plan || !plan.days || plan.days.length === 0) return 0;

    const updatedCalendar = { ...calendarData };
    let addedTasksCount = 0;

    plan.days.forEach((dayPlan) => {
      updatedCalendar[dayPlan.date] = {
        date: dayPlan.date,
        type: dayPlan.type,
        title: dayPlan.title,
        note: dayPlan.note,
        targetSubjects: dayPlan.targetSubjects,
        reminderTime: '16:00',
        notifyEnabled: true,
      };

      if (dayPlan.tasks && Array.isArray(dayPlan.tasks)) {
        dayPlan.tasks.forEach((t) => {
          onAddTask(t.text, t.subject, t.priority, dayPlan.date);
          addedTasksCount++;
        });
      }
    });

    setCalendarData(updatedCalendar);
    return addedTasksCount;
  };

  const handleGenerateAiPlan = async () => {
    if (!aiPlanQuery.trim()) {
      showToast('⚠️ يرجى كتابة ما تريد مذاكرته وتقسيمه');
      return;
    }

    setIsGeneratingAiPlan(true);
    try {
      const res = await fetch('/api/gemini/plan-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: aiPlanQuery.trim(),
          daysCount: aiPlanDaysCount,
          startDate: aiPlanStartDate,
          dailyHours: aiPlanDailyHours,
          track: currentTrack.titleArabic,
          selectedSubjects: currentTrack.subjects.map((s) => s.name)
        })
      });

      if (res.ok) {
        const data: AiSchedulePlanResult = await res.json();
        setAiPlanResult(data);

        // Automatically inject and apply into calendar schedule and tasks!
        if (autoApplyPlan) {
          const addedCount = applyPlanDataToCalendar(data);
          showToast(`✨ تم توليد الخطة وحفظها مباشرة في جدولك وإضافة ${addedCount} مهمة مذاكرة! 📅`);
        } else {
          showToast('✨ تم تقسيم الجدول بالذكاء الاصطناعي! يمكنك معاينته واعتماده.');
        }
      } else {
        throw new Error('Server response not ok');
      }
    } catch (err) {
      console.error('Error generating AI study schedule:', err);
      showToast('⚠️ حدث خطأ أثناء التوليد، يرجى المحاولة ثانية.');
    } finally {
      setIsGeneratingAiPlan(false);
    }
  };

  const handleApplyAiPlan = () => {
    if (!aiPlanResult) return;
    const addedTasksCount = applyPlanDataToCalendar(aiPlanResult);
    setIsAiPlanModalOpen(false);
    showToast(`🎉 تم اعتماد وتطبيق الخطة بنجاح في جدولك وإضافة ${addedTasksCount} مهمة مذاكرة!`);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper to format date string as YYYY-MM-DD
  const formatYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayStr = useMemo(() => formatYMD(new Date()), []);

  // Compute days in month and padding
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // In Arabic week: Saturday = 0, Sunday = 1, ... Friday = 6
    // JS getDay(): Sunday = 0, Monday = 1, ... Saturday = 6
    const jsDay = firstDayOfMonth.getDay();
    const firstDayIndex = (jsDay + 1) % 7; // Convert so Saturday is 0

    const days: { dateStr: string; dayNumber: number; isCurrentMonth: boolean; dateObj: Date }[] = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        dateStr: formatYMD(prevDate),
        dayNumber: prevMonthLastDay - i,
        isCurrentMonth: false,
        dateObj: prevDate
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(year, month, day);
      days.push({
        dateStr: formatYMD(thisDate),
        dayNumber: day,
        isCurrentMonth: true,
        dateObj: thisDate
      });
    }

    // Next month padding to fill a complete 35 or 42 grid
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remaining = totalCells - days.length;
    for (let day = 1; day <= remaining; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        dateStr: formatYMD(nextDate),
        dayNumber: day,
        isCurrentMonth: false,
        dateObj: nextDate
      });
    }

    return days;
  }, [year, month]);

  // Tasks grouped by date (either by dueDate or by createdAt date)
  const tasksByDate = useMemo(() => {
    const map: { [dateStr: string]: TaskItem[] } = {};
    tasks.forEach((task) => {
      // Priority to dueDate if set, otherwise createdAt prefix YYYY-MM-DD
      const dateKey = task.dueDate || (task.createdAt ? task.createdAt.split('T')[0] : '');
      if (dateKey) {
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push(task);
      }
    });
    return map;
  }, [tasks]);

  // Stats for the current active month
  const monthStats = useMemo(() => {
    let intensiveCount = 0;
    let revisionCount = 0;
    let examPrepCount = 0;
    let restCount = 0;

    (Object.entries(calendarData) as [string, StudyDayPlan][]).forEach(([dateStr, plan]) => {
      if (plan && dateStr.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) {
        if (plan.type === 'intensive') intensiveCount++;
        else if (plan.type === 'revision') revisionCount++;
        else if (plan.type === 'exam_prep') examPrepCount++;
        else if (plan.type === 'rest') restCount++;
      }
    });

    return { intensiveCount, revisionCount, examPrepCount, restCount };
  }, [calendarData, year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(formatYMD(now));
  };

  const handleSelectDayType = (type: StudyDayType) => {
    setCalendarData((prev) => {
      const existing = prev[selectedDateStr] || { date: selectedDateStr, type: 'normal' };
      if (type === 'normal') {
        const copy = { ...prev };
        delete copy[selectedDateStr];
        return copy;
      }
      return {
        ...prev,
        [selectedDateStr]: {
          ...existing,
          date: selectedDateStr,
          type
        }
      };
    });
  };

  const handleSaveDayNote = () => {
    setCalendarData((prev) => {
      const existing = prev[selectedDateStr] || { date: selectedDateStr, type: 'normal' };
      return {
        ...prev,
        [selectedDateStr]: {
          ...existing,
          note: customNoteInput.trim()
        }
      };
    });
  };

  const handleToggleTargetSubject = (subjName: string) => {
    setCalendarData((prev) => {
      const existing = prev[selectedDateStr] || { date: selectedDateStr, type: 'normal' };
      const currentSubjs = existing.targetSubjects || [];
      const updated = currentSubjs.includes(subjName)
        ? currentSubjs.filter((s) => s !== subjName)
        : [...currentSubjs, subjName];

      return {
        ...prev,
        [selectedDateStr]: {
          ...existing,
          targetSubjects: updated
        }
      };
    });
  };

  const handleCreateTaskForSelectedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    onAddTask(newTaskText.trim(), newTaskSubject, newTaskPriority, selectedDateStr);
    setNewTaskText('');
  };

  const selectedDayPlan = calendarData[selectedDateStr];
  const selectedDayTasks = tasksByDate[selectedDateStr] || [];

  return (
    <div id="study-calendar-section" className="bg-white dark:bg-slate-900 rounded-3xl p-3.5 sm:p-7 md:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-5 sm:space-y-6">
      
      {/* Calendar Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 rounded-xl">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-xl text-slate-900 dark:text-white">
                تقويم المذاكرة وخطة الشهر
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                حدد أيام المذاكرة المكثفة والمراجعة واربطها بمهامك الدراسية
              </p>
            </div>
          </div>
        </div>

        {/* Month Navigation, Today Button & Notifications Settings */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          
          {/* AI Study Plan Divider Trigger */}
          <button
            id="btn-ai-study-plan-trigger"
            onClick={() => setIsAiPlanModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-[11px] sm:text-xs font-black shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
            title="تقسيم المذاكرة والمناهج بالذكاء الاصطناعي"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-pulse" />
            <span>المقسم الذكي للجدول (AI)</span>
          </button>

          {/* Notifications Settings Trigger */}
          <button
            id="btn-calendar-notifications-trigger"
            onClick={() => setIsNotificationModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all border ${
              notificationSettings.enabled || Notification.permission === 'granted'
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 animate-pulse'
            }`}
            title="إعدادات تنبيهات المذاكرة"
          >
            {notificationSettings.enabled ? (
              <BellRing className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
            )}
            <span className="hidden sm:inline">
              {notificationSettings.enabled ? 'تنبيهات المذاكرة (مفعلة)' : 'تفعيل إشعارات المذاكرة 🔔'}
            </span>
            <span className="sm:hidden">
              {notificationSettings.enabled ? 'التنبيهات' : 'تفعيل الإشعارات'}
            </span>
          </button>

          <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 sm:p-1 shadow-xs">
            <button
              onClick={handleNextMonth}
              aria-label="الشهر القادم"
              className="p-1 sm:p-1.5 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
              title="الشهر القادم"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <span className="px-2 sm:px-3 py-1 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 min-w-[100px] sm:min-w-[130px] text-center">
              {ARABIC_MONTHS[month]} {year}
            </span>

            <button
              onClick={handlePrevMonth}
              aria-label="الشهر السابق"
              className="p-1 sm:p-1.5 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
              title="الشهر السابق"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          <button
            onClick={handleGoToToday}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            اليوم 📍
          </button>
        </div>
      </div>

      {/* Monthly Summary Statistics Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-black text-amber-700 dark:text-amber-300">
              {monthStats.intensiveCount}
            </div>
            <div className="text-[11px] text-amber-900/70 dark:text-amber-400/80 font-semibold">
              أيام مذاكرة مكثفة
            </div>
          </div>
        </div>

        <div className="p-3 bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/50 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-sky-500/20 text-sky-600 dark:text-sky-400 rounded-lg">
            <RotateCw className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-black text-sky-700 dark:text-sky-300">
              {monthStats.revisionCount}
            </div>
            <div className="text-[11px] text-sky-900/70 dark:text-sky-400/80 font-semibold">
              أيام مراجعة شاملة
            </div>
          </div>
        </div>

        <div className="p-3 bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/50 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-black text-purple-700 dark:text-purple-300">
              {monthStats.examPrepCount}
            </div>
            <div className="text-[11px] text-purple-900/70 dark:text-purple-400/80 font-semibold">
              أيام حل نماذج وامتحانات
            </div>
          </div>
        </div>

        <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Coffee className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-300">
              {monthStats.restCount}
            </div>
            <div className="text-[11px] text-emerald-900/70 dark:text-emerald-400/80 font-semibold">
              أيام راحة واستعادة طاقة
            </div>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs">
        <span className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 ml-2">
          <Filter className="w-3.5 h-3.5" />
          <span>تصفية العرض:</span>
        </span>

        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1 rounded-lg font-bold transition-all ${
            filterType === 'all'
              ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          الكل
        </button>

        {DAY_TYPES.filter((t) => t.type !== 'normal').map((t) => (
          <button
            key={t.type}
            onClick={() => setFilterType(t.type)}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              filterType === t.type
                ? t.badgeBg + ' ring-2 ring-emerald-500/30 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <t.icon className="w-3 h-3" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main 7-Column Calendar View */}
        <div className="lg:col-span-8 space-y-2">
          
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] sm:text-xs text-slate-700 dark:text-slate-300 pb-1">
            {WEEKDAYS_SHORT.map((dShort, idx) => (
              <div key={idx} className="py-1">
                <span className="sm:hidden">{dShort}</span>
                <span className="hidden sm:inline">{WEEKDAYS_FULL[idx]}</span>
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {calendarDays.map((dayItem) => {
              const { dateStr, dayNumber, isCurrentMonth } = dayItem;
              const plan = calendarData[dateStr];
              const dayTasks = tasksByDate[dateStr] || [];
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDateStr;

              // If filter applied and does not match, reduce opacity
              const isDimmed = filterType !== 'all' && plan?.type !== filterType;

              let typeConfig = DAY_TYPES.find((t) => t.type === plan?.type);

              return (
                <div
                  key={dateStr}
                  onClick={() => {
                    setSelectedDateStr(dateStr);
                    setIsDetailModalOpen(true);
                  }}
                  className={`relative min-h-[58px] sm:min-h-[92px] p-1 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between select-none min-w-0 overflow-hidden ${
                    isSelected
                      ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-md'
                      : isToday
                      ? 'border-emerald-400 dark:border-emerald-600 bg-white dark:bg-slate-800/90 shadow-sm'
                      : isCurrentMonth
                      ? 'border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-slate-900/40 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 text-slate-300 dark:text-slate-600 opacity-60'
                  } ${isDimmed ? 'opacity-30' : ''}`}
                >
                  {/* Day Header (Number + Badges) */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black inline-flex items-center justify-center w-6 h-6 rounded-lg ${
                        isToday
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isCurrentMonth
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {dayNumber}
                    </span>

                    {/* Day type icon badge */}
                    {typeConfig && typeConfig.type !== 'normal' && (
                      <span
                        className={`p-1 rounded-md text-[10px] ${typeConfig.badgeBg}`}
                        title={typeConfig.label}
                      >
                        <typeConfig.icon className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Day Plan & Tasks Indicator */}
                  <div className="mt-1 space-y-1">
                    {plan?.type && plan.type !== 'normal' && (
                      <div className="truncate text-[9px] font-bold text-slate-700 dark:text-slate-300">
                        {plan.title || typeConfig?.label}
                      </div>
                    )}

                    {/* Tasks count indicator */}
                    {dayTasks.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 ${
                            dayTasks.every((t) => t.done)
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>{dayTasks.filter((t) => t.done).length}/{dayTasks.length} مهام</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspector & Interactive Planner */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-700/80 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            
            {/* Header of selected day */}
            <div className="border-b border-slate-200 dark:border-slate-700/70 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  تفاصيل الخطة لليوم
                </span>
                <span className="text-[11px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md font-mono">
                  {selectedDateStr}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('ar-EG', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h4>
            </div>

            {/* Change Study Mode Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                اختر نمط المذاكرة لهذا اليوم:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DAY_TYPES.map((t) => {
                  const isCurrent = selectedDayPlan?.type === t.type || (!selectedDayPlan && t.type === 'normal');
                  return (
                    <button
                      key={t.type}
                      onClick={() => handleSelectDayType(t.type)}
                      className={`p-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                        isCurrent
                          ? t.badgeBg + ' ' + t.activeBorder + ' shadow-sm'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-500'
                      }`}
                    >
                      <t.icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{t.label}</span>
                      {isCurrent && <Check className="w-3 h-3 mr-auto text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Subjects for this Day */}
            <div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>المواد المستهدفة لهذا اليوم:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentTrack.subjects.map((subj) => {
                  const isSelected = selectedDayPlan?.targetSubjects?.includes(subj.name);
                  return (
                    <button
                      key={subj.id}
                      onClick={() => handleToggleTargetSubject(subj.name)}
                      aria-label={`تحديد مادة ${subj.name} لهذا اليوم`}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                      }`}
                    >
                      {subj.name} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Notes / Goal for this Day */}
            <div>
              <label htmlFor="calendar-custom-note-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                ملاحظات أو أهداف خاصة باليوم:
              </label>
              <div className="flex gap-1.5">
                <input
                  id="calendar-custom-note-input"
                  name="dayCustomNote"
                  type="text"
                  aria-label="ملاحظات أو أهداف خاصة باليوم"
                  value={customNoteInput}
                  onChange={(e) => setCustomNoteInput(e.target.value)}
                  onBlur={handleSaveDayNote}
                  placeholder="مثال: حل 30 سؤال كيمياء + مراجعة الإحصاء..."
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  onClick={handleSaveDayNote}
                  aria-label="حفظ ملاحظة اليوم"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  حفظ
                </button>
              </div>
            </div>

            {/* Day Specific Browser Reminder Section */}
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="calendar-day-reminder-check" className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
                  <Bell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>تنبيه المتصفح لبدء جلسة هذا اليوم:</span>
                </label>
                <input
                  id="calendar-day-reminder-check"
                  name="dayReminderCheck"
                  type="checkbox"
                  aria-label="تنبيه المتصفح لبدء جلسة هذا اليوم"
                  checked={isReminderActiveForDay}
                  onChange={(e) => handleToggleDayReminder(e.target.checked, customReminderTime)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
              </div>

              {isReminderActiveForDay && (
                <div className="flex items-center gap-2 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  <label htmlFor="calendar-day-reminder-time" className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">وقت التنبيه:</label>
                  <input
                    id="calendar-day-reminder-time"
                    name="dayReminderTime"
                    type="time"
                    aria-label="وقت التنبيه اليومي"
                    value={customReminderTime}
                    onChange={(e) => handleToggleDayReminder(true, e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold mr-auto">
                    تنبيه نشط 🔔
                  </span>
                </div>
              )}
            </div>

            {/* Tasks linked to this day */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/70">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>المهام المجدولة في هذا اليوم ({selectedDayTasks.length})</span>
                </div>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {selectedDayTasks.length === 0 ? (
                  <div className="text-center py-4 text-slate-600 dark:text-slate-400 text-[11px] bg-white/60 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 font-medium">
                    لا توجد مهام مسجلة لهذا التاريخ. أضف مهمة أدناه!
                  </div>
                ) : (
                  selectedDayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-start justify-between p-2.5 rounded-xl border text-xs ${
                        task.done
                          ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-2 min-w-0 flex-1">
                        <button
                          onClick={() => onToggleTask(task.id)}
                          aria-label={task.done ? 'تحديد المهمة كغير مكتملة' : 'تحديد المهمة كمكتملة'}
                          className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                            task.done
                              ? 'bg-emerald-600 text-white'
                              : 'border border-slate-400 dark:border-slate-500 hover:border-emerald-500'
                          }`}
                        >
                          {task.done && <Check className="w-3 h-3" />}
                        </button>
                        <span className={`font-medium break-words leading-relaxed whitespace-pre-wrap flex-1 ${task.done ? 'line-through text-slate-400' : ''}`}>
                          {task.text}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 mr-2">
                        {task.subject && (
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-1.5 py-0.5 rounded">
                            {task.subject}
                          </span>
                        )}
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          aria-label="حذف المهمة"
                          className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 p-0.5"
                          title="حذف"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Add Task for Selected Date Form */}
            <form onSubmit={handleCreateTaskForSelectedDate} className="pt-2">
              <label htmlFor="calendar-new-task-text" className="sr-only">
                إضافة مهمة لهذا اليوم
              </label>
              <div className="flex gap-1.5 mb-1.5">
                <input
                  id="calendar-new-task-text"
                  name="newTaskText"
                  type="text"
                  aria-label="إضافة مهمة لهذا اليوم"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="إضافة مهمة لهذا اليوم (مثل: حل فصل 1)..."
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  aria-label="إضافة المهمة لهذا التاريخ"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold transition-colors shrink-0"
                  title="إضافة للمهام"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="calendar-task-subject-select" className="sr-only">
                  المادة الدراسية للمهمة
                </label>
                <select
                  id="calendar-task-subject-select"
                  name="taskSubject"
                  aria-label="اختيار مادة المهمة"
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  {currentTrack.subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <label htmlFor="calendar-task-priority-select" className="sr-only">
                  أولوية المهمة
                </label>
                <select
                  id="calendar-task-priority-select"
                  name="taskPriority"
                  aria-label="اختيار أولوية المهمة"
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="high">أولوية قصوى ⚡</option>
                  <option value="medium">أولوية متوسطة</option>
                  <option value="low">أولوية عادية</option>
                </select>
              </div>
            </form>

          </div>
        </div>

      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Notification Settings Modal */}
      {isNotificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-2xl">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    إعدادات تنبيهات المذاكرة (Browser Notifications)
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    تذكير ذكي ببدء جلسات المذاكرة والورد القرآني
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNotificationModalOpen(false)}
                aria-label="إغلاق نافذة إعدادات الإشعارات"
                className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Permission Status Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>حالة إذن المتصفح:</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold ${
                      Notification.permission === 'granted'
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                        : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                    }`}
                  >
                    {Notification.permission === 'granted' ? 'مسموح به ✓' : 'غير مفعل حالياً ⚠️'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  تصلك الإشعارات حتى إذا كنت تتصفح تبويب آخر أو أثناء التركيز.
                </p>
              </div>

              {Notification.permission !== 'granted' && (
                <button
                  onClick={handleRequestPermission}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs"
                >
                  منح الإذن الآن
                </button>
              )}
            </div>

            {/* Notification Options */}
            <div className="space-y-4">
              
              {/* Daily study session time */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <label htmlFor="settings-daily-study-time" className="text-xs font-bold text-slate-900 dark:text-slate-100 block cursor-pointer">
                    موعد التذكير اليومي بالمذاكرة
                  </label>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    يصلك تنبيه يومي قبل بدء وقت جلسة المذاكرة المقررة
                  </div>
                </div>
                <input
                  id="settings-daily-study-time"
                  name="dailyStudyTime"
                  type="time"
                  aria-label="موعد التذكير اليومي بالمذاكرة"
                  value={notificationSettings.dailyStudyTime}
                  onChange={(e) => {
                    notificationService.saveSettings({ dailyStudyTime: e.target.value });
                  }}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              {/* Study calendar alerts toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label htmlFor="settings-calendar-session-check" className="text-xs font-bold text-slate-900 dark:text-slate-100 block cursor-pointer">
                    تنبيهات جدول التقويم
                  </label>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    إرسال إشعار عند حلول موعد أيام المذاكرة المكثفة والمراجعة
                  </div>
                </div>
                <input
                  id="settings-calendar-session-check"
                  name="calendarSessionReminder"
                  type="checkbox"
                  aria-label="تفعيل تنبيهات جدول التقويم"
                  checked={notificationSettings.calendarSessionReminder}
                  onChange={(e) => {
                    notificationService.saveSettings({ calendarSessionReminder: e.target.checked });
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Quran Wird Reminder toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label htmlFor="settings-quran-wird-check" className="text-xs font-bold text-slate-900 dark:text-slate-100 block cursor-pointer">
                    تذكير الورد القرآني اليومي
                  </label>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    تذكير بقراءة صفحة القرآن اليومية قبل أو بعد المذاكرة
                  </div>
                </div>
                <input
                  id="settings-quran-wird-check"
                  name="quranWirdReminder"
                  type="checkbox"
                  aria-label="تفعيل تذكير الورد القرآني اليومي"
                  checked={notificationSettings.quranWirdReminder}
                  onChange={(e) => {
                    notificationService.saveSettings({ quranWirdReminder: e.target.checked });
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Sound alert chime */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label htmlFor="settings-sound-alert-check" className="text-xs font-bold text-slate-900 dark:text-slate-100 block cursor-pointer">
                    نغمة التنبيه الصوتية
                  </label>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    تشغيل نغمة هادئة عند وصول التنبيه
                  </div>
                </div>
                <input
                  id="settings-sound-alert-check"
                  name="soundAlert"
                  type="checkbox"
                  aria-label="تفعيل نغمة التنبيه الصوتية"
                  checked={notificationSettings.soundAlert}
                  onChange={(e) => {
                    notificationService.saveSettings({ soundAlert: e.target.checked });
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
              <button
                id="btn-test-notification-alert"
                onClick={handleTestNotification}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>إرسال إشعار تجريبي الآن</span>
              </button>

              <button
                onClick={() => setIsNotificationModalOpen(false)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                حفظ وإغلاق
              </button>
            </div>

          </div>
        </div>
      )}

      {/* AI Study Plan Generator Modal */}
      {isAiPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white rounded-2xl shadow-md shadow-emerald-500/20">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                    مقسم جدول المذاكرة بالذكاء الاصطناعي
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    اكتب ما عليك من أبواب وفصول، وسيقوم الذكاء الاصطناعي بتقسيمها يومياً بذكاء
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiPlanModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input & Configurations */}
            <div className="space-y-4">
              
              {/* Natural Language Prompt Area */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  ما الذي ترغب في مذاكرته أو إنجازه؟ (باللغة العامية أو الفصحى) ✍️
                </label>
                <textarea
                  rows={3}
                  value={aiPlanQuery}
                  onChange={(e) => setAiPlanQuery(e.target.value)}
                  placeholder="مثال: عليا الباب الأول والتاني فيزياء و3 وحدات إنجليزي وفصلين كيمياء ونحو، وعايز أخلصهم في 10 أيام مع يوم راحة وحل امتحانات..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              {/* Quick Template Prompts */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400">نماذج مقترحة سريعة:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAiPlanQuery('خطة أسبوعية مكثفة لإنهاء بابين في الفيزياء والكيمياء وحل بنك أسئلة')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors"
                  >
                    ⚡ خطة أسبوعية للفيزياء والكيمياء
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPlanQuery('خطة مراجعة شاملة لجميع مواد الشعبة على مدار 14 يوماً مع يوم راحة أسبوعي')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors"
                  >
                    🎯 خطة 14 يوماً مراجعة عامة
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPlanQuery('خطة طوارئ 5 أيام قبل امتحان الشهر مع حل نماذج امتحانات سابقة')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors"
                  >
                    🔥 خطة طوارئ 5 أيام قبل الامتحان
                  </button>
                </div>
              </div>

              {/* Duration, Daily Hours & Start Date Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    عدد أيام الجدول:
                  </label>
                  <select
                    value={aiPlanDaysCount}
                    onChange={(e) => setAiPlanDaysCount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={5}>5 أيام</option>
                    <option value={7}>7 أيام (أسبوع)</option>
                    <option value={10}>10 أيام</option>
                    <option value={14}>14 يوماً (أسبوعين)</option>
                    <option value={21}>21 يوماً (3 أسابيع)</option>
                    <option value={30}>30 يوماً (شهر كامل)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ساعات المذاكرة يومياً:
                  </label>
                  <select
                    value={aiPlanDailyHours}
                    onChange={(e) => setAiPlanDailyHours(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={2}>ساعتان يومياً</option>
                    <option value={4}>4 ساعات يومياً</option>
                    <option value={6}>6 ساعات يومياً</option>
                    <option value={8}>8 ساعات يومياً (مكثف)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تاريخ البداية:
                  </label>
                  <input
                    type="date"
                    value={aiPlanStartDate}
                    onChange={(e) => setAiPlanStartDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Auto Apply Option */}
              <div className="flex items-center justify-between p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>إدراج الخطة مباشرة في الجدول والمهام بعد التوليد</span>
                  </div>
                  <div className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                    يقوم الذكاء الاصطناعي بوضع الأيام والمهام فوراً في التقويم
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoApplyPlan}
                    onChange={(e) => setAutoApplyPlan(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Generate Action Button */}
              <button
                id="btn-execute-ai-plan-generator"
                onClick={handleGenerateAiPlan}
                disabled={isGeneratingAiPlan}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGeneratingAiPlan ? (
                  <>
                    <RotateCw className="w-5 h-5 animate-spin" />
                    <span>جارٍ تحليل المنهج وتوزيع الخطة بالذكاء الاصطناعي...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
                    <span>توليد وتقسيم الخطة بالذكاء الاصطناعي الآن</span>
                  </>
                )}
              </button>

            </div>

            {/* Generated Plan Review Section */}
            {aiPlanResult && (
              <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-700 animate-fadeIn">
                <div className="bg-emerald-50 dark:bg-emerald-950/60 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm sm:text-base text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>{aiPlanResult.planTitle}</span>
                    </h4>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                      {aiPlanResult.totalDays} أيام
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed font-medium">
                    {aiPlanResult.summary}
                  </p>
                </div>

                {/* Day-by-Day Preview List */}
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {aiPlanResult.days.map((day, idx) => (
                    <div
                      key={day.date + idx}
                      className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900 dark:text-white">
                          {day.dayName} ({day.date})
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          day.type === 'rest'
                            ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300'
                            : day.type === 'exam_prep'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                            : day.type === 'revision'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        }`}>
                          {day.title}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">
                        {day.note}
                      </p>
                      {day.tasks && day.tasks.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {day.tasks.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                            >
                              • {t.text}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Apply Button */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAiPlanModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-300"
                  >
                    إلغاء
                  </button>

                  <button
                    id="btn-apply-ai-plan-to-calendar"
                    onClick={handleApplyAiPlan}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>تطبيق واعتماد الخطة في التقويم والمهام فوراً 🚀</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
