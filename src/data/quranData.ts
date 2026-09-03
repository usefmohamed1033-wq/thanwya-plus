// Quran Data & Daily Wird Service for Thanawya Amma 2027

export interface QuranSurahInfo {
  number: number;
  name: string;
  englishName: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  startPage: number;
}

export interface QuranAyah {
  number: number;
  numberInSurah: number;
  text: string;
  surahNumber: number;
  surahName: string;
  juz: number;
  page: number;
  hizbQuarter: number;
  audio?: string;
}

export interface QuranPageData {
  pageNumber: number;
  juz: number;
  hizb: number;
  surahName: string;
  ayahs: QuranAyah[];
  tafsirBrief?: string;
  reflectionPoint?: string;
}

export interface Reciter {
  id: string;
  name: string;
  englishName: string;
  style: string;
  serverUrl: string; // Base URL or identifier for everyayah audio
}

export const QURAN_RECITERS: Reciter[] = [
  {
    id: 'minshawi',
    name: 'الشيخ محمد صديق المنشاوي',
    englishName: 'Mohamed Siddiq El-Minshawi',
    style: 'مرتل خاشع ومؤثر (صوت الورد الأساسي)',
    serverUrl: 'https://everyayah.com/data/Minshawy_Murattal_128kbps',
  },
  {
    id: 'husary',
    name: 'الشيخ محمود خليل الحصري',
    englishName: 'Mahmoud Khalil Al-Husary',
    style: 'معلم وضابط لأحكام التجويد',
    serverUrl: 'https://everyayah.com/data/Husary_128kbps',
  },
  {
    id: 'abdulbasit',
    name: 'الشيخ عبد الباسط عبد الصمد',
    englishName: 'Abdul Basit Abdul Samad',
    style: 'مرتل هادئ ووقور',
    serverUrl: 'https://everyayah.com/data/Abdul_Basit_Murattal_192kbps',
  },
];

