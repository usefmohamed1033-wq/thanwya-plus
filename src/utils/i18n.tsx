import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'en';

export interface ScientificTerm {
  ar: string;
  en: string;
  category: 'math' | 'physics' | 'chemistry' | 'biology' | 'geology' | 'general';
  descriptionAr?: string;
  descriptionEn?: string;
}

export const SCIENTIFIC_TERMS: ScientificTerm[] = [
  // Physics
  { ar: 'قانون أوم', en: "Ohm's Law", category: 'physics', descriptionAr: 'العلاقة بين فرق الجهد وشدة التيار والمقاومة', descriptionEn: 'V = I * R relationship' },
  { ar: 'قانون كيرشوف', en: "Kirchhoff's Laws", category: 'physics', descriptionAr: 'قوانين حفظ الشحنة والطاقة في الدوائر الكهربية', descriptionEn: 'Current and voltage loop laws' },
  { ar: 'الحث الكهرومغناطيسي', en: 'Electromagnetic Induction', category: 'physics', descriptionAr: 'توليد قوة دافعة كهربية مستحثة', descriptionEn: 'Inducing EMF through magnetic flux variation' },
  { ar: 'دينامو التيار المتردد', en: 'AC Generator (Dynamo)', category: 'physics' },
  { ar: 'المحول الكهربي', en: 'Electric Transformer', category: 'physics' },
  { ar: 'ازدواجية الموجة والجسيم', en: 'Wave-Particle Duality', category: 'physics' },
  { ar: 'التأثير الكهروضوئي', en: 'Photoelectric Effect', category: 'physics' },
  { ar: 'أشعة الليزر', en: 'Laser (Stimulated Emission)', category: 'physics' },
  { ar: 'الدوائر المنطقية والترانزستور', en: 'Logic Gates & Transistors', category: 'physics' },

  // Chemistry
  { ar: 'العناصر الانتقالية', en: 'Transition Elements', category: 'chemistry' },
  { ar: 'التحليل الكيميائي', en: 'Chemical Analysis', category: 'chemistry' },
  { ar: 'الاتزان الكيميائي', en: 'Chemical Equilibrium', category: 'chemistry' },
  { ar: 'الكيمياء الكهربية', en: 'Electrochemistry', category: 'chemistry' },
  { ar: 'الكيمياء العضوية', en: 'Organic Chemistry', category: 'chemistry' },
  { ar: 'الهيدروكربونات الأليفاتية', en: 'Aliphatic Hydrocarbons', category: 'chemistry' },
  { ar: 'المركبات الأروماتية', en: 'Aromatic Compounds', category: 'chemistry' },
  { ar: 'الخلايا الجلفانية والإلكتروليتية', en: 'Galvanic & Electrolytic Cells', category: 'chemistry' },

  // Math
  { ar: 'التفاضل والتكامل', en: 'Calculus (Differentiation & Integration)', category: 'math' },
  { ar: 'المشتقات العليا', en: 'Higher Order Derivatives', category: 'math' },
  { ar: 'معادلة المماس والعمودي', en: 'Tangent & Normal Lines', category: 'math' },
  { ar: 'التكامل المحدد وغير المحدد', en: 'Definite & Indefinite Integration', category: 'math' },
  { ar: 'الجبر والهندسة الفراغية', en: 'Algebra & Solid Geometry', category: 'math' },
  { ar: 'نظرية ذات الحدين', en: 'Binomial Theorem', category: 'math' },
  { ar: 'الأعداد المركبة والصورة المثلثية', en: 'Complex Numbers & Polar Form', category: 'math' },
  { ar: 'المحددات والمصفوفات', en: 'Determinants & Matrices', category: 'math' },
  { ar: 'الاستاتيكا (علم السكون)', en: 'Statics', category: 'math' },
  { ar: 'الديناميكا (علم الحركة)', en: 'Dynamics', category: 'math' },
  { ar: 'قوانين نيوتن للحركة', en: "Newton's Laws of Motion", category: 'math' },
  { ar: 'الدفع والتصادم', en: 'Impulse & Momentum', category: 'math' },
  { ar: 'الشغل والطاقة والقدرة', en: 'Work, Energy & Power', category: 'math' },

  // Biology & Geology
  { ar: 'الدعامة والحركة', en: 'Support & Movement in Living Organisms', category: 'biology' },
  { ar: 'التنسيق الهرموني', en: 'Hormonal Coordination', category: 'biology' },
  { ar: 'التكاثر في الكائنات الحية', en: 'Reproduction in Organisms', category: 'biology' },
  { ar: 'المناعة في الإنسان', en: 'Immunity in Humans', category: 'biology' },
  { ar: 'الحمض النووي والبيولوجيا الجزيئية', en: 'DNA & Molecular Biology', category: 'biology' },
  { ar: 'تخليق البروتين', en: 'Protein Synthesis', category: 'biology' },
  { ar: 'الجيولوجيا وعلوم البيئة', en: 'Geology & Environmental Sciences', category: 'geology' },
  { ar: 'تكتونية الصفائح والزلازل', en: 'Plate Tectonics & Earthquakes', category: 'geology' },
];

