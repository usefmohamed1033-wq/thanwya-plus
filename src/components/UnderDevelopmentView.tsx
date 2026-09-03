import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  Heart,
  Sparkles,
  Construction,
  FolderLock,
  Code2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export const UnderDevelopmentView: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check normalized password (handling spaces or variations)
    // Requested password: "128 2009" or "1282009"
    const cleaned = password.trim();
    if (cleaned === '128 2009' || cleaned === '1282009') {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('كلمة المرور غير صحيحة! برجاء المحاولة مرة أخرى.');
    }
  };

  return (
    <div id="under-development-view" className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-right">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
              <Construction className="w-8 h-8 text-amber-300 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  قسم تحت التطوير والتحديثات الخاصة 🚀
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  سري / مشفر
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                هذا القسم مخصص للتحديثات البرمجية والملفات الخاصة المحمية بكلمة مرور.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60 text-xs font-mono text-indigo-300">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>v2027.SECURE_VAULT</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!isUnlocked ? (
        /* Password Lock Screen */
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center mb-4 shadow-sm">
            <FolderLock className="w-8 h-8" />
          </div>

          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-1">
            الملف محمي بكلمة مرور
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            أدخل كلمة المرور لفتح محتويات هذا الملف السري
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="أدخل كلمة المرور..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-center font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/25 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>فتح الملف</span>
            </button>
          </form>
        </div>
      ) : (
        /* Unlocked Special Secret Message */
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-rose-50 via-white to-pink-50 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-rose-300 dark:border-rose-800/80 text-center relative overflow-hidden animate-fadeIn">
          
          {/* Decorative Sparkles & Hearts Background */}
          <div className="absolute top-4 right-4 text-rose-400 opacity-40 animate-pulse">
            <Heart className="w-8 h-8 fill-rose-300" />
          </div>
          <div className="absolute bottom-4 left-4 text-pink-400 opacity-40 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center mb-6 shadow-xl shadow-rose-500/30 transform hover:scale-110 transition-transform">
            <Heart className="w-10 h-10 fill-white animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>تم فك التشفير بنجاح ❤️</span>
          </div>

          {/* The Exact Special Requested Text */}
          <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-rose-200/80 dark:border-rose-700/50 shadow-inner mb-6">
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-rose-700 dark:text-rose-300 leading-relaxed tracking-wide font-sans">
              « عمر حبي ليكي ما يقل بحبك اوي والله ربنا ميحرمنيش من وجودك يا اشطر مهندسة »
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            مهندسة المستقبل دفعة 2027 🎓✨
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-center">
            <button
              onClick={() => {
                setIsUnlocked(false);
                setPassword('');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>إعادة قفل الملف</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
