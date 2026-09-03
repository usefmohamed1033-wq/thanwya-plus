import React, { useState } from 'react';
import {
  X,
  FileText,
  Printer,
  Eye,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  BookOpen,
  Share2,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  Edit3
} from 'lucide-react';
import { PastExamPaper } from '../data/pastExamPapers';

interface ExamPaperViewerModalProps {
  paper: PastExamPaper;
  onClose: () => void;
}

export const ExamPaperViewerModal: React.FC<ExamPaperViewerModalProps> = ({
  paper,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'paper' | 'model_answer' | 'practice'>('paper');
  
  // Initialize all sections as expanded by default so the student sees the entire exam immediately!
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    paper.sections.forEach((_, idx) => {
      initial[idx] = true;
    });
    return initial;
  });

  const [userPracticeAnswers, setUserPracticeAnswers] = useState<Record<number, number>>({});
  const [showExplanationFor, setShowExplanationFor] = useState<Record<number, boolean>>({});
  const [isCopied, setIsCopied] = useState(false);

  const toggleSection = (idx: number) => {
    setExpandedSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const expandAllSections = () => {
    const allExp: Record<number, boolean> = {};
    paper.sections.forEach((_, idx) => {
      allExp[idx] = true;
    });
    setExpandedSections(allExp);
  };

  const collapseAllSections = () => {
    const allCol: Record<number, boolean> = {};
    paper.sections.forEach((_, idx) => {
      allCol[idx] = false;
    });
    setExpandedSections(allCol);
  };

  const handleSelectPracticeOption = (qNum: number, optIdx: number) => {
    setUserPracticeAnswers((prev) => ({ ...prev, [qNum]: optIdx }));
  };

  const toggleExplanation = (qNum: number) => {
    setShowExplanationFor((prev) => ({ ...prev, [qNum]: !prev[qNum] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Total questions count across all sections
  const totalQuestionsInExam = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);

  return (
    <div
      id="exam-viewer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="exam-paper-document-container"
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Document Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  امتحان رسمي {paper.year}
                </span>
                <span className="text-xs text-slate-400">
                  {paper.session} • {paper.durationHours} ساعات
                </span>
                <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  {totalQuestionsInExam} سؤالاً كاملاً
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                كراسة امتحان: {paper.subject} (الثانوية العامة الرسمية)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              aria-label="طباعة كراسة الامتحان أو حفظ كملف PDF"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="طباعة ورقة الامتحان / حفظ كملف PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              aria-label="مشاركة رابط الامتحان"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors relative cursor-pointer"
              title="مشاركة رابط الامتحان"
            >
              <Share2 className="w-4 h-4" />
              {isCopied && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                  تم النسخ!
                </span>
              )}
            </button>
            <button
              onClick={onClose}
              aria-label="إغلاق نافذة استعراض الامتحان"
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Tabs Navigation & View Expand Controls */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 shrink-0 text-xs font-bold gap-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setActiveTab('paper')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'paper'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>استعراض ورقة الامتحان بالكامل</span>
            </button>

            <button
              onClick={() => setActiveTab('model_answer')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'model_answer'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>نموذج الإجابة الرسمي وتوزيع الدرجات</span>
            </button>

            <button
              onClick={() => setActiveTab('practice')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'practice'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>حل تفاعلي وتصحيح فوري</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAllSections}
              className="text-[11px] text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60"
            >
              توسيع كل الأقسام
            </button>
            <button
              onClick={collapseAllSections}
              className="text-[11px] text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60"
            >
              طي الأقسام
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-slate-50/60 dark:bg-slate-950/40">
          
          {/* Official Ministry Exam Header Paper Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-300 dark:border-slate-700 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600"></div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 text-xs font-bold text-slate-600 dark:text-slate-400">
              <div className="text-right">
                <p>جمهورية مصر العربية</p>
                <p>وزارة التربية والتعليم والتعليم الفني</p>
                <p>الإدارة العامة للامتحانات</p>
              </div>
              <div className="my-2 sm:my-0 text-center">
                <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  امتحان شهادة إتمام الدراسة الثانوية العامة {paper.year}
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {paper.session} - نظام البابل شيت الحديث
                </div>
              </div>
              <div className="text-left">
                <p>المادة: {paper.subject}</p>
                <p>الزمن: {paper.durationHours} ساعات</p>
                <p>الدرجة العظمى: {paper.totalMarks} درجة</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-2xl mx-auto">
              {paper.description}
            </p>
          </div>

          {/* Exam Questions Sections */}
          <div className="space-y-6">
            {paper.sections.map((section, sIdx) => {
              const isExpanded = expandedSections[sIdx] ?? true;

              return (
                <div
                  key={sIdx}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden"
                >
                  {/* Section Title Accordion Header */}
                  <div
                    onClick={() => toggleSection(sIdx)}
                    className="p-4 bg-slate-100/90 dark:bg-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors select-none"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span>{section.title}</span>
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                          {section.questions.length} أسئلة
                        </span>
                      </div>
                      {section.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {section.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="text-[11px] font-semibold hidden sm:inline">
                        {isExpanded ? 'طي القسم' : 'عرض الأسئلة'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Questions List */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 space-y-6 divide-y divide-slate-100 dark:divide-slate-800/60">
                      {section.questions.map((q) => {
                        const isAnswered = userPracticeAnswers[q.number] !== undefined;
                        const selectedIdx = userPracticeAnswers[q.number];
                        const isCorrect = selectedIdx === q.correctOption;
                        const showExpl = showExplanationFor[q.number];
                        const isEssay = q.type === 'essay' || !q.options || q.options.length === 0;

                        return (
                          <div
                            key={q.number}
                            className={`pt-5 first:pt-0 space-y-3 ${
                              activeTab === 'practice' && isAnswered && !isEssay
                                ? isCorrect
                                  ? 'p-3 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl'
                                  : 'p-3 bg-rose-50/40 dark:bg-rose-950/20 rounded-xl'
                                : ''
                            }`}
                          >
                            {/* Question Number, Type Badge, and Text */}
                            <div className="flex items-start gap-3">
                              <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700">
                                {q.number}
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                      سؤال بدرجة ({q.marks} {q.marks > 1 ? 'درجات' : 'درجة'})
                                    </span>
                                    {isEssay && (
                                      <span className="text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-300 dark:border-indigo-800 flex items-center gap-1">
                                        <Edit3 className="w-3 h-3" />
                                        <span>سؤال مقالي رسمي</span>
                                      </span>
                                    )}
                                  </div>

                                  {activeTab === 'practice' && isAnswered && !isEssay && (
                                    <span
                                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                        isCorrect
                                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                                      }`}
                                    >
                                      {isCorrect ? 'إجابة صحيحة ✓' : 'إجابة خاطئة ✗'}
                                    </span>
                                  )}
                                </div>

                                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed mt-1 whitespace-pre-line">
                                  {q.text}
                                </p>
                              </div>
                            </div>

                            {/* Multiple Choice Options (MCQ) */}
                            {!isEssay && q.options && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mr-10">
                                {q.options.map((opt, oIdx) => {
                                  const optLetters = ['أ', 'ب', 'ج', 'د'];
                                  const isOptionCorrect = q.correctOption === oIdx;
                                  const isUserSelected = selectedIdx === oIdx;

                                  let optionStyle =
                                    'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500';

                                  if (activeTab === 'model_answer') {
                                    if (isOptionCorrect) {
                                      optionStyle =
                                        'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20';
                                    }
                                  } else if (activeTab === 'practice' && isAnswered) {
                                    if (isOptionCorrect) {
                                      optionStyle =
                                        'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                                    } else if (isUserSelected && !isCorrect) {
                                      optionStyle =
                                        'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200 font-bold';
                                    }
                                  } else if (isUserSelected) {
                                    optionStyle =
                                      'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20';
                                  }

                                  return (
                                    <div
                                      key={oIdx}
                                      onClick={() => handleSelectPracticeOption(q.number, oIdx)}
                                      className={`p-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-2.5 transition-all cursor-pointer select-none ${optionStyle}`}
                                    >
                                      <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                                        {optLetters[oIdx] || oIdx + 1}
                                      </span>
                                      <span className="leading-snug">{opt}</span>
                                      {activeTab === 'model_answer' && isOptionCorrect && (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-auto shrink-0" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Model Answer & Step-by-Step Explanation */}
                            {(activeTab === 'model_answer' ||
                              (activeTab === 'practice' && (isAnswered || isEssay)) ||
                              showExpl) && (
                              <div className="mr-10 p-4 bg-slate-100/90 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 animate-fadeIn">
                                <div className="flex items-center justify-between">
                                  <div className="font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>النموذج الوزاري المعتمد وتوزيع الدرجات:</span>
                                  </div>
                                  <span className="text-[11px] text-slate-500 font-mono font-bold">
                                    درجة الإجابة: {q.marks}
                                  </span>
                                </div>
                                <div className="font-bold text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                                  {q.modelAnswer}
                                </div>
                                <div className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed pt-2 border-t border-slate-200 dark:border-slate-700">
                                  <span className="font-bold text-slate-700 dark:text-slate-300">
                                    تفسير وتوضيح نواتج التعلم الوزارية:{' '}
                                  </span>
                                  {q.explanation}
                                </div>
                              </div>
                            )}

                            {/* Toggle explanation button in standard paper mode */}
                            {activeTab === 'paper' && (
                              <div className="mr-10 flex justify-end">
                                <button
                                  onClick={() => toggleExplanation(q.number)}
                                  className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <HelpCircle className="w-3.5 h-3.5" />
                                  <span>
                                    {showExpl ? 'إخفاء الإجابة النموذجية' : 'عرض الإجابة والخطوات النموذجية'}
                                  </span>
                                </button>
                              </div>
                            )}
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

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-right">
            تمت مراجعة أسئلة هذا الامتحان بالكامل وتطابقها مع نماذج امتحانات الثانوية العامة المعتمدة.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة كملف PDF</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <span>تم الاطلاع (إغلاق)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