export interface TranslationDictionary {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const DICTIONARY: TranslationDictionary = {
  // Brand & Header
  'app.name': { ar: 'ثانوي بلس 2027', en: 'Thanawy Plus 2027' },
  'app.tagline': { ar: 'المنصة الذكية للثانوية العامة المصرية', en: 'The Smart Platform for Egyptian High School' },
  'app.badge': { ar: '2027', en: '2027' },

  // Tracks
  'track.sci_math': { ar: 'علمي رياضة', en: 'Scientific - Math' },
  'track.sci_science': { ar: 'علمي علوم', en: 'Scientific - Science' },
  'track.lit': { ar: 'أدبي', en: 'Literary Track' },
  'track.select': { ar: 'اختر الشعبة', en: 'Select Track' },
  'track.current': { ar: 'الشعبة الحالية', en: 'Current Track' },

  // Navigation Items
  'nav.home': { ar: 'الرئيسية والجدول', en: 'Home & Schedule' },
  'nav.home_short': { ar: 'الرئيسية', en: 'Home' },
  'nav.home_desc': { ar: 'الجدول الدراسي والمهام اليومية', en: 'Study calendar & daily tasks' },

  'nav.calculator': { ar: 'حاسبة التنسيق والقبول الجامعي', en: 'College Admission Calculator' },
  'nav.calculator_short': { ar: 'حاسبة التنسيق', en: 'Admission Calc' },
  'nav.calculator_desc': { ar: 'توقع الكليات المتاحة وحساب الهدف', en: 'Predict university programs & targets' },

  'nav.formulas': { ar: 'بنك القوانين والمفاهيم الوزارية', en: 'Formulas & Concepts Bank' },
  'nav.formulas_short': { ar: 'بنك القوانين', en: 'Formulas Bank' },
  'nav.formulas_desc': { ar: 'كتيب القوانين والتريكات ليلة الامتحان', en: 'Cheat-sheets, key laws & formulas' },

  'nav.mistakes': { ar: 'دفتر الأخطاء والتريكات', en: 'Mistakes & Tricks Notebook' },
  'nav.mistakes_short': { ar: 'دفتر الأخطاء', en: 'Mistakes Log' },
  'nav.mistakes_desc': { ar: 'سجل الأسئلة الصعبة وتفادي التكرار', en: 'Review hard questions & avoid mistakes' },

  'nav.lessons': { ar: 'مواعيد الدروس والحصص', en: 'Lessons & Classes Schedule' },
  'nav.lessons_short': { ar: 'مواعيد الدروس', en: 'Classes' },
  'nav.lessons_desc': { ar: 'تسجيل حصص السنتر والمدرسين', en: 'Track private center & tutor appointments' },

  'nav.teachers': { ar: 'دليل المعلمين وقنوات الشرح', en: 'Teachers & YouTube Directory' },
  'nav.teachers_short': { ar: 'دليل المعلمين', en: 'Teachers' },
  'nav.teachers_desc': { ar: 'أفضل قنوات يوتيوب للمواد', en: 'Top free channels & educators' },

