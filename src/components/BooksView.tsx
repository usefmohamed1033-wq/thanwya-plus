import React, { useState } from 'react';
import {
  Library,
  Download,
  ExternalLink,
  BookOpen,
  Search,
  CheckCircle2,
  FileCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { BookResource, TrackConfig, TrackType } from '../types';
import { BOOKS_DATA } from '../data/curriculumData';

interface BooksViewProps {
  currentTrack: TrackConfig;
  onSelectTrack: (track: TrackType) => void;
}

export const BooksView: React.FC<BooksViewProps> = ({ currentTrack, onSelectTrack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<TrackType | 'all'>(currentTrack.id);

  const filteredBooks = BOOKS_DATA.filter((b) => {
    const matchesTrack = selectedFilter === 'all' || b.track === 'all' || b.track === selectedFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch;
  });

  return (
    <div id="books-view-container" className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shadow-md">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  الكتب المدرسية الرسمية 2027
                </h2>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  وزارة التربية والتعليم
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                كتب الوزارة والمفاهيم الرسمية المعتمدة لدفعة الثانوية العامة 2027 للتحميل والقراءة المباشرة.
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setSelectedFilter('sci_math')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedFilter === 'sci_math'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              علمي رياضة
            </button>
            <button
              onClick={() => setSelectedFilter('sci_science')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedFilter === 'sci_science'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              علمي علوم
            </button>
            <button
              onClick={() => setSelectedFilter('lit')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedFilter === 'lit'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              أدبي
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <label htmlFor="books-search-input" className="sr-only">
            ابحث عن كتاب مدرسي
          </label>
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          <input
            id="books-search-input"
            name="booksSearch"
            type="text"
            aria-label="ابحث عن كتاب مدرسي أو مادة"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن كتاب مدرسي أو مادة معينة..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Books Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:border-emerald-500/80 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-semibold">
                    {book.subject}
                  </span>
                  {book.isMinistryApproved && (
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <FileCheck className="w-3 h-3" />
                      <span>معتمد 2027</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {book.grade} • إصدار {book.year} {book.fileSize && `• الحجم التقريبي: ${book.fileSize}`}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>نسخة رقمية PDF أصلية</span>
              </span>

              <a
                href={book.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل / تصفح الكتاب</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Advice Notice */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-slate-800 dark:text-slate-200">توجيه أكاديمي هام: </span>
          تعتمد أسئلة امتحانات الثانوية العامة المصرية الحديثة بصورة كاملة على نواتج التعلم والرسومات التوضيحية الواردة في كتاب الوزارة الرسمي. ننصح بقراءة كتاب المدرسة وحل أمثلته قبل الاعتماد على أي كتب خارجية.
        </div>
      </div>
    </div>
  );
};
