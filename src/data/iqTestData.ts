export type IQDifficultyLevel = 'easy' | 'hard' | 'very_hard';

export interface MatrixCellData {
  type: 'circle' | 'square' | 'triangle' | 'polygon' | 'lines' | 'dots' | 'composite' | 'custom_svg';
  shapes?: {
    kind: 'circle' | 'rect' | 'triangle' | 'polygon' | 'cross' | 'star' | 'diamond' | 'arrow' | 'line';
    x?: number;
    y?: number;
    size?: number;
    color?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    rotation?: number;
    count?: number;
    opacity?: number;
    points?: string;
    d?: string;
  }[];
  dotsCount?: number;
  rotation?: number;
  label?: string;
}

export interface IQQuestion {
  id: number;
  level: IQDifficultyLevel;
  category: 'fluid_reasoning' | 'spatial_relations' | 'pattern_logic' | 'matrix_operations';
  categoryLabelAr: string;
  categoryLabelEn: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  titleAr: string;
  titleEn: string;
  ruleAr: string;
  ruleEn: string;
  gridType: '3x3' | '2x2';
  cells: (MatrixCellData | null)[];
  options: MatrixCellData[];
  correctOptionIndex: number;
  explanationAr: string;
  explanationEn: string;
}

export interface IQLevelConfig {
  id: IQDifficultyLevel;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  badge: string;
  durationMinutes: number;
  iqRange: string;
  colorClass: string;
  bgGradient: string;
  descriptionAr: string;
}

export const IQ_LEVEL_CONFIGS: Record<IQDifficultyLevel, IQLevelConfig> = {
  easy: {
    id: 'easy',
    titleAr: 'المستوى القياسي / السهل',
    titleEn: 'Standard / Basic Level',
    subtitleAr: 'تدرج الأنماط والأشكال الأساسية',
    badge: 'سهل 🟢',
    durationMinutes: 12,
    iqRange: 'IQ 75 - 115',
    colorClass: 'emerald',
    bgGradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-300 dark:border-emerald-800',
    descriptionAr: 'اختبار تمهيدي يقيس القدرة على ملاحظة التدرجات الهندسية المباشرة، الألوان، والدوران المنتظم.',
  },
  hard: {
    id: 'hard',
    titleAr: 'المستوى المتقدم / الصعب',
    titleEn: 'Advanced / Hard Level',
    subtitleAr: 'المصفوفات التناظرية والدمج المنطقي',
    badge: 'صعب 🟡',
    durationMinutes: 18,
    iqRange: 'IQ 100 - 138',
    colorClass: 'amber',
    bgGradient: 'from-amber-500/10 to-orange-500/10 border-amber-300 dark:border-amber-800',
    descriptionAr: 'يقيس التفكير التحليلي المتقدم، العمليات الحسابية المتقاطعة، وتراكب وتطابق الأشكال ثنائية وثلاثية الأبعاد.',
  },
  very_hard: {
    id: 'very_hard',
    titleAr: 'المستوى النخبوي / صعب جداً (Mensa Genius)',
    titleEn: 'Ultra Mensa Genius Tier',
    subtitleAr: 'الجبر البولياني والمصفوفات الطوبولوجية المعقدة',
    badge: 'صعب جداً 🔴 🌟',
    durationMinutes: 25,
    iqRange: 'IQ 125 - 160+',
    colorClass: 'rose',
    bgGradient: 'from-rose-500/10 to-purple-500/10 border-rose-300 dark:border-rose-800',
    descriptionAr: 'اختبار عالي الدقة للنوابغ يماثل اختبارات منسا الدولية، يعتمد على بوابات XOR/AND، وتفكيك البنى الطوبولوجية المعقدة.',
  },
};

