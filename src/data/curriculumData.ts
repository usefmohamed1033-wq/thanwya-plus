import { TrackConfig, Subject, BookResource, ExamResource } from '../types';

export const CURRICULUM_DATA: Record<string, TrackConfig> = {
  sci_math: {
    id: 'sci_math',
    name: 'علمي رياضة',
    titleArabic: 'شعبة الرياضيات (علمي رياضة)',
    totalMarks: 320,
    subjects: [
      {
        id: 'arabic',
        name: 'اللغة العربية',
        mark: 80,
        iconName: 'BookOpen',
        color: 'emerald',
        chapters: [
          { id: 'ar-1', name: 'الوحدة الأولى: النحو والصرف (الإعراب، المشتقات، المصادر، أساليب النحو)', keyLaw: 'قواعد الإعراب وضوابط الممنوع من الصرف' },
          { id: 'ar-2', name: 'الوحدة الثانية: البلاغة (البيان، البديع، المعاني، التجربة الشعرية)', keyLaw: 'التذوق البلاغي والصور المركبة والمبتكرة' },
          { id: 'ar-3', name: 'الوحدة الثالثة: الأدب والنصوص (الإحياء، الاتجاه الوجداني، الديوان، أبوللو، المهاجر، الواقعية)', keyLaw: 'خصائص كل مدرسة وسماتها الفنية' },
          { id: 'ar-4', name: 'الوحدة الرابعة: قصة الأيام والقراءة المتحررة', keyLaw: 'فهم المقروء واستنتاج المعاني الضمنية' },
          { id: 'ar-5', name: 'الوحدة الخامسة: فنون التعبير المقالي والوظيفي والإملاء', keyLaw: 'قواعد الهمزات وعلامات الترقيم وتماسك الفكرة' }
        ]
      },
      {
        id: 'english',
        name: 'اللغة الأجنبية الأولى (English)',
        mark: 60,
        iconName: 'Languages',
        color: 'blue',
        chapters: [
          { id: 'en-1', name: 'Units 1-3: Making a Difference, Storytelling & Tenses Review', keyLaw: 'Past & Present Perfect, Passive Voice' },
          { id: 'en-2', name: 'Units 4-6: Technology, Innovation & Conditionals', keyLaw: 'If Conditionals, Wish & Modal Verbs' },
          { id: 'en-3', name: 'Units 7-9: Future Careers, Lifelong Learning & Relative Clauses', keyLaw: 'Relative Clauses, Future Forms & Phrasal Verbs' },
          { id: 'en-4', name: 'Units 10-12: Nature, Environment, Reported Speech & Inversion', keyLaw: 'Direct & Indirect Speech, Sentence Inversion' },
          { id: 'en-5', name: 'Advanced Skills: Translation, Comprehension & Essay Writing', keyLaw: 'Thesis Statement, Linking Words & Idioms' }
        ]
      },
      {
        id: 'physics',
        name: 'الفيزياء',
        mark: 60,
        iconName: 'Atom',
        color: 'indigo',
        chapters: [
          { id: 'ph-1', name: 'الفصل 1: التيار الكهربي وقانون أوم وقانونا كيرشوف', keyLaw: 'V = IR, I = V/R, ∑I_in = ∑I_out, ∑V = 0' },
          { id: 'ph-2', name: 'الفصل 2: التأثير المغناطيسي للتيار الكهربي وأجهزة القياس', keyLaw: 'B = μI/(2πd), F = BIL sinθ, τ = BIAN sinθ' },
          { id: 'ph-3', name: 'الفصل 3: الحث الكهرومغناطيسي وقوانين فاراداي والمحول', keyLaw: 'emf = -N(ΔΦ/Δt), Vs/Vp = Ns/Np' },
          { id: 'ph-4', name: 'الفصل 4: دوائر التيار المتردد والرنين الكهربي', keyLaw: 'Z = √(R² + (XL - XC)²), f0 = 1/(2π√LC)' },
          { id: 'ph-5', name: 'الفصل 5: ازدواجية الموجة والجسيم والظاهرة الكهروضوئية', keyLaw: 'E = hν, λ = h/p, KE_max = hν - W_e' },
          { id: 'ph-6', name: 'الفصل 6: الأطياف الذرية وأشعة إكس', keyLaw: 'ΔE = E2 - E1 = hν' },
          { id: 'ph-7', name: 'الفصل 7: الليزر والانبعاث التلقائي والمستحث', keyLaw: 'الإسكان المعكوس والنقاء الطيفي' },
          { id: 'ph-8', name: 'الفصل 8: الإلكترونيات الحديثة والوصلة الثنائية والترانزستور والبوابات', keyLaw: 'IC = β IB, IE = IB + IC' }
        ]
      },
      {
        id: 'chemistry',
        name: 'الكيمياء',
        mark: 60,
        iconName: 'FlaskConical',
        color: 'teal',
        chapters: [
          { id: 'ch-1', name: 'الباب 1: العناصر الانتقالية وخامات الحديد وسبائكه', keyLaw: 'التوزيع الإلكتروني وحالات التأكسد وعزم المغناطيسية' },
          { id: 'ch-2', name: 'الباب 2: التحليل الكيميائي الوصفي والكمي (المعايرة والتطاير والترسيب)', keyLaw: 'MaVa/na = MbVb/nb, قانون الكتلة المولية' },
          { id: 'ch-3', name: 'الباب 3: الاتزان الكيميائي والأيوني وقاعدة لوشاتيليه', keyLaw: 'Kc = [النواتج]/[المتفاعلات], pH + pOH = 14, Kw = 10^-14' },
          { id: 'ch-4', name: 'الباب 4: الكيمياء الكهربية والخلايا الجلفانية والإلكتروليتية وقوانين فاراداي', keyLaw: 'E°cell = E°ox + E°red, m = (M*I*t)/(z*96500)' },
          { id: 'ch-5', name: 'الباب 5: الكيمياء العضوية (الهيدروكربونات الأليفاتية والأروماتية والمشتقات)', keyLaw: 'تفاعلات الإضافة والاستبدال والبلمرة والأسترة' }
        ]
      },
      {
        id: 'math',
        name: 'الرياضيات البحتة والتطبيقية',
        mark: 60,
        iconName: 'Calculator',
        color: 'rose',
        chapters: [
          { id: 'ma-1', name: 'التفاضل والتكامل: اشتقاق الدوال المثلثية والأسية واللوغاريتمية والمعدلات الزمنية', keyLaw: 'd/dx(ln x) = 1/x, d/dx(e^x) = e^x' },
          { id: 'ma-2', name: 'تطبيقات التفاضل والتكامل: سلوك الدالة، المساحات والحجوم الدورانية', keyLaw: 'V = π ∫ [f(x)]² dx' },
          { id: 'ma-3', name: 'الجبر والهندسة الفراغية: مبدأ العد، نظرية ذات الحدين، المحددات، والمستقيم والمستوى في الفراغ', keyLaw: 'r = a + tk, cos θ = |d1 . d2| / (|d1||d2|)' },
          { id: 'ma-4', name: 'الاستاتيكا: الاحتكاك، العزوم، القوى المتوازية المستوية، والاتزان العام والازدواج', keyLaw: 'Fs ≤ μs R, ∑Fx = 0, ∑Fy = 0, ∑M = 0' },
          { id: 'ma-5', name: 'الديناميكا: تفاضل وتكامل المتجهات، قوانين نيوتن الثلاثة، الدفع والتصادم، والشغل والطاقة والقدرة', keyLaw: 'F = m a, I = F Δt = m(v2 - v1), T + V = ثابت' }
        ]
      }
    ]
  },
  sci_science: {
    id: 'sci_science',
    name: 'علمي علوم',
    titleArabic: 'شعبة العلوم (علمي علوم)',
    totalMarks: 320,
    subjects: [
      {
        id: 'arabic',
        name: 'اللغة العربية',
        mark: 80,
        iconName: 'BookOpen',
        color: 'emerald',
        chapters: [
          { id: 'ar-1', name: 'الوحدة الأولى: النحو والصرف (الإعراب، المشتقات، المصادر، أساليب النحو)', keyLaw: 'قواعد الإعراب وضوابط الممنوع من الصرف' },
          { id: 'ar-2', name: 'الوحدة الثانية: البلاغة (البيان، البديع، المعاني، التجربة الشعرية)', keyLaw: 'التذوق البلاغي والصور المركبة والمبتكرة' },
          { id: 'ar-3', name: 'الوحدة الثالثة: الأدب والنصوص (الإحياء، الاتجاه الوجداني، الديوان، أبوللو، المهاجر، الواقعية)', keyLaw: 'خصائص كل مدرسة وسماتها الفنية' },
          { id: 'ar-4', name: 'الوحدة الرابعة: قصة الأيام والقراءة المتحررة', keyLaw: 'فهم المقروء واستنتاج المعاني الضمنية' },
          { id: 'ar-5', name: 'الوحدة الخامسة: فنون التعبير المقالي والوظيفي والإملاء', keyLaw: 'قواعد الهمزات وعلامات الترقيم وتماسك الفكرة' }
        ]
      },
      {
        id: 'english',
        name: 'اللغة الأجنبية الأولى (English)',
        mark: 60,
        iconName: 'Languages',
        color: 'blue',
        chapters: [
          { id: 'en-1', name: 'Units 1-3: Making a Difference, Storytelling & Tenses Review', keyLaw: 'Past & Present Perfect, Passive Voice' },
          { id: 'en-2', name: 'Units 4-6: Technology, Innovation & Conditionals', keyLaw: 'If Conditionals, Wish & Modal Verbs' },
          { id: 'en-3', name: 'Units 7-9: Future Careers, Lifelong Learning & Relative Clauses', keyLaw: 'Relative Clauses, Future Forms & Phrasal Verbs' },
          { id: 'en-4', name: 'Units 10-12: Nature, Environment, Reported Speech & Inversion', keyLaw: 'Direct & Indirect Speech, Sentence Inversion' },
          { id: 'en-5', name: 'Advanced Skills: Translation, Comprehension & Essay Writing', keyLaw: 'Thesis Statement, Linking Words & Idioms' }
        ]
      },
      {
        id: 'physics',
        name: 'الفيزياء',
        mark: 60,
        iconName: 'Atom',
        color: 'indigo',
        chapters: [
          { id: 'ph-1', name: 'الفصل 1: التيار الكهربي وقانون أوم وقانونا كيرشوف', keyLaw: 'V = IR, I = V/R, ∑I_in = ∑I_out' },
          { id: 'ph-2', name: 'الفصل 2: التأثير المغناطيسي للتيار الكهربي وأجهزة القياس', keyLaw: 'B = μI/(2πd), τ = BIAN sinθ' },
          { id: 'ph-3', name: 'الفصل 3: الحث الكهرومغناطيسي والمولد والمحول الكهربي', keyLaw: 'emf = -N(ΔΦ/Δt)' },
          { id: 'ph-4', name: 'الفصل 4: دوائر التيار المتردد والمعاوقة الكلية', keyLaw: 'Z = √(R² + (XL - XC)²)' },
          { id: 'ph-5', name: 'الفصل 5: ازدواجية الموجة والجسيم والفيزياء الحديثة', keyLaw: 'E = hν, λ = h/mv' },
          { id: 'ph-6', name: 'الفصل 6: الأطياف الذرية والإلكترونيات الحديثة والليزر', keyLaw: 'شبه الموصلات والبوابات المنطقية' }
        ]
      },
      {
        id: 'chemistry',
        name: 'الكيمياء',
        mark: 60,
        iconName: 'FlaskConical',
        color: 'teal',
        chapters: [
          { id: 'ch-1', name: 'الباب 1: العناصر الانتقالية والحديد وسبائكه', keyLaw: 'الخواص البارامغناطيسية والألوان المحفزة' },
          { id: 'ch-2', name: 'الباب 2: التحليل الكيميائي الكمي والوصفي والكواشف', keyLaw: 'المعايرة الحجمية والترسيب' },
          { id: 'ch-3', name: 'الباب 3: الاتزان الكيميائي والأيوني والأملاح', keyLaw: 'Kc, Kp, Ka, Kb, Ksp حاصل الإذابة' },
          { id: 'ch-4', name: 'الباب 4: الكيمياء الكهربية وتطبيقات التآكل والبطاريات', keyLaw: 'سلسلة الجهود الكهربية وقوانين فاراداي' },
          { id: 'ch-5', name: 'الباب 5: الكيمياء العضوية الشاملة والمشتقات الأكسجينية', keyLaw: 'الألكانات والألكينات والألكاينات والكحولات والأحماض' }
        ]
      },
      {
        id: 'biology',
        name: 'الأحياء (البيولوجيا)',
        mark: 60,
        iconName: 'Dna',
        color: 'emerald',
        chapters: [
          { id: 'bio-1', name: 'الباب 1 - الفصل 1: الدعامة والحركة في النبات والإنسان', keyLaw: 'الدعامة الفسيولوجية والتركيبية وآلية انقباض العضلات (خيوط الأكتين والميوسين)' },
          { id: 'bio-2', name: 'الباب 1 - الفصل 2: التنسيق الهرموني والغدد الصماء', keyLaw: 'الغدة النخامية والغدة الدرقية وهرمونات البنكرياس والأدرينالين' },
          { id: 'bio-3', name: 'الباب 1 - الفصل 3: التكاثر في الكائنات الحية (اللا جنسي والجنسي وفي الإنسان)', keyLaw: 'دورة الطمث، الإخصاب، وتكوين الجنين وزراعة الأنسجة' },
          { id: 'bio-4', name: 'الباب 1 - الفصل 4: المناعة في النبات والإنسان وخلايا الدم البيضاء', keyLaw: 'المناعة الفطرية والمكتسبة (الخلطية والخلوية) والأجسام المضادة' },
          { id: 'bio-5', name: 'الباب 2 - الفصل 1: الحمض النووي DNA والمعلومات الوراثية وتضاعفه', keyLaw: 'القواعد النيتروجينية A=T, C≡G، وإصلاح عيوب DNA' },
          { id: 'bio-6', name: 'الباب 2 - الفصل 2: الأحماض النووية RNA وتخليق البروتين والهندسة الوراثية', keyLaw: 'mRNA, tRNA, rRNA والشفرة الوراثية وتكنولوجيا DNA معاد الاتحاد' }
        ]
      }
    ]
  },
  lit: {
    id: 'lit',
    name: 'الشعبة الأدبية',
    titleArabic: 'الشعبة الأدبية',
    totalMarks: 320,
    subjects: [
      {
        id: 'arabic',
        name: 'اللغة العربية',
        mark: 80,
        iconName: 'BookOpen',
        color: 'emerald',
        chapters: [
          { id: 'ar-1', name: 'النحو والصرف الشامل', keyLaw: 'المبتدأ والخبر، كان وأخواتها، إن وأخواتها، المشتقات العاملة' },
          { id: 'ar-2', name: 'البلاغة والنقد الأدبي', keyLaw: 'التشبيه، الاستعارة، الكناية، المحسنات البديعية' },
          { id: 'ar-3', name: 'الأدب والنصوص وتحليل المدارس الشعرية', keyLaw: 'سمات الإحياء، مطران، الديوان، أبوللو، المهاجر، الواقعية' },
          { id: 'ar-4', name: 'القراءة المتحررة والقصة', keyLaw: 'القيم الضمنية والمغزى والمهارات النقدية' },
          { id: 'ar-5', name: 'التعبير المقالي والوظيفي والإملاء', keyLaw: 'أسس بناء المقال وعلامات الترقيم' }
        ]
      },
      {
        id: 'english',
        name: 'اللغة الأجنبية الأولى (English)',
        mark: 60,
        iconName: 'Languages',
        color: 'blue',
        chapters: [
          { id: 'en-1', name: 'Units 1-3: Global Affairs, Society & Verb Forms', keyLaw: 'Grammar in context, Phrasal verbs' },
          { id: 'en-2', name: 'Units 4-6: History, Cultures & Modals of Deduction', keyLaw: 'Must have, Can\'t have, Passive conditionals' },
          { id: 'en-3', name: 'Units 7-9: Communication, Media & Narrative Tenses', keyLaw: 'Advanced narrative techniques & Discourse markers' },
          { id: 'en-4', name: 'Units 10-12: Future Challenges & Report Writing', keyLaw: 'Formal argumentative writing & Vocabulary' },
          { id: 'en-5', name: 'Critical Reading, Comprehension & Professional Translation', keyLaw: 'Idiomatic expressions & Accurate rendering' }
        ]
      },
      {
        id: 'history',
        name: 'التاريخ الحديث والمعاصر',
        mark: 60,
        iconName: 'Hourglass',
        color: 'amber',
        chapters: [
          { id: 'hi-1', name: 'الفصل 1: الحملة الفرنسية على مصر والشام (1798 - 1801)', keyLaw: 'أسباب الحملة، مقاومة الشعب، معركة أبي قير، ونتائجها السياسية والعلمية' },
          { id: 'hi-2', name: 'الفصل 2: بناء الدولة الحديثة في مصر في عهد محمد علي وخلفائه', keyLaw: 'نظام الاحتكار، التوسع الخارجي، معاهدة لندن 1840، وفرمانا 1841' },
          { id: 'hi-3', name: 'الفصل 3: مصر منذ الثورة العرابية حتى قيام الحرب العالمية الأولى', keyLaw: 'التدخل الأجنبي، الثورة العرابية 1881، الاحتلال البريطاني، ومصطفى كامل ومحمد فريد' },
          { id: 'hi-4', name: 'الفصل 4: ثورة 1919 ومصر حتى ما قبل ثورة 23 يوليو 1952', keyLaw: 'تصريح 28 فبراير 1922، دستور 1923، معاهدة 1936، وحريق القاهرة' },
          { id: 'hi-5', name: 'الفصل 5: التوسع الاستعماري في البلاد العربية قبل الحرب العالمية الأولى', keyLaw: 'احتلال فرنسا للجزائر وتونس والمغرب، وإيطاليا لليبيا' },
          { id: 'hi-6', name: 'الفصل 6: التوسع الاستعماري في البلاد العربية بعد الحرب العالمية الأولى', keyLaw: 'اتفاقية سايكس بيكو، مؤتمر سان ريمو، وحركات التحرر في سوريا ولبنان والعراق' },
          { id: 'hi-7', name: 'الفصل 7: الصراع العربي الإسرائيلي وتطور القضية الفلسطينية', keyLaw: 'وعد بلفور 1917، حرب 1948، العدوان الثلاثي 1956، نكسة 1967، وحرب أكتوبر المجيدة 1973' },
          { id: 'hi-8', name: 'الفصل 8: ثورتا 25 يناير 2011 و 30 يونيو 2013', keyLaw: 'المقدمات والأسباب، تسلسل الأحداث، ومسار خارطة الطريق واستقرار الدولة' }
        ]
      },
      {
        id: 'geography',
        name: 'الجغرافيا السياسية',
        mark: 60,
        iconName: 'Globe',
        color: 'cyan',
        chapters: [
          { id: 'geo-1', name: 'الدرس التمهيدي: مدخل لدراسة الجغرافيا السياسية وتطورها', keyLaw: 'مفهوم الجغرافيا السياسية، الجيوبوليتيك، وتقنيات الاستشعار ونظم المعلومات' },
          { id: 'geo-2', name: 'الوحدة 1: الدولة، المقومات الطبيعية (الموقع والمساحة والمناخ)، والمقومات البشرية', keyLaw: 'شكل الدولة، أنواع الحدود، القوة الديموغرافية والاقتصادية والعسكرية' },
          { id: 'geo-3', name: 'الوحدة 2: الحدود السياسية (أنواعها ووظائفها ومراحل تخطيطها والمشكلات الحدودية)', keyLaw: 'الحدود الهندسية والأنثروبولوجية ومشكلات الرعاة والماء والطاقة' },
          { id: 'geo-4', name: 'الوحدة 3: التكتلات الاقتصادية (الاتحاد الأوروبي، الكوميسا، مجلس التعاون) والأحلاف العسكرية (الناتو)', keyLaw: 'مراحل تكوين التكتلات الاقتصادية وأهداف الأحلاف العسكرية وأسباب تفكك حلف وارسو' },
          { id: 'geo-5', name: 'الوحدة 4: العلاقات الدولية والنظام العالمي الجديد وخصائصه وتأثيراته', keyLaw: 'طبيعة النظام العالمي الجديد، العولمة، والمنظمات الدولية (الأمم المتحدة)' }
        ]
      },
      {
        id: 'statistics',
        name: 'الإحصاء والاقتصاد',
        mark: 60,
        iconName: 'LineChart',
        color: 'violet',
        chapters: [
          { id: 'st-1', name: 'الإحصاء: الارتباط والانحدار (بيرسون وسبيرمان ومعادلة خط الانحدار)', keyLaw: 'r = معامل الارتباط، y = a + bx' },
          { id: 'st-2', name: 'الإحصاء: الاحتمال الشرطي والأحداث المستقلة', keyLaw: 'P(A|B) = P(A ∩ B) / P(B)' },
          { id: 'st-3', name: 'الإحصاء: المتغيرات العشوائية والتوزيعات الاحتمالية والتوزيع الطبيعي المعياري', keyLaw: 'μ = E(X), σ² = التباين, z = (x - μ)/σ' },
          { id: 'st-4', name: 'الاقتصاد: المشكلة الاقتصادية والحاجات والموارد وعوامل الإنتاج والدخل القومي والمالية العامة', keyLaw: 'الدخل القومي، الاستهلاك والادخار والاستثمار، الضرائب والموازنة العامة' }
        ]
      }
    ]
  }
};