  'nav.curriculum': { ar: 'المنهج والدروس 2027', en: 'Curriculum & Lessons 2027' },
  'nav.curriculum_short': { ar: 'المنهج', en: 'Curriculum' },
  'nav.curriculum_desc': { ar: 'خطة المواد ونواتج التعلم', en: 'Subject roadmaps & learning outcomes' },

  'nav.books': { ar: 'الكتب المدرسية الرسمية', en: 'Official Ministry Books' },
  'nav.books_short': { ar: 'الكتب', en: 'Books' },
  'nav.books_desc': { ar: 'تحميل وقراءة بصيغة PDF', en: 'Download & read official PDFs' },

  'nav.exams': { ar: 'امتحانات سابقة وتدريبات', en: 'Past Exams & Drills' },
  'nav.exams_short': { ar: 'الامتحانات', en: 'Past Exams' },
  'nav.exams_desc': { ar: 'نماذج الوزارة والتدريبات التفاعلية', en: 'Official ministry past papers' },

  'nav.pomodoro': { ar: 'مؤقت التركيز Pomodoro', en: 'Pomodoro Focus Timer' },
  'nav.pomodoro_short': { ar: 'المؤقت', en: 'Focus Timer' },
  'nav.pomodoro_desc': { ar: 'جلسات المذاكرة وأصوات الطبيعة', en: 'Deep work loops & ambient sounds' },

  'nav.duaa': { ar: 'أدعية وأذكار المذاكرة', en: 'Study Duaa & Athkar' },
  'nav.duaa_short': { ar: 'الأدعية والأذكار', en: 'Duaa & Athkar' },
  'nav.duaa_desc': { ar: 'تيسير الفهم وتثبيت الحفظ والمسبحة', en: 'Daily remembrance & focus prayers' },

  'nav.progress': { ar: 'تتبع التقدم والإحصائيات', en: 'Progress & Analytics' },
  'nav.progress_short': { ar: 'الإحصائيات', en: 'Analytics' },
  'nav.progress_desc': { ar: 'مستوى الإنجاز والنسخ الاحتياطي', en: 'Achievement rates & backup' },

  'nav.ai': { ar: 'المساعد الذكي (قيد التطوير)', en: 'AI Tutor (In Progress)' },
  'nav.ai_short': { ar: 'الذكاء الاصطناعي', en: 'AI Tutor' },

  // Common UI Actions & Controls
  'btn.login': { ar: 'تسجيل الدخول', en: 'Sign In' },
  'btn.logout': { ar: 'تسجيل الخروج', en: 'Log Out' },
  'btn.share': { ar: 'مشاركة الإنجاز', en: 'Share Achievement' },
  'btn.dark_mode': { ar: 'الوضع الليلي', en: 'Dark Mode' },
  'btn.light_mode': { ar: 'الوضع المضيء', en: 'Light Mode' },
  'btn.sound_on': { ar: 'كتم الأصوات', en: 'Mute Sounds' },
  'btn.sound_off': { ar: 'تفعيل الأصوات', en: 'Enable Sounds' },
  'btn.language': { ar: 'اللغة', en: 'Language' },
  'btn.lang_ar': { ar: 'العربية', en: 'Arabic (العربية)' },
  'btn.lang_en': { ar: 'الإنجليزية', en: 'English' },
  'btn.scientific_terms': { ar: 'المصطلحات العلمية', en: 'Scientific Glossary' },
  'btn.save': { ar: 'حفظ', en: 'Save' },
  'btn.cancel': { ar: 'إلغاء', en: 'Cancel' },
  'btn.add_task': { ar: 'إضافة مهمة', en: 'Add Task' },
  'btn.search': { ar: 'بحث...', en: 'Search...' },
  'btn.download': { ar: 'تحميل', en: 'Download' },
  'btn.view': { ar: 'عرض', en: 'View' },
  'btn.filter': { ar: 'تصفية', en: 'Filter' },
  'btn.all': { ar: 'الكل', en: 'All' },
  'btn.active': { ar: 'قيد التنفيذ', en: 'In Progress' },
  'btn.completed': { ar: 'المكتملة', en: 'Completed' },
  'btn.close': { ar: 'إغلاق', en: 'Close' },
  'btn.confirm': { ar: 'تأكيد', en: 'Confirm' },

