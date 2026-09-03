import { PastExamPaper, ExamQuestion } from '../data/pastExamPapers';
import { BookResource, FormulaItem, TrackType } from '../types';

export const ADMIN_EMAIL = 'usefmohamed1033@gmail.com';
export const ADMIN_PASSWORD = 'usef9900';

export interface AdminAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'info' | 'motivation' | 'exam_news';
  active: boolean;
  createdAt: string;
  linkText?: string;
  linkUrl?: string;
}

export interface AdminCustomData {
  exams: PastExamPaper[];
  books: BookResource[];
  announcements: AdminAnnouncement[];
  formulas: FormulaItem[];
  siteSettings: {
    platformName: string;
    academicYear: string;
    customBannerText?: string;
    maintenanceMode: boolean;
  };
}

const STORAGE_KEY = 'thanawy_admin_custom_data_v1';

const DEFAULT_ANNOUNCEMENTS: AdminAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'تحديث نماذج امتحانات الوزارة 2027',
    message: 'تم إضافة نماذج امتحانات الثانوية العامة المعتمدة رسمياً بنظام البابل شيت والمقالي مع الإجابات النموذجية.',
    type: 'urgent',
    active: true,
    createdAt: new Date().toISOString(),
    linkText: 'عرض كراسات الامتحانات',
  },
  {
    id: 'ann-2',
    title: 'رسالة تحفيزية لدفعة 2027',
    message: '«لكل مجتهد نصيب، والقمة تتسع للجميع» - استمر في المذاكرة الذكية وتنظيم وقتك يومياً.',
    type: 'motivation',
    active: true,
    createdAt: new Date().toISOString(),
  }
];

export function getAdminCustomData(): AdminCustomData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        exams: parsed.exams || [],
        books: parsed.books || [],
        announcements: parsed.announcements || DEFAULT_ANNOUNCEMENTS,
        formulas: parsed.formulas || [],
        siteSettings: parsed.siteSettings || {
          platformName: 'ثانوي بلس 2027',
          academicYear: '2026/2027',
          maintenanceMode: false,
        }
      };
    }
  } catch (e) {
    console.error('Error reading admin custom data:', e);
  }

  return {
    exams: [],
    books: [],
    announcements: DEFAULT_ANNOUNCEMENTS,
    formulas: [],
    siteSettings: {
      platformName: 'ثانوي بلس 2027',
      academicYear: '2026/2027',
      maintenanceMode: false,
    }
  };
}

export function saveAdminCustomData(data: AdminCustomData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Dispatch custom event for real-time reactivity across components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('thanawy_admin_data_updated', { detail: data }));
    }
  } catch (e) {
    console.error('Error saving admin custom data:', e);
  }
}

// Helper methods for Exams
export function addAdminExam(exam: PastExamPaper): void {
  const data = getAdminCustomData();
  const existingIdx = data.exams.findIndex((e) => e.id === exam.id);
  if (existingIdx >= 0) {
    data.exams[existingIdx] = exam;
  } else {
    data.exams.unshift(exam);
  }
  saveAdminCustomData(data);
}

export function deleteAdminExam(examId: string): void {
  const data = getAdminCustomData();
  data.exams = data.exams.filter((e) => e.id !== examId);
  saveAdminCustomData(data);
}

// Helper methods for Books
export function addAdminBook(book: BookResource): void {
  const data = getAdminCustomData();
  const existingIdx = data.books.findIndex((b) => b.id === book.id);
  if (existingIdx >= 0) {
    data.books[existingIdx] = book;
  } else {
    data.books.unshift(book);
  }
  saveAdminCustomData(data);
}

export function deleteAdminBook(bookId: string): void {
  const data = getAdminCustomData();
  data.books = data.books.filter((b) => b.id !== bookId);
  saveAdminCustomData(data);
}

// Helper methods for Announcements
export function addAdminAnnouncement(announcement: AdminAnnouncement): void {
  const data = getAdminCustomData();
  const existingIdx = data.announcements.findIndex((a) => a.id === announcement.id);
  if (existingIdx >= 0) {
    data.announcements[existingIdx] = announcement;
  } else {
    data.announcements.unshift(announcement);
  }
  saveAdminCustomData(data);
}

export function deleteAdminAnnouncement(announcementId: string): void {
  const data = getAdminCustomData();
  data.announcements = data.announcements.filter((a) => a.id !== announcementId);
  saveAdminCustomData(data);
}

// Helper methods for Formulas
export function addAdminFormula(formula: FormulaItem): void {
  const data = getAdminCustomData();
  const existingIdx = data.formulas.findIndex((f) => f.id === formula.id);
  if (existingIdx >= 0) {
    data.formulas[existingIdx] = formula;
  } else {
    data.formulas.unshift(formula);
  }
  saveAdminCustomData(data);
}

export function deleteAdminFormula(formulaId: string): void {
  const data = getAdminCustomData();
  data.formulas = data.formulas.filter((f) => f.id !== formulaId);
  saveAdminCustomData(data);
}

// Check if a user is admin
export function isUserAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
