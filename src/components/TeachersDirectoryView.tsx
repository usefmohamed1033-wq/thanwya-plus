import React, { useState, useMemo } from 'react';
import {
  Youtube,
  ExternalLink,
  Sparkles,
  Search,
  CheckCircle2,
  Tv,
  Users,
  Award,
  BookOpen,
  Filter,
  GraduationCap
} from 'lucide-react';
import { TEACHERS_DATA } from '../data/studentFeaturesData';
import { TrackConfig } from '../types';

interface TeachersDirectoryViewProps {
  currentTrack: TrackConfig;
}

export const TeachersDirectoryView: React.FC<TeachersDirectoryViewProps> = ({ currentTrack }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const availableSubjects = useMemo(() => {
    return Array.from(new Set(TEACHERS_DATA.map((t) => t.subject)));
  }, []);

  const filteredTeachers = useMemo(() => {
    return TEACHERS_DATA.filter((t) => {
      if (selectedSubject !== 'all' && t.subject !== selectedSubject) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = t.teacherName.toLowerCase().includes(q);
        const matchSub = t.subject.toLowerCase().includes(q);
        const matchDesc = t.description.toLowerCase().includes(q);
        if (!matchName && !matchSub && !matchDesc) return false;
      }
      return true;
    });
  }, [selectedSubject, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 border border-red-500/30 shadow-xl">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-400/30">
              <Youtube className="w-3.5 h-3.5" />
              <span>دليل معلمين وقنوات يوتيوب المعتمدة • ثانوية عامة 2027</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              دليل أفضل المعلمين وقنوات الشرح المجانية 📺
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              قائمة بأبرز وأكفأ مدرسي الثانوية العامة في مصر لكل المواد، مع قنواتهم الرسمية على يوتيوب ومميزات أسلوب كل مدرس لتختار الأنسب لك.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-850/90 backdrop-blur-md p-4 rounded-2xl border border-red-500/40 text-center min-w-[160px] shadow-lg">
              <span className="text-[11px] font-bold text-slate-300 block mb-1">
                معلمون معتمدون
              </span>
              <div className="text-2xl font-black text-red-400">
                {TEACHERS_DATA.length} قنوات رسمية
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مدرس أو مادة (مثال: عبد المعبود، خالد صقر، رضا الفاروق)..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Subject Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedSubject === 'all'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            جميع المواد ({TEACHERS_DATA.length})
          </button>
          {availableSubjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeachers.map((tch) => (
          <div
            key={tch.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header: Teacher Name, Subject Badge & Verified Icon */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                    <Tv className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {tch.teacherName}
                      </h3>
                      {tch.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" title="معلم موثوق" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">
                      مادة {tch.subject}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold text-[11px] border border-red-200 dark:border-red-900">
                  قناة رسمية 🔴
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                {tch.description}
              </p>

              {/* Features List */}
              <div className="space-y-1.5 mb-4">
                {tch.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action: Open YouTube Channel */}
            <a
              href={tch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <Youtube className="w-4 h-4" />
              <span>مشاهدة القناة والشروحات على YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
