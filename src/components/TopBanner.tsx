import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, CheckCircle2, GraduationCap, ChevronLeft, Target } from 'lucide-react';
import { DREAM_COLLEGES_DATA } from '../data/collegeThemes';
import { useLanguage } from '../utils/i18n';

interface TopBannerProps {
  targetDate?: string;
  dreamCollegeId?: string;
  onOpenDreamCollege?: () => void;
}

export const TopBanner: React.FC<TopBannerProps> = ({
  targetDate = '2027-06-10T09:00:00',
  dreamCollegeId = 'medicine',
  onOpenDreamCollege,
}) => {
  const { lang, t } = useLanguage();
  const theme = DREAM_COLLEGES_DATA[dreamCollegeId] || DREAM_COLLEGES_DATA.medicine;
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div id="top-banner-container" className="w-full bg-slate-950 text-slate-200 border-b border-slate-800/90 select-none">
      {/* Top attribution header strip with College Ambience Accent */}
      <div id="powered-by-bar" className="bg-slate-900/90 border-b border-slate-800 text-center py-1.5 px-4 text-xs font-medium tracking-wide flex flex-wrap items-center justify-between max-w-7xl mx-auto gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: theme.primaryColor }}
          />
          <span className="font-semibold text-slate-100">Thanawy Plus 2027</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-300 text-[11px] font-bold">
            {lang === 'ar' ? `ثيم الهدف الأكاديمي: ${theme.nameAr}` : `Dream Goal Theme: ${theme.nameEn}`}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-emerald-400 text-[11px] hidden sm:inline font-mono font-bold">
            {theme.expectedTansikPercent}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          {onOpenDreamCollege && (
            <button
              onClick={onOpenDreamCollege}
              className="text-[10px] px-2.5 py-0.5 rounded-full font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer bg-slate-800 text-amber-300 border border-amber-500/40 flex items-center gap-1"
            >
              <Target className="w-3 h-3" />
              <span>{lang === 'ar' ? 'تبديل الكلية والثيم' : 'Switch College Theme'}</span>
            </button>
          )}
          <div className="text-slate-400 font-mono">
            <span className="text-slate-500">by</span> <span className="text-emerald-400 font-semibold">usef mohamed</span>
          </div>
        </div>
      </div>

      {/* Countdown Area */}
      <div id="countdown-banner" className="py-2.5 px-3 sm:px-4 bg-slate-950/70 relative overflow-hidden">
        {/* Glow tint from theme */}
        <div
          className="absolute -right-10 top-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: theme.primaryColor }}
        />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
          
          {/* Milestone Label & Student College Identity */}
          <div className="flex items-center gap-2.5 text-center md:text-right ltr:md:text-left w-full md:w-auto justify-center md:justify-start">
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm"
              style={{
                backgroundColor: `${theme.primaryColor}20`,
                borderColor: `${theme.primaryColor}60`,
                color: theme.primaryColor,
              }}
            >
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-slate-100 flex flex-wrap items-center gap-1.5 sm:gap-2 justify-center md:justify-start">
                <span>
                  {lang === 'ar'
                    ? 'العد التنازلي لامتحانات 2027'
                    : 'Countdown to Final Exams 2027'}
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded font-mono font-bold">
                  {lang === 'ar' ? 'دفعة 2027' : 'Batch 2027'}
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs truncate max-w-[160px] sm:max-w-none"
                  style={{
                    backgroundColor: `${theme.primaryColor}25`,
                    borderColor: `${theme.primaryColor}80`,
                    color: '#ffffff',
                  }}
                >
                  🎓 {lang === 'ar' ? theme.studentTitleAr : theme.studentTitleEn}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 justify-center md:justify-start">
                <span>{lang === 'ar' ? 'البدء: 10 يونيو 2027' : 'June 10, 2027'}</span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-amber-300 font-semibold italic truncate hidden sm:inline">«{lang === 'ar' ? theme.mottoAr : theme.mottoEn}»</span>
              </p>
            </div>
          </div>

          {/* Countdown Monospace Display - Mobile Fluid Grid */}
          <div id="countdown-digits" className="grid grid-cols-4 gap-1 sm:flex sm:items-center sm:gap-2 w-full max-w-xs sm:max-w-none sm:w-auto" dir="ltr">
            {/* Days */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-1.5 sm:px-2.5 py-1 text-center shadow-xs min-w-0">
              <div className="text-lg sm:text-2xl font-bold font-mono text-slate-100 tracking-tight">
                {timeLeft.days}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                {lang === 'ar' ? 'يوم' : 'Days'}
              </div>
            </div>

            {/* Hours */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-1.5 sm:px-2.5 py-1 text-center shadow-xs min-w-0">
              <div className="text-lg sm:text-2xl font-bold font-mono text-slate-100 tracking-tight">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                {lang === 'ar' ? 'ساعة' : 'Hours'}
              </div>
            </div>

            {/* Minutes */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-1.5 sm:px-2.5 py-1 text-center shadow-xs min-w-0">
              <div className="text-lg sm:text-2xl font-bold font-mono text-slate-100 tracking-tight">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                {lang === 'ar' ? 'دقيقة' : 'Mins'}
              </div>
            </div>

            {/* Seconds */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-1.5 sm:px-2.5 py-1 text-center shadow-xs min-w-0">
              <div className="text-lg sm:text-2xl font-bold font-mono text-emerald-400 tracking-tight">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                {lang === 'ar' ? 'ثانية' : 'Secs'}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
