export type TrackType = 'sci_math' | 'sci_science' | 'lit';

export interface SubjectChapter {
  id: string;
  name: string;
  description?: string;
  lessons?: string[];
  keyLaw?: string;
}

export interface Subject {
  id: string;
  name: string;
  mark: number;
  iconName: string;
  color: string;
  chapters: SubjectChapter[];
}

export interface TrackConfig {
  id: TrackType;
  name: string;
  titleArabic: string;
  totalMarks: number;
  subjects: Subject[];
}

export type StudyDayType = 'intensive' | 'revision' | 'exam_prep' | 'rest' | 'normal';

export interface StudyDayPlan {
  date: string; // YYYY-MM-DD
  type: StudyDayType;
  title?: string;
  note?: string;
  targetSubjects?: string[];
  reminderTime?: string; // e.g. "16:00"
  notifyEnabled?: boolean;
}

export interface StudyCalendarData {
  [dateString: string]: StudyDayPlan; // key is 'YYYY-MM-DD'
}

export interface TaskItem {
  id: number;
  text: string;
  subject?: string;
  priority?: 'high' | 'medium' | 'low';
  done: boolean;
  createdAt: string;
  dueDate?: string; // YYYY-MM-DD
}

export interface ExamResource {
  id: string;
  subject: string;
  track: TrackType | 'all';
  years: { [year: string]: string };
  solutionVideoUrl?: string;
}

export interface BookResource {
  id: string;
  title: string;
  subject: string;
  track: TrackType | 'all';
  grade: string;
  year: string;
  downloadUrl: string;
  fileSize?: string;
  isMinistryApproved: boolean;
}

export interface AiQuestionItem {
  question: string;
  answer: string;
}

export interface FlashcardItem {
  front: string;
  back: string;
}

export interface AiAnalysisResult {
  source: 'gemini' | 'offline_fallback';
  summary: string;
  keypoints: string[];
  questions: AiQuestionItem[];
  flashcards: FlashcardItem[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserProgressData {
  [subjectName: string]: boolean[]; // boolean array per chapter index
}

export interface LessonAppointment {
  id: string;
  subject: string;
  teacherName: string;
  dayOfWeek: string; // e.g. "السبت", "الأحد", etc.
  startTime: string; // "16:00"
  endTime: string; // "18:00"
  locationType: 'center' | 'online' | 'private';
  locationName?: string; // e.g. "سنتر الأوائل - قاعة 3" or Zoom link
  notes?: string;
  monthlyFee?: number;
  reminderEnabled?: boolean;
}

export interface AiSchedulePlanDay {
  date: string; // YYYY-MM-DD
  dayName: string; // e.g. "اليوم 1 - السبت"
  type: StudyDayType;
  title: string;
  targetSubjects: string[];
  note: string;
  tasks: { text: string; subject: string; priority: 'high' | 'medium' | 'low' }[];
}

export interface AiSchedulePlanResult {
  source: 'gemini' | 'offline_fallback';
  planTitle: string;
  totalDays: number;
  summary: string;
  tips: string[];
  days: AiSchedulePlanDay[];
}

export interface GmailMessage {
  id: string;
  threadId?: string;
  from: string;
  to?: string;
  subject: string;
  snippet: string;
  bodyText?: string;
  date: string;
  unread: boolean;
  category?: 'exam' | 'teacher' | 'school' | 'general';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  provider: 'google' | 'facebook' | 'email' | 'email_otp' | 'admin_credentials';
  role?: 'admin' | 'student';
  isAdmin?: boolean;
  avatarUrl?: string;
  track?: TrackType;
  targetScore?: string;
  targetCollege?: string;
  dreamCollegeId?: string;
  targetUniversityId?: string;
  schoolName?: string;
  verified?: boolean;
  verifiedAt?: string;
  createdAt: string;
}

export interface FormulaSymbolMeaning {
  symbol: string;
  meaning: string;
  unit?: string;
}

export interface FormulaItem {
  id: string;
  subject: string;
  chapter: string;
  title: string;
  formula: string; // الصيغة الرمزية والرياضية
  verbalForm?: string; // الصيغة اللفظية المكتوبة بالحروف والكلمات باللغة العربية
  symbolsGuide?: FormulaSymbolMeaning[]; // دليل معاني الحروف والرموز ووحدات القياس
  explanation: string;
  examTip?: string;
  track: TrackType | 'all';
}

export interface CollegePrediction {
  id: string;
  name: string;
  category: 'medical' | 'engineering' | 'humanities' | 'commerce' | 'applied' | 'languages';
  track: TrackType | 'all';
  minScore2024: number; // Percentage, e.g. 91.5
  minScore2025Expected: number;
  description: string;
  careerProspects: string[];
  requiresAptitudeTest?: boolean;
}

export interface MistakeItem {
  id: string;
  subject: string;
  topic: string;
  question: string;
  myMistake: string;
  correctAnswer: string;
  keyTakeaway: string;
  difficulty: 'hard' | 'medium' | 'trick';
  resolved: boolean;
  createdAt: string;
}

export interface TeacherChannel {
  id: string;
  teacherName: string;
  subject: string;
  platform: 'youtube' | 'platform' | 'center';
  url: string;
  description: string;
  features: string[];
  isVerified: boolean;
  avatarUrl?: string;
}

export interface DuaaItem {
  id: string;
  title: string;
  occasion: 'before_study' | 'after_study' | 'exam_day' | 'forgetting' | 'anxiety' | 'success';
  arabicText: string;
  benefit: string;
}

export interface AppState {
  dark: boolean;
  activeTab: 'home' | 'curriculum' | 'books' | 'exams' | 'pomodoro' | 'progress' | 'lessons' | 'gmail' | 'formulas' | 'duaa' | 'quran' | 'dev' | 'iq_test';
  track: TrackType;
  examTrack: TrackType;
  tasks: TaskItem[];
  lessons: LessonAppointment[];
  progress: UserProgressData;
  pomodoroSessions: number;
  targetExamDate: string;
  notes: { id: string; title: string; content: string; subject: string; date: string }[];
}
