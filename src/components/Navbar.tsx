import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Share2,
  LogIn,
  User,
  LogOut,
  ChevronDown,
  Languages,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { TrackType, UserProfile } from '../types';
import { DREAM_COLLEGES_DATA } from '../data/collegeThemes';
import { useLanguage } from '../utils/i18n';
import { AppLogo } from './AppLogo';

interface NavbarProps {
  dark: boolean;
  onToggleDark: () => void;
  track: TrackType;
  onSelectTrack: (track: TrackType) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenGmail: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenShare: () => void;
  onLogout: () => void;
  dreamCollegeId?: string;
  onOpenDreamCollege?: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  dark,
  onToggleDark,
  track,
  onSelectTrack,
  soundEnabled,
  onToggleSound,
  onOpenGmail,
  currentUser,
  onOpenAuth,
  onOpenShare,
  onLogout,
  onOpenGlossary,
  dreamCollegeId = 'medicine',
  onOpenDreamCollege,
  onOpenAdmin,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { lang, toggleLang, t } = useLanguage();
  const dreamTheme = DREAM_COLLEGES_DATA[dreamCollegeId] || DREAM_COLLEGES_DATA.medicine;
  const isAdmin = currentUser?.email === 'usefmohamed1033@gmail.com' || currentUser?.isAdmin;

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors relative">
      {/* College dynamic accent strip under navbar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-80"
        style={{
          background: `linear-gradient(90deg, transparent, ${dreamTheme.primaryColor}, transparent)`,
        }}
      />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-15 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <AppLogo size="md" />
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight font-sans">
                  Thanawy Plus
                </span>
                <span className="text-[10px] sm:text-[11px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800 font-mono">
                  2027
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                {t('app.tagline', 'المنصة الذكية للثانوية العامة المصرية')}
              </p>
            </div>
          </div>

          {/* Center Track Selection - Clean segmented control */}
          <div id="nav-track-selector" className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              id="nav-btn-sci-math"
              onClick={() => onSelectTrack('sci_math')}
              aria-label={t('track.sci_math')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                track === 'sci_math'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('track.sci_math', 'علمي رياضة')}
            </button>
            <button
              id="nav-btn-sci-science"
              onClick={() => onSelectTrack('sci_science')}
              aria-label={t('track.sci_science')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                track === 'sci_science'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('track.sci_science', 'علمي علوم')}
            </button>
            <button
              id="nav-btn-lit"
              onClick={() => onSelectTrack('lit')}
              aria-label={t('track.lit')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                track === 'lit'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('track.lit', 'أدبي')}
            </button>
          </div>

          {/* Dream College Quick Emblem Pill Button (Visible across screens, responsive) */}
          {onOpenDreamCollege && (
            <button
              id="btn-nav-dream-college-pill"
              onClick={onOpenDreamCollege}
              className={`hidden sm:flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all shadow-xs border cursor-pointer hover:scale-105 active:scale-95 bg-gradient-to-r ${dreamTheme.gradientBadge} shrink-0`}
              title={lang === 'ar' ? 'تغيير كلية الأحلام والثيم التفاعلي' : 'Change Dream College Theme'}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="truncate max-w-[120px]">{lang === 'ar' ? dreamTheme.studentTitleAr : dreamTheme.studentTitleEn}</span>
            </button>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">

            {/* Language Switcher Button */}
            <button
              id="btn-language-toggle"
              onClick={toggleLang}
              className="flex items-center gap-1 px-2 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
              title={lang === 'ar' ? 'Switch interface to English' : 'التحويل إلى اللغة العربية'}
              aria-label="Toggle language"
            >
              <Languages className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="font-mono font-bold text-[10px] sm:text-[11px]">{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Direct Gmail Contact Button (Opens mailto directly) */}
            <a
              id="btn-nav-gmail-contact"
              href="mailto:usefmohamed1033@gmail.com?subject=تواصل%20بخصوص%20منصة%20ثانوية%20بلس%202027"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0"
              title="تواصل مباشر عبر Gmail: usefmohamed1033@gmail.com"
            >
              <Mail className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Gmail</span>
            </a>

            {/* Quick Share Button (Desktop/Tablet) */}
            <button
              id="btn-nav-share"
              onClick={onOpenShare}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
              title={lang === 'ar' ? 'مشاركة رابط التطبيق' : 'Share application'}
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{t('btn.share', 'مشاركة')}</span>
            </button>

            {/* User Auth / Profile Badge */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="btn-user-profile-menu"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover border border-emerald-500"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[80px] truncate hidden md:inline">
                    {currentUser.name}
                  </span>
                  {isAdmin && (
                    <span
                      id="navbar-admin-badge"
                      className="text-[9px] font-mono font-bold bg-amber-500 text-white px-1.5 py-0.2 rounded-md shadow-xs flex items-center gap-0.5"
                    >
                      <ShieldCheck className="w-2.5 h-2.5" />
                      Admin
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute left-0 ltr:right-0 ltr:left-auto mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-right ltr:text-left animate-fadeIn">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                        {isAdmin && (
                          <span className="text-[9px] font-mono font-bold bg-amber-500 text-white px-1 py-0.2 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">{currentUser.email}</p>
                    </div>

                    {isAdmin && onOpenAdmin && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>لوحة تحكم المدير (Admin Settings)</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenShare();
                      }}
                      className="w-full px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t('btn.share', 'مشاركة بطاقة إنجازي')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('btn.logout', 'تسجيل الخروج')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-open-login"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('btn.login', 'تسجيل الدخول')}</span>
              </button>
            )}

            {/* Sound Toggle */}
            <button
              id="btn-sound-toggle"
              onClick={onToggleSound}
              aria-label={soundEnabled ? t('btn.sound_on') : t('btn.sound_off')}
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title={soundEnabled ? t('btn.sound_on') : t('btn.sound_off')}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={onToggleDark}
              aria-label={dark ? t('btn.light_mode') : t('btn.dark_mode')}
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title={dark ? t('btn.light_mode') : t('btn.dark_mode')}
            >
              {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};