  // Banner & Notifications
  'banner.countdown': { ar: 'العد التنازلي لامتحانات الثانوية العامة', en: 'High School Final Exams Countdown' },
  'banner.days_left': { ar: 'يوماً متبقياً', en: 'days left' },
  'status.online': { ar: 'متصل بالإنترنت', en: 'Online' },
  'status.offline': { ar: 'وضع عدم الاتصال (أوفلاين) - البيانات محفوظة محلياً', en: 'Offline Mode - Data saved locally' },

  // Subjects Bilingual Map
  'subject.arabic': { ar: 'اللغة العربية', en: 'Arabic Language' },
  'subject.english': { ar: 'اللغة الأجنبية الأولى (إنجليزي)', en: 'English (First Foreign Language)' },
  'subject.french': { ar: 'اللغة الأجنبية الثانية', en: 'Second Foreign Language' },
  'subject.physics': { ar: 'الفيزياء', en: 'Physics' },
  'subject.chemistry': { ar: 'الكيمياء', en: 'Chemistry' },
  'subject.biology': { ar: 'الأحياء', en: 'Biology' },
  'subject.geology': { ar: 'الجيولوجيا وعلوم البيئة', en: 'Geology & Environmental Science' },
  'subject.pure_math': { ar: 'الرياضيات البحتة (تفاضل وتكامل وجبر فراغية)', en: 'Pure Mathematics (Calculus & Solid Algebra)' },
  'subject.applied_math': { ar: 'الرياضيات التطبيقية (استاتيكا وديناميكا)', en: 'Applied Mathematics (Statics & Dynamics)' },
  'subject.history': { ar: 'التاريخ', en: 'History' },
  'subject.geography': { ar: 'الجغرافيا', en: 'Geography' },
  'subject.philosophy': { ar: 'الفلسفة والمنطق', en: 'Philosophy & Logic' },
  'subject.psychology': { ar: 'علم النفس والاجتماع', en: 'Psychology & Sociology' },

  // Footer & Meta
  'footer.rights': { ar: 'جميع الحقوق محفوظة لطلاب الثانوية العامة المصرية 2027', en: 'All rights reserved for Egyptian Thanaweya Amma 2027 Students' },
  'footer.description': { ar: 'منصة تعليمية ذكية متكاملة مصممة خصيصاً لمساعدة طلاب الثانوية العامة في تنظيم المذاكرة والوصول للقمة.', en: 'Comprehensive smart educational platform built specifically to empower high school students to achieve their dreams.' },
};

interface LanguageContextType {
  lang: Language;
  dir: 'rtl' | 'ltr';
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string, defaultVal?: string) => string;
  getSubjectName: (subjectKeyOrName: string) => { ar: string; en: string };
  scientificTerms: ScientificTerm[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('thanawy_lang');
      if (saved === 'ar' || saved === 'en') return saved;
    } catch (e) {}
    return 'ar';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('thanawy_lang', newLang);
    } catch (e) {}
  };

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const t = (key: string, defaultVal?: string): string => {
    const entry = DICTIONARY[key];
    if (entry && entry[lang]) {
      return entry[lang];
    }
    return defaultVal || entry?.ar || key;
  };

  const getSubjectName = (subjectKeyOrName: string) => {
    const match = Object.values(DICTIONARY).find(
      (entry) => entry.ar === subjectKeyOrName || entry.en === subjectKeyOrName
    );
    if (match) {
      return { ar: match.ar, en: match.en };
    }
    return { ar: subjectKeyOrName, en: subjectKeyOrName };
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        dir,
        setLang,
        toggleLang,
        t,
        getSubjectName,
        scientificTerms: SCIENTIFIC_TERMS,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