export const NON_ADDED_SUBJECTS = [
  {
    id: 'religion',
    name: 'التربية الدينية (الإسلامية / المسيحية)',
    chapters: ['العقيدة والإيمان', 'العبادات والفقه المعاملات', 'السيرة النبوية والشخصيات', 'القيم والأخلاق والمواطنة', 'سور الحفظ والفهم والحديث الشريف']
  },
  {
    id: 'second_lang',
    name: 'اللغة الأجنبية الثانية (فرنساوي / ألماني / إيطالي / إسباني)',
    chapters: ['Unité 1: Les loisirs et le sport', 'Unité 2: L\'alimentation et la santé', 'Unité 3: L\'environnement et la météo', 'Unité 4: Les voyages et la communication', 'Grammaire et Vocabulaire essentiels']
  },
  {
    id: 'civics',
    name: 'التربية الوطنية والمواطنة وحقوق الإنسان',
    chapters: ['الفصل 1: القانون والدستور في مصر', 'الفصل 2: الديمقراطية وتطورها', 'الفصل 3: الأحزاب السياسية ودورها الوطني', 'الفصل 4: المشاركة السياسية والواجب الدستوري']
  }
];

export const BOOKS_DATA: BookResource[] = [
  {
    id: 'b-ar',
    title: 'كتاب اللغة العربية - النصوص والنحو والقراءة 2027',
    subject: 'اللغة العربية',
    track: 'all',
    grade: 'الصف الثالث الثانوي',
    year: '2027',
    downloadUrl: 'https://moe.gov.eg/',
    fileSize: '42 MB',
    isMinistryApproved: true
  },
  {
    id: 'b-en',
    title: 'كتاب اللغة الإنجليزية New Hello! 2027 (Student & Workbook)',
    subject: 'اللغة الأجنبية الأولى',
    track: 'all',
    grade: 'الصف الثالث الثانوي',
    year: '2027',
    downloadUrl: 'https://moe.gov.eg/',
    fileSize: '35 MB',
    isMinistryApproved: true
  },
  {
    id: 'b-ph',
    title: 'كتاب الفيزياء المدرسية - الشرح والتجارب 2027',
    subject: 'الفيزياء',
    track: 'sci_math',
    grade: 'الصف الثالث الثانوي',
    year: '2027',
    downloadUrl: 'https://moe.gov.eg/',
    fileSize: '48 MB',
    isMinistryApproved: true
  },
  {
    id: 'b-ch',
    title: 'كتاب الكيمياء - النظري والعلمي والتدريبات 2027',
    subject: 'الكيمياء',
    track: 'sci_math',
    grade: 'الصف الثالث الثانوي',
    year: '2027',
    downloadUrl: 'https://moe.gov.eg/',
    fileSize: '45 MB',
    isMinistryApproved: true
  },
  {
    id: 'b-math-pure',
    title: 'كتاب الرياضيات البحتة (التفاضل والتكامل والجبر والفراغية) 2027',
    subject: 'الرياضيات',
    track: 'sci_math',
    grade: 'الصف الثالث الثانوي',
    year: '2027',
    downloadUrl: 'https://moe.gov.eg/',
    fileSize: '52 MB',
    isMinistryApproved: true
  },
  {
    id: 'b-math-app',
    title: 'كتاب الرياضيات التطبيقية (الاستاتيكا والديناميكا) 2027',
    subject: 'الرياضيات',
    track: 'sci_math',
    grade: 'الصف الثالث الثانوي',
    year: '2027',
    downloadUrl: 'https://moe.gov.eg/',
    fileSize: '39 MB',
    isMinistryApproved: true
  },
  {
    id: 'b-bio',
    title: 'كتاب الأحياء الشامل (التشريح والفسيولوجيا والوراثة) 2027',
    subject: 'الأحياء',
    track: 'sci_science',
    grade: 'الصف الثالث الثانوي',
    year: '2027',
    downloadUrl: 'https://moe.gov.eg/',
    fileSize: '50 MB',
    isMinistryApproved: true
  },
  {
    id: 'b-hist',
    title: 'كتاب التاريخ للثانوية العامة - تاريخ مصر والعالم المعاصر 2027',
    subject: 'التاريخ',
    track: 'lit',
    grade: 'الصف الثالث الثانوي',
    year: '2027',
    downloadUrl: 'https://moe.gov.eg/',
    fileSize: '46 MB',
    isMinistryApproved: true
  },
  {
    id: 'b-geo',
    title: 'كتاب الجغرافيا السياسية وقراءة الخرائط 2027',
    subject: 'الجغرافيا',
    track: 'lit',
    grade: 'الصف الثالث الثانوي',
    year: '2027',
    downloadUrl: 'https://moe.gov.eg/',
    fileSize: '41 MB',
    isMinistryApproved: true
  },
  {
    id: 'b-stat',
    title: 'كتاب الإحصاء والاقتصاد لطلاب الثانوية العامة 2027',
    subject: 'الإحصاء والاقتصاد',
    track: 'lit',
    grade: 'الصف الثالث الثانوي',
    year: '2027',
    downloadUrl: 'https://moe.gov.eg/',
    fileSize: '28 MB',
    isMinistryApproved: true
  }
];