export const ALL_IQ_QUESTIONS: IQQuestion[] = [
  // ===================== EASY LEVEL (Questions 1 - 8) =====================
  {
    id: 1,
    level: 'easy',
    category: 'pattern_logic',
    categoryLabelAr: 'التعرف على الأنماط والتسلسل',
    categoryLabelEn: 'Pattern Recognition & Progression',
    difficulty: 1,
    titleAr: 'مصفوفة التزايد العددي للنقاط',
    titleEn: 'Dot Progression Matrix',
    ruleAr: 'يزداد عدد النقاط في كل صف بمقدار 1 من اليسار إلى اليمين.',
    ruleEn: 'The number of dots increases by 1 in each row.',
    gridType: '3x3',
    cells: [
      { type: 'dots', dotsCount: 1 },
      { type: 'dots', dotsCount: 2 },
      { type: 'dots', dotsCount: 3 },
      { type: 'dots', dotsCount: 2 },
      { type: 'dots', dotsCount: 3 },
      { type: 'dots', dotsCount: 4 },
      { type: 'dots', dotsCount: 3 },
      { type: 'dots', dotsCount: 4 },
      null
    ],
    options: [
      { type: 'dots', dotsCount: 3 },
      { type: 'dots', dotsCount: 5 },
      { type: 'dots', dotsCount: 6 },
      { type: 'dots', dotsCount: 4 },
      { type: 'dots', dotsCount: 2 },
      { type: 'dots', dotsCount: 7 }
    ],
    correctOptionIndex: 1,
    explanationAr: 'في الصف الثالث: 3 نقاط، ثم 4 نقاط، إذن الخلية التالية تحتوي على 5 نقاط.',
    explanationEn: 'Row 3 progression: 3, 4, so next is 5 dots.'
  },
  {
    id: 2,
    level: 'easy',
    category: 'fluid_reasoning',
    categoryLabelAr: 'الاستدلال السائل والتجريدي',
    categoryLabelEn: 'Polygon Sides Progression',
    difficulty: 1,
    titleAr: 'تدرج أضلاع المضلعات الهندسية',
    titleEn: 'Polygon Sides Progression',
    ruleAr: 'في كل صف: مثلث (3 أضلاع) ➔ مربع (4 أضلاع) ➔ خماسي (5 أضلاع).',
    ruleEn: 'Row rule: Triangle (3) ➔ Square (4) ➔ Pentagon (5).',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'triangle', fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'rect', fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'rect', fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'rect', fill: '#f59e0b' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'circle', fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'rect', fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'star', fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: '#3b82f6' }] }
    ],
    correctOptionIndex: 2,
    explanationAr: 'الصف الثالث لونه برتقالي، والشكل الناقص هو خماسي الأضلاع باللون البرتقالي.',
    explanationEn: 'The missing shape is an orange pentagon completing the 3, 4, 5 sides cycle.'
  },
  {
    id: 3,
    level: 'easy',
    category: 'spatial_relations',
    categoryLabelAr: 'العلاقات المكانية والدوران',
    categoryLabelEn: 'Spatial Rotation & Angles',
    difficulty: 2,
    titleAr: 'دوران السهم البسيط 90 درجة',
    titleEn: '90° Clockwise Arrow Rotation',
    ruleAr: 'يدور السهم باتجاه عقارب الساعة بمقدار 90° في كل خطوة.',
    ruleEn: 'Arrow rotates 90° clockwise in each step.',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 0, color: '#6366f1' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 90, color: '#6366f1' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 180, color: '#6366f1' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 90, color: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 180, color: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 270, color: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 180, color: '#14b8a6' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 270, color: '#14b8a6' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 270, color: '#14b8a6' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 0, color: '#14b8a6' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 90, color: '#14b8a6' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 180, color: '#14b8a6' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 0, color: '#6366f1' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 45, color: '#14b8a6' }] }
    ],
    correctOptionIndex: 1,
    explanationAr: 'السهم في الصف الثالث: للأسفل (180°) ➔ لليسار (270°) ➔ للأعلى (0°) بلون التركواز.',
    explanationEn: 'The sequence 180°, 270° continues clockwise to 0° (Up).'
  },
  {
    id: 4,
    level: 'easy',
    category: 'pattern_logic',
    categoryLabelAr: 'التعرف على الأنماط والتسلسل',
    categoryLabelEn: 'Quadrant Shading Cycle',
    difficulty: 2,
    titleAr: 'توزيع التظليل داخل الأرباع',
    titleEn: 'Quadrant Shading Cycle',
    ruleAr: 'ينتقل الربع المظلل داخل الدائرة باتجاه عقارب الساعة في كل صف.',
    ruleEn: 'The shaded quadrant rotates clockwise.',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#94a3b8' }, { kind: 'rect', x: 50, y: 15, size: 35, fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#94a3b8' }, { kind: 'rect', x: 50, y: 50, size: 35, fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#94a3b8' }, { kind: 'rect', x: 15, y: 50, size: 35, fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#94a3b8' }, { kind: 'rect', x: 50, y: 50, size: 35, fill: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#94a3b8' }, { kind: 'rect', x: 15, y: 50, size: 35, fill: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#94a3b8' }, { kind: 'rect', x: 15, y: 15, size: 35, fill: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#94a3b8' }, { kind: 'rect', x: 15, y: 50, size: 35, fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#94a3b8' }, { kind: 'rect', x: 15, y: 15, size: 35, fill: '#10b981' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#94a3b8' }, { kind: 'rect', x: 15, y: 50, size: 35, fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#94a3b8' }, { kind: 'rect', x: 50, y: 15, size: 35, fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#94a3b8' }, { kind: 'rect', x: 50, y: 50, size: 35, fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#94a3b8' }, { kind: 'rect', x: 15, y: 15, size: 35, fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#94a3b8' }] }
    ],
    correctOptionIndex: 1,
    explanationAr: 'في الصف الثالث: التظليل أسفل يسار ➔ أعلى يسار ➔ الموضع التالي هو أعلى يمين باللون الأخضر.',
    explanationEn: 'The quadrant moves to top-right.'
  },
  {
    id: 5,
    level: 'easy',
    category: 'spatial_relations',
    categoryLabelAr: 'العلاقات المكانية والدوران',
    categoryLabelEn: 'Concentric Rings Expansion',
    difficulty: 2,
    titleAr: 'تزايد الحلقات متحدة المركز',
    titleEn: 'Concentric Rings Expansion',
    ruleAr: 'في كل صف: حلقة واحدة ➔ حلقتان ➔ ثلاث حلقات.',
    ruleEn: '1 ring ➔ 2 rings ➔ 3 rings.',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'circle', size: 30, fill: 'none', stroke: '#0284c7', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'circle', size: 30, fill: 'none', stroke: '#0284c7', strokeWidth: 3 }, { kind: 'circle', size: 55, fill: 'none', stroke: '#0284c7', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'circle', size: 30, fill: 'none', stroke: '#0284c7', strokeWidth: 3 }, { kind: 'circle', size: 55, fill: 'none', stroke: '#0284c7', strokeWidth: 3 }, { kind: 'circle', size: 80, fill: 'none', stroke: '#0284c7', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 25, fill: 'none', stroke: '#7c3aed', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 25, fill: 'none', stroke: '#7c3aed', strokeWidth: 3 }, { kind: 'rect', size: 50, fill: 'none', stroke: '#7c3aed', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 25, fill: 'none', stroke: '#7c3aed', strokeWidth: 3 }, { kind: 'rect', size: 50, fill: 'none', stroke: '#7c3aed', strokeWidth: 3 }, { kind: 'rect', size: 75, fill: 'none', stroke: '#7c3aed', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'triangle', size: 25, fill: 'none', stroke: '#e11d48', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'triangle', size: 25, fill: 'none', stroke: '#e11d48', strokeWidth: 3 }, { kind: 'triangle', size: 50, fill: 'none', stroke: '#e11d48', strokeWidth: 3 }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'triangle', size: 25, fill: 'none', stroke: '#e11d48', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'triangle', size: 25, fill: 'none', stroke: '#e11d48', strokeWidth: 3 }, { kind: 'triangle', size: 50, fill: 'none', stroke: '#e11d48', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'triangle', size: 25, fill: 'none', stroke: '#e11d48', strokeWidth: 3 }, { kind: 'triangle', size: 50, fill: 'none', stroke: '#e11d48', strokeWidth: 3 }, { kind: 'triangle', size: 75, fill: 'none', stroke: '#e11d48', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 75, fill: 'none', stroke: '#e11d48', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'circle', size: 80, fill: 'none', stroke: '#e11d48', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'triangle', size: 75, fill: '#e11d48' }] }
    ],
    correctOptionIndex: 2,
    explanationAr: 'الصف الثالث: مثلث ➔ مثلثان ➔ ثلاثة مثلثات متداخلة.',
    explanationEn: 'The sequence requires 3 nested concentric triangles.'
  },
  {
    id: 6,
    level: 'easy',
    category: 'spatial_relations',
    categoryLabelAr: 'العلاقات المكانية والدوران',
    categoryLabelEn: 'Subgrid Dot Movement',
    difficulty: 2,
    titleAr: 'دوران النقطة في زوايا المربع',
    titleEn: 'Corner Dot Orbital Movement',
    ruleAr: 'تتحرك النقطة بزوايا المربع في اتجاه عقارب الساعة خطوة واحدة.',
    ruleEn: 'The dot moves around the corners clockwise.',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'rect', size: 80, fill: 'none', stroke: '#94a3b8' }, { kind: 'circle', x: 25, y: 25, size: 14, fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 80, fill: 'none', stroke: '#94a3b8' }, { kind: 'circle', x: 75, y: 25, size: 14, fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 80, fill: 'none', stroke: '#94a3b8' }, { kind: 'circle', x: 75, y: 75, size: 14, fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 80, fill: 'none', stroke: '#94a3b8' }, { kind: 'circle', x: 75, y: 25, size: 14, fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 80, fill: 'none', stroke: '#94a3b8' }, { kind: 'circle', x: 75, y: 75, size: 14, fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 80, fill: 'none', stroke: '#94a3b8' }, { kind: 'circle', x: 25, y: 75, size: 14, fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 80, fill: 'none', stroke: '#94a3b8' }, { kind: 'circle', x: 75, y: 75, size: 14, fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 80, fill: 'none', stroke: '#94a3b8' }, { kind: 'circle', x: 25, y: 75, size: 14, fill: '#f59e0b' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'rect', size: 80, fill: 'none', stroke: '#94a3b8' }, { kind: 'circle', x: 25, y: 25, size: 14, fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 80, fill: 'none', stroke: '#94a3b8' }, { kind: 'circle', x: 75, y: 25, size: 14, fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 80, fill: 'none', stroke: '#94a3b8' }, { kind: 'circle', x: 75, y: 75, size: 14, fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 80, fill: 'none', stroke: '#94a3b8' }, { kind: 'circle', x: 25, y: 75, size: 14, fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 80, fill: 'none', stroke: '#94a3b8' }, { kind: 'circle', x: 50, y: 50, size: 14, fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 80, fill: '#f59e0b' }] }
    ],
    correctOptionIndex: 0,
    explanationAr: 'الصف الثالث: النقطة أسفل يمين ➔ أسفل يسار ➔ أعلى يسار باللون البرتقالي.',
    explanationEn: 'The dot continues clockwise to top-left.'
  },
  {
    id: 7,
    level: 'easy',
    category: 'fluid_reasoning',
    categoryLabelAr: 'الاستدلال السائل والتجريدي',
    categoryLabelEn: 'Additive Line Grid Logic',
    difficulty: 2,
    titleAr: 'جمع الخطوط المتوازية',
    titleEn: 'Additive Parallel Lines',
    ruleAr: 'عدد الخطوط في الخلية 3 = مجموع عدد الخطوط في الخلية 1 والخلية 2.',
    ruleEn: 'Cell 3 lines = Cell 1 lines + Cell 2 lines.',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'line', x: 50, y: 20, rotation: 0, stroke: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 35, y: 20, rotation: 0, stroke: '#3b82f6' }, { kind: 'line', x: 65, y: 20, rotation: 0, stroke: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 25, y: 20, rotation: 0, stroke: '#3b82f6' }, { kind: 'line', x: 50, y: 20, rotation: 0, stroke: '#3b82f6' }, { kind: 'line', x: 75, y: 20, rotation: 0, stroke: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 35, y: 20, rotation: 90, stroke: '#10b981' }, { kind: 'line', x: 65, y: 20, rotation: 90, stroke: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 35, y: 20, rotation: 90, stroke: '#10b981' }, { kind: 'line', x: 65, y: 20, rotation: 90, stroke: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 20, y: 20, rotation: 90, stroke: '#10b981' }, { kind: 'line', x: 40, y: 20, rotation: 90, stroke: '#10b981' }, { kind: 'line', x: 60, y: 20, rotation: 90, stroke: '#10b981' }, { kind: 'line', x: 80, y: 20, rotation: 90, stroke: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 50, y: 20, rotation: 45, stroke: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 25, y: 20, rotation: 45, stroke: '#8b5cf6' }, { kind: 'line', x: 50, y: 20, rotation: 45, stroke: '#8b5cf6' }, { kind: 'line', x: 75, y: 20, rotation: 45, stroke: '#8b5cf6' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'line', x: 35, y: 20, rotation: 45, stroke: '#8b5cf6' }, { kind: 'line', x: 65, y: 20, rotation: 45, stroke: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 25, y: 20, rotation: 45, stroke: '#8b5cf6' }, { kind: 'line', x: 50, y: 20, rotation: 45, stroke: '#8b5cf6' }, { kind: 'line', x: 75, y: 20, rotation: 45, stroke: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 20, y: 20, rotation: 45, stroke: '#8b5cf6' }, { kind: 'line', x: 40, y: 20, rotation: 45, stroke: '#8b5cf6' }, { kind: 'line', x: 60, y: 20, rotation: 45, stroke: '#8b5cf6' }, { kind: 'line', x: 80, y: 20, rotation: 45, stroke: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 50, y: 20, rotation: 45, stroke: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'cross', color: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: '#8b5cf6' }] }
    ],
    correctOptionIndex: 2,
    explanationAr: 'في الصف الثالث: 1 خط + 3 خطوط = 4 خطوط مائلة.',
    explanationEn: '1 + 3 = 4 diagonal lines.'
  },
  {
    id: 8,
    level: 'easy',
    category: 'matrix_operations',
    categoryLabelAr: 'العمليات المنطقية على المصفوفات',
    categoryLabelEn: 'Shape Overlay Superposition',
    difficulty: 2,
    titleAr: 'تراكب الأشكال البسيط',
    titleEn: 'Simple Shape Superposition',
    ruleAr: 'الخلية الثالثة = دمج الشكل الخارجي من الأولى مع الرمز الداخلي من الثانية.',
    ruleEn: 'Cell 3 combines outer shape from Cell 1 and inner shape from Cell 2.',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#3b82f6', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'cross', color: '#ef4444' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#3b82f6', strokeWidth: 3 }, { kind: 'cross', color: '#ef4444' }] },
      { type: 'composite', shapes: [{ kind: 'rect', fill: 'none', stroke: '#10b981', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'diamond', color: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'rect', fill: 'none', stroke: '#10b981', strokeWidth: 3 }, { kind: 'diamond', color: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', fill: 'none', stroke: '#8b5cf6', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'star', color: '#ec4899' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'star', color: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', fill: 'none', stroke: '#8b5cf6', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: 'none', stroke: '#8b5cf6', strokeWidth: 3 }, { kind: 'star', color: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', fill: 'none', stroke: '#8b5cf6', strokeWidth: 3 }, { kind: 'star', color: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'rect', fill: 'none', stroke: '#8b5cf6', strokeWidth: 3 }, { kind: 'star', color: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', fill: '#8b5cf6' }] }
    ],
    correctOptionIndex: 3,
    explanationAr: 'مثلث بنفسجي مفرغ وبداخله نجمة وردية.',
    explanationEn: 'Outer purple triangle containing inner pink star.'
  },

  // ===================== HARD LEVEL (Questions 9 - 18) =====================
  {
    id: 9,
    level: 'hard',
    category: 'pattern_logic',
    categoryLabelAr: 'التعرف على الأنماط والتسلسل',
    categoryLabelEn: 'Latin Square Attribute Matrix',
    difficulty: 3,
    titleAr: 'مصفوفة التوزيع اللاتيني للأشكال والألوان',
    titleEn: 'Latin Square 3-Variable Matrix',
    ruleAr: 'يحتوي كل صف وكل عمود على: دائرة، مربع، مثلث، بحيث لا يتكرر أي شكل في نفس الصف أو العمود.',
    ruleEn: 'Each row & column has 1 Circle, 1 Square, 1 Triangle of distinct colors.',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'circle', fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'rect', fill: '#ef4444' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'rect', fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: '#ef4444' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', fill: '#ef4444' }] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: '#10b981' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'circle', fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'rect', fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'rect', fill: '#ef4444' }] },
      { type: 'composite', shapes: [{ kind: 'rect', fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'diamond', fill: '#3b82f6' }] }
    ],
    correctOptionIndex: 2,
    explanationAr: 'في الصف الثالث والعمود الثالث، الشكل الناقص هو مربع، واللون الناقص هو الأزرق ➔ مربع أزرق.',
    explanationEn: 'Latin Square logic: The missing cell in Row 3 / Col 3 is the Blue Square.'
  },
  {
    id: 10,
    level: 'hard',
    category: 'spatial_relations',
    categoryLabelAr: 'العلاقات المكانية والدوران',
    categoryLabelEn: 'Axial Mirror Inversion',
    difficulty: 3,
    titleAr: 'الانعكاس والتماثل المحوري المزدوج',
    titleEn: 'Axial Mirror Inversion',
    ruleAr: 'في كل صف: السهم يدور بزاوية 90° مع كل خطوة.',
    ruleEn: 'The arrow rotates 90° clockwise in each step.',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 45, color: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 135, color: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 225, color: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 315, color: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 45, color: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 135, color: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 225, color: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 315, color: '#ec4899' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 225, color: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 315, color: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 45, color: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 135, color: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 90, color: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 0, color: '#ec4899' }] }
    ],
    correctOptionIndex: 2,
    explanationAr: 'في الصف الثالث: 225° ➔ 315° (+90°) ➔ 45° (315° + 90° = 405° = 45°).',
    explanationEn: '225° + 90° = 315°, + 90° = 45°.'
  },
  {
    id: 11,
    level: 'hard',
    category: 'matrix_operations',
    categoryLabelAr: 'العمليات المنطقية على المصفوفات',
    categoryLabelEn: 'Exclusive OR (XOR) Cancellation',
    difficulty: 4,
    titleAr: 'قاعدة الإلغاء المتماثل للخطوط (XOR Logic)',
    titleEn: 'Exclusive OR (XOR) Line Cancellation',
    ruleAr: 'الخطوط المشتركة بين الخلية 1 والخلية 2 تختفي في الخلية 3، والخطوط الفريدة تظهر (XOR).',
    ruleEn: 'Overlapping lines cancel out (XOR logic).',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'line', x: 50, y: 15, rotation: 0, stroke: '#3b82f6' }, { kind: 'line', x: 15, y: 50, rotation: 90, stroke: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 50, y: 15, rotation: 0, stroke: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 15, y: 50, rotation: 90, stroke: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 15, y: 50, rotation: 90, stroke: '#10b981' }, { kind: 'line', x: 15, y: 15, rotation: 45, stroke: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 15, y: 15, rotation: 45, stroke: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 15, y: 50, rotation: 90, stroke: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 50, y: 15, rotation: 0, stroke: '#f59e0b' }, { kind: 'line', x: 15, y: 15, rotation: 45, stroke: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 50, y: 15, rotation: 0, stroke: '#f59e0b' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'line', x: 50, y: 15, rotation: 0, stroke: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 15, y: 15, rotation: 45, stroke: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 15, y: 50, rotation: 90, stroke: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 50, y: 15, rotation: 0, stroke: '#f59e0b' }, { kind: 'line', x: 15, y: 15, rotation: 45, stroke: '#f59e0b' }] },
      { type: 'composite', shapes: [] },
      { type: 'composite', shapes: [{ kind: 'circle', fill: '#f59e0b' }] }
    ],
    correctOptionIndex: 1,
    explanationAr: 'الخط الرأسي مكرر في الخليتين الأولى والثانية فيحذف، ويتبقى الخط المائل 45° فقط.',
    explanationEn: 'Vertical line cancels out, leaving only the diagonal line.'
  },
  {
    id: 12,
    level: 'hard',
    category: 'matrix_operations',
    categoryLabelAr: 'العمليات المنطقية على المصفوفات',
    categoryLabelEn: 'Subtractive Shape Decomposition',
    difficulty: 4,
    titleAr: 'طرح وحذف الأشكال المتطابقة',
    titleEn: 'Subtractive Shape Decomposition',
    ruleAr: 'الخلية 3 = الخلية 1 مطروحاً منها الخلية 2.',
    ruleEn: 'Cell 3 = Cell 1 minus Cell 2.',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'circle', size: 70, fill: 'none', stroke: '#3b82f6', strokeWidth: 3 }, { kind: 'rect', size: 35, fill: '#ef4444' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 35, fill: '#ef4444' }] },
      { type: 'composite', shapes: [{ kind: 'circle', size: 70, fill: 'none', stroke: '#3b82f6', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 70, fill: 'none', stroke: '#10b981', strokeWidth: 3 }, { kind: 'triangle', size: 35, fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', size: 35, fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 70, fill: 'none', stroke: '#10b981', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: 'none', stroke: '#8b5cf6', strokeWidth: 3 }, { kind: 'circle', size: 25, fill: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'circle', size: 25, fill: '#ec4899' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'circle', size: 25, fill: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: 'none', stroke: '#8b5cf6', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 70, fill: 'none', stroke: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', size: 70, fill: 'none', stroke: '#8b5cf6' }] },
      { type: 'composite', shapes: [] }
    ],
    correctOptionIndex: 1,
    explanationAr: 'بحذف الدائرة الوردية من الخلية الأولى يتبقى الإطار الخماسي البنفسجي المفرغ.',
    explanationEn: 'Subtracting the inner circle leaves the hollow pentagon.'
  },
  {
    id: 13,
    level: 'hard',
    category: 'spatial_relations',
    categoryLabelAr: 'العلاقات المكانية والدوران',
    categoryLabelEn: 'Dual-Axis Spatial Flip',
    difficulty: 4,
    titleAr: 'الانعكاس المزدوج مع تغير اللون',
    titleEn: 'Dual-Axis Flip with Color Inversion',
    ruleAr: 'في كل صف: ينعكس السهم أفقياً ثم عمودياً مع تغير دورة اللون.',
    ruleEn: 'Arrow flips horizontally then vertically with color shifts.',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 0, color: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 180, color: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 90, color: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 90, color: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 270, color: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 180, color: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 180, color: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 0, color: '#f59e0b' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 270, color: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 90, color: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 180, color: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 0, color: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 45, color: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'arrow', rotation: 135, color: '#f59e0b' }] }
    ],
    correctOptionIndex: 0,
    explanationAr: 'في الصف الثالث: السهم 180° ➔ 0° ➔ 270° (يشير لليسار) باللون البرتقالي.',
    explanationEn: '180° ➔ 0° ➔ 270° in orange.'
  },
  {
    id: 14,
    level: 'hard',
    category: 'fluid_reasoning',
    categoryLabelAr: 'الاستدلال السائل والتجريدي',
    categoryLabelEn: 'Cross-Cell Element Summation',
    difficulty: 4,
    titleAr: 'مصفوفة التكامل الهندسي التبادلي',
    titleEn: 'Cross-Cell Element Matrix',
    ruleAr: 'في كل عمود: عدد الدوائر يتزايد رأسياً من 1 إلى 3 مع ثبات الشكل الخارجي.',
    ruleEn: 'Circles increase vertically from 1 to 3.',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'rect', size: 70, fill: 'none', stroke: '#3b82f6', strokeWidth: 3 }, { kind: 'circle', x: 50, y: 50, size: 16, fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', size: 70, fill: 'none', stroke: '#10b981', strokeWidth: 3 }, { kind: 'circle', x: 50, y: 50, size: 16, fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: 'none', stroke: '#f59e0b', strokeWidth: 3 }, { kind: 'circle', x: 50, y: 50, size: 16, fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 70, fill: 'none', stroke: '#3b82f6', strokeWidth: 3 }, { kind: 'circle', x: 35, y: 50, size: 14, fill: '#3b82f6' }, { kind: 'circle', x: 65, y: 50, size: 14, fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', size: 70, fill: 'none', stroke: '#10b981', strokeWidth: 3 }, { kind: 'circle', x: 35, y: 50, size: 14, fill: '#10b981' }, { kind: 'circle', x: 65, y: 50, size: 14, fill: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: 'none', stroke: '#f59e0b', strokeWidth: 3 }, { kind: 'circle', x: 35, y: 50, size: 14, fill: '#f59e0b' }, { kind: 'circle', x: 65, y: 50, size: 14, fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 70, fill: 'none', stroke: '#3b82f6', strokeWidth: 3 }, { kind: 'circle', x: 25, y: 50, size: 12, fill: '#3b82f6' }, { kind: 'circle', x: 50, y: 50, size: 12, fill: '#3b82f6' }, { kind: 'circle', x: 75, y: 50, size: 12, fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', size: 70, fill: 'none', stroke: '#10b981', strokeWidth: 3 }, { kind: 'circle', x: 25, y: 50, size: 12, fill: '#10b981' }, { kind: 'circle', x: 50, y: 50, size: 12, fill: '#10b981' }, { kind: 'circle', x: 75, y: 50, size: 12, fill: '#10b981' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: 'none', stroke: '#f59e0b', strokeWidth: 3 }, { kind: 'circle', x: 50, y: 50, size: 16, fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: 'none', stroke: '#f59e0b', strokeWidth: 3 }, { kind: 'circle', x: 25, y: 50, size: 12, fill: '#f59e0b' }, { kind: 'circle', x: 50, y: 50, size: 12, fill: '#f59e0b' }, { kind: 'circle', x: 75, y: 50, size: 12, fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 70, fill: 'none', stroke: '#f59e0b', strokeWidth: 3 }, { kind: 'circle', x: 25, y: 50, size: 12, fill: '#f59e0b' }, { kind: 'circle', x: 50, y: 50, size: 12, fill: '#f59e0b' }, { kind: 'circle', x: 75, y: 50, size: 12, fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', size: 70, fill: 'none', stroke: '#f59e0b', strokeWidth: 3 }] },
      { type: 'composite', shapes: [] }
    ],
    correctOptionIndex: 1,
    explanationAr: 'في العمود الثالث والصف الثالث: إطار خماسي برتقالي وبداخله 3 دوائر صغيرة.',
    explanationEn: 'Orange pentagon with 3 internal dots.'
  },

  // ===================== VERY HARD LEVEL / MENSA TIER (Questions 15 - 24) =====================
  {
    id: 15,
    level: 'very_hard',
    category: 'matrix_operations',
    categoryLabelAr: 'العمليات المنطقية على المصفوفات',
    categoryLabelEn: 'Multi-Axis XOR & Rotation',
    difficulty: 5,
    titleAr: 'الإلغاء المنطقي المتداخل (Dual XOR + 45° Spin)',
    titleEn: 'Dual XOR & 45° Spin Matrix',
    ruleAr: 'الصف الثالث يجمع بين قاعدة XOR للخطوط ودوران بزاوية 45° باتجاه عقارب الساعة.',
    ruleEn: 'Combines line XOR cancellation with a 45° clockwise spin.',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'line', x: 50, y: 15, rotation: 0, stroke: '#ef4444' }, { kind: 'line', x: 15, y: 50, rotation: 90, stroke: '#ef4444' }, { kind: 'line', x: 15, y: 15, rotation: 45, stroke: '#ef4444' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 50, y: 15, rotation: 0, stroke: '#ef4444' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 15, y: 50, rotation: 135, stroke: '#ef4444' }, { kind: 'line', x: 15, y: 15, rotation: 90, stroke: '#ef4444' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 15, y: 50, rotation: 90, stroke: '#8b5cf6' }, { kind: 'line', x: 15, y: 15, rotation: 45, stroke: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 15, y: 50, rotation: 90, stroke: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 15, y: 15, rotation: 90, stroke: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 50, y: 15, rotation: 0, stroke: '#ec4899' }, { kind: 'line', x: 15, y: 15, rotation: 45, stroke: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 15, y: 15, rotation: 45, stroke: '#ec4899' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'line', x: 50, y: 15, rotation: 45, stroke: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 15, y: 50, rotation: 90, stroke: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 50, y: 15, rotation: 0, stroke: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'line', x: 15, y: 15, rotation: 135, stroke: '#ec4899' }] },
      { type: 'composite', shapes: [] },
      { type: 'composite', shapes: [{ kind: 'cross', color: '#ec4899' }] }
    ],
    correctOptionIndex: 0,
    explanationAr: 'تطبيق XOR يحذف الخط المائل 45°، ويدور الخط الرأسي بمقدار 45° ليصبح مائلاً بزاوية 45° باللون الوردي.',
    explanationEn: 'XOR cancels the 45° line; the remaining vertical line rotates 45°.'
  },
  {
    id: 16,
    level: 'very_hard',
    category: 'spatial_relations',
    categoryLabelAr: 'العلاقات المكانية والدوران',
    categoryLabelEn: '3D Orbital Isometric Matrix',
    difficulty: 5,
    titleAr: 'الدوران الفضائي ثلاثي الأبعاد (Isometric 3D)',
    titleEn: '3D Orbital Matrix',
    ruleAr: 'تتحرك النجوم والأشكال بزوايا متعاكسة محاكاة للدوران الفراغي ثلاثي الأبعاد.',
    ruleEn: 'Simulates 3D isometric rotation across 3 axes.',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'diamond', color: '#3b82f6' }, { kind: 'circle', x: 50, y: 20, size: 10, fill: '#ef4444' }] },
      { type: 'composite', shapes: [{ kind: 'diamond', color: '#3b82f6' }, { kind: 'circle', x: 80, y: 50, size: 10, fill: '#ef4444' }] },
      { type: 'composite', shapes: [{ kind: 'diamond', color: '#3b82f6' }, { kind: 'circle', x: 50, y: 80, size: 10, fill: '#ef4444' }] },
      { type: 'composite', shapes: [{ kind: 'star', color: '#10b981' }, { kind: 'circle', x: 80, y: 50, size: 10, fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'star', color: '#10b981' }, { kind: 'circle', x: 50, y: 80, size: 10, fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'star', color: '#10b981' }, { kind: 'circle', x: 20, y: 50, size: 10, fill: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'cross', color: '#f59e0b' }, { kind: 'circle', x: 50, y: 80, size: 10, fill: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'cross', color: '#f59e0b' }, { kind: 'circle', x: 20, y: 50, size: 10, fill: '#8b5cf6' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'cross', color: '#f59e0b' }, { kind: 'circle', x: 50, y: 20, size: 10, fill: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'cross', color: '#f59e0b' }, { kind: 'circle', x: 80, y: 50, size: 10, fill: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'cross', color: '#f59e0b' }, { kind: 'circle', x: 50, y: 80, size: 10, fill: '#8b5cf6' }] },
      { type: 'composite', shapes: [{ kind: 'diamond', color: '#f59e0b' }] },
      { type: 'composite', shapes: [{ kind: 'star', color: '#f59e0b' }] },
      { type: 'composite', shapes: [] }
    ],
    correctOptionIndex: 0,
    explanationAr: 'في الصف الثالث: النقطة في الأسفل (50, 80) ➔ اليسار (20, 50) ➔ إذن الموضع التالي هو الأعلى (50, 20) مع صليب برتقالي.',
    explanationEn: 'The orbit continues clockwise to top position (50, 20).'
  },
  {
    id: 17,
    level: 'very_hard',
    category: 'matrix_operations',
    categoryLabelAr: 'العمليات المنطقية على المصفوفات',
    categoryLabelEn: 'Boolean AND & Topology Logic',
    difficulty: 5,
    titleAr: 'التقاطع البولياني (Boolean AND Conjunction)',
    titleEn: 'Boolean AND Conjunction',
    ruleAr: 'الخلية 3 تحتوي فقط على الأجزاء المشتركة الموجودة في كل من الخلية 1 والخلية 2 (AND Logic).',
    ruleEn: 'Cell 3 contains only the elements present in BOTH Cell 1 and Cell 2 (AND).',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'circle', size: 70, fill: 'none', stroke: '#3b82f6', strokeWidth: 3 }, { kind: 'line', x: 50, y: 15, rotation: 0, stroke: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'circle', size: 70, fill: 'none', stroke: '#3b82f6', strokeWidth: 3 }, { kind: 'line', x: 15, y: 50, rotation: 90, stroke: '#3b82f6' }] },
      { type: 'composite', shapes: [{ kind: 'circle', size: 70, fill: 'none', stroke: '#3b82f6', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 70, fill: 'none', stroke: '#10b981', strokeWidth: 3 }, { kind: 'cross', color: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'cross', color: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'cross', color: '#10b981' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', size: 70, fill: 'none', stroke: '#ec4899', strokeWidth: 3 }, { kind: 'diamond', color: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', size: 70, fill: 'none', stroke: '#ec4899', strokeWidth: 3 }, { kind: 'circle', size: 20, fill: '#ec4899' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'triangle', size: 70, fill: 'none', stroke: '#ec4899', strokeWidth: 3 }] },
      { type: 'composite', shapes: [{ kind: 'diamond', color: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'circle', size: 20, fill: '#ec4899' }] },
      { type: 'composite', shapes: [{ kind: 'triangle', size: 70, fill: 'none', stroke: '#ec4899', strokeWidth: 3 }, { kind: 'diamond', color: '#ec4899' }] },
      { type: 'composite', shapes: [] },
      { type: 'composite', shapes: [{ kind: 'rect', size: 70, fill: '#ec4899' }] }
    ],
    correctOptionIndex: 0,
    explanationAr: 'بوابة التقاطع AND: العنصر المشترك الوحيد بين الخليتين هو إطار المثلث الوردي المفرغ.',
    explanationEn: 'Only the outer triangle is present in both cells.'
  },
  {
    id: 18,
    level: 'very_hard',
    category: 'fluid_reasoning',
    categoryLabelAr: 'الاستدلال السائل والتجريدي',
    categoryLabelEn: 'Multi-Variable Vector Topology',
    difficulty: 5,
    titleAr: 'تكامل المتجهات المتقاطعة (Mensa Vector Field)',
    titleEn: 'Mensa Vector Field Matrix',
    ruleAr: 'في كل صف: مجموع اتجاهات الأسهم وحاصل ضرب التفرعات يتبع قاعدة التناظر القطري.',
    ruleEn: 'Diagonal symmetry rule across multi-variable vector shapes.',
    gridType: '3x3',
    cells: [
      { type: 'composite', shapes: [{ kind: 'diamond', color: '#6366f1' }, { kind: 'arrow', rotation: 45, color: '#6366f1' }] },
      { type: 'composite', shapes: [{ kind: 'diamond', color: '#6366f1' }, { kind: 'arrow', rotation: 135, color: '#6366f1' }] },
      { type: 'composite', shapes: [{ kind: 'diamond', color: '#6366f1' }, { kind: 'arrow', rotation: 225, color: '#6366f1' }] },
      { type: 'composite', shapes: [{ kind: 'star', color: '#14b8a6' }, { kind: 'arrow', rotation: 135, color: '#14b8a6' }] },
      { type: 'composite', shapes: [{ kind: 'star', color: '#14b8a6' }, { kind: 'arrow', rotation: 225, color: '#14b8a6' }] },
      { type: 'composite', shapes: [{ kind: 'star', color: '#14b8a6' }, { kind: 'arrow', rotation: 315, color: '#14b8a6' }] },
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: '#f43f5e' }, { kind: 'arrow', rotation: 225, color: '#ffffff' }] },
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: '#f43f5e' }, { kind: 'arrow', rotation: 315, color: '#ffffff' }] },
      null
    ],
    options: [
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: '#f43f5e' }, { kind: 'arrow', rotation: 45, color: '#ffffff' }] },
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: '#f43f5e' }, { kind: 'arrow', rotation: 135, color: '#ffffff' }] },
      { type: 'composite', shapes: [{ kind: 'polygon', points: '50,15 90,40 75,85 25,85 10,40', fill: '#f43f5e' }, { kind: 'arrow', rotation: 225, color: '#ffffff' }] },
      { type: 'composite', shapes: [{ kind: 'star', color: '#f43f5e' }] },
      { type: 'composite', shapes: [{ kind: 'diamond', color: '#f43f5e' }] },
      { type: 'composite', shapes: [] }
    ],
    correctOptionIndex: 0,
    explanationAr: 'في الصف الثالث: السهم بزاوية 225° ➔ 315° (+90°) ➔ إذن التالي بزاوية 45° داخل خماسي وردي.',
    explanationEn: 'The vector rotation steps by 90° to 45° within the pink pentagon.'
  }
];

