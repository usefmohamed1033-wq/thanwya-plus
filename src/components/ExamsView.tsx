import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  Timer,
  AlertCircle,
  ExternalLink,
  Eye,
  BookOpen,
  Check
} from 'lucide-react';
import { ExamResource, QuizQuestion, TrackConfig, TrackType } from '../types';
import { EXAMS_DATA } from '../data/curriculumData';
import { PAST_EXAM_PAPERS, PastExamPaper, getFullExamPaper } from '../data/pastExamPapers';
import { ExamPaperViewerModal } from './ExamPaperViewerModal';

interface ExamsViewProps {
  currentTrack: TrackConfig;
  soundEnabled: boolean;
}

export const ExamsView: React.FC<ExamsViewProps> = ({ currentTrack, soundEnabled }) => {
  const [selectedExamTrack, setSelectedExamTrack] = useState<TrackType | 'all'>(currentTrack.id);
  const [viewTab, setViewTab] = useState<'papers' | 'quiz'>('papers');
  const [activeExamPaper, setActiveExamPaper] = useState<PastExamPaper | null>(null);

  // Interactive Quiz State
  const [quizSubject, setQuizSubject] = useState(currentTrack.subjects[0]?.name || 'الفيزياء');
  const [quizChapter, setQuizChapter] = useState('');
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const filteredExams = EXAMS_DATA.filter((ex) => {
    return selectedExamTrack === 'all' || ex.track === 'all' || ex.track === selectedExamTrack;
  });

  // Handler to open direct exam paper with complete questions
  const handleOpenExam = (subject: string, year: string) => {
    const fullPaper = getFullExamPaper(subject, year, currentTrack.id);
    setActiveExamPaper(fullPaper);
  };

  // Start Interactive Quiz with offline rich questions
  const handleStartQuiz = () => {
    setIsQuizLoading(true);
    setUserAnswers({});
    setIsQuizSubmitted(false);

    setTimeout(() => {
      const fullPaper = getFullExamPaper(quizSubject, '2024', currentTrack.id);
      const generatedQuestions: QuizQuestion[] = [];
      let qId = 1;

      fullPaper.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          if (q.options && q.options.length > 0) {
            generatedQuestions.push({
              id: qId++,
              question: q.text,
              options: q.options,
              correctIndex: q.correctOption ?? 0,
              explanation: q.explanation
            });
          }
        });
      });

      setQuizQuestions(generatedQuestions.slice(0, 8));
      setIsQuizLoading(false);
    }, 300);
  };

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (isQuizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(userAnswers).length < quizQuestions.length) {
      if (!confirm('لم تقم بالإجابة على جميع الأسئلة. هل ترغب في إنهاء الاختبار وعرض النتيجة؟')) {
        return;
      }
    }
    setIsQuizSubmitted(true);
  };

  // Calculate score
  let correctCount = 0;
  quizQuestions.forEach((q) => {
    if (userAnswers[q.id] === q.correctIndex) {
      correctCount++;
    }
  });

  return (
    <div id="exams-view-container" className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  امتحانات الثانوية العامة والتدريبات التفاعلية
                </h2>
                <span className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-700">
                  2022 - 2025
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                نماذج امتحانات الوزارة الرسمية للسنوات السابقة + اختبارات بابل شيت تفاعلية فورية.
              </p>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setViewTab('papers')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
                viewTab === 'papers'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>أوراق الامتحانات السابقة</span>
            </button>
            <button
              onClick={() => setViewTab('quiz')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
                viewTab === 'quiz'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>اختبار بابل شيت تفاعلي</span>
            </button>
          </div>
        </div>
      </div>

      {viewTab === 'papers' ? (
        /* Past Papers Repository */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              اختر المادة لتحميل امتحانات السنوات السابقة بنماذج الإجابة:
            </h3>

            {/* Track Switcher */}
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <button
                onClick={() => setSelectedExamTrack('all')}
                className={`px-3 py-1.5 rounded-lg ${
                  selectedExamTrack === 'all'
                    ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setSelectedExamTrack('sci_math')}
                className={`px-3 py-1.5 rounded-lg ${
                  selectedExamTrack === 'sci_math'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                علمي رياضة
              </button>
              <button
                onClick={() => setSelectedExamTrack('sci_science')}
                className={`px-3 py-1.5 rounded-lg ${
                  selectedExamTrack === 'sci_science'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                علمي علوم
              </button>
              <button
                onClick={() => setSelectedExamTrack('lit')}
                className={`px-3 py-1.5 rounded-lg ${
                  selectedExamTrack === 'lit'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                أدبي
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>امتحانات مادة {exam.subject}</span>
                  </h4>
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                    رسمي
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {Object.entries(exam.years).map(([yr]) => (
                    <button
                      key={yr}
                      onClick={() => handleOpenExam(exam.subject, yr)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/60 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-700 transition-all group text-center active:scale-95 shadow-xs cursor-pointer"
                      title={`فتح ورقة امتحان ${exam.subject} لعام ${yr} ونموذج الإجابة`}
                    >
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>امتحان {yr}</span>
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-0.5 bg-emerald-100/70 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <Eye className="w-2.5 h-2.5" />
                        <span>فتح الامتحان فوراً</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Interactive Quiz Generator */
        <div className="space-y-6">
          {/* Quiz Settings Box */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>توليد اختبار تدريبي بنظام البابل شيت 2027</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="quiz-subject-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  المادة:
                </label>
                <select
                  id="quiz-subject-select"
                  name="quizSubject"
                  aria-label="اختيار مادة الاختبار التدريبي"
                  value={quizSubject}
                  onChange={(e) => setQuizSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                >
                  {currentTrack.subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.mark} درجة)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quiz-chapter-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  الفصل أو الموضوع (اختياري):
                </label>
                <input
                  id="quiz-chapter-input"
                  name="quizChapter"
                  type="text"
                  aria-label="الفصل أو الموضوع للاختبار"
                  value={quizChapter}
                  onChange={(e) => setQuizChapter(e.target.value)}
                  placeholder="مثال: قانون أوم وكيرشوف، الاتزان الكيميائي، النحو..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleStartQuiz}
                disabled={isQuizLoading}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                {isQuizLoading ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>جاري صياغة أسئلة الامتحان...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>بدء الاختبار التدريبي</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quiz Questions presentation */}
          {quizQuestions.length > 0 && (
            <div className="space-y-4">
              {/* Score Banner when submitted */}
              {isQuizSubmitted && (
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">
                        نتيجتك: {correctCount} من أصل {quizQuestions.length} (
                        {Math.round((correctCount / quizQuestions.length) * 100)}%)
                      </h4>
                      <p className="text-xs text-emerald-100 mt-0.5">
                        راجع الشرح التفصيلي أسفل كل سؤال لتثبيت المعلومة.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleStartQuiz}
                    className="bg-white text-emerald-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50"
                  >
                    اختبار جديد ↻
                  </button>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-4">
                {quizQuestions.map((q, qIndex) => {
                  const selectedOpt = userAnswers[q.id];
                  const isCorrect = selectedOpt === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border transition-all ${
                        isQuizSubmitted
                          ? isCorrect
                            ? 'border-emerald-500 dark:border-emerald-500/80'
                            : 'border-red-400 dark:border-red-500/80'
                          : 'border-slate-200/80 dark:border-slate-700/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                          <span className="inline-block w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-center text-xs leading-6 ml-2">
                            {qIndex + 1}
                          </span>
                          {q.question}
                        </div>

                        {isQuizSubmitted && (
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            }`}
                          >
                            {isCorrect ? 'إجابة صحيحة ✅' : 'إجابة خاطئة ❌'}
                          </span>
                        )}
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = selectedOpt === optIdx;
                          const isOptionCorrect = q.correctIndex === optIdx;

                          let optionStyle = 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
                          if (isQuizSubmitted) {
                            if (isOptionCorrect) {
                              optionStyle = 'bg-emerald-100/80 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                            } else if (isOptionSelected && !isOptionCorrect) {
                              optionStyle = 'bg-red-100/80 dark:bg-red-950/80 border-red-500 text-red-900 dark:text-red-200';
                            }
                          } else if (isOptionSelected) {
                            optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-emerald-900 dark:text-emerald-200 font-bold';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`w-full text-right p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                            >
                              <span>{opt}</span>
                              <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 mr-2">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation when submitted */}
                      {isQuizSubmitted && q.explanation && (
                        <div className="mt-4 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-950 dark:text-blue-200 leading-relaxed">
                          <span className="font-bold text-blue-800 dark:text-blue-300">الشرح والتفسير العلمي: </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!isQuizSubmitted && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleSubmitQuiz}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
                  >
                    تسليم الاختبار وعرض النتيجة 📋
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Direct Exam Paper & PDF Viewer Modal */}
      {activeExamPaper && (
        <ExamPaperViewerModal
          paper={activeExamPaper}
          onClose={() => setActiveExamPaper(null)}
        />
      )}
    </div>
  );
};
