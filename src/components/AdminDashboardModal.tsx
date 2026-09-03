import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  FileText,
  Library,
  Megaphone,
  Compass,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Check,
  Settings,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import {
  AdminAnnouncement,
  AdminCustomData,
  getAdminCustomData,
  saveAdminCustomData,
  addAdminExam,
  deleteAdminExam,
  addAdminBook,
  deleteAdminBook,
  addAdminAnnouncement,
  deleteAdminAnnouncement,
  addAdminFormula,
  deleteAdminFormula,
} from '../utils/adminStorage';
import { PastExamPaper, ExamQuestion, ExamSection } from '../data/pastExamPapers';
import { BookResource, FormulaItem, TrackType, UserProfile } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onRefreshData?: () => void;
}

type AdminTab = 'overview' | 'exams' | 'books' | 'announcements' | 'formulas' | 'backup';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [adminData, setAdminData] = useState<AdminCustomData>(() => getAdminCustomData());
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states for creating new Exam
  const [examSubject, setExamSubject] = useState('الفيزياء');
  const [examTrack, setExamTrack] = useState<TrackType | 'all'>('sci_math');
  const [examYear, setExamYear] = useState('2026');
  const [examSession, setExamSession] = useState<'دور أول' | 'دور ثان' | 'نماذج استرشادية وتجريبية'>('دور أول');
  const [examDurationHours, setExamDurationHours] = useState('3');
  const [examTotalMarks, setExamTotalMarks] = useState('60');
  const [examQuestionsCount, setExamQuestionsCount] = useState('46');
  const [examDescription, setExamDescription] = useState('كراسة امتحان الثانوية العامة الرسمية مع الإجابات النموذجية.');
  const [examQuestionsList, setExamQuestionsList] = useState<ExamQuestion[]>([
    {
      number: 1,
      type: 'mcq',
      text: 'في الدائرة الكهربية الموضحة، عند زيادة المقاومة المتغيرة (S)، فإن قراءة الفولتميتر بين قطبي البطارية:',
      options: ['تزداد', 'تقل', 'تظل ثابتة', 'تصبح صفراً'],
      correctOption: 0,
      marks: 1,
      modelAnswer: 'الإجابة الصحيحة هي: (أ) تزداد، طبقاً للعلاقة V = V_B - I*r حيث يقل التيار الكلي بزيادة المقاومة فيزداد فرق الجهد الخارجي.',
      explanation: 'تطبيق قانون أوم للدائرة المغلقة وفهم العلاقة التناقصية لفرق الجهد.',
    },
  ]);

  // Temporary question form inside exam modal
  const [newQType, setNewQType] = useState<'mcq' | 'essay'>('mcq');
  const [newQText, setNewQText] = useState('');
  const [newQOptions, setNewQOptions] = useState<string[]>(['', '', '', '']);
  const [newQCorrectIdx, setNewQCorrectIdx] = useState(0);
  const [newQMarks, setNewQMarks] = useState(1);
  const [newQAnswer, setNewQAnswer] = useState('');
  const [newQOutcome, setNewQOutcome] = useState('');

  // Form states for creating new Book
  const [bookTitle, setBookTitle] = useState('');
  const [bookSubject, setBookSubject] = useState('الفيزياء');
  const [bookTrack, setBookTrack] = useState<TrackType | 'all'>('all');
  const [bookGrade, setBookGrade] = useState('الصف الثالث الثانوي');
  const [bookYear, setBookYear] = useState('2026 / 2027');
  const [bookUrl, setBookUrl] = useState('');
  const [bookSize, setBookSize] = useState('18.5 MB');
  const [bookMinistryApproved, setBookMinistryApproved] = useState(true);

  // Form states for Announcement
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annType, setAnnType] = useState<'urgent' | 'info' | 'motivation' | 'exam_news'>('urgent');
  const [annLinkText, setAnnLinkText] = useState('');

  // Form states for Formula
  const [formSubject, setFormSubject] = useState('الفيزياء');
  const [formChapter, setFormChapter] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formFormula, setFormFormula] = useState('');
  const [formVerbal, setFormVerbal] = useState('');
  const [formExplanation, setFormExplanation] = useState('');
  const [formTip, setFormTip] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAdminData(getAdminCustomData());
      setFeedback(null);
    }
  }, [isOpen]);

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  if (!isOpen) return null;

  // Add Question to current exam creation form
  const handleAddQuestionToExam = () => {
    if (!newQText.trim()) {
      showMessage('يرجى كتابة نص السؤال أولاً.', 'error');
      return;
    }

    const newQuestion: ExamQuestion = {
      number: examQuestionsList.length + 1,
      type: newQType,
      text: newQText.trim(),
      marks: Number(newQMarks) || 1,
      modelAnswer: newQAnswer.trim() || 'نموذج الإجابة الوزاري المعتمد',
      explanation: newQOutcome.trim() || 'فهم وتطبيق مخرجات نواتج التعلم',
    };

    if (newQType === 'mcq') {
      newQuestion.options = newQOptions.map((opt, i) => opt.trim() || `الخيار ${i + 1}`);
      newQuestion.correctOption = newQCorrectIdx;
    }

    setExamQuestionsList((prev) => [...prev, newQuestion]);
    setNewQText('');
    setNewQAnswer('');
    setNewQOutcome('');
    setNewQOptions(['', '', '', '']);
    showMessage('تمت إضافة السؤال إلى كراسة الامتحان الحالية بنجاح.');
  };

  // Save new exam to Admin Storage
  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examSubject.trim()) {
      showMessage('يرجى تحديد اسم المادة.', 'error');
      return;
    }

    const newExamId = `custom-exam-${Date.now()}`;
    const newExamPaper: PastExamPaper = {
      id: newExamId,
      subject: examSubject,
      year: examYear,
      session: examSession,
      track: examTrack,
      totalMarks: Number(examTotalMarks) || 60,
      durationHours: Number(examDurationHours) || 3,
      pagesCount: 16,
      officialPdfAvailable: true,
      questionsCount: examQuestionsList.length || Number(examQuestionsCount) || 46,
      description: examDescription,
      sections: [
        {
          title: 'القسم الأول: الأسئلة الموضوعية (اختيار من متعدد)',
          description: 'نظام البابل شيت وتظليل الدائرة المعبرة عن الإجابة الصحيحة',
          questions: examQuestionsList.filter((q) => q.type === 'mcq' || !q.type),
        },
        {
          title: 'القسم الثاني: الأسئلة المقالية الوزارية',
          description: 'الإجابة في المساحات المخصصة بورقة الإجابة',
          questions: examQuestionsList.filter((q) => q.type === 'essay'),
        },
      ],
    };

    addAdminExam(newExamPaper);
    setAdminData(getAdminCustomData());
    if (onRefreshData) onRefreshData();
    showMessage(`تم نشر وحفظ كراسة امتحان ${examSubject} (${examYear}) بنجاح!`);
  };

  // Save new book
  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim()) {
      showMessage('يرجى إدخال عنوان الكتاب.', 'error');
      return;
    }

    const newBook: BookResource = {
      id: `custom-book-${Date.now()}`,
      title: bookTitle.trim(),
      subject: bookSubject,
      track: bookTrack,
      grade: bookGrade,
      year: bookYear,
      downloadUrl: bookUrl.trim() || '#',
      fileSize: bookSize.trim() || '15 MB',
      isMinistryApproved: bookMinistryApproved,
    };

    addAdminBook(newBook);
    setAdminData(getAdminCustomData());
    setBookTitle('');
    setBookUrl('');
    if (onRefreshData) onRefreshData();
    showMessage(`تمت إضافة كتاب/مذكرة "${newBook.title}" بنجاح!`);
  };

  // Save new Announcement
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) {
      showMessage('يرجى كتابة عنوان ونص الإعلان.', 'error');
      return;
    }

    const newAnn: AdminAnnouncement = {
      id: `ann-${Date.now()}`,
      title: annTitle.trim(),
      message: annMessage.trim(),
      type: annType,
      active: true,
      createdAt: new Date().toISOString(),
      linkText: annLinkText.trim() || undefined,
    };

    addAdminAnnouncement(newAnn);
    setAdminData(getAdminCustomData());
    setAnnTitle('');
    setAnnMessage('');
    setAnnLinkText('');
    if (onRefreshData) onRefreshData();
    showMessage('تم نشر الإعلان على شريط الموقع بنجاح!');
  };

  // Save new Formula
  const handleSaveFormula = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formFormula.trim()) {
      showMessage('يرجى إدخال اسم القانون والصيغة الرياضية.', 'error');
      return;
    }

    const newFormula: FormulaItem = {
      id: `custom-formula-${Date.now()}`,
      subject: formSubject,
      chapter: formChapter.trim() || 'الفصل العام',
      title: formTitle.trim(),
      formula: formFormula.trim(),
      verbalForm: formVerbal.trim() || undefined,
      explanation: formExplanation.trim() || 'قانون ومفهوم وزاري أساسي للامتحان.',
      examTip: formTip.trim() || undefined,
      track: 'all',
    };

    addAdminFormula(newFormula);
    setAdminData(getAdminCustomData());
    setFormTitle('');
    setFormFormula('');
    setFormVerbal('');
    setFormExplanation('');
    setFormTip('');
    if (onRefreshData) onRefreshData();
    showMessage(`تمت إضافة قانون "${newFormula.title}" إلى بنك المفاهيم!`);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const dataStr = JSON.stringify(adminData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `thanawy-plus-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showMessage('تم تنزيل ملف النسخة الاحتياطية بنجاح!');
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          saveAdminCustomData(parsed);
          setAdminData(getAdminCustomData());
          if (onRefreshData) onRefreshData();
          showMessage('تمت استعادة البيانات بنجاح من النسخة الاحتياطية!');
        }
      } catch (err) {
        showMessage('الملف غير صالح أو تالف.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header with Admin Badge */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  لوحة تحكم المشرف والأدمن (Admin Control Hub)
                </h2>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 rounded-full text-[11px] font-bold">
                  يوسف محمد
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                إضافة وتعديل الامتحانات، الكتب والمذكرات، الإعلانات الوزارية، وبنك القوانين مباشرة على الموقع.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="إغلاق اللوحة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`px-6 py-2.5 text-xs font-bold flex items-center justify-between ${
              feedback.type === 'success'
                ? 'bg-emerald-500 text-white'
                : 'bg-rose-500 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-100/70 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>نظرة عامة وإحصائيات</span>
          </button>

          <button
            onClick={() => setActiveTab('exams')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'exams'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>إدارة الامتحانات ({adminData.exams.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('books')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'books'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>الكتب والمذكرات ({adminData.books.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'announcements'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>شريط الإعلانات ({adminData.announcements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('formulas')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'formulas'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>بنك القوانين ({adminData.formulas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>النسخ الاحتياطي والبيانات</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Quick Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">الامتحانات المضافة</p>
                  <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200 mt-1">
                    {adminData.exams.length}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">امتحانات مخصصة بنماذجها</p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-2xl">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">الكتب والمذكرات</p>
                  <p className="text-2xl font-black text-blue-900 dark:text-blue-200 mt-1">
                    {adminData.books.length}
                  </p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1">ملفات PDF مضافة للمنصة</p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">الإعلانات والتنبيهات</p>
                  <p className="text-2xl font-black text-amber-900 dark:text-amber-200 mt-1">
                    {adminData.announcements.length}
                  </p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">تنبيهات نشطة في الأعلى</p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 rounded-2xl">
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-400">القوانين والمفاهيم</p>
                  <p className="text-2xl font-black text-purple-900 dark:text-purple-200 mt-1">
                    {adminData.formulas.length}
                  </p>
                  <p className="text-[10px] text-purple-600 dark:text-purple-400 mt-1">قواعد وتريكات مضافة</p>
                </div>
              </div>

              {/* Admin Identity Card */}
              <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-700 shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center font-black text-lg border-2 border-emerald-300">
                      YM
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">يوسف محمد - المدير العام والمشرف الرئيسي</h3>
                      <p className="text-xs text-slate-300 font-mono">usefmohamed1033@gmail.com</p>
                      <p className="text-[11px] text-emerald-400 mt-0.5 font-semibold">
                        صلاحيات كاملة للتحكم بالمحتوى وتحديث المناهج والامتحانات في ثانوية بلس 2027.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('exams')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      ➕ إضافة امتحان جديد
                    </button>
                    <button
                      onClick={() => setActiveTab('announcements')}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      📢 نشر إعلان عاجل
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick List of Active Announcements */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                  الإعلانات والتنبيهات الحالية على الموقع:
                </h4>
                <div className="space-y-2">
                  {adminData.announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{ann.title}</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                            {ann.type}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">{ann.message}</p>
                      </div>
                      <button
                        onClick={() => {
                          deleteAdminAnnouncement(ann.id);
                          setAdminData(getAdminCustomData());
                          showMessage('تم حذف الإعلان بنجاح.');
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="حذف الإعلان"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXAMS MANAGEMENT */}
          {activeTab === 'exams' && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleSaveExam} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>إنشاء كراسة امتحان ونموذج إجابة جديدة</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">المادة</label>
                    <input
                      type="text"
                      value={examSubject}
                      onChange={(e) => setExamSubject(e.target.value)}
                      placeholder="مثال: الفيزياء، الكيمياء، اللغة العربية"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">الشعبة</label>
                    <select
                      value={examTrack}
                      onChange={(e) => setExamTrack(e.target.value as TrackType | 'all')}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="all">جميع الشُعب (مشترك)</option>
                      <option value="sci_math">علمي رياضة</option>
                      <option value="sci_science">علمي علوم</option>
                      <option value="lit">أدبي</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">سنة الامتحان</label>
                    <input
                      type="text"
                      value={examYear}
                      onChange={(e) => setExamYear(e.target.value)}
                      placeholder="2026 أو 2027"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">الدور</label>
                    <input
                      type="text"
                      value={examSession}
                      onChange={(e) => setExamSession(e.target.value)}
                      placeholder="الدور الأول / نموذج الوزارة الاسترشادي"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">الزمن الكلي (بالساعات)</label>
                    <input
                      type="number"
                      value={examDurationHours}
                      onChange={(e) => setExamDurationHours(e.target.value)}
                      placeholder="3"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">الدرجة الكلية</label>
                    <input
                      type="number"
                      value={examTotalMarks}
                      onChange={(e) => setExamTotalMarks(e.target.value)}
                      placeholder="60"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Sub-form: Add Questions to this exam */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      إضافة أسئلة لكراسة الامتحان ({examQuestionsList.length} أسئلة حالياً):
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNewQType('mcq')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          newQType === 'mcq' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        اختيار من متعدد (بابل شيت)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewQType('essay')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          newQType === 'essay' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        سؤال مقالي وزاري
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={newQText}
                    onChange={(e) => setNewQText(e.target.value)}
                    placeholder="اكتب نص السؤال هنا..."
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />

                  {newQType === 'mcq' && (
                    <div className="grid grid-cols-2 gap-2">
                      {newQOptions.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <input
                            type="radio"
                            name="correctOpt"
                            checked={newQCorrectIdx === idx}
                            onChange={() => setNewQCorrectIdx(idx)}
                            title="تحديد كإجابة صحيحة"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updated = [...newQOptions];
                              updated[idx] = e.target.value;
                              setNewQOptions(updated);
                            }}
                            placeholder={`الخيار (${String.fromCharCode(1571 + idx)})`}
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newQAnswer}
                      onChange={(e) => setNewQAnswer(e.target.value)}
                      placeholder="نموذج الإجابة والتفسير العلمي..."
                      className="text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                    />
                    <input
                      type="text"
                      value={newQOutcome}
                      onChange={(e) => setNewQOutcome(e.target.value)}
                      placeholder="نواتج التعلم المستهدفة..."
                      className="text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuestionToExam}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    ➕ إدراج هذا السؤال في كراسة الامتحان
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>نشر وحفظ كراسة الامتحان على المنصة الآن</span>
                </button>
              </form>

              {/* List of Custom Exams */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  الامتحانات المخصصة المضافة بواسطة الأدمن ({adminData.exams.length}):
                </h4>
                {adminData.exams.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">لا توجد امتحانات مخصصة بعد. أضف أول امتحان من النموذج أعلاه.</p>
                ) : (
                  adminData.exams.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between gap-4 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                            امتحان {ex.subject} ({ex.year} - {ex.session})
                          </h5>
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                            {ex.totalMarks} درجة • {ex.questionsCount || 46} سؤال
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          الشعبة: {ex.track === 'sci_math' ? 'علمي رياضة' : ex.track === 'sci_science' ? 'علمي علوم' : ex.track === 'lit' ? 'أدبي' : 'مشترك'} • الزمن: {ex.durationHours || 3} ساعات
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          deleteAdminExam(ex.id);
                          setAdminData(getAdminCustomData());
                          if (onRefreshData) onRefreshData();
                          showMessage('تم حذف كراسة الامتحان بنجاح.');
                        }}
                        className="text-rose-500 hover:text-rose-700 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="حذف هذا الامتحان"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BOOKS MANAGEMENT */}
          {activeTab === 'books' && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleSaveBook} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>إضافة كتاب مدرسي أو مذكرة PDF جديدة</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">عنوان الكتاب أو المذكرة</label>
                    <input
                      type="text"
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      placeholder="مثال: كتاب الوزارة في الفيزياء 2027"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">المادة</label>
                    <input
                      type="text"
                      value={bookSubject}
                      onChange={(e) => setBookSubject(e.target.value)}
                      placeholder="الفيزياء، الكيمياء، الرياضيات..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">الشعبة</label>
                    <select
                      value={bookTrack}
                      onChange={(e) => setBookTrack(e.target.value as TrackType | 'all')}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="all">جميع الشُعب</option>
                      <option value="sci_math">علمي رياضة</option>
                      <option value="sci_science">علمي علوم</option>
                      <option value="lit">أدبي</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">رابط تحميل / فتح الـ PDF</label>
                    <input
                      type="url"
                      value={bookUrl}
                      onChange={(e) => setBookUrl(e.target.value)}
                      placeholder="https://example.com/book.pdf"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">حجم الملف</label>
                    <input
                      type="text"
                      value={bookSize}
                      onChange={(e) => setBookSize(e.target.value)}
                      placeholder="مثال: 18.5 MB"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>حفظ وإضافة الكتاب إلى مكتبة المنصة</span>
                </button>
              </form>

              {/* Books List */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  الكتب المضافة بواسطة الأدمن ({adminData.books.length}):
                </h4>
                {adminData.books.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">لا توجد كتب مضافة بعد.</p>
                ) : (
                  adminData.books.map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900 dark:text-white">{b.title}</h5>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-semibold">
                            {b.fileSize}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                          المادة: {b.subject} • السنة: {b.year}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          deleteAdminBook(b.id);
                          setAdminData(getAdminCustomData());
                          if (onRefreshData) onRefreshData();
                          showMessage('تم حذف الكتاب بنجاح.');
                        }}
                        className="text-rose-500 hover:text-rose-700 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="حذف هذا الكتاب"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleSaveAnnouncement} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>نشر تنبيه أو إعلان عاجل في شريط الموقع</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">عنوان الإعلان</label>
                    <input
                      type="text"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      placeholder="مثال: تنبيه هام بخصوص موعد امتحانات 2027"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">نوع الإعلان</label>
                    <select
                      value={annType}
                      onChange={(e) => setAnnType(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="urgent">عاجل وهام (أحمر)</option>
                      <option value="exam_news">أخبار الامتحانات (أخضر)</option>
                      <option value="motivation">رسالة تحفيزية (ذهبي)</option>
                      <option value="info">إرشادات عامة (أزرق)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">نص الرسالة</label>
                  <textarea
                    value={annMessage}
                    onChange={(e) => setAnnMessage(e.target.value)}
                    placeholder="اكتب تفاصيل التنبيه أو الإعلان هنا ليظهر لجميع الطلاب..."
                    rows={3}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>نشر الإعلان على المنصة فوراً</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: FORMULAS */}
          {activeTab === 'formulas' && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleSaveFormula} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>إضافة قانون أو قاعدة علمية جديدة لبنك المفاهيم</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">المادة</label>
                    <input
                      type="text"
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      placeholder="الفيزياء، الكيمياء، الرياضيات..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">الفصل / الباب</label>
                    <input
                      type="text"
                      value={formChapter}
                      onChange={(e) => setFormChapter(e.target.value)}
                      placeholder="الباب الأول: التيار الكهربي"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">اسم القانون / المفهوم</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="قانون أوم المغلق"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">الصيغة الرياضية والرمزية</label>
                    <input
                      type="text"
                      value={formFormula}
                      onChange={(e) => setFormFormula(e.target.value)}
                      placeholder="V = V_B - I*r"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">الصيغة اللفظية بالحروف والكلمات</label>
                    <input
                      type="text"
                      value={formVerbal}
                      onChange={(e) => setFormVerbal(e.target.value)}
                      placeholder="فرق الجهد = القوة الدافعة ناقص الهبوط في الجهد"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">الشرح العلمي</label>
                    <input
                      type="text"
                      value={formExplanation}
                      onChange={(e) => setFormExplanation(e.target.value)}
                      placeholder="شرح مبسط لكيفية تطبيق القانون..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">تريك ليلة الامتحان</label>
                    <input
                      type="text"
                      value={formTip}
                      onChange={(e) => setFormTip(e.target.value)}
                      placeholder="ملاحظة هامة على العلاقات البيانية أو الحالات الخاصة..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>إضافة القانون إلى بنك المفاهيم</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: BACKUP */}
          {activeTab === 'backup' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>تصدير واستيراد البيانات (Data Backup & Restore)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  يمكنك حفظ جميع الإضافات والتعديلات كملف JSON واستعادتها في أي وقت على أي جهاز آخر.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleExportBackup}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>تصدير نسخة احتياطية (JSON)</span>
                  </button>

                  <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>استيراد ملف نسخة احتياطية</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => {
                      if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط إضافات الأدمن إلى الوضع الافتراضي؟')) {
                        localStorage.removeItem('thanawy_admin_custom_data_v1');
                        setAdminData(getAdminCustomData());
                        if (onRefreshData) onRefreshData();
                        showMessage('تمت إعادة الضبط بنجاح.');
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>إعادة ضبط المصنع</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <span>المنصة: ثانوي بلس 2027 • حساب الأدمن الرسمي</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-800 cursor-pointer"
          >
            إغلاق اللوحة
          </button>
        </div>

      </div>
    </div>
  );
};