export interface IQResultMetrics {
  level: IQDifficultyLevel;
  score: number;
  percentile: number;
  mensaQualified: boolean;
  classificationAr: string;
  classificationEn: string;
  tierColor: string;
  domainScores: {
    fluid: number;
    spatial: number;
    pattern: number;
    matrix: number;
  };
  totalAnswered: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  date: string;
}

export function calculateIQScoreByLevel(
  level: IQDifficultyLevel,
  questions: IQQuestion[],
  answers: Record<number, number>,
  timeSpentSeconds: number
): IQResultMetrics {
  let correctCount = 0;
  let fluidCorrect = 0;
  let fluidTotal = 0;
  let spatialCorrect = 0;
  let spatialTotal = 0;
  let patternCorrect = 0;
  let patternTotal = 0;
  let matrixCorrect = 0;
  let matrixTotal = 0;

  questions.forEach((q) => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctOptionIndex;

    if (isCorrect) {
      correctCount++;
    }

    if (q.category === 'fluid_reasoning') {
      fluidTotal++;
      if (isCorrect) fluidCorrect++;
    } else if (q.category === 'spatial_relations') {
      spatialTotal++;
      if (isCorrect) spatialCorrect++;
    } else if (q.category === 'pattern_logic') {
      patternTotal++;
      if (isCorrect) patternCorrect++;
    } else if (q.category === 'matrix_operations') {
      matrixTotal++;
      if (isCorrect) matrixCorrect++;
    }
  });

  const totalQuestions = questions.length;
  const ratio = totalQuestions > 0 ? correctCount / totalQuestions : 0;

  let rawIQ = 100;
  if (level === 'easy') {
    rawIQ = Math.round(75 + ratio * 40); // 75 to 115
  } else if (level === 'hard') {
    rawIQ = Math.round(95 + ratio * 43); // 95 to 138
  } else {
    // very_hard
    rawIQ = Math.round(115 + ratio * 45); // 115 to 160+
  }

  // Speed bonus
  const targetTime = level === 'very_hard' ? 1200 : level === 'hard' ? 900 : 600;
  if (ratio >= 0.8 && timeSpentSeconds < targetTime) {
    rawIQ = Math.min(160, rawIQ + 3);
  }

  let percentile = 50;
  if (rawIQ <= 85) percentile = 16;
  else if (rawIQ <= 90) percentile = 25;
  else if (rawIQ <= 100) percentile = 50;
  else if (rawIQ <= 110) percentile = 75;
  else if (rawIQ <= 115) percentile = 84;
  else if (rawIQ <= 120) percentile = 91;
  else if (rawIQ <= 125) percentile = 95;
  else if (rawIQ <= 130) percentile = 98;
  else if (rawIQ <= 135) percentile = 99;
  else if (rawIQ <= 145) percentile = 99.7;
  else percentile = 99.9;

  let classificationAr = 'متوسط الذكاء الطبيعي';
  let classificationEn = 'Average Intelligence';
  let tierColor = 'text-emerald-600 bg-emerald-50 border-emerald-300 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300';
  const mensaQualified = rawIQ >= 132;

  if (rawIQ >= 140) {
    classificationAr = 'عبقري / متفوق استثنائياً (مستوى منسا العالمي النخبوي 🌟)';
    classificationEn = 'Genius / Highly Gifted (Mensa Tier)';
    tierColor = 'text-amber-500 bg-amber-50 border-amber-300 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300';
  } else if (rawIQ >= 125) {
    classificationAr = 'متفوق جداً / ذكاء فائق (مؤهل لجمعيات النوابغ)';
    classificationEn = 'Very Superior Intelligence';
    tierColor = 'text-purple-600 bg-purple-50 border-purple-300 dark:bg-purple-950/60 dark:border-purple-800 dark:text-purple-300';
  } else if (rawIQ >= 115) {
    classificationAr = 'فوق المتوسط / قدرة استدلالية متقدمة';
    classificationEn = 'Above Average Intelligence';
    tierColor = 'text-blue-600 bg-blue-50 border-blue-300 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300';
  } else if (rawIQ >= 90) {
    classificationAr = 'متوسط الذكاء القياسي (طبيعي متوازن)';
    classificationEn = 'Standard Average';
    tierColor = 'text-emerald-600 bg-emerald-50 border-emerald-300 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300';
  } else {
    classificationAr = 'مستوى تأسيسي';
    classificationEn = 'Developing Spatial Logic';
    tierColor = 'text-slate-600 bg-slate-100 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }

  return {
    level,
    score: rawIQ,
    percentile,
    mensaQualified,
    classificationAr,
    classificationEn,
    tierColor,
    domainScores: {
      fluid: fluidTotal > 0 ? Math.round((fluidCorrect / fluidTotal) * 100) : 100,
      spatial: spatialTotal > 0 ? Math.round((spatialCorrect / spatialTotal) * 100) : 100,
      pattern: patternTotal > 0 ? Math.round((patternCorrect / patternTotal) * 100) : 100,
      matrix: matrixTotal > 0 ? Math.round((matrixCorrect / matrixTotal) * 100) : 100,
    },
    totalAnswered: Object.keys(answers).length,
    correctAnswers: correctCount,
    totalQuestions,
    timeSpentSeconds,
    date: new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  };
}
