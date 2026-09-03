import React, { useState } from 'react';
import {
  Share2,
  X,
  Copy,
  Check,
  Sparkles,
  Trophy,
  BookOpen,
  CheckCircle2,
  Clock,
  Heart,
  Send,
  ExternalLink,
  MessageCircle,
  Flame,
  Award
} from 'lucide-react';
import { TrackConfig, UserProgressData, UserProfile } from '../types';

interface ShareAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: TrackConfig;
  progress: UserProgressData;
  completedTasksCount: number;
  pomodoroSessions: number;
  currentUser: UserProfile | null;
}

export const ShareAchievementModal: React.FC<ShareAchievementModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  progress,
  completedTasksCount,
  pomodoroSessions,
  currentUser,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  // Calculate stats
  let totalChapters = 0;
  let completedChapters = 0;
  currentTrack.subjects.forEach((subj) => {
    totalChapters += subj.chapters.length;
    const subjProg = progress[subj.name] || [];
    completedChapters += subjProg.filter(Boolean).length;
  });

  const overallPercent = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://thanawy-plus-2027.web.app';
  const studentName = currentUser?.name || 'طالب الثانوية العامة 2027';

  // Formatted share message
  const shareText = `🎓 رحلتي في الثانوية العامة 2027 على منصة "ثانوي بلس":
🌟 الشعبة: ${currentTrack.titleArabic}
📊 نسبة إنجاز المنهج: ${overallPercent}% (${completedChapters}/${totalChapters} فصل مكتمل)
✅ المهام الدراسية المنجزة: ${completedTasksCount} مهمة
⏱️ جلسات التركيز (بومودورو): ${pomodoroSessions} جلسة
🎯 هدفي: التفوق والدرجة النهائية بمجموع ${currentTrack.totalMarks} درجة!

جرّب منصة ثانوي بلس 2027 الآن مجاناً للمذاكرة الذكية والامتحانات والكتب الوزارية:
🔗 ${appUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ثانوي بلس 2027 - منصتي للمذاكرة والتفوق',
          text: shareText,
          url: appUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopyLink();
    }
  };

  // Social Share URLs
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(appUrl);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">مشاركة الإنجاز والتطبيق</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">شارك تقدمك ورابط المنصة مع زملائك على السوشيال ميديا</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-4 space-y-5 flex-1 pr-1">
          
          {/* Visual Achievement Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-5 shadow-xl border border-emerald-500/40 space-y-4">
            
            {/* Ambient Background Circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Top Brand & Badge */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 ring-1 ring-emerald-400/40 p-0.5">
                  <img src="/app-icon.jpg" alt="ثانوي بلس" className="w-full h-full object-cover rounded-md" />
                </div>
                <div>
                  <div className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                    <span>ثانوي بلس</span>
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-400/40">2027</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-medium">{studentName}</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentTrack.titleArabic}</span>
              </div>
            </div>

            {/* Stats Metrics Grid */}
            <div className="grid grid-cols-3 gap-2.5 pt-1 relative z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 text-center border border-white/10">
                <div className="text-emerald-400 font-black text-lg sm:text-xl">{overallPercent}%</div>
                <div className="text-[10px] text-slate-300 font-medium">إنجاز المنهج</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 text-center border border-white/10">
                <div className="text-teal-300 font-black text-lg sm:text-xl">{completedTasksCount}</div>
                <div className="text-[10px] text-slate-300 font-medium">مهام منجزة</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 text-center border border-white/10">
                <div className="text-amber-300 font-black text-lg sm:text-xl">{pomodoroSessions}</div>
                <div className="text-[10px] text-slate-300 font-medium">جلسات تركيز</div>
              </div>
            </div>

            {/* Quote / Subtitle */}
            <div className="text-[11px] text-slate-300 border-t border-white/10 pt-2.5 flex items-center justify-between relative z-10 font-medium">
              <span>🎯 نحو الدرجة النهائية {currentTrack.totalMarks} درجة</span>
              <span className="text-emerald-400 font-mono text-[10px]">thanawy-plus-2027</span>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              مشاركة مباشرة على منصات التواصل:
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 text-center"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>واتساب</span>
              </a>

              {/* Facebook */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95 text-center"
              >
                <span className="font-bold text-base leading-none">f</span>
                <span>فيسبوك</span>
              </a>

              {/* Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-95 text-center"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>تيليجرام</span>
              </a>

              {/* X / Twitter */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 bg-slate-900 dark:bg-slate-950 hover:bg-black text-white rounded-2xl text-xs font-bold shadow-md transition-all hover:scale-[1.02] active:scale-95 text-center border border-slate-700"
              >
                <span className="font-black">𝕏</span>
                <span>تويتر</span>
              </a>
            </div>
          </div>

          {/* Quick Copy Link & Text Section */}
          <div className="space-y-3 pt-1">
            {/* Copy Link Input Bar */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">رابط التطبيق المباشر:</span>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1.5 rounded-2xl">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 bg-transparent px-2.5 text-xs text-slate-700 dark:text-slate-300 font-mono focus:outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    copiedLink
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الرابط</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action Bar for Native share & Copy Message */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCopyText}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  copiedText
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                }`}
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{copiedText ? 'تم نسخ رسالة الإنجاز!' : 'نسخ نص بطاقة الإنجاز بالكامل'}</span>
              </button>

              <button
                onClick={handleNativeShare}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>مشاركة عبر قائمة الهاتف 📱</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
