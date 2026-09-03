import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Copy,
  Check,
  Share2,
  BookOpen,
  RotateCcw,
  Plus,
  Volume2
} from 'lucide-react';
import { DUAA_DATA } from '../data/studentFeaturesData';
import { DuaaItem } from '../types';

export const AthkarDuaaView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Digital Tasbeeh Counter
  const [tasbeehCount, setTasbeehCount] = useState<number>(0);
  const [tasbeehGoal, setTasbeehGoal] = useState<number>(100);
  const [currentZikr, setCurrentZikr] = useState<string>('لا حول ولا قوة إلا بالله العلي العظيم');

  const zikrOptions = [
    'لا حول ولا قوة إلا بالله العلي العظيم',
    'اللهم صلِّ وسلم وبارك على نبينا محمد',
    'سبحان الله وبحمده، سبحان الله العظيم',
    'أستغفر الله العظيم وأتوب إليه',
    'حسبي الله ونعم الوكيل',
    'يا حي يا قيوم برحمتك أستغيث',
  ];

  const handleCopy = (item: DuaaItem) => {
    const text = `🤲 [${item.title}]\n${item.arabicText}\n💡 الفضل: ${item.benefit}\n-- منصة ثانوي بلس 2027`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredDuaa = DUAA_DATA.filter((d) => {
    if (selectedCategory === 'all') return true;
    return d.occasion === selectedCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 border border-teal-500/30 shadow-xl">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30">
              <Heart className="w-3.5 h-3.5" />
              <span>الطمأنينة والتوكل على الله • ثانوية عامة 2027</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              أدعية وأذكار المذاكرة والتفوق 🤲
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              أدعية مأثورة لتيسير الفهم، تثبيت الحفظ، طرد القلق والتوتر، ودعاء دخول لجان الامتحانات مع مسبحة إلكترونية للذكر والاستعانة بالله.
            </p>
          </div>
        </div>
      </div>

      {/* Digital Tasbeeh & Psychological Calming Widget */}
      <div className="bg-gradient-to-br from-emerald-900/40 via-slate-800 to-teal-950/50 rounded-3xl p-6 border border-emerald-500/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-right max-w-md">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>المسبحة الإلكترونية لطرد التشتت</span>
          </span>
          <h2 className="text-lg font-black text-white">
            اذكر الله واطرد التوتر قبل بدء المذاكرة
          </h2>

          <select
            value={currentZikr}
            onChange={(e) => {
              setCurrentZikr(e.target.value);
              setTasbeehCount(0);
            }}
            className="w-full px-3 py-2 rounded-xl bg-slate-900/90 text-emerald-300 border border-emerald-500/40 text-xs font-bold focus:outline-none"
          >
            {zikrOptions.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>

        {/* Counter Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTasbeehCount((prev) => prev + 1)}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white flex flex-col items-center justify-center shadow-xl shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer select-none"
          >
            <span className="text-2xl sm:text-3xl font-black">{tasbeehCount}</span>
            <span className="text-[10px] font-bold opacity-80">اضغط للذكر</span>
          </button>

          <button
            onClick={() => setTasbeehCount(0)}
            title="إعادة التصفير"
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          جميع الأدعية ({DUAA_DATA.length})
        </button>
        <button
          onClick={() => setSelectedCategory('before_study')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'before_study'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          قبل المذاكرة والفهم
        </button>
        <button
          onClick={() => setSelectedCategory('after_study')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'after_study'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          تثبيت الحفظ والاستيداع
        </button>
        <button
          onClick={() => setSelectedCategory('forgetting')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'forgetting'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          عند نسيان معلومة
        </button>
        <button
          onClick={() => setSelectedCategory('anxiety')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'anxiety'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          طرد القلق والتوتر
        </button>
        <button
          onClick={() => setSelectedCategory('exam_day')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'exam_day'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          يوم الامتحان ودخول اللجنة
        </button>
      </div>

      {/* Duaa Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDuaa.map((item) => {
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700 mb-3">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Heart className="w-4 h-4 text-teal-500" />
                    <span>{item.title}</span>
                  </h3>

                  <button
                    onClick={() => handleCopy(item)}
                    title="نسخ الدعاء"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Arabic Text (Calligraphy-style container) */}
                <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-900/40 text-center mb-3">
                  <p className="text-sm sm:text-base font-bold text-teal-950 dark:text-teal-200 leading-loose">
                    "{item.arabicText}"
                  </p>
                </div>

                {/* Benefit */}
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  💡 <strong>متى يُقال؟</strong> {item.benefit}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
