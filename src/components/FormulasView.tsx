import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  Copy,
  Check,
  Lightbulb,
  Printer,
  Bookmark,
  AlignRight,
  Code2,
  Layers,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Hash,
  Scale
} from 'lucide-react';
import { FormulaItem, TrackConfig, TrackType } from '../types';
import { FORMULAS_DATA } from '../data/studentFeaturesData';
import { useLanguage } from '../utils/i18n';

interface FormulasViewProps {
  currentTrack: TrackConfig;
  trackId: TrackType;
}

type ViewMode = 'full' | 'verbal_only' | 'symbols_only';

export const FormulasView: React.FC<FormulasViewProps> = ({ currentTrack, trackId }) => {
  const { lang, t } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('full');
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('thanawy_saved_formulas');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState<boolean>(false);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem('thanawy_saved_formulas', JSON.stringify(next));
      return next;
    });
  };

  const handleCopy = (formula: FormulaItem) => {
    const textToCopy = `📌 [${formula.subject}] ${formula.title}\n\n✍️ الصيغة اللفظية بالحروف والكلمات:\n${formula.verbalForm || formula.explanation}\n\n📐 الصيغة الرياضية والرمزية:\n${formula.formula}${
      formula.symbolsGuide && formula.symbolsGuide.length > 0
        ? `\n\n🔍 دليل معاني الحروف والرموز:\n${formula.symbolsGuide.map((s) => `• ${s.symbol}: ${s.meaning} (${s.unit || 'بدون وحدة'})`).join('\n')}`
        : ''
    }\n\n📖 الشرح: ${formula.explanation}${formula.examTip ? `\n\n💡 تريك الامتحان: ${formula.examTip}` : ''}\n\n-- منصة ثانوي بلس 2027`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(formula.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const availableSubjects = useMemo(() => {
    const subs = Array.from(new Set(FORMULAS_DATA.map((f) => f.subject)));
    return subs;
  }, []);

  const filteredFormulas = useMemo(() => {
    return FORMULAS_DATA.filter((item) => {
      // Track filter
      if (item.track !== 'all' && item.track !== trackId) {
        return false;
      }
      // Subject filter
      if (selectedSubject !== 'all' && item.subject !== selectedSubject) {
        return false;
      }
      // Bookmark filter
      if (showOnlyBookmarked && !bookmarkedIds.includes(item.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchFormula = item.formula.toLowerCase().includes(q);
        const matchVerbal = item.verbalForm ? item.verbalForm.toLowerCase().includes(q) : false;
        const matchExpl = item.explanation.toLowerCase().includes(q);
        const matchChap = item.chapter.toLowerCase().includes(q);
        const matchSub = item.subject.toLowerCase().includes(q);
        const matchSymbols = item.symbolsGuide?.some(
          (s) => s.symbol.toLowerCase().includes(q) || s.meaning.toLowerCase().includes(q)
        );
        if (!matchTitle && !matchFormula && !matchVerbal && !matchExpl && !matchChap && !matchSub && !matchSymbols) {
          return false;
        }
      }
      return true;
    });
  }, [selectedSubject, searchQuery, showOnlyBookmarked, bookmarkedIds, trackId]);

  // Typography size classes based on state
  const verbalFontSize = {
    normal: 'text-sm sm:text-base leading-relaxed',
    large: 'text-base sm:text-lg leading-relaxed',
    xlarge: 'text-lg sm:text-xl leading-loose',
  }[fontSizeLevel];

  const mathFontSize = {
    normal: 'text-sm sm:text-base',
    large: 'text-base sm:text-lg',
    xlarge: 'text-lg sm:text-xl',
  }[fontSizeLevel];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 border border-indigo-500/30 shadow-xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-right ltr:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === 'ar'
                  ? 'كتيب المفاهيم والقوانين الذهبية • مكتوبة بالحروف والرموز'
                  : 'Concepts & Golden Formulas Handbook • Verbal & Symbols'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>{lang === 'ar' ? 'بنك القوانين والمفاهيم الشاملة' : 'Formulas & Concepts Bank'}</span>
              <span className="text-xl">📐</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              {lang === 'ar'
                ? 'كل القوانين الفيزيائية، الكيميائية، الرياضية، والنحوية مكتوبة بالحروف والكلمات العربية الواضحة مع الصياغة الرمزية ودليل تفكيك معاني الحروف ووحدات القياس.'
                : 'All physics, chemistry, math, and grammatical formulas written in clear verbal language along with mathematical notation, breakdown guides, and SI measurement units.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-stretch lg:self-auto">
            {/* Font Size Selector */}
            <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700">
              <button
                onClick={() => setFontSizeLevel('normal')}
                title={lang === 'ar' ? 'خط عادي' : 'Normal font'}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  fontSizeLevel === 'normal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSizeLevel('large')}
                title={lang === 'ar' ? 'خط كبير' : 'Large font'}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  fontSizeLevel === 'large' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSizeLevel('xlarge')}
                title={lang === 'ar' ? 'خط كبير جداً' : 'Extra large font'}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  fontSizeLevel === 'xlarge' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                A++
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold border border-slate-700 transition-all cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'طباعة القوانين' : 'Print'}</span>
            </button>

            <button
              onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
              className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                showOnlyBookmarked
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-extrabold'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${showOnlyBookmarked ? 'fill-current' : ''}`} />
              <span>{lang === 'ar' ? `المحفوظات (${bookmarkedIds.length})` : `Saved (${bookmarkedIds.length})`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Subject Filters & View Mode */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-slate-400 ${lang === 'ar' ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'ابحث عن قانون، اسم حرف، رمز، أو قاعدة (مثل: كيرشوف، أوم، ماركونيكوف، أوستفالد)...'
                  : 'Search for formula, symbol, law (e.g. Kirchhoff, Ohm, Markovnikov, Work Function)...'
              }
              className={`w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                lang === 'ar' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ${
                  lang === 'ar' ? 'left-3' : 'right-3'
                }`}
              >
                {lang === 'ar' ? 'مسح' : 'Clear'}
              </button>
            )}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs self-stretch md:self-auto justify-center">
            <button
              onClick={() => setViewMode('full')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'full'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'عرض شامل' : 'Full'}</span>
            </button>
            <button
              onClick={() => setViewMode('verbal_only')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'verbal_only'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <AlignRight className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'بالحروف فقط' : 'Verbal'}</span>
            </button>
            <button
              onClick={() => setViewMode('symbols_only')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'symbols_only'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'الرموز الرياضية فقط' : 'Symbols'}</span>
            </button>
          </div>
        </div>

        {/* Subject Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-1 border-t border-slate-100 dark:border-slate-700/60">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedSubject === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {lang === 'ar' ? `جميع المواد (${FORMULAS_DATA.length})` : `All Subjects (${FORMULAS_DATA.length})`}
          </button>
          {availableSubjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t(sub)}
            </button>
          ))}
        </div>
      </div>

      {/* Formulas Grid */}
      {filteredFormulas.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredFormulas.map((item) => {
            const isBookmarked = bookmarkedIds.includes(item.id);
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                id={`formula-card-${item.id}`}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-4">
                  {/* Top Bar: Subject Badge + Chapter + Actions */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                        {item.subject}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[200px] sm:max-w-xs">
                        {item.chapter}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleBookmark(item.id)}
                        title={
                          lang === 'ar'
                            ? isBookmarked
                              ? 'إزالة من المحفوظات'
                              : 'حفظ القانون في المفضلة'
                            : isBookmarked
                            ? 'Remove from saved'
                            : 'Save formula'
                        }
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          isBookmarked
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800'
                            : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleCopy(item)}
                        title={lang === 'ar' ? 'نسخ القانون بالصيغة اللفظية والرياضية' : 'Copy formula'}
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {item.title}
                  </h3>

                  {/* 1. Verbal Formulation Written with Letters (الصيغة اللفظية بالحروف والكلمات) */}
                  {(viewMode === 'full' || viewMode === 'verbal_only') && item.verbalForm && (
                    <div className="rounded-2xl p-4 sm:p-4.5 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs space-y-2">
                      <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 text-xs font-bold">
                        <AlignRight className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                        <span>
                          {lang === 'ar'
                            ? 'الصيغة اللفظية المكتوبة بالحروف والكلمات:'
                            : 'Verbal formulation in words:'}
                        </span>
                      </div>
                      <div className={`font-verbal-text text-slate-800 dark:text-indigo-100 font-bold ${verbalFontSize} whitespace-pre-line text-right ltr:text-left`}>
                        {item.verbalForm}
                      </div>
                    </div>
                  )}

                  {/* 2. Mathematical Symbol Box (الصيغة الرياضية والرمزية) */}
                  {(viewMode === 'full' || viewMode === 'symbols_only') && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
                        <span className="flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>
                            {lang === 'ar' ? 'الصيغة الرياضية والرمزية:' : 'Mathematical formula:'}
                          </span>
                        </span>
                      </div>
                      <div className={`p-4 rounded-xl bg-slate-950 text-emerald-300 font-formula-math ${mathFontSize} font-semibold text-center dir-ltr overflow-x-auto border border-slate-800 shadow-inner select-all tracking-wide`}>
                        {item.formula}
                      </div>
                    </div>
                  )}

                  {/* 3. Symbols Guide & Letters Breakdown (دليل معاني وتفكيك الحروف والرموز) */}
                  {item.symbolsGuide && item.symbolsGuide.length > 0 && viewMode !== 'verbal_only' && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                        <span>
                          {lang === 'ar'
                            ? 'دليل وتفكيك معاني الحروف والرموز:'
                            : 'Symbols & parameters guide:'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {item.symbolsGuide.map((sym, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/60"
                          >
                            <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/70 text-indigo-800 dark:text-indigo-200 font-formula-math font-bold text-xs shrink-0 dir-ltr">
                              {sym.symbol}
                            </span>
                            <div className="flex-1 leading-snug">
                              <p className="text-slate-800 dark:text-slate-200 font-semibold">{sym.meaning}</p>
                              {sym.unit && (
                                <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                                  {lang === 'ar' ? 'الوحدة: ' : 'Unit: '}
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">{sym.unit}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. General Scientific Explanation */}
                  {item.explanation && (
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal pt-1">
                      <strong className="font-bold text-slate-700 dark:text-slate-200">
                        {lang === 'ar' ? 'الشرح والتوضيح: ' : 'Explanation: '}
                      </strong>
                      {item.explanation}
                    </div>
                  )}
                </div>

                {/* 5. Exam Tip / Trick Box (تريك ليلة الامتحان) */}
                {item.examTip && (
                  <div className="p-3.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 mt-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-950 dark:text-amber-200 font-medium leading-relaxed">
                      <strong className="font-bold">
                        {lang === 'ar' ? 'تريك ليلة الامتحان: ' : 'Exam Tip: '}
                      </strong>
                      {item.examTip}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-14 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            {lang === 'ar'
              ? 'لم يتم العثور على قوانين مطابقة للبحث'
              : 'No matching formulas found'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ar'
              ? 'جرب البحث بكلمات أخرى أو اختر مادة مختلفة من القائمة العلوية.'
              : 'Try different search keywords or select another subject.'}
          </p>
        </div>
      )}
    </div>
  );
};
