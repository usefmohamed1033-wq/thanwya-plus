import React from 'react';
import {
  Home,
  BookOpenCheck,
  FileText,
  Timer,
  TrendingUp,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  AlertTriangle,
  Heart,
  ShieldCheck,
  FolderLock,
  Brain
} from 'lucide-react';
import { AppState, UserProfile } from '../types';
import { useLanguage } from '../utils/i18n';

interface SidebarProps {
  activeTab: AppState['activeTab'];
  onSelectTab: (tab: AppState['activeTab']) => void;
  onPrefetchTab?: (tab: AppState['activeTab']) => void;
  pendingTasksCount: number;
  completedChaptersCount: number;
  pomoSessionsCount: number;
  currentUser?: UserProfile | null;
  onOpenAdmin?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onPrefetchTab,
  pendingTasksCount,
  completedChaptersCount,
  pomoSessionsCount,
  currentUser,
  onOpenAdmin,
}) => {
  const { lang, t, dir } = useLanguage();
  const isAdmin = currentUser?.email === 'usefmohamed1033@gmail.com' || currentUser?.isAdmin;

  const navItems = [
    {
      id: 'home' as const,
      label: t('nav.home', 'الرئيسية والجدول'),
      shortLabel: t('nav.home_short', 'الرئيسية'),
      description: t('nav.home_desc', 'الجدول الدراسي والمهام اليومية'),
      icon: Home,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined,
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    },
    {
      id: 'curriculum' as const,
      label: t('nav.curriculum', 'المنهج والدروس 2027'),
      shortLabel: t('nav.curriculum_short', 'المنهج'),
      description: t('nav.curriculum_desc', 'خطة المواد ونواتج التعلم وتتبع الفصول'),
      icon: BookOpenCheck,
      badge: completedChaptersCount > 0 ? `${completedChaptersCount} ${lang === 'ar' ? 'فصل' : 'ch'}` : undefined,
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    },
    {
      id: 'exams' as const,
      label: t('nav.exams', 'امتحانات سابقة وتدريبات'),
      shortLabel: t('nav.exams_short', 'الامتحانات'),
      description: t('nav.exams_desc', 'نماذج الوزارة والتدريبات التفاعلية الشاملة'),
      icon: FileText,
      badge: '2022-2025',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    },
    {
      id: 'pomodoro' as const,
      label: t('nav.pomodoro', 'مؤقت التركيز Pomodoro'),
      shortLabel: t('nav.pomodoro_short', 'المؤقت'),
      description: t('nav.pomodoro_desc', 'جلسات المذاكرة وأصوات الطبيعة'),
      icon: Timer,
      badge: pomoSessionsCount > 0 ? `${pomoSessionsCount}` : undefined,
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    },
    {
      id: 'duaa' as const,
      label: t('nav.duaa', 'أدعية وأذكار المذاكرة'),
      shortLabel: t('nav.duaa_short', 'الأدعية والأذكار'),
      description: t('nav.duaa_desc', 'تيسير الفهم وتثبيت الحفظ والمسبحة'),
      icon: Heart,
      badge: undefined,
      badgeColor: '',
    },
    {
      id: 'quran' as const,
      label: 'تلاوات الشيخ المنشاوي والقرآن الكريم',
      shortLabel: 'تلاوات المنشاوي',
      description: 'المصحف المرتل والمجود والورد القرآني بصوت الشيخ المنشاوي',
      icon: BookOpen,
      badge: '🎙️',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    },
    {
      id: 'iq_test' as const,
      label: 'اختبار الذكاء العالمي المعتمد (IQ)',
      shortLabel: 'اختبار الذكاء 🧠',
      description: 'مصفوفات رافن القياسية وسلم منسا العالمي لقياس نسبة الذكاء',
      icon: Brain,
      badge: 'معتمد 🌍',
      badgeColor: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    },
    {
      id: 'progress' as const,
      label: t('nav.progress', 'تتبع التقدم والإحصائيات'),
      shortLabel: t('nav.progress_short', 'الإحصائيات'),
      description: t('nav.progress_desc', 'مستوى الإنجاز والنسخ الاحتياطي'),
      icon: TrendingUp,
      badge: undefined,
      badgeColor: '',
    },
    {
      id: 'dev' as const,
      label: 'تحت التطوير (ملف خاص مشفر)',
      shortLabel: 'تحت التطوير 🔒',
      description: 'قسم التحديثات البرمجية والملفات السرية المحمية',
      icon: FolderLock,
      badge: '🔒 سرّي',
      badgeColor: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800',
    },
  ];

  const ArrowIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <aside id="main-sidebar" className="w-full lg:w-68 shrink-0">
      {/* Mobile Horizontal Navigation bar */}
      <div className="lg:hidden mb-4 overflow-x-auto no-scrollbar pb-1">
        <nav aria-label="أقسام الموقع على الموبايل" className="flex items-center gap-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                onMouseEnter={() => onPrefetchTab?.(item.id)}
                onTouchStart={() => onPrefetchTab?.(item.id)}
                aria-label={`الانتقال إلى تبويب ${item.label}`}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.shortLabel}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Desktop Main Sidebar Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 p-2.5 sm:p-3 sticky top-18 transition-colors hidden lg:block">
        <div className="flex items-center justify-between px-2.5 py-1.5 mb-1">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider font-mono">
            {lang === 'ar' ? 'القائمة الرئيسية' : 'Navigation'}
          </span>
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
            2027
          </span>
        </div>

        <nav id="sidebar-navigation" aria-label="أقسام المنصة الرئيسية" className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                onMouseEnter={() => onPrefetchTab?.(item.id)}
                onTouchStart={() => onPrefetchTab?.(item.id)}
                aria-label={`الانتقال إلى تبويب ${item.label} - ${item.description}`}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-right ltr:text-left transition-colors group cursor-pointer outline-none ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`p-1.5 rounded-md transition-colors shrink-0 ${
                      isActive
                        ? 'text-white dark:text-slate-900'
                        : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 text-right ltr:text-left">
                    <div className="text-xs tracking-tight truncate">
                      {item.label}
                    </div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
                      {item.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 mr-1 ltr:mr-0 ltr:ml-1">
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                          : item.badgeColor || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ArrowIcon
                    className={`w-3 h-3 transition-transform ${
                      isActive
                        ? 'opacity-80'
                        : 'opacity-0 group-hover:opacity-100 text-slate-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Admin Settings Button (Visible only to Admin / usefmohamed1033@gmail.com) */}
        {isAdmin && onOpenAdmin && (
          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800">
            <button
              id="sidebar-admin-settings-btn"
              onClick={onOpenAdmin}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 transition-all font-bold text-xs cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{lang === 'ar' ? 'إعدادات المدير (Admin Settings)' : 'Admin Settings'}</span>
              </div>
              <span className="text-[9px] bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">
                Admin
              </span>
            </button>
          </div>
        )}

        {/* Tip of the Day card */}
        <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-right ltr:text-left">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              {lang === 'ar' ? 'إرشاد دراسي' : 'Study Tip'}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
              99%
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            {lang === 'ar'
              ? 'الاستمرارية اليومية حتى لو 4 ساعات تفوق 12 ساعة متقطعة أسبوعياً. ركز على حل النماذج.'
              : 'Daily consistency always beats irregular cramming. Focus on solving real past exam problems.'}
          </p>
        </div>
      </div>
    </aside>
  );
};


