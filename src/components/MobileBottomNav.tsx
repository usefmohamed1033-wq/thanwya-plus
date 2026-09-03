import React from 'react';
import {
  Home,
  BookOpenCheck,
  FileText,
  GraduationCap,
  Timer,
  Heart,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { AppState } from '../types';
import { useLanguage } from '../utils/i18n';

interface MobileBottomNavProps {
  activeTab: AppState['activeTab'];
  onSelectTab: (tab: AppState['activeTab']) => void;
  pendingTasksCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  pendingTasksCount,
}) => {
  const { lang, t } = useLanguage();

  const navItems = [
    {
      id: 'home' as const,
      label: lang === 'ar' ? 'الرئيسية' : 'Home',
      icon: Home,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined,
    },
    {
      id: 'curriculum' as const,
      label: lang === 'ar' ? 'المنهج' : 'Curriculum',
      icon: BookOpenCheck,
    },
    {
      id: 'exams' as const,
      label: lang === 'ar' ? 'الامتحانات' : 'Exams',
      icon: FileText,
      badge: lang === 'ar' ? 'جديد' : 'New',
    },
    {
      id: 'pomodoro' as const,
      label: lang === 'ar' ? 'التركيز' : 'Focus',
      icon: Timer,
    },
    {
      id: 'duaa' as const,
      label: lang === 'ar' ? 'الأدعية' : 'Duaa',
      icon: Heart,
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 shadow-lg safe-area-bottom">
      <nav aria-label="شريط التنقل السفلي للهاتف" className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer select-none active:scale-90 ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
              }`}
            >
              {/* Active Pill Glow */}
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-fadeIn" />
              )}
              
              <div className="relative p-1">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 text-[9px] font-mono font-bold bg-emerald-500 text-white px-1 py-0.2 rounded-full shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight truncate mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