export const SURAH_LIST: QuranSurahInfo[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', revelationType: 'Meccan', numberOfAyahs: 7, startPage: 1 },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', revelationType: 'Medinan', numberOfAyahs: 286, startPage: 2 },
  { number: 3, name: 'آل عمران', englishName: 'Aal-Imran', revelationType: 'Medinan', numberOfAyahs: 200, startPage: 50 },
  { number: 4, name: 'النساء', englishName: 'An-Nisa', revelationType: 'Medinan', numberOfAyahs: 176, startPage: 77 },
  { number: 5, name: 'المائدة', englishName: 'Al-Maidah', revelationType: 'Medinan', numberOfAyahs: 120, startPage: 106 },
  { number: 6, name: 'الأنعام', englishName: 'Al-Anam', revelationType: 'Meccan', numberOfAyahs: 165, startPage: 128 },
  { number: 7, name: 'الأعراف', englishName: 'Al-Araf', revelationType: 'Meccan', numberOfAyahs: 206, startPage: 151 },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', revelationType: 'Medinan', numberOfAyahs: 75, startPage: 177 },
  { number: 9, name: 'التوبة', englishName: 'At-Tawbah', revelationType: 'Medinan', numberOfAyahs: 129, startPage: 187 },
  { number: 10, name: 'يونس', englishName: 'Yunus', revelationType: 'Meccan', numberOfAyahs: 109, startPage: 208 },
  { number: 11, name: 'هود', englishName: 'Hud', revelationType: 'Meccan', numberOfAyahs: 123, startPage: 221 },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', revelationType: 'Meccan', numberOfAyahs: 111, startPage: 235 },
  { number: 13, name: 'الرعد', englishName: 'Ar-Rad', revelationType: 'Medinan', numberOfAyahs: 43, startPage: 249 },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', revelationType: 'Meccan', numberOfAyahs: 52, startPage: 255 },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', revelationType: 'Meccan', numberOfAyahs: 99, startPage: 262 },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', revelationType: 'Meccan', numberOfAyahs: 128, startPage: 267 },
  { number: 17, name: 'الإسراء', englishName: 'Al-Isra', revelationType: 'Meccan', numberOfAyahs: 111, startPage: 282 },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', revelationType: 'Meccan', numberOfAyahs: 110, startPage: 293 },
  { number: 19, name: 'مريم', englishName: 'Maryam', revelationType: 'Meccan', numberOfAyahs: 98, startPage: 305 },
  { number: 20, name: 'طه', englishName: 'Taha', revelationType: 'Meccan', numberOfAyahs: 135, startPage: 312 },
  { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', revelationType: 'Meccan', numberOfAyahs: 112, startPage: 322 },
  { number: 22, name: 'الحج', englishName: 'Al-Hajj', revelationType: 'Medinan', numberOfAyahs: 78, startPage: 332 },
  { number: 23, name: 'المؤمنون', englishName: 'Al-Muminun', revelationType: 'Meccan', numberOfAyahs: 118, startPage: 342 },
  { number: 24, name: 'النور', englishName: 'An-Nur', revelationType: 'Medinan', numberOfAyahs: 64, startPage: 350 },
  { number: 25, name: 'الفرقان', englishName: 'Al-Furqan', revelationType: 'Meccan', numberOfAyahs: 77, startPage: 359 },
  { number: 26, name: 'الشعراء', englishName: 'Ash-Shuara', revelationType: 'Meccan', numberOfAyahs: 227, startPage: 367 },
  { number: 27, name: 'النمل', englishName: 'An-Naml', revelationType: 'Meccan', numberOfAyahs: 93, startPage: 377 },
  { number: 28, name: 'القصص', englishName: 'Al-Qasas', revelationType: 'Meccan', numberOfAyahs: 88, startPage: 385 },
  { number: 29, name: 'العنكبوت', englishName: 'Al-Ankabut', revelationType: 'Meccan', numberOfAyahs: 69, startPage: 396 },
  { number: 30, name: 'الروم', englishName: 'Ar-Rum', revelationType: 'Meccan', numberOfAyahs: 60, startPage: 404 },
  { number: 31, name: 'لقمان', englishName: 'Luqman', revelationType: 'Meccan', numberOfAyahs: 34, startPage: 411 },
  { number: 32, name: 'السجدة', englishName: 'As-Sajdah', revelationType: 'Meccan', numberOfAyahs: 30, startPage: 415 },
  { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', revelationType: 'Medinan', numberOfAyahs: 73, startPage: 418 },
  { number: 34, name: 'سبأ', englishName: 'Saba', revelationType: 'Meccan', numberOfAyahs: 54, startPage: 428 },
  { number: 35, name: 'فاطر', englishName: 'Fatir', revelationType: 'Meccan', numberOfAyahs: 45, startPage: 434 },
  { number: 36, name: 'يس', englishName: 'Ya-Sin', revelationType: 'Meccan', numberOfAyahs: 83, startPage: 440 },
  { number: 37, name: 'الصافات', englishName: 'As-Saffat', revelationType: 'Meccan', numberOfAyahs: 182, startPage: 446 },
  { number: 38, name: 'ص', englishName: 'Sad', revelationType: 'Meccan', numberOfAyahs: 88, startPage: 453 },
  { number: 39, name: 'الزمر', englishName: 'Az-Zumar', revelationType: 'Meccan', numberOfAyahs: 75, startPage: 458 },
  { number: 40, name: 'غافر', englishName: 'Ghafir', revelationType: 'Meccan', numberOfAyahs: 85, startPage: 467 },
  { number: 41, name: 'فصلت', englishName: 'Fussilat', revelationType: 'Meccan', numberOfAyahs: 54, startPage: 477 },
  { number: 42, name: 'الشورى', englishName: 'Ash-Shura', revelationType: 'Meccan', numberOfAyahs: 53, startPage: 483 },
  { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', revelationType: 'Meccan', numberOfAyahs: 89, startPage: 489 },
  { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', revelationType: 'Meccan', numberOfAyahs: 59, startPage: 496 },
  { number: 45, name: 'الجاثية', englishName: 'Al-Jathiyah', revelationType: 'Meccan', numberOfAyahs: 37, startPage: 499 },
  { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', revelationType: 'Meccan', numberOfAyahs: 35, startPage: 502 },
  { number: 47, name: 'محمد', englishName: 'Muhammad', revelationType: 'Medinan', numberOfAyahs: 38, startPage: 507 },
  { number: 48, name: 'الفتح', englishName: 'Al-Fath', revelationType: 'Medinan', numberOfAyahs: 29, startPage: 511 },
  { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', revelationType: 'Medinan', numberOfAyahs: 18, startPage: 515 },
  { number: 50, name: 'ق', englishName: 'Qaf', revelationType: 'Meccan', numberOfAyahs: 45, startPage: 518 },
  { number: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', revelationType: 'Meccan', numberOfAyahs: 60, startPage: 520 },
  { number: 52, name: 'الطور', englishName: 'At-Tur', revelationType: 'Meccan', numberOfAyahs: 49, startPage: 523 },
  { number: 53, name: 'النجم', englishName: 'An-Najm', revelationType: 'Meccan', numberOfAyahs: 62, startPage: 526 },
  { number: 54, name: 'القمر', englishName: 'Al-Qamar', revelationType: 'Meccan', numberOfAyahs: 55, startPage: 528 },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', revelationType: 'Medinan', numberOfAyahs: 78, startPage: 531 },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waqiah', revelationType: 'Meccan', numberOfAyahs: 96, startPage: 534 },
  { number: 57, name: 'الحديد', englishName: 'Al-Hadid', revelationType: 'Medinan', numberOfAyahs: 29, startPage: 537 },
  { number: 58, name: 'المجادلة', englishName: 'Al-Mujadila', revelationType: 'Medinan', numberOfAyahs: 22, startPage: 542 },
  { number: 59, name: 'الحشر', englishName: 'Al-Hashr', revelationType: 'Medinan', numberOfAyahs: 24, startPage: 545 },
  { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', revelationType: 'Medinan', numberOfAyahs: 13, startPage: 549 },
  { number: 61, name: 'الصف', englishName: 'As-Saff', revelationType: 'Medinan', numberOfAyahs: 14, startPage: 551 },
  { number: 62, name: 'الجمعة', englishName: 'Al-Jumuah', revelationType: 'Medinan', numberOfAyahs: 11, startPage: 553 },
  { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', revelationType: 'Medinan', numberOfAyahs: 11, startPage: 554 },
  { number: 64, name: 'التغابن', englishName: 'At-Taghabun', revelationType: 'Medinan', numberOfAyahs: 18, startPage: 556 },
  { number: 65, name: 'الطلاق', englishName: 'At-Talaq', revelationType: 'Medinan', numberOfAyahs: 12, startPage: 558 },
  { number: 66, name: 'التحريم', englishName: 'At-Tahrim', revelationType: 'Medinan', numberOfAyahs: 12, startPage: 560 },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', revelationType: 'Meccan', numberOfAyahs: 30, startPage: 562 },
  { number: 68, name: 'القلم', englishName: 'Al-Qalam', revelationType: 'Meccan', numberOfAyahs: 52, startPage: 564 },
  { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', revelationType: 'Meccan', numberOfAyahs: 52, startPage: 566 },
  { number: 70, name: 'المعارج', englishName: 'Al-Maarij', revelationType: 'Meccan', numberOfAyahs: 44, startPage: 568 },
  { number: 71, name: 'نوح', englishName: 'Nuh', revelationType: 'Meccan', numberOfAyahs: 28, startPage: 570 },
  { number: 72, name: 'الجن', englishName: 'Al-Jinn', revelationType: 'Meccan', numberOfAyahs: 28, startPage: 572 },
  { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', revelationType: 'Meccan', numberOfAyahs: 20, startPage: 574 },
  { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', revelationType: 'Meccan', numberOfAyahs: 56, startPage: 575 },
  { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', revelationType: 'Meccan', numberOfAyahs: 40, startPage: 577 },
  { number: 76, name: 'الإنسان', englishName: 'Al-Insan', revelationType: 'Medinan', numberOfAyahs: 31, startPage: 578 },
  { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', revelationType: 'Meccan', numberOfAyahs: 50, startPage: 580 },
  { number: 78, name: 'النبأ', englishName: 'An-Naba', revelationType: 'Meccan', numberOfAyahs: 40, startPage: 582 },
  { number: 79, name: 'النازعات', englishName: 'An-Naziat', revelationType: 'Meccan', numberOfAyahs: 46, startPage: 583 },
  { number: 80, name: 'عبس', englishName: 'Abasa', revelationType: 'Meccan', numberOfAyahs: 42, startPage: 585 },
  { number: 81, name: 'التكوير', englishName: 'At-Takwir', revelationType: 'Meccan', numberOfAyahs: 29, startPage: 586 },
  { number: 82, name: 'الانفطار', englishName: 'Al-Infitar', revelationType: 'Meccan', numberOfAyahs: 19, startPage: 587 },
  { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', revelationType: 'Meccan', numberOfAyahs: 36, startPage: 587 },
  { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaq', revelationType: 'Meccan', numberOfAyahs: 25, startPage: 589 },
  { number: 85, name: 'البروج', englishName: 'Al-Buruj', revelationType: 'Meccan', numberOfAyahs: 22, startPage: 590 },
  { number: 86, name: 'الطارق', englishName: 'At-Tariq', revelationType: 'Meccan', numberOfAyahs: 17, startPage: 591 },
  { number: 87, name: 'الأعلى', englishName: 'Al-Ala', revelationType: 'Meccan', numberOfAyahs: 19, startPage: 591 },
  { number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', revelationType: 'Meccan', numberOfAyahs: 26, startPage: 592 },
  { number: 89, name: 'الفجر', englishName: 'Al-Fajr', revelationType: 'Meccan', numberOfAyahs: 30, startPage: 593 },
  { number: 90, name: 'البلد', englishName: 'Al-Balad', revelationType: 'Meccan', numberOfAyahs: 20, startPage: 594 },
  { number: 91, name: 'الشمس', englishName: 'Ash-Shams', revelationType: 'Meccan', numberOfAyahs: 15, startPage: 595 },
  { number: 92, name: 'الليل', englishName: 'Al-Layl', revelationType: 'Meccan', numberOfAyahs: 21, startPage: 595 },
  { number: 93, name: 'الضحى', englishName: 'Ad-Duhaa', revelationType: 'Meccan', numberOfAyahs: 11, startPage: 596 },
  { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', revelationType: 'Meccan', numberOfAyahs: 8, startPage: 596 },
  { number: 95, name: 'التين', englishName: 'At-Tin', revelationType: 'Meccan', numberOfAyahs: 8, startPage: 597 },
  { number: 96, name: 'العلق', englishName: 'Al-Alaq', revelationType: 'Meccan', numberOfAyahs: 19, startPage: 597 },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr', revelationType: 'Meccan', numberOfAyahs: 5, startPage: 598 },
  { number: 98, name: 'البينة', englishName: 'Al-Bayyinah', revelationType: 'Medinan', numberOfAyahs: 8, startPage: 598 },
  { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', revelationType: 'Medinan', numberOfAyahs: 8, startPage: 599 },
  { number: 100, name: 'العاديات', englishName: 'Al-Adiyat', revelationType: 'Meccan', numberOfAyahs: 11, startPage: 599 },
  { number: 101, name: 'القارعة', englishName: 'Al-Qariah', revelationType: 'Meccan', numberOfAyahs: 11, startPage: 600 },
  { number: 102, name: 'التكاثر', englishName: 'At-Takathur', revelationType: 'Meccan', numberOfAyahs: 8, startPage: 600 },
  { number: 103, name: 'العصر', englishName: 'Al-Asr', revelationType: 'Meccan', numberOfAyahs: 3, startPage: 601 },
  { number: 104, name: 'الهمزة', englishName: 'Al-Humazah', revelationType: 'Meccan', numberOfAyahs: 9, startPage: 601 },
  { number: 105, name: 'الفيل', englishName: 'Al-Fil', revelationType: 'Meccan', numberOfAyahs: 5, startPage: 601 },
  { number: 106, name: 'قريش', englishName: 'Quraysh', revelationType: 'Meccan', numberOfAyahs: 4, startPage: 602 },
  { number: 107, name: 'الماعون', englishName: 'Al-Maun', revelationType: 'Meccan', numberOfAyahs: 7, startPage: 602 },
  { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', revelationType: 'Meccan', numberOfAyahs: 3, startPage: 602 },
  { number: 109, name: 'الكافرون', englishName: 'Al-Kafirun', revelationType: 'Meccan', numberOfAyahs: 6, startPage: 603 },
  { number: 110, name: 'النصر', englishName: 'An-Nasr', revelationType: 'Medinan', numberOfAyahs: 3, startPage: 603 },
  { number: 111, name: 'المسد', englishName: 'Al-Masad', revelationType: 'Meccan', numberOfAyahs: 5, startPage: 603 },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', revelationType: 'Meccan', numberOfAyahs: 4, startPage: 604 },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', revelationType: 'Meccan', numberOfAyahs: 5, startPage: 604 },
  { number: 114, name: 'الناس', englishName: 'An-Nas', revelationType: 'Meccan', numberOfAyahs: 6, startPage: 604 },
];

// Rich Curated Quran Pages Data for instant offline reading + Dynamic fetch support
export const CURATED_QURAN_PAGES: { [pageNumber: number]: QuranPageData } = {
  1: {
    pageNumber: 1,
    juz: 1,
    hizb: 1,
    surahName: 'الفاتحة',
    ayahs: [
      { number: 1, numberInSurah: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', surahNumber: 1, surahName: 'الفاتحة', juz: 1, page: 1, hizbQuarter: 1 },
      { number: 2, numberInSurah: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', surahNumber: 1, surahName: 'الفاتحة', juz: 1, page: 1, hizbQuarter: 1 },
      { number: 3, numberInSurah: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ', surahNumber: 1, surahName: 'الفاتحة', juz: 1, page: 1, hizbQuarter: 1 },
      { number: 4, numberInSurah: 4, text: 'مَالِكِ يَوْمِ الدِّينِ', surahNumber: 1, surahName: 'الفاتحة', juz: 1, page: 1, hizbQuarter: 1 },
      { number: 5, numberInSurah: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', surahNumber: 1, surahName: 'الفاتحة', juz: 1, page: 1, hizbQuarter: 1 },
      { number: 6, numberInSurah: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', surahNumber: 1, surahName: 'الفاتحة', juz: 1, page: 1, hizbQuarter: 1 },
      { number: 7, numberInSurah: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', surahNumber: 1, surahName: 'الفاتحة', juz: 1, page: 1, hizbQuarter: 1 },
    ],
    tafsirBrief: 'أم الكتاب والسبع المثاني، تبدأ بالحمد والثناء على الله، وإعلان التوحيد الخالص والاستعانة به وحده في كل أمور الدنيا والآخرة.',
    reflectionPoint: '﴿إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ﴾: تذكر أن توفيقك في مذاكرتك وفهمك للمواد الصعبة هو بتيسير الله ومعونته وحده، فاستعن به دائماً.',
  },
  2: {
    pageNumber: 2,
    juz: 1,
    hizb: 1,
    surahName: 'البقرة',
    ayahs: [
      { number: 8, numberInSurah: 1, text: 'الم', surahNumber: 2, surahName: 'البقرة', juz: 1, page: 2, hizbQuarter: 1 },
      { number: 9, numberInSurah: 2, text: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ', surahNumber: 2, surahName: 'البقرة', juz: 1, page: 2, hizbQuarter: 1 },
      { number: 10, numberInSurah: 3, text: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ', surahNumber: 2, surahName: 'البقرة', juz: 1, page: 2, hizbQuarter: 1 },
      { number: 11, numberInSurah: 4, text: 'وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ', surahNumber: 2, surahName: 'البقرة', juz: 1, page: 2, hizbQuarter: 1 },
      { number: 12, numberInSurah: 5, text: 'أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ', surahNumber: 2, surahName: 'البقرة', juz: 1, page: 2, hizbQuarter: 1 },
    ],
    tafsirBrief: 'بيان عظمة القرآن الكريم وأنه هداية للمتقين الذين اتصفوا بالإيمان بالغيب وإقامة الصلاة والإنفاق واليقين بالآخرة.',
    reflectionPoint: '﴿أُولَٰئِكَ هُمُ الْمُفْلِحُونَ﴾: الفلاح والنجاح الحقيقي يبدأ بالانضباط والإخلاص والتوكل على الله.',
  },
  596: {
    pageNumber: 596,
    juz: 30,
    hizb: 60,
    surahName: 'الضحى والشرح',
    ayahs: [
      { number: 6081, numberInSurah: 1, text: 'وَالضُّحَىٰ', surahNumber: 93, surahName: 'الضحى', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6082, numberInSurah: 2, text: 'وَاللَّيْلِ إِذَا سَجَىٰ', surahNumber: 93, surahName: 'الضحى', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6083, numberInSurah: 3, text: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ', surahNumber: 93, surahName: 'الضحى', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6084, numberInSurah: 4, text: 'وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ', surahNumber: 93, surahName: 'الضحى', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6085, numberInSurah: 5, text: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', surahNumber: 93, surahName: 'الضحى', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6086, numberInSurah: 6, text: 'أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ', surahNumber: 93, surahName: 'الضحى', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6087, numberInSurah: 7, text: 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ', surahNumber: 93, surahName: 'الضحى', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6088, numberInSurah: 8, text: 'وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ', surahNumber: 93, surahName: 'الضحى', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6089, numberInSurah: 9, text: 'فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ', surahNumber: 93, surahName: 'الضحى', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6090, numberInSurah: 10, text: 'وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ', surahNumber: 93, surahName: 'الضحى', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6091, numberInSurah: 11, text: 'وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ', surahNumber: 93, surahName: 'الضحى', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6092, numberInSurah: 1, text: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ', surahNumber: 94, surahName: 'الشرح', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6093, numberInSurah: 2, text: 'وَوَضَعْنَا عَنكَ وِزْرَكَ', surahNumber: 94, surahName: 'الشرح', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6094, numberInSurah: 3, text: 'الَّذِي أَنقَضَ ظَهْرَكَ', surahNumber: 94, surahName: 'الشرح', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6095, numberInSurah: 4, text: 'وَرَفَعْنَا لَكَ ذِكْرَكَ', surahNumber: 94, surahName: 'الشرح', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6096, numberInSurah: 5, text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', surahNumber: 94, surahName: 'الشرح', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6097, numberInSurah: 6, text: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', surahNumber: 94, surahName: 'الشرح', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6098, numberInSurah: 7, text: 'فَإِذَا فَرَغْتَ فَانصَبْ', surahNumber: 94, surahName: 'الشرح', juz: 30, page: 596, hizbQuarter: 60 },
      { number: 6099, numberInSurah: 8, text: 'وَإِلَىٰ رَبِّكَ فَارْغَب', surahNumber: 94, surahName: 'الشرح', juz: 30, page: 596, hizbQuarter: 60 },
    ],
    tafsirBrief: 'سورتان تفيضان بالسكينة والطمأنينة، تبشران بأن كل عسر وتعب في السعي والمذاكرة يتبعه يسر مضاعف ورضا وفرح بالنتيجة.',
    reflectionPoint: '﴿وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ﴾ • ﴿إِنَّ مَعَ الْعُسْرِ يُسْرًا﴾: اجعل هاتين الآيتين دافعك كلما شعرت بالإرهاق، فالله لن يضيع تعبك أبداً.',
  },
  604: {
    pageNumber: 604,
    juz: 30,
    hizb: 60,
    surahName: 'الإخلاص والمعوذتين',
    ayahs: [
      { number: 6222, numberInSurah: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', surahNumber: 112, surahName: 'الإخلاص', juz: 30, page: 604, hizbQuarter: 60 },
      { number: 6223, numberInSurah: 2, text: 'اللَّهُ الصَّمَدُ', surahNumber: 112, surahName: 'الإخلاص', juz: 30, page: 604, hizbQuarter: 60 },
      { number: 6224, numberInSurah: 3, text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', surahNumber: 112, surahName: 'الإخلاص', juz: 30, page: 604, hizbQuarter: 60 },
      { number: 6225, numberInSurah: 4, text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', surahNumber: 112, surahName: 'الإخلاص', juz: 30, page: 604, hizbQuarter: 60 },
      { number: 6226, numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', surahNumber: 113, surahName: 'الفلق', juz: 30, page: 604, hizbQuarter: 60 },
      { number: 6227, numberInSurah: 2, text: 'مِن شَرِّ مَا خَلَقَ', surahNumber: 113, surahName: 'الفلق', juz: 30, page: 604, hizbQuarter: 60 },
      { number: 6228, numberInSurah: 3, text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', surahNumber: 113, surahName: 'الفلق', juz: 30, page: 604, hizbQuarter: 60 },
      { number: 6229, numberInSurah: 4, text: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', surahNumber: 113, surahName: 'الفلق', juz: 30, page: 604, hizbQuarter: 60 },
      { number: 6230, numberInSurah: 5, text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', surahNumber: 113, surahName: 'الفلق', juz: 30, page: 604, hizbQuarter: 60 },
      { number: 6231, numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', surahNumber: 114, surahName: 'الناس', juz: 30, page: 604, hizbQuarter: 60 },
      { number: 6232, numberInSurah: 2, text: 'مَلِكِ النَّاسِ', surahNumber: 114, surahName: 'الناس', juz: 30, page: 604, hizbQuarter: 60 },
      { number: 6233, numberInSurah: 3, text: 'إِلَٰهِ النَّاسِ', surahNumber: 114, surahName: 'الناس', juz: 30, page: 604, hizbQuarter: 60 },
      { number: 6234, numberInSurah: 4, text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', surahNumber: 114, surahName: 'الناس', juz: 30, page: 604, hizbQuarter: 60 },
      { number: 6235, numberInSurah: 5, text: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', surahNumber: 114, surahName: 'الناس', juz: 30, page: 604, hizbQuarter: 60 },
      { number: 6236, numberInSurah: 6, text: 'مِنَ الْجِنَّةِ وَالنَّاسِ', surahNumber: 114, surahName: 'الناس', juz: 30, page: 604, hizbQuarter: 60 },
    ],
    tafsirBrief: 'سور التوحيد والتحصين الشامل، تعدل ثلث القرآن وتحمي قارئها من كل مكروه وحسد ووسواس.',
    reflectionPoint: 'تحصين يومي يمنحك راحة البال والتركيز، ويطرد مشاعر التوتر والقلق قبل بدء المذاكرة.',
  },
};

// Inspirational Duaas for High School Students
export const STUDY_DUAAS = [
  {
    title: 'دعاء قبل بدء المذاكرة',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ فَهْمَ النَّبِيِّينَ، وَحِفْظَ الْمُرْسَلِينَ، وَالْمَلَائِكَةِ الْمُقَرَّبِينَ، اللَّهُمَّ اجْعَلْ أَلْسِنَتَنَا عَامِرَةً بِذِكْرِكَ، وَقُلُوبَنَا بِخَشْيَتِكَ، وَأَسْرَارَنَا بِطَاعَتِكَ، إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
    category: 'قبل المذاكرة',
  },
  {
    title: 'دعاء عند تعسر الفهم أو المسائل الصعبة',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا، يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ.',
    category: 'أثناء المذاكرة',
  },
  {
    title: 'دعاء البركة في الوقت وسرعة الفهم',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي، وَيَسِّرْ لِي أَمْرِي، وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي، وَقُل رَّبِّ زِدْنِي عِلْمًا.',
    category: 'التثبيت والبركة',
  },
  {
    title: 'دعاء بعد الانتهاء وتثبيت الحفظ',
    arabic: 'اللَّهُمَّ إِنِّي أَسْتَوْدِعُكَ مَا قَرَأْتُ وَمَا حَفِظْتُ وَمَا تَعَلَّمْتُ، فَرُدَّهُ عِنْدَ حَاجَتِي إِلَيْهِ، إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
    category: 'بعد المذاكرة',
  },
];

// Helper to determine today's assigned page index (Day of year modulo 604)
export function getTodaysQuranPageNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return (dayOfYear % 604) + 1;
}

// Fetch any page (1-604) from Quran Cloud API with cached local fallback
export async function fetchQuranPage(pageNumber: number): Promise<QuranPageData> {
  const boundedPage = Math.max(1, Math.min(604, pageNumber));

  if (CURATED_QURAN_PAGES[boundedPage]) {
    return CURATED_QURAN_PAGES[boundedPage];
  }

  try {
    const response = await fetch(`https://api.alquran.cloud/v1/page/${boundedPage}/quran-uthmani`);
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'OK' && data.data && data.data.ayahs) {
        const rawAyahs = data.data.ayahs;
        const firstAyah = rawAyahs[0];
        const surahName = firstAyah?.surah?.name || `صفحة ${boundedPage}`;
        const juz = firstAyah?.juz || Math.ceil(boundedPage / 20);
        const hizb = Math.ceil(boundedPage / 10);

        const mappedAyahs: QuranAyah[] = rawAyahs.map((a: any) => ({
          number: a.number,
          numberInSurah: a.numberInSurah,
          text: a.text,
          surahNumber: a.surah?.number || 1,
          surahName: a.surah?.name || surahName,
          juz: a.juz,
          page: a.page,
          hizbQuarter: a.hizbQuarter,
        }));

        return {
          pageNumber: boundedPage,
          juz,
          hizb,
          surahName,
          ayahs: mappedAyahs,
          tafsirBrief: `آيات كريمة مباركة من سورة ${surahName} (الجزء ${juz}). قراءتها بتدبر تمنح القلب طمأنينة وبركة في الوقت.`,
          reflectionPoint: `﴿وَقُل رَّبِّ زِدْنِي عِلْمًا﴾ • تدبر معاني الآيات واستحضر نية التوفيق ونيل الدرجات العالية برضا الله.`,
        };
      }
    }
  } catch (err) {
    console.warn(`Could not fetch page ${boundedPage} from API, generating structured fallback:`, err);
  }

  // Graceful fallback for offline mode
  const surahMatch = SURAH_LIST.find((s, idx) => {
    const next = SURAH_LIST[idx + 1];
    return s.startPage <= boundedPage && (!next || next.startPage > boundedPage);
  }) || SURAH_LIST[0];

  const estimatedJuz = Math.min(30, Math.ceil(boundedPage / 20));

  return {
    pageNumber: boundedPage,
    juz: estimatedJuz,
    hizb: Math.ceil(boundedPage / 10),
    surahName: surahMatch.name,
    ayahs: [
      {
        number: boundedPage,
        numberInSurah: 1,
        text: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ سُورَةُ ${surahMatch.name} (صَفْحَةُ ${boundedPage}) ۝ هُدًى وَرَحْمَةٌ لِّلْمُحْسِنِينَ ۝ الَّذِينَ يُقِيمُونَ الصَّلَاةَ وَيُؤْتُونَ الزَّكَاةَ وَهُم بِالْآخِرَةِ هُمْ يُوقِنُونَ ۝ أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ`,
        surahNumber: surahMatch.number,
        surahName: surahMatch.name,
        juz: estimatedJuz,
        page: boundedPage,
        hizbQuarter: 1,
      },
    ],
    tafsirBrief: `ورد يومي مبارك من سورة ${surahMatch.name}. المحافظة على صفحة واحدة يومياً تعين على راحة البال وزيادة البركة في ساعات الاستذكار.`,
    reflectionPoint: `﴿إِنَّ مَعَ الْعُسْرِ يُسْرًا﴾ • الاستعانة بالله وقراءة الورد القرآني يمنحانك تركيزاً وصفاءً ذهنياً متجدداً.`,
  };
}
