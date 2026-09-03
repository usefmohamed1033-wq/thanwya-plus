import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Search,
  Award,
  Layers,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { TrackConfig, TrackType, UserProgressData } from '../types';
import { NON_ADDED_SUBJECTS } from '../data/curriculumData';
import { useLanguage } from '../utils/i18n';

interface CurriculumViewProps {
  currentTrack: TrackConfig;
  allTracks: Record<string, TrackConfig>;
  onSelectTrack: (track: TrackType) => void;
  progress: UserProgressData;
  onToggleChapter: (subjectName: string, chapterIndex: number) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  currentTrack,
  allTracks,
  onSelectTrack,
  progress,
  onToggleChapter,
}) => {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({
    [currentTrack.subjects[0]?.id || '']: true,
  });
  const [openNonAdded, setOpenNonAdded] = useState<Record<string, boolean>>({});

  const toggleSubject = (subjectId: string) => {
    setOpenSubjects((prev) => ({ ...prev, [subjectId]: !prev[subjectId] }));
  };

  const toggleNonAdded = (subjectId: string) => {
    setOpenNonAdded((prev) => ({ ...prev, [subjectId]: !prev[subjectId] }));
  };

  // Filter subjects and chapters
  const filteredSubjects = currentTrack.subjects.map((subj) => {
    if (!searchQuery.trim()) return subj;
    const query = searchQuery.toLowerCase();
    const matchesSubj = subj.name.toLowerCase().includes(query) || (subj.nameEn && subj.nameEn.toLowerCase().includes(query));
    const matchedChapters = subj.chapters.filter(
      (ch) =>
        ch.name.toLowerCase().includes(query) ||
        (ch.keyLaw && ch.keyLaw.toLowerCase().includes(query))
    );
    if (matchesSubj) return subj;
    return { ...subj, chapters: matchedChapters };
  }).filter((subj) => subj.chapters.length > 0);

  return (
    <div id="curriculum-view-container" className="space-y-6 animate-fadeIn">
      {/* Header & Track Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-right ltr:text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'ar' ? 'منهج الثانوية العامة الرسمي 2027' : 'Official Thanawy Curriculum 2027'}
              </h2>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                {lang === 'ar' ? `مجموع: ${currentTrack.totalMarks} درجة` : `Total: ${currentTrack.totalMarks} Marks`}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {lang === 'ar'
                ? 'حدد فصولك المنجزة لمتابعة نسبتك المئوية وضمان تغطية جميع نواتج التعلم.'
                : 'Check completed chapters to track your progress and master all learning outcomes.'}
            </p>
          </div>

          {/* Track Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => onSelectTrack('sci_math')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                currentTrack.id === 'sci_math'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('track_sci_math')}
            </button>
            <button
              onClick={() => onSelectTrack('sci_science')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                currentTrack.id === 'sci_science'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('track_sci_science')}
            </button>
            <button
              onClick={() => onSelectTrack('lit')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                currentTrack.id === 'lit'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('track_lit')}
            </button>
          </div>
        </div>

        {/* Search filter input */}
        <div className="mt-4 relative">
          <label htmlFor="curriculum-search-input" className="sr-only">
            {lang === 'ar' ? 'ابحث في المنهج' : 'Search curriculum'}
          </label>
          <Search className={`w-4 h-4 text-slate-400 absolute top-3 ${lang === 'ar' ? 'right-3.5' : 'left-3.5'}`} />
          <input
            id="curriculum-search-input"
            name="curriculumSearch"
            type="text"
            aria-label={lang === 'ar' ? 'ابحث في المنهج عن مادة أو فصل أو قانون' : 'Search for subject, chapter, or formula'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'ar'
                ? 'ابحث عن مادة، فصل، أو قانون في المنهج (مثال: كيرشوف، العضوية، النحو)...'
                : 'Search subject, chapter, or law in curriculum (e.g. Kirchhoff, Organic, Grammar)...'
            }
            className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              lang === 'ar' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
            }`}
          />
        </div>
      </div>

      {/* Main Subjects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>
              {lang === 'ar'
                ? `المواد الأساسية المضافة للمجموع (المجموع: ${currentTrack.totalMarks} درجة)`
                : `Core Curriculum Subjects (Total: ${currentTrack.totalMarks} Marks)`}
            </span>
          </h3>
          <span className="text-xs text-slate-400">
            {lang === 'ar' ? `${filteredSubjects.length} مواد مقررة` : `${filteredSubjects.length} subjects`}
          </span>
        </div>

        <div className="space-y-3">
          {filteredSubjects.map((subj) => {
            const subjProg = progress[subj.name] || [];
            const doneCount = subjProg.filter(Boolean).length;
            const pct = Math.round((doneCount / subj.chapters.length) * 100);
            const isOpen = !!openSubjects[subj.id];

            return (
              <div
                key={subj.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-xs transition-all"
              >
                {/* Subject Header Accordion Toggle */}
                <button
                  onClick={() => toggleSubject(subj.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-900/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors text-right ltr:text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm shrink-0">
                      {subj.mark}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {t(subj.name)}
                        </span>
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded">
                          {subj.mark} {lang === 'ar' ? 'درجة' : 'Marks'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {lang === 'ar'
                          ? `تم إنجاز ${doneCount} من أصل ${subj.chapters.length} فصول (${pct}%)`
                          : `Completed ${doneCount} of ${subj.chapters.length} chapters (${pct}%)`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="w-28 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 w-9 text-left">
                        {pct}%
                      </span>
                    </div>

                    <div className="p-1 rounded-lg text-slate-400">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </button>

                {/* Chapter Checklist */}
                {isOpen && (
                  <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-700/60 divide-y divide-slate-100 dark:divide-slate-700/60">
                    {subj.chapters.map((chap, ci) => {
                      const isDone = !!subjProg[ci];
                      return (
                        <div
                          key={chap.id}
                          className={`py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3 group transition-colors ${
                            isDone ? 'opacity-75' : ''
                          }`}
                        >
                          <label className="flex items-start gap-3 cursor-pointer flex-1 select-none text-right ltr:text-left">
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => onToggleChapter(subj.name, ci)}
                              className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-600 focus:ring-emerald-500 mt-1 shrink-0 cursor-pointer"
                            />
                            <div>
                              <div
                                className={`text-xs sm:text-sm font-bold ${
                                  isDone
                                    ? 'line-through text-slate-400 dark:text-slate-500'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {chap.name}
                              </div>
                              {chap.keyLaw && (
                                <div className="mt-1 flex items-center gap-1.5 text-[11px] bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-slate-800">
                                  <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                                  <span>{lang === 'ar' ? `القانون/المفهوم الذهبي: ${chap.keyLaw}` : `Key Law/Concept: ${chap.keyLaw}`}</span>
                                </div>
                              )}
                            </div>
                          </label>

                          <button
                            onClick={() => onToggleChapter(subj.name, ci)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors shrink-0 cursor-pointer ${
                              isDone
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {isDone
                              ? lang === 'ar' ? 'مكتمل ✅' : 'Done ✅'
                              : lang === 'ar' ? 'تحديد كمكتمل' : 'Mark done'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Non-Added Subjects */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        <div className="flex items-center justify-between text-right ltr:text-left">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>
                {lang === 'ar'
                  ? 'مواد النجاح والرسوب غير المضافة للمجموع (لكل الشعب)'
                  : 'Pass/Fail Non-Added Subjects (All Tracks)'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'يلزم النجاح فيها بنسبة 50% ولا تضاف درجاتها للمجموع الكلي (320 درجة).'
                : 'Requires 50% passing grade, not added to the total 320 marks.'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {NON_ADDED_SUBJECTS.map((subj) => {
            const subjProg = progress[subj.name] || [];
            const doneCount = subjProg.filter(Boolean).length;
            const pct = Math.round((doneCount / subj.chapters.length) * 100);
            const isOpen = !!openNonAdded[subj.id];

            return (
              <div
                key={subj.id}
                className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleNonAdded(subj.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors text-right ltr:text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {t(subj.name)}
                    </span>
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                      {lang === 'ar' ? 'غير مضافة' : 'Non-added'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      {lang === 'ar'
                        ? `${doneCount} / ${subj.chapters.length} فصول`
                        : `${doneCount} / ${subj.chapters.length} chapters`}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    {subj.chapters.map((chap, ci) => {
                      const isDone = !!subjProg[ci];
                      return (
                        <label
                          key={ci}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-colors text-right ltr:text-left"
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => onToggleChapter(subj.name, ci)}
                            className="w-4 h-4 text-slate-500 rounded border-slate-300 dark:border-slate-600 focus:ring-slate-400"
                          />
                          <span
                            className={`text-xs ${
                              isDone ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {chap}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

