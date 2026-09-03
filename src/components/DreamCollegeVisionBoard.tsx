import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Syringe,
  Activity,
  Compass,
  Cpu,
  Code2,
  Scale,
  Building2,
  Palette,
  Mic,
  Globe2,
  Microscope,
  Pill,
  Sparkles,
  Flame,
  Award,
  ChevronLeft,
  Settings2,
  Heart,
  TrendingUp,
  Volume2,
  CheckCircle2,
  Wrench,
  Layers,
  GraduationCap,
  Binary,
  Edit3,
  Check,
  X,
  MapPin,
  Landmark
} from 'lucide-react';
import { DREAM_COLLEGES_DATA, DreamCollegeTheme, EgyptianUniversity, getUniversityById, EGYPTIAN_UNIVERSITIES } from '../data/collegeThemes';
import { UserProfile, TrackConfig } from '../types';
import { useLanguage } from '../utils/i18n';

interface DreamCollegeVisionBoardProps {
  collegeId: string;
  targetUniversityId?: string;
  onOpenSelector: () => void;
  onSelectUniversity?: (uniId: string) => void;
  currentUser: UserProfile | null;
  currentTrack?: TrackConfig;
  soundEnabled: boolean;
  onUpdateStudentName?: (name: string) => void;
}

export const DreamCollegeVisionBoard: React.FC<DreamCollegeVisionBoardProps> = ({
  collegeId,
  targetUniversityId,
  onOpenSelector,
  onSelectUniversity,
  currentUser,
  currentTrack,
  soundEnabled,
  onUpdateStudentName,
}) => {
  const { lang, t } = useLanguage();
  const theme: DreamCollegeTheme = DREAM_COLLEGES_DATA[collegeId] || DREAM_COLLEGES_DATA.medicine;
  const university: EgyptianUniversity = getUniversityById(targetUniversityId || currentUser?.targetUniversityId);

  // Local student name state for instant live updates and inline editing
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(() => {
    return currentUser?.name || localStorage.getItem('thanawy_custom_student_name') || '';
  });

  useEffect(() => {
    if (currentUser?.name) {
      setNameInput(currentUser.name);
    }
  }, [currentUser?.name]);

  // Interactive local states for tactile feedback
  const [heartbeatActive, setHeartbeatActive] = useState(false);
  const [syringeDose, setSyringeDose] = useState(3);
  const [syringeInjected, setSyringeInjected] = useState(false);
  const [gearSpeed, setGearSpeed] = useState<'normal' | 'fast'>('normal');
  const [codeLinesCount, setCodeLinesCount] = useState(1);
  const [scalesTilted, setScalesTilted] = useState<'balanced' | 'left' | 'right'>('balanced');
  const [activePaintColor, setActivePaintColor] = useState('#10b981');
  const [flaskBubbling, setFlaskBubbling] = useState(false);
  const [interactiveToast, setInteractiveToast] = useState<string | null>(null);

  // Play auditory feedback with Web Audio API synthesizer
  const playTactileSound = (type: 'heart' | 'click' | 'gear' | 'gavel' | 'potion' | 'chime') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (type === 'heart') {
        // Double heartbeat lub-dub sound
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(80, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);
        gain1.gain.setValueAtTime(0.3, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.16);

        setTimeout(() => {
          try {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(70, ctx.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.18);
            gain2.gain.setValueAtTime(0.25, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start();
            osc2.stop(ctx.currentTime + 0.19);
          } catch (e) {}
        }, 220);
      } else if (type === 'gavel') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.26);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(type === 'potion' ? 440 : 520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.13);
      }
    } catch (e) {}
  };

  const handleStethoscopeClick = () => {
    setHeartbeatActive(true);
    playTactileSound('heart');
    setInteractiveToast(lang === 'ar' ? '🫀 نبضات قلب مريضك سليمة ومستقرة! أحسنت يا دكتور.' : '🫀 Patient vitals are stable! Excellent work, Doctor.');
    setTimeout(() => {
      setHeartbeatActive(false);
      setInteractiveToast(null);
    }, 2800);
  };

  const handleSyringeClick = () => {
    playTactileSound('potion');
    setSyringeInjected(true);
    setInteractiveToast(lang === 'ar' ? '💉 تم حقن جرعة التركيز بنجاح! طاقتك ارتفعت إلى 100%.' : '💉 Focus dose delivered! Energy boosted to 100%.');
    setTimeout(() => {
      setSyringeInjected(false);
      setInteractiveToast(null);
    }, 2500);
  };

  const handleGearClick = () => {
    playTactileSound('gear');
    setGearSpeed((prev) => (prev === 'normal' ? 'fast' : 'normal'));
    setInteractiveToast(lang === 'ar' ? '⚙️ تم تسريع توربينات المحرك الهندسي بكفاءة 100%!' : '⚙️ Turbines accelerated to maximum efficiency!');
    setTimeout(() => setInteractiveToast(null), 2500);
  };

  const handleCodeRunClick = () => {
    playTactileSound('chime');
    setCodeLinesCount((prev) => (prev < 4 ? prev + 1 : 1));
    setInteractiveToast(lang === 'ar' ? '⚡ تم تدريب خوارزمية الذكاء الاصطناعي بنجاح (Accuracy: 99.8%)!' : '⚡ AI model trained with 99.8% accuracy!');
    setTimeout(() => setInteractiveToast(null), 2500);
  };

  const handleGavelClick = () => {
    playTactileSound('gavel');
    setScalesTilted((prev) => (prev === 'balanced' ? 'left' : prev === 'left' ? 'right' : 'balanced'));
    setInteractiveToast(lang === 'ar' ? '⚖️ رُفعت الجلسة! حكمت المحكمة لصالح الاجتهاد والتفوق.' : '⚖️ Court is adjourned in favor of excellence and justice.');
    setTimeout(() => setInteractiveToast(null), 2500);
  };

  const handleSaveStudentName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      localStorage.setItem('thanawy_custom_student_name', trimmed);
      onUpdateStudentName?.(trimmed);
      playTactileSound('chime');
      setInteractiveToast(lang === 'ar' ? `✨ أهلاً بك يا ${theme.prefixAr} ${trimmed}! تم تثبيت اسمك على البالطو.` : `✨ Welcome ${theme.prefixEn} ${trimmed}! Name updated on coat.`);
      setTimeout(() => setInteractiveToast(null), 3000);
    }
    setEditingName(false);
  };

  const currentSavedName = nameInput || currentUser?.name || localStorage.getItem('thanawy_custom_student_name') || '';
  const studentDisplayName = currentSavedName || (lang === 'ar' ? 'طالب ثانوي بلس' : 'Thanawy Student');
  const targetUni = theme.defaultUniversities[0];

  return (
    <div
      id="dream-college-vision-board"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/70 text-white p-4 sm:p-7 md:p-9 shadow-sm transition-all"
    >
      {/* Toast popup */}
      {interactiveToast && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-xl flex items-center gap-2 border border-emerald-300 animate-bounce">
          <span>{interactiveToast}</span>
        </div>
      )}

      {/* Dynamic Ambient Background Elements based on College */}
      <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
        {theme.id === 'medicine' && (
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] animate-pulse" />
        )}
        {theme.id === 'engineering' && (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)] [background-size:20px_20px]" />
        )}
        {theme.id === 'computer_ai' && (
          <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px]" />
        )}
        {theme.id === 'law_judiciary' && (
          <div className="absolute inset-0 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:24px_24px]" />
        )}
      </div>

      {/* Header bar: Title, Badge, and Switcher Button */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'محراب كلية الأحلام' : 'Dream College Vision Board'}</span>
            </span>

            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${theme.gradientBadge}`}>
              <span>{lang === 'ar' ? theme.shortNameAr : theme.shortNameEn}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-amber-300 border border-slate-700">
              <span>{university.crestEmoji}</span>
              <span>{lang === 'ar' ? university.shortNameAr : university.shortNameEn}</span>
            </span>

            <span className="text-[11px] font-mono text-slate-400">
              {lang === 'ar' ? 'الحد الأدنى المتوقع:' : 'Target Benchmark:'} {theme.benchmarkPercentage}%
            </span>
          </div>

          {editingName ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-emerald-400 font-bold text-sm">{theme.prefixAr}</span>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveStudentName()}
                placeholder={lang === 'ar' ? 'اكتب اسمك هنا (مثلاً: يوسف محمد)' : 'Enter your name'}
                autoFocus
                className="bg-slate-800 border border-emerald-500/80 rounded-xl px-3 py-1.5 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                onClick={handleSaveStudentName}
                className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1 text-xs px-2.5 cursor-pointer"
                title="حفظ الاسم"
              >
                <Check className="w-4 h-4" />
                <span>حفظ</span>
              </button>
              <button
                onClick={() => setEditingName(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                title="إلغاء"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{lang === 'ar' ? `${theme.prefixAr} ${studentDisplayName}` : `${theme.prefixEn} ${studentDisplayName}`}</span>
                <span className="text-xs sm:text-sm font-normal text-slate-300">
                  ({lang === 'ar' ? theme.studentTitleAr : theme.studentTitleEn})
                </span>
              </h2>

              <button
                onClick={() => setEditingName(true)}
                className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/40 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                title="تعديل اسم الطالب/الطبيبة"
              >
                <Edit3 className="w-3 h-3" />
                <span>{lang === 'ar' ? 'تعديل اسمك على البالطو' : 'Edit Name'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Change Dream College & University Button */}
        <button
          id="btn-change-dream-college"
          onClick={onOpenSelector}
          className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white px-4 py-3 sm:py-2.5 rounded-xl text-xs font-bold border border-slate-600 transition-all active:scale-95 cursor-pointer shrink-0 w-full sm:w-auto min-h-[44px]"
        >
          <Settings2 className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'ar' ? 'تغيير الكلية والجامعة' : 'Change Faculty & University'}</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive College Visual Assets Area */}
      <div className="relative z-10 my-5">
        {/* Medicine / Dentistry / Pharmacy Specific Interactive Visuals */}
        {(theme.id === 'medicine' || theme.id === 'dentistry' || theme.id === 'pharmacy') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Realistic White Doctor Coat Display */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex flex-col justify-between relative group hover:border-emerald-400 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'بالطو الطبيب الأبيض' : 'Doctor White Coat'}</span>
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                  {lang === 'ar' ? 'معطف الشرف' : 'Badge of Honor'}
                </span>
              </div>

              {/* Graphical Doctor Coat Card */}
              <div className="relative bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 p-4 rounded-lg shadow-inner border border-slate-300 my-1 flex flex-col items-center justify-center text-center overflow-hidden">
                {/* Coat Lapel Lines & ID Badge */}
                <div className="w-full flex justify-between items-start mb-2">
                  <div className="bg-slate-900 text-emerald-400 px-2 py-1 rounded text-[10px] font-mono font-bold border border-emerald-500/50 shadow-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{theme.coatBadgeTextAr}</span>
                  </div>
                  <button
                    onClick={() => setEditingName(true)}
                    className="p-1 text-slate-700 hover:text-emerald-700 bg-white/70 hover:bg-white rounded-md border border-slate-300 transition-all cursor-pointer shadow-xs"
                    title="تعديل الاسم المكتوب على البالطو"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-sm sm:text-base font-black text-slate-950 tracking-tight bg-white/80 px-3 py-1 rounded-md border border-slate-300/80 shadow-xs w-full">
                  {lang === 'ar' ? `${theme.prefixAr} ${studentDisplayName}` : `${theme.prefixEn} ${studentDisplayName}`}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-700 font-bold mt-1 flex items-center justify-center gap-1">
                  <span>{university.crestEmoji}</span>
                  <span>{lang === 'ar' ? `${theme.nameAr} • ${university.shortNameAr}` : `${theme.nameEn} • ${university.shortNameEn}`}</span>
                </div>

                {/* Stethoscope around collar graphics */}
                <div className="w-24 h-6 border-b-3 border-slate-800 rounded-b-full my-1 opacity-80" />
              </div>

              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] text-slate-400 text-right">
                  {lang === 'ar' ? 'ارتداؤك لهذا البالطو مسألة وقت واجتهاد فقط.. ثابر!' : 'Wearing this coat is only a matter of dedication.'}
                </p>
                <button
                  onClick={() => setEditingName(true)}
                  className="text-[10px] text-emerald-400 hover:underline shrink-0 font-bold"
                >
                  {lang === 'ar' ? 'تعديل الاسم ✍️' : 'Edit Name'}
                </button>
              </div>
            </div>

            {/* 2. Interactive Stethoscope with Live Heartbeat */}
            <div
              onClick={handleStethoscopeClick}
              className={`p-4 rounded-xl bg-slate-950/80 border transition-all cursor-pointer flex flex-col justify-between relative group ${
                heartbeatActive ? 'border-red-500 shadow-lg shadow-red-500/20 bg-red-950/20' : 'border-slate-800 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Stethoscope className={`w-4 h-4 ${heartbeatActive ? 'text-red-400 animate-bounce' : 'text-emerald-400'}`} />
                  <span>{lang === 'ar' ? 'سماعة الطبيب القلبية' : 'Acoustic Stethoscope'}</span>
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {heartbeatActive ? '75 BPM 🫀' : (lang === 'ar' ? 'اضغط للفحص' : 'Click to test')}
                </span>
              </div>

              {/* Heartbeat ECG Line Visualizer */}
              <div className="h-20 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center p-2 relative overflow-hidden my-1">
                <svg className="w-full h-12 stroke-emerald-400 fill-none stroke-2" viewBox="0 0 200 40">
                  <path
                    d="M 0 20 L 40 20 L 48 10 L 56 32 L 64 5 L 72 25 L 80 20 L 140 20 L 148 10 L 156 32 L 164 5 L 172 25 L 180 20 L 200 20"
                    className={`${heartbeatActive ? 'animate-pulse stroke-red-400 stroke-[2.5]' : 'opacity-70'}`}
                  />
                </svg>
                {heartbeatActive && (
                  <span className="absolute text-xs font-bold text-red-300 bg-red-950/90 px-2 py-0.5 rounded border border-red-500/40 animate-pulse">
                    {lang === 'ar' ? 'النبض منتظم: 75 bpm' : 'Regular Rhythm: 75 bpm'}
                  </span>
                )}
              </div>

              <button className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-950 text-emerald-400 text-[11px] font-bold border border-slate-700 hover:border-emerald-500/50 transition-colors flex items-center justify-center gap-1.5">
                <Heart className={`w-3.5 h-3.5 ${heartbeatActive ? 'fill-red-400 text-red-400' : ''}`} />
                <span>{lang === 'ar' ? 'استمع لنبضات قلب مريضك' : 'Listen to patient heartbeat'}</span>
              </button>
            </div>

            {/* 3. Interactive Precision Syringe / Dose Injector */}
            <div
              onClick={handleSyringeClick}
              className={`p-4 rounded-xl bg-slate-950/80 border transition-all cursor-pointer flex flex-col justify-between relative group ${
                syringeInjected ? 'border-cyan-400 shadow-lg shadow-cyan-500/20 bg-cyan-950/20' : 'border-slate-800 hover:border-cyan-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Syringe className={`w-4 h-4 ${syringeInjected ? 'text-cyan-400 rotate-45' : 'text-teal-400'}`} />
                  <span>{lang === 'ar' ? 'حقنة التركيز والدواء' : 'Precision Syringe'}</span>
                </span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-mono">
                  {syringeInjected ? '100% Focused' : '5 ml Dose'}
                </span>
              </div>

              {/* Visual Syringe Barrel */}
              <div className="h-20 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center p-3 relative my-1">
                <div className="w-full h-8 bg-slate-800 rounded-r-md rounded-l-sm border border-slate-600 relative overflow-hidden flex items-center">
                  {/* Fluid Level */}
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-700 flex items-center justify-center text-[10px] font-mono font-bold text-slate-950"
                    style={{ width: syringeInjected ? '100%' : '65%' }}
                  >
                    {syringeInjected ? '100% Full Energy' : 'High Focus 65%'}
                  </div>
                  {/* Graduation ticks */}
                  <div className="absolute inset-0 flex justify-between px-2 text-[8px] font-mono text-slate-400 pointer-events-none opacity-80">
                    <span>1ml</span>
                    <span>2ml</span>
                    <span>3ml</span>
                    <span>4ml</span>
                    <span>5ml</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 text-cyan-300 text-[11px] font-bold border border-slate-700 hover:border-cyan-500/50 transition-colors flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ar' ? 'اضغط لحقن جرعة التركيز' : 'Inject Focus Dose'}</span>
              </button>
            </div>

          </div>
        )}

        {/* Engineering Specific Visuals */}
        {theme.id === 'engineering' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Drafting Board & T-Square */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'طاولة الرسم والمسطرة T' : 'Drafting Board & T-Square'}</span>
                </span>
                <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-mono">
                  Scale 1:50
                </span>
              </div>

              <div className="h-24 bg-blue-950/40 rounded-lg border border-blue-500/30 p-3 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="w-full h-1 bg-amber-400/80 mb-2 rounded shadow-xs" title="T-Square" />
                <span className="text-xs font-mono font-bold text-blue-200">
                  {lang === 'ar' ? `مشروع تخرج: ${studentDisplayName}` : `Graduation Capstone: ${studentDisplayName}`}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 font-mono">
                  AutoCAD / SolidWorks / Revit Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                {lang === 'ar' ? 'كل مسألة تفاضل وميكانيكا تبني بها ناطحة سحابك القادمة!' : 'Every calculus formula constructs your future tower!'}
              </p>
            </div>

            {/* Precision Mechanical Gears */}
            <div
              onClick={handleGearClick}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 cursor-pointer flex flex-col justify-between group transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تروس المحركات الميكانيكية' : 'Precision Mechanical Gears'}</span>
                </span>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded font-mono">
                  {gearSpeed === 'fast' ? '3000 RPM ⚡' : '1000 RPM'}
                </span>
              </div>

              <div className="h-24 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center gap-3 p-2 relative overflow-hidden">
                <div className={`w-12 h-12 border-4 border-dashed border-amber-400 rounded-full flex items-center justify-center ${gearSpeed === 'fast' ? 'animate-spin' : 'animate-[spin_4s_linear_infinite]'}`}>
                  <div className="w-3 h-3 bg-amber-400 rounded-full" />
                </div>
                <div className={`w-8 h-8 border-4 border-dashed border-blue-400 rounded-full flex items-center justify-center ${gearSpeed === 'fast' ? 'animate-[spin_1.5s_linear_infinite_reverse]' : 'animate-[spin_3s_linear_infinite_reverse]'}`}>
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                </div>
              </div>

              <button className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-amber-950 text-amber-300 text-[11px] font-bold border border-slate-700 transition-colors">
                {lang === 'ar' ? 'اضغط لتسريع التروس والمحركات' : 'Click to accelerate gears'}
              </button>
            </div>

            {/* Engineer ID Badge */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>{lang === 'ar' ? 'كارنيه نقابة المهندسين' : 'Engineers Syndicate ID'}</span>
                </span>
                <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-mono">
                  Class 2027
                </span>
              </div>

              <div className="h-24 bg-gradient-to-r from-blue-900/60 to-slate-900 rounded-lg border border-blue-700/50 p-3 flex flex-col justify-center text-center">
                <span className="text-xs font-bold text-white">
                  {lang === 'ar' ? `م. ${studentDisplayName}` : `Eng. ${studentDisplayName}`}
                </span>
                <span className="text-[10px] text-blue-300 mt-1 font-mono flex items-center justify-center gap-1">
                  <span>{university.crestEmoji}</span>
                  <span>{lang === 'ar' ? `${theme.nameAr} • ${university.shortNameAr}` : `${theme.nameEn} • ${university.shortNameEn}`}</span>
                </span>
              </div>

              <p className="text-[10px] text-slate-400 mt-2 text-center">
                {lang === 'ar' ? 'مجموعك الحالي يقربك من هدفك كل يوم!' : 'Your consistency moves you closer daily!'}
              </p>
            </div>

          </div>
        )}

        {/* Computers & AI Specific Visuals */}
        {theme.id === 'computer_ai' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Live Interactive Code Terminal */}
            <div
              onClick={handleCodeRunClick}
              className="p-4 rounded-xl bg-slate-950/90 border border-violet-500/40 hover:border-violet-400 cursor-pointer flex flex-col justify-between transition-colors col-span-1 md:col-span-2"
            >
              <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[11px] font-mono text-slate-400 mr-2">ai_graduate_model.py</span>
                </div>
                <span className="text-[10px] font-mono text-violet-400 bg-violet-950 px-2 py-0.5 rounded border border-violet-800">
                  Python 3.12 • PyTorch
                </span>
              </div>

              <div className="bg-black/90 p-3 rounded-lg font-mono text-xs text-left space-y-1 my-1 overflow-x-auto text-emerald-400" dir="ltr">
                <div><span className="text-violet-400">import</span> torch</div>
                <div><span className="text-violet-400">class</span> <span className="text-yellow-300">AIArchitect2027</span>(nn.Module):</div>
                <div className="pl-4 text-slate-300">student = <span className="text-amber-300">"{studentDisplayName}"</span></div>
                <div className="pl-4 text-slate-300">goal_score = <span className="text-cyan-300">385 / 410</span></div>
                {codeLinesCount >= 2 && (
                  <div className="pl-4 text-emerald-300">train_accuracy = <span className="text-green-400">99.8%</span> # Model Optimized!</div>
                )}
                {codeLinesCount >= 3 && (
                  <div className="pl-4 text-cyan-300">status = <span className="text-yellow-400">"Top 10 Thanaweya Rank Locked 🚀"</span></div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{lang === 'ar' ? 'اضغط لتشغيل تدريب النموذج العصبي' : 'Click to run model training'}</span>
                <span className="text-violet-400 font-bold font-mono">Run Shift+Enter ⚡</span>
              </div>
            </div>

            {/* Neural Matrix Badge */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-violet-500/30 flex flex-col justify-between text-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-violet-400 flex items-center gap-1">
                  <Cpu className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'المعالج العصبي (NPU)' : 'Neural Engine'}</span>
                </span>
                <span className="text-[10px] bg-violet-950 text-violet-300 px-1.5 py-0.5 rounded font-mono">
                  120 TFLOPS
                </span>
              </div>

              <div className="my-auto py-2 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-xl bg-violet-950/60 border-2 border-violet-500/50 flex items-center justify-center text-violet-400 shadow-lg shadow-violet-500/20 mb-2">
                  <Binary className="w-8 h-8 animate-pulse" />
                </div>
                <div className="text-xs font-bold text-white">
                  {lang === 'ar' ? `م. ${studentDisplayName}` : `Eng. ${studentDisplayName}`}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Deep Learning & Cybersecurity
                </div>
              </div>

              <p className="text-[10px] text-slate-400">
                {lang === 'ar' ? 'خوارزمياتك تصنع المستقبل الذكي!' : 'Your code shapes tomorrow!'}
              </p>
            </div>

          </div>
        )}

        {/* Law / Judiciary Specific Visuals */}
        {theme.id === 'law_judiciary' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Interactive Scales of Justice */}
            <div
              onClick={handleGavelClick}
              className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 hover:border-rose-400 cursor-pointer flex flex-col justify-between transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'ميزان العدالة الذهبي' : 'Scales of Justice'}</span>
                </span>
                <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded font-mono">
                  {scalesTilted === 'balanced' ? '⚖️ متزن تماماً' : '⚖️ وزن الأدلة'}
                </span>
              </div>

              <div className="h-24 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden my-1">
                <Scale
                  className={`w-14 h-14 text-amber-400 transition-transform duration-500 ${
                    scalesTilted === 'left' ? '-rotate-12' : scalesTilted === 'right' ? 'rotate-12' : 'rotate-0'
                  }`}
                />
              </div>

              <button className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-300 text-[11px] font-bold border border-slate-700 transition-colors flex items-center justify-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ar' ? 'اطرق بمطرقة القضاء' : 'Strike Gavel'}</span>
              </button>
            </div>

            {/* Constitutional Seal Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between text-center col-span-1 md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">
                  {lang === 'ar' ? 'دستور وحصانة رجال القضاء' : 'Judicial Constitutional Bench'}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  مجلس الدولة والنيابة العامة
                </span>
              </div>

              <div className="p-4 bg-stone-950/60 rounded-lg border border-stone-800 text-center space-y-1">
                <div className="text-sm font-black text-amber-400">
                  {lang === 'ar' ? `معالي المستشار: ${studentDisplayName}` : `Counselor ${studentDisplayName}`}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-serif">
                  «العدل أساس الملك، وصوت الحق يعلو ولا يُعلى عليه في منصات القضاء الشامخ»
                </p>
              </div>

              <p className="text-[11px] text-slate-400 mt-2">
                {lang === 'ar' ? 'كل نص وبلاغة تتقنها اليوم، هي حجة دامغة لك غداً على منصة القضاء.' : 'Every rhetoric skill sharpens your future courtroom arguments.'}
              </p>
            </div>

          </div>
        )}

        {/* Other Faculties (Economics, Arts, Languages, Science, Mass Comm) */}
        {!['medicine', 'dentistry', 'pharmacy', 'engineering', 'computer_ai', 'law_judiciary'].includes(theme.id) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'شارة التفوق الأكاديمي' : 'Academic Excellence Badge'}</span>
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {theme.shortNameAr}
                </span>
              </div>

              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-center space-y-1">
                <div className="text-base font-black text-white">
                  {lang === 'ar' ? `${theme.prefixAr} ${studentDisplayName}` : `${theme.prefixEn} ${studentDisplayName}`}
                </div>
                <div className="text-xs text-slate-300">
                  {lang === 'ar' ? theme.studentTitleAr : theme.studentTitleEn}
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-2 text-center">
                {lang === 'ar' ? theme.mottoAr : theme.mottoEn}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">
                  {lang === 'ar' ? 'نصيحة ذهبية للوصول لكلية الأحلام' : 'Golden Strategic Advice'}
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  {theme.benchmarkPercentage}%
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed p-3 bg-slate-900 rounded-lg border border-slate-800">
                {lang === 'ar' ? theme.adviceAr : theme.adviceEn}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>{lang === 'ar' ? 'الكلية المستهدفة:' : 'Target Faculty:'}</span>
                <span className="font-bold text-white">{targetUni?.nameAr || theme.nameAr}</span>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Interactive Floating Feedback Toast */}
      {interactiveToast && (
        <div className="my-3 p-2.5 rounded-xl bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{interactiveToast}</span>
          </div>
          <button
            onClick={() => setInteractiveToast(null)}
            className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-mono cursor-pointer"
          >
            OK
          </button>
        </div>
      )}

      {/* Footer Motivational Quote & University Goal */}
      <div className="relative z-10 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-slate-300 leading-relaxed max-w-2xl">
          <span className="font-bold text-amber-400">« {lang === 'ar' ? theme.mottoAr : theme.mottoEn} »</span>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 flex items-center gap-1">
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'الجامعة المستهدفة:' : 'Target Uni:'}</span>
          </span>
          <span className="font-bold text-emerald-400">{university.crestEmoji} {lang === 'ar' ? university.nameAr : university.nameEn}</span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">({lang === 'ar' ? university.campusCityAr : university.campusCityEn})</span>
        </div>
      </div>
    </div>
  );
};
