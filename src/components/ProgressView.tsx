import React, { useState, useRef } from 'react';
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Layers,
  Flame,
  Percent
} from 'lucide-react';
import { TrackConfig, UserProgressData } from '../types';
import { NON_ADDED_SUBJECTS } from '../data/curriculumData';

interface ProgressViewProps {
  currentTrack: TrackConfig;
  progress: UserProgressData;
  pomodoroSessions: number;
  completedTasksCount: number;
  onResetProgress: () => void;
  onImportProgress: (data: UserProgressData) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  currentTrack,
  progress,
  pomodoroSessions,
  completedTasksCount,
  onResetProgress,
  onImportProgress,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Calculate statistics
  let totalChapters = 0;
  let finishedChapters = 0;
  let earnedMarks = 0;

  currentTrack.subjects.forEach((subj) => {
    totalChapters += subj.chapters.length;
    const subjProg = progress[subj.name] || [];
    const done = subjProg.filter(Boolean).length;
    finishedChapters += done;

    // Fractional mark contribution
    if (subj.chapters.length > 0) {
      earnedMarks += (done / subj.chapters.length) * subj.mark;
    }
  });

  const overallPercent = totalChapters > 0 ? Math.round((finishedChapters / totalChapters) * 100) : 0;
  const estimatedTotal = Math.round(earnedMarks);

  // Export Data
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `thanawy_plus_progress_2027_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Data
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          onImportProgress(parsed);
          setStatusMessage({ text: '✅ تم استرجاع بيانات تقدمك بنجاح!', success: true });
        } catch (err) {
          setStatusMessage({ text: '❌ فشل قراءة الملف، تأكد من صحة ملف النسخة الاحتياطية.', success: false });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div id="progress-view-container" className="space-y-6 animate-fadeIn">
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between shadow-xs ${
            statusMessage.success
              ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100'
              : 'bg-red-50 dark:bg-red-950/70 border-red-300 dark:border-red-700 text-red-900 dark:text-red-100'
          }`}
        >
          <div className="font-bold text-sm">{statusMessage.text}</div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 px-3 py-1 rounded-lg font-bold"
          >
            إغلاق
          </button>
        </div>
      )}
      {/* Overview Stats Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Estimated Mark Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-emerald-100 font-semibold">المجموع التقديري المنجز</span>
            <Award className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="text-3xl font-black tracking-tight">
            {estimatedTotal} <span className="text-base font-normal text-emerald-100">/ {currentTrack.totalMarks}</span>
          </div>
          <div className="text-[11px] text-emerald-100 mt-2">
            معدل إنجاز الدرجات: {((estimatedTotal / currentTrack.totalMarks) * 100).toFixed(1)}%
          </div>
        </div>

        {/* Overall Percentage */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">نسبة إنهاء المنهج</span>
            <Percent className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {overallPercent}%
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-2">
            أنجزت {finishedChapters} من أصل {totalChapters} فصلاً
          </div>
        </div>

        {/* Pomodoro hours */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">ساعات التركيز والمذاكرة</span>
            <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {(pomodoroSessions * 0.42).toFixed(1)}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-2">
            عبر {pomodoroSessions} جلسة بومودورو مسجلة
          </div>
        </div>

        {/* Tasks Done */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">المهام اليومية المكتملة</span>
            <CheckCircle2 className="w-5 h-5 text-teal-700 dark:text-teal-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {completedTasksCount}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-2">
            مهمة منجزة بنجاح
          </div>
        </div>
      </div>

      {/* Breakdown per subject */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <span>معدلات إنجاز المواد الأساسية ({currentTrack.name})</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              مجموع درجات الشعبة: {currentTrack.totalMarks} درجة موزعة على المقررات
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {currentTrack.subjects.map((subj) => {
            const subjProg = progress[subj.name] || [];
            const done = subjProg.filter(Boolean).length;
            const pct = Math.round((done / subj.chapters.length) * 100);
            const subjMarksEarned = Math.round((done / subj.chapters.length) * subj.mark);

            return (
              <div key={subj.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <span>{subj.name}</span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium px-2 py-0.5 rounded">
                      {subj.mark} درجة
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      تقدير الدرجة: {subjMarksEarned} / {subj.mark}
                    </span>
                    <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300 w-12 text-left">
                      {pct}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-700/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  {done} من {subj.chapters.length} فصول منجزة
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Non added subjects progress */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          المواد غير المضافة للمجموع:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {NON_ADDED_SUBJECTS.map((subj) => {
            const subjProg = progress[subj.name] || [];
            const done = subjProg.filter(Boolean).length;
            const pct = Math.round((done / subj.chapters.length) * 100);

            return (
              <div
                key={subj.id}
                className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-slate-800 dark:text-slate-200">{subj.name}</span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pct}%` }}></div>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-300 font-medium mt-2">
                  {done} من {subj.chapters.length} فصول
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backup, Export & Reset Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            النسخ الاحتياطي وإدارة التقدم
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
            جميع بياناتك محفوظة محلياً في متصفحك. يمكنك تحميل نسخة احتياطية أو استعادتها.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label htmlFor="progress-backup-file-input" className="sr-only">
            استيراد ملف النسخة الاحتياطية
          </label>
          <input
            id="progress-backup-file-input"
            name="backupFile"
            type="file"
            aria-label="استيراد ملف النسخة الاحتياطية بتنسيق JSON"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير نسخة احتياطية</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>استيراد نسخة</span>
          </button>

          <button
            onClick={onResetProgress}
            className="flex items-center gap-1.5 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl text-xs font-bold transition-colors border border-red-200 dark:border-red-900"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تصفير التقدم</span>
          </button>
        </div>
      </div>
    </div>
  );
};