export const EXAMS_DATA: ExamResource[] = [
  {
    id: 'ex-ar',
    subject: 'اللغة العربية',
    track: 'all',
    years: {
      '2025': 'https://moe.gov.eg/',
      '2024': 'https://moe.gov.eg/',
      '2023': 'https://moe.gov.eg/',
      '2022': 'https://moe.gov.eg/'
    }
  },
  {
    id: 'ex-en',
    subject: 'اللغة الأجنبية الأولى (English)',
    track: 'all',
    years: {
      '2025': 'https://moe.gov.eg/',
      '2024': 'https://moe.gov.eg/',
      '2023': 'https://moe.gov.eg/',
      '2022': 'https://moe.gov.eg/'
    }
  },
  {
    id: 'ex-ph',
    subject: 'الفيزياء',
    track: 'sci_math',
    years: {
      '2025': 'https://moe.gov.eg/',
      '2024': 'https://moe.gov.eg/',
      '2023': 'https://moe.gov.eg/',
      '2022': 'https://moe.gov.eg/'
    }
  },
  {
    id: 'ex-ch',
    subject: 'الكيمياء',
    track: 'sci_math',
    years: {
      '2025': 'https://moe.gov.eg/',
      '2024': 'https://moe.gov.eg/',
      '2023': 'https://moe.gov.eg/',
      '2022': 'https://moe.gov.eg/'
    }
  },
  {
    id: 'ex-math',
    subject: 'الرياضيات (بحتة وتطبيقية)',
    track: 'sci_math',
    years: {
      '2025': 'https://moe.gov.eg/',
      '2024': 'https://moe.gov.eg/',
      '2023': 'https://moe.gov.eg/',
      '2022': 'https://moe.gov.eg/'
    }
  },
  {
    id: 'ex-bio',
    subject: 'الأحياء',
    track: 'sci_science',
    years: {
      '2025': 'https://moe.gov.eg/',
      '2024': 'https://moe.gov.eg/',
      '2023': 'https://moe.gov.eg/',
      '2022': 'https://moe.gov.eg/'
    }
  },
  {
    id: 'ex-hist',
    subject: 'التاريخ',
    track: 'lit',
    years: {
      '2025': 'https://moe.gov.eg/',
      '2024': 'https://moe.gov.eg/',
      '2023': 'https://moe.gov.eg/',
      '2022': 'https://moe.gov.eg/'
    }
  },
  {
    id: 'ex-geo',
    subject: 'الجغرافيا السياسية',
    track: 'lit',
    years: {
      '2025': 'https://moe.gov.eg/',
      '2024': 'https://moe.gov.eg/',
      '2023': 'https://moe.gov.eg/',
      '2022': 'https://moe.gov.eg/'
    }
  },
  {
    id: 'ex-stat',
    subject: 'الإحصاء والاقتصاد',
    track: 'lit',
    years: {
      '2025': 'https://moe.gov.eg/',
      '2024': 'https://moe.gov.eg/',
      '2023': 'https://moe.gov.eg/',
      '2022': 'https://moe.gov.eg/'
    }
  },
  {
    id: 'ex-rel',
    subject: 'التربية الدينية',
    track: 'all',
    years: {
      '2025': 'https://moe.gov.eg/',
      '2024': 'https://moe.gov.eg/',
      '2023': 'https://moe.gov.eg/',
      '2022': 'https://moe.gov.eg/'
    }
  },
  {
    id: 'ex-french',
    subject: 'اللغة الأجنبية الثانية',
    track: 'all',
    years: {
      '2025': 'https://moe.gov.eg/',
      '2024': 'https://moe.gov.eg/',
      '2023': 'https://moe.gov.eg/',
      '2022': 'https://moe.gov.eg/'
    }
  }
];

export const MOTIVATIONAL_QUOTES = [
  { text: 'النجاح في الثانوية العامة ليس صدفة، بل هو تراكم ساعات التركيز والجهد اليومي الهادئ.', author: 'نصيحة أوائل الثانوية' },
  { text: 'لا تقارن بدايتك بمواسم حصاد الآخرين؛ التزم بجدولك وستصل إلى حلمك بإذن الله.', author: 'ثانوي بلس 2027' },
  { text: 'كل مسألة صعبة تحلها اليوم هي درجة مضمونة في كليتك غداً.', author: 'طريق التفوق' },
  { text: 'قسّم المنهج إلى أهداف صغيرة، وسترى الجبال تتحول إلى درجات ترتقي بها.', author: 'استراتيجية الإنجاز' },
  { text: 'العبرة بالاستمرارية وليس بالانطلاقة السريعة ثم الانقطاع. ثباتك هو سلاحك.', author: 'همة نحو القمة' }
];
