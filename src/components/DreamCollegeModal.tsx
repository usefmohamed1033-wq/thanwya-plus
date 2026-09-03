import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  GraduationCap,
  Activity,
  Compass,
  Cpu,
  Scale,
  Building2,
  Palette,
  Mic,
  Globe2,
  Microscope,
  Pill,
  ChevronLeft,
  User,
  Target,
  Award,
  Search,
  Landmark,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';
import { DREAM_COLLEGES_DATA, DreamCollegeTheme, EGYPTIAN_UNIVERSITIES, EgyptianUniversity, getUniversityById } from '../data/collegeThemes';
import { TrackType, UserProfile } from '../types';
import { useLanguage } from '../utils/i18n';

interface DreamCollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCollegeId: string;
  targetUniversityId?: string;
  onSelectCollege: (collegeId: string, updatedName?: string, updatedTargetScore?: string) => void;
  onSelectUniversity?: (uniId: string) => void;
  currentTrack?: TrackType;
  currentUser: UserProfile | null;
  onUpdateUserTarget?: (updatedProfile: Partial<UserProfile>) => void;
}

export const DreamCollegeModal: React.FC<DreamCollegeModalProps> = ({
  isOpen,
  onClose,
  currentCollegeId,
  targetUniversityId,
  onSelectCollege,
  onSelectUniversity,
  currentTrack = 'sci_math',
  currentUser,
  onUpdateUserTarget,
}) => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'colleges' | 'universities'>('colleges');
  const [selectedId, setSelectedId] = useState<string>(currentCollegeId || 'medicine');
  const [selectedUniId, setSelectedUniId] = useState<string>(() => {
    return targetUniversityId || currentUser?.targetUniversityId || localStorage.getItem('thanawy_target_university') || 'cairo';
  });
  const [studentNameInput, setStudentNameInput] = useState<string>(() => {
    return currentUser?.name || localStorage.getItem('thanawy_custom_student_name') || '';
  });
  const [targetScoreInput, setTargetScoreInput] = useState<string>(() => {
    return currentUser?.targetScore || localStorage.getItem('thanawy_custom_target_score') || '385';
  });
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'compatible' | 'medical' | 'engineering' | 'humanities'>('all');
  const [uniTypeFilter, setUniTypeFilter] = useState<'all' | 'public' | 'national' | 'private_international'>('all');
  const [uniSearchQuery, setUniSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const collegesList = Object.values(DREAM_COLLEGES_DATA);
  const universitiesList = Object.values(EGYPTIAN_UNIVERSITIES);
  const activeTheme = DREAM_COLLEGES_DATA[selectedId] || DREAM_COLLEGES_DATA.medicine;
  const activeUniversity: EgyptianUniversity = getUniversityById(selectedUniId);
  const safeTrack: TrackType = (currentTrack as TrackType) || 'sci_math';

  const filteredColleges = collegesList.filter((col) => {
    if (selectedCategoryFilter === 'compatible') {
      return col.trackCompatibility.includes(safeTrack);
    }
    if (selectedCategoryFilter === 'medical') {
      return col.facultyType === 'medical';
    }
    if (selectedCategoryFilter === 'engineering') {
      return col.facultyType === 'engineering' || col.facultyType === 'tech';
    }
    if (selectedCategoryFilter === 'humanities') {
      return col.facultyType === 'humanities' || col.facultyType === 'law' || col.facultyType === 'arts';
    }
    return true;
  });

  const filteredUniversities = universitiesList.filter((uni) => {
    if (uniTypeFilter === 'public' && uni.type !== 'public') return false;
    if (uniTypeFilter === 'national' && uni.type !== 'national') return false;
    if (uniTypeFilter === 'private_international' && uni.type !== 'private' && uni.type !== 'international') return false;

    if (uniSearchQuery.trim()) {
      const q = uniSearchQuery.trim().toLowerCase();
      const matchName = uni.nameAr.toLowerCase().includes(q) || uni.nameEn.toLowerCase().includes(q);
      const matchCity = uni.campusCityAr.toLowerCase().includes(q) || uni.campusCityEn.toLowerCase().includes(q);
      return matchName || matchCity;
    }
    return true;
  });

  const handleSaveAndApply = () => {
    const trimmedName = studentNameInput.trim();
    if (trimmedName) {
      localStorage.setItem('thanawy_custom_student_name', trimmedName);
    }
    if (targetScoreInput) {
      localStorage.setItem('thanawy_custom_target_score', targetScoreInput);
    }
    if (selectedUniId) {
      localStorage.setItem('thanawy_target_university', selectedUniId);
      onSelectUniversity?.(selectedUniId);
    }
    onSelectCollege(selectedId, trimmedName, targetScoreInput);
    if (onUpdateUserTarget && (trimmedName || targetScoreInput || selectedUniId)) {
      onUpdateUserTarget({
        name: trimmedName || currentUser?.name || (lang === 'ar' ? 'طالب ثانوي بلس' : 'Student'),
        targetScore: targetScoreInput,
        targetUniversityId: selectedUniId,
      });
    }
    onClose();
  };

  const getFacultyIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'engineering':
        return <Compass className="w-4 h-4 text-blue-400" />;
      case 'tech':
        return <Cpu className="w-4 h-4 text-violet-400" />;
      case 'law':
        return <Scale className="w-4 h-4 text-rose-400" />;
      case 'humanities':
        return <Globe2 className="w-4 h-4 text-amber-400" />;
      case 'arts':
        return <Palette className="w-4 h-4 text-orange-400" />;
      case 'science':
        return <Microscope className="w-4 h-4 text-cyan-400" />;
      default:
        return <GraduationCap className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                <span>{lang === 'ar' ? 'تحديد كلية والجامعة المستهدفة' : 'Choose Dream Faculty & University'}</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'اختر كليتك وجامعتك المصرية لتحويل الثيم والشارات والبالطو وكارنيه التفوق حسب هدفك.'
                  : 'Customize your faculty, Egyptian university, badges, lab coat and vision board.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs (Colleges vs Universities) */}
        <div className="flex items-center bg-slate-950 border-b border-slate-800 px-4 sm:px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('colleges')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'colleges'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{lang === 'ar' ? '1. الكلية المستهدفة والثيم' : '1. Faculty & Theme'}</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
              {activeTheme.shortNameAr}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('universities')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'universities'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>{lang === 'ar' ? '2. الجامعة المصرية' : '2. Egyptian University'}</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-amber-300 flex items-center gap-1">
              <span>{activeUniversity.crestEmoji}</span>
              <span>{activeUniversity.shortNameAr}</span>
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: COLLEGES SELECTION */}
          {activeTab === 'colleges' && (
            <div className="space-y-5">
              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800 text-xs font-semibold">
                <span className="text-slate-400 text-[11px] ml-1">{lang === 'ar' ? 'تصنيف الكليات:' : 'Categories:'}</span>
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-white text-slate-900 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {lang === 'ar' ? 'جميع الكليات' : 'All Faculties'}
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('compatible')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedCategoryFilter === 'compatible'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {lang === 'ar' ? 'المناسبة لشعبتك الحالية ⭐' : 'Compatible with Track ⭐'}
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('medical')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedCategoryFilter === 'medical'
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {lang === 'ar' ? 'القطاع الطبي والصيدلي 🩺' : 'Medical & Pharma 🩺'}
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('engineering')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedCategoryFilter === 'engineering'
                      ? 'bg-blue-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {lang === 'ar' ? 'الهندسة والذكاء الاصطناعي 📐' : 'Engineering & AI 📐'}
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('humanities')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedCategoryFilter === 'humanities'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {lang === 'ar' ? 'الإنسانيات والسياسة والقضاء 🏛️' : 'Politics, Law & Arts 🏛️'}
                </button>
              </div>

              {/* Grid of Colleges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredColleges.map((col) => {
                  const isSelected = selectedId === col.id;
                  const isCompatible = col.trackCompatibility.includes(safeTrack);

                  return (
                    <div
                      key={col.id}
                      onClick={() => setSelectedId(col.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-400 ring-2 ring-emerald-500/30 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getFacultyIcon(col.facultyType)}
                            <span className="font-bold text-xs sm:text-sm text-white">
                              {lang === 'ar' ? col.nameAr : col.nameEn}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                            {lang === 'ar' ? col.studentTitleAr : col.studentTitleEn}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {lang === 'ar' ? col.mottoAr : col.mottoEn}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{lang === 'ar' ? 'الحد الأدنى المتوقع:' : 'Min Score:'} <strong className="text-emerald-400">{col.benchmarkPercentage}%</strong></span>
                        {!isCompatible && (
                          <span className="text-amber-400/80">{lang === 'ar' ? 'شعبة أخرى' : 'Other track'}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UNIVERSITIES SELECTION */}
          {activeTab === 'universities' && (
            <div className="space-y-5">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pb-3 border-b border-slate-800">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={uniSearchQuery}
                    onChange={(e) => setUniSearchQuery(e.target.value)}
                    placeholder={lang === 'ar' ? 'ابحث باسم الجامعة أو المحافظة (مثلاً: القاهرة، المنصورة، أسيوط...)' : 'Search university by name or city...'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setUniTypeFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                      uniTypeFilter === 'all'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lang === 'ar' ? 'كل الجامعات' : 'All'}
                  </button>
                  <button
                    onClick={() => setUniTypeFilter('public')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                      uniTypeFilter === 'public'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lang === 'ar' ? 'الجامعات الحكومية والأزهر' : 'Public'}
                  </button>
                  <button
                    onClick={() => setUniTypeFilter('national')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                      uniTypeFilter === 'national'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lang === 'ar' ? 'الأهلية والتكنولوجية' : 'National'}
                  </button>
                  <button
                    onClick={() => setUniTypeFilter('private_international')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                      uniTypeFilter === 'private_international'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lang === 'ar' ? 'الخاصة والدولية' : 'Private / Int.'}
                  </button>
                </div>
              </div>

              {/* Grid of Universities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredUniversities.map((uni) => {
                  const isSelected = selectedUniId === uni.id;

                  return (
                    <div
                      key={uni.id}
                      onClick={() => setSelectedUniId(uni.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                        isSelected
                          ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-500/30 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{uni.crestEmoji}</span>
                            <span className="font-bold text-xs sm:text-sm text-white">
                              {lang === 'ar' ? uni.shortNameAr : uni.shortNameEn}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-2 font-mono">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400" />
                            <span>{lang === 'ar' ? uni.campusCityAr : uni.campusCityEn}</span>
                          </span>
                          <span>•</span>
                          <span>{lang === 'ar' ? `تأسست عام ${uni.foundedYear}` : `Est. ${uni.foundedYear}`}</span>
                        </div>

                        <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                          « {lang === 'ar' ? uni.mottoAr : uni.mottoEn} »
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="capitalize text-amber-300">
                          {uni.type === 'public' ? (lang === 'ar' ? 'جامعة حكومية' : 'Public Univ') : uni.type === 'national' ? (lang === 'ar' ? 'جامعة أهلية' : 'National Univ') : (lang === 'ar' ? 'جامعة دولية/خاصة' : 'Private/Int.')}
                        </span>
                        <span className="text-emerald-400 font-bold">
                          {activeTheme.shortNameAr}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Student Customization Card */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-sm text-white">
                  {lang === 'ar' ? `معاينة بطاقة القبول الجامعي 2027` : `2027 University Admission Card Preview`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {activeTheme.studentTitleAr}
                </span>
                <span className="text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800 flex items-center gap-1">
                  <span>{activeUniversity.crestEmoji}</span>
                  <span>{activeUniversity.shortNameAr}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Student Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'ar' ? 'اسم الطالب ليظهر على البالطو والكارنيه:' : 'Your Name for Badges & Coat:'}</span>
                </label>
                <input
                  type="text"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: يوسف محمد' : 'e.g., Youssef Mohamed'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Target Score Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'ar' ? 'مجموعك المستهدف (من 410):' : 'Target Score (out of 410):'}</span>
                </label>
                <input
                  type="number"
                  value={targetScoreInput}
                  onChange={(e) => setTargetScoreInput(e.target.value)}
                  placeholder="385"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* University Acceptance Card Graphic */}
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 text-right">
                <div className="text-3xl p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {activeUniversity.crestEmoji}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">
                    {activeTheme.prefixAr} {studentNameInput || (lang === 'ar' ? 'طالب ثانوي بلس' : 'Student')}
                  </div>
                  <div className="text-slate-300 text-xs">
                    {activeTheme.nameAr} — {activeUniversity.nameAr}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {activeUniversity.campusCityAr} • دفعة 2027
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 px-3 py-1.5 rounded-lg text-center font-mono font-bold shrink-0">
                <div className="text-[10px] text-emerald-400 uppercase">Target Score</div>
                <div className="text-sm">{targetScoreInput || '385'} / 410 ({activeTheme.benchmarkPercentage}%)</div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 hidden sm:block">
            {lang === 'ar' ? 'يمكنك تعديل الكلية والجامعة والاسم في أي وقت.' : 'You can switch college & university anytime.'}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              onClick={handleSaveAndApply}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{lang === 'ar' ? 'تطبيق الكلية والجامعة 🚀' : 'Apply College & University 🚀'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
