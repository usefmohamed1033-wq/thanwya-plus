import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  BookOpen,
  DollarSign,
  AlertCircle,
  Video,
  Building,
  Home,
  BellRing,
  Filter,
  Check
} from 'lucide-react';
import { LessonAppointment, TrackConfig } from '../types';

interface LessonsScheduleViewProps {
  currentTrack: TrackConfig;
  lessons: LessonAppointment[];
  onAddLesson: (lesson: Omit<LessonAppointment, 'id'>) => void;
  onUpdateLesson: (lesson: LessonAppointment) => void;
  onDeleteLesson: (id: string) => void;
  onSyncLessonsToCalendar?: () => void;
}

const WEEKDAYS = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

export const LessonsScheduleView: React.FC<LessonsScheduleViewProps> = ({
  currentTrack,
  lessons,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onSyncLessonsToCalendar,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  // Form State
  const [subject, setSubject] = useState(currentTrack.subjects[0]?.name || 'الفيزياء');
  const [teacherName, setTeacherName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('السبت');
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('18:00');
  const [locationType, setLocationType] = useState<'center' | 'online' | 'private'>('center');
  const [locationName, setLocationName] = useState('');
  const [notes, setNotes] = useState('');
  const [monthlyFee, setMonthlyFee] = useState<string>('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingLessonId(null);
    setSubject(currentTrack.subjects[0]?.name || 'الفيزياء');
    setTeacherName('');
    setDayOfWeek('السبت');
    setStartTime('16:00');
    setEndTime('18:00');
    setLocationType('center');
    setLocationName('');
    setNotes('');
    setMonthlyFee('');
    setReminderEnabled(true);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (lesson: LessonAppointment) => {
    setEditingLessonId(lesson.id);
    setSubject(lesson.subject);
    setTeacherName(lesson.teacherName);
    setDayOfWeek(lesson.dayOfWeek);
    setStartTime(lesson.startTime);
    setEndTime(lesson.endTime);
    setLocationType(lesson.locationType);
    setLocationName(lesson.locationName || '');
    setNotes(lesson.notes || '');
    setMonthlyFee(lesson.monthlyFee ? String(lesson.monthlyFee) : '');
    setReminderEnabled(lesson.reminderEnabled ?? true);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) {
      showToast('⚠️ يرجى كتابة اسم المدرس أو الأستاذ');
      return;
    }

    if (editingLessonId) {
      onUpdateLesson({
        id: editingLessonId,
        subject,
        teacherName: teacherName.trim(),
        dayOfWeek,
        startTime,
        endTime,
        locationType,
        locationName: locationName.trim(),
        notes: notes.trim(),
        monthlyFee: monthlyFee ? Number(monthlyFee) : undefined,
        reminderEnabled,
      });
      showToast('✅ تم تحديث ميعاد الحصة بنجاح!');
    } else {
      onAddLesson({
        subject,
        teacherName: teacherName.trim(),
        dayOfWeek,
        startTime,
        endTime,
        locationType,
        locationName: locationName.trim(),
        notes: notes.trim(),
        monthlyFee: monthlyFee ? Number(monthlyFee) : undefined,
        reminderEnabled,
      });
      showToast('🎉 تم تسجيل ميعاد الدرس بنجاح!');
    }

    setIsAddModalOpen(false);
  };

  const filteredLessons = selectedDay === 'all'
    ? lessons
    : lessons.filter((l) => l.dayOfWeek === selectedDay);

  // Group lessons by day
  const lessonsByDay: { [day: string]: LessonAppointment[] } = {};
  WEEKDAYS.forEach((day) => {
    lessonsByDay[day] = lessons.filter((l) => l.dayOfWeek === day);
  });

  // Calculate upcoming next lesson today
  const todayArabicDay = new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(new Date());
  const todayLessons = lessons.filter((l) => l.dayOfWeek.includes(todayArabicDay) || todayArabicDay.includes(l.dayOfWeek));

  return (
    <div id="lessons-schedule-view" className="space-y-6 animate-fadeIn">
      
      {/* View Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-2xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                جدول ومواعيد الدروس الخصوصية والمجموعات
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                سجل مواعيد حصص السنتر والأونلاين وأسماء المدرسين والقاعات لمتابعتها بدقة
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-add-lesson-modal-trigger"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل ميعاد درس جديد</span>
          </button>
        </div>
      </div>

      {/* Today's Lessons Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-100">
            <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>حصص ودروس اليوم ({todayArabicDay}):</span>
          </div>
          <div className="text-base sm:text-lg font-bold">
            {todayLessons.length > 0 ? (
              <span>لديك {todayLessons.length} حصص مقررة اليوم. استعد وركز جيداً!</span>
            ) : (
              <span>لا توجد حصص سنتر أو أونلاين مسجلة اليوم. فرصة ذهبية للمذاكرة الذاتية والحل!</span>
            )}
          </div>
        </div>

        {todayLessons.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {todayLessons.map((l) => (
              <div key={l.id} className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/20">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{l.subject} ({l.startTime})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekday Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedDay('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
            selectedDay === 'all'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
          }`}
        >
          كل الأسبوع ({lessons.length})
        </button>

        {WEEKDAYS.map((day) => {
          const count = lessonsByDay[day]?.length || 0;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                selectedDay === day
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{day}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedDay === day ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Lessons List Grid */}
      {filteredLessons.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center border border-dashed border-slate-200 dark:border-slate-700 space-y-4">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-3xl mx-auto flex items-center justify-center">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {selectedDay === 'all' ? 'لم تقم بتسجيل أي مواعيد دروس بعد' : `لا توجد دروس مسجلة في يوم ${selectedDay}`}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              سجل مواعيد حصصك الأسبوعية ومكان السنتر أو رابط المنصة واسم المعلم لتنظيم وقتك وتفادي التضارب!
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل أول درس الآن</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredLessons.map((lesson) => {
            const LocationIcon = lesson.locationType === 'online' ? Video : lesson.locationType === 'private' ? Home : Building;
            const locationLabel = lesson.locationType === 'online' ? 'أونلاين / منصة' : lesson.locationType === 'private' ? 'درس خصوصي منزلي' : 'سنتر / قاعة';

            return (
              <div
                key={lesson.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative"
              >
                <div className="space-y-3">
                  
                  {/* Top Bar: Subject & Day */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/80">
                        {lesson.subject}
                      </span>
                      <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-2 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>أستاذ / {lesson.teacherName}</span>
                      </h4>
                    </div>

                    <div className="text-left">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 rounded-xl block text-center">
                        كل {lesson.dayOfWeek}
                      </span>
                    </div>
                  </div>

                  {/* Time & Duration */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>من {lesson.startTime} إلى {lesson.endTime}</span>
                  </div>

                  {/* Location / Center */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <LocationIcon className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="font-semibold">{locationLabel}</span>
                    {lesson.locationName && (
                      <span className="text-slate-900 dark:text-slate-200 font-bold truncate">
                        : {lesson.locationName}
                      </span>
                    )}
                  </div>

                  {/* Notes if any */}
                  {lesson.notes && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed font-medium">
                      {lesson.notes}
                    </div>
                  )}

                  {/* Monthly fee if any */}
                  {lesson.monthlyFee && (
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>المصروفات الشهرية: {lesson.monthlyFee} جنيه مصري</span>
                    </div>
                  )}

                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    تنبيه أسبوعي مفعل 🔔
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(lesson)}
                      aria-label="تعديل ميعاد الدرس"
                      className="p-2 text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                      title="تعديل"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف درس ${lesson.subject} للأستاذ ${lesson.teacherName}؟`)) {
                          onDeleteLesson(lesson.id);
                          showToast('تم حذف ميعاد الدرس');
                        }
                      }}
                      aria-label="حذف ميعاد الدرس"
                      className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Lesson Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-2xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">
                    {editingLessonId ? 'تعديل ميعاد الدرس' : 'تسجيل ميعاد درس جديد'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    أدخل تفاصيل الحصة والمدرس ومكان السنتر والوقت
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Subject & Teacher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    المادة الدراسية
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {currentTrack.subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="اللغة الفرنسية">اللغة الفرنسية (لغة ثانية)</option>
                    <option value="اللغة الألمانية">اللغة الألمانية (لغة ثانية)</option>
                    <option value="الجيولوجيا">الجيولوجيا وعلوم البيئة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    اسم الأستاذ / المعلم *
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="مثال: أ/ محمد عبد المعبود"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Day of Week & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    يوم الحصة
                  </label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {WEEKDAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    من الساعة
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    إلى الساعة
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Location Type & Location details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    نوع ونظام الحضور
                  </label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="center">سنتر / قاعة تعليمية 🏫</option>
                    <option value="online">أونلاين (منصة / زووم / يوتيوب) 💻</option>
                    <option value="private">مجموعة خاصة / منزل 🏠</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    اسم السنتر / عنوان القاعة / المنصة
                  </label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="مثال: سنتر الأوائل - قاعة 2"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Monthly Fee & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    المصروفات الشهرية (اختياري)
                  </label>
                  <input
                    type="number"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                    placeholder="مثال: 350"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    ملاحظات إضافية (ميعاد التسميع / الشيت)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: تسميع كلمات + تسليم الواجب أول 10 دقائق"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingLessonId ? 'حفظ التعديلات' : 'تسجيل الدرس'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
