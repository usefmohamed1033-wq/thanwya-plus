// Sheikh Mohamed Siddiq El-Minshawi Dedicated Recitations and Sanctuary Data
// المصحف المرتل والمجود وروائع التلاوات الخاشعة لفضيلة الشيخ محمد صديق المنشاوي (رحمه الله)

export interface MinshawiRecitationItem {
  id: string;
  titleAr: string;
  titleEn: string;
  surahNumber: number;
  surahName: string;
  type: 'mujawwad' | 'murattal' | 'historical' | 'short_surahs';
  durationText: string;
  locationAr?: string;
  historicalContextAr?: string;
  audioUrl: string;
  ayahCount?: number;
  descriptionAr: string;
}

export interface MinshawiSurahItem {
  number: number;
  name: string;
  englishName: string;
  ayahCount: number;
  revelationType: 'Meccan' | 'Medinan';
  pageNumber: number;
  murattalAudioUrl: string;
  mujawwadAudioUrl: string;
}

// Complete 114 Surahs with direct MP3 streams for Sheikh El-Minshawi
export function getMinshawiAudioMirrors(surahNumber: number, style: 'murattal' | 'mujawwad'): string[] {
  const pad3 = String(surahNumber).padStart(3, '0');
  if (style === 'murattal') {
    return [
      `https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawee/${pad3}.mp3`,
      `https://server10.mp3quran.net/minsh/${pad3}.mp3`,
      `https://server11.mp3quran.net/minsh/${pad3}.mp3`,
      `https://ia800301.us.archive.org/20/items/Muhammad-Siddiq-Al-Minshawi-Murattal/${pad3}.mp3`,
      `https://cdn.islamic.network/quran/audio/128/ar.minshawi/${surahNumber}.mp3`
    ];
  } else {
    return [
      `https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawee_mujawwad/${pad3}.mp3`,
      `https://server10.mp3quran.net/minsh_mjwd/${pad3}.mp3`,
      `https://server11.mp3quran.net/minsh_mjwd/${pad3}.mp3`,
      `https://ia801309.us.archive.org/34/items/Minshawi-Mujawwad-HQ/${pad3}.mp3`,
      `https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawee/${pad3}.mp3`
    ];
  }
}

export function getMinshawiMasterpieceMirrors(surahNumber: number): string[] {
  const pad3 = String(surahNumber).padStart(3, '0');
  return [
    `https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawee_mujawwad/${pad3}.mp3`,
    `https://server10.mp3quran.net/minsh_mjwd/${pad3}.mp3`,
    `https://server11.mp3quran.net/minsh_mjwd/${pad3}.mp3`,
    `https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawee/${pad3}.mp3`,
    `https://server10.mp3quran.net/minsh/${pad3}.mp3`
  ];
}

export function getAyahAudioMirrors(surahNumber: number, ayahNumberInSurah: number): string[] {
  const surahPadded = String(surahNumber).padStart(3, '0');
  const ayahPadded = String(ayahNumberInSurah).padStart(3, '0');
  return [
    `https://everyayah.com/data/Minshawy_Murattal_128kbps/${surahPadded}${ayahPadded}.mp3`,
    `https://everyayah.com/data/Minshawy_Mujawwad_192kbps/${surahPadded}${ayahPadded}.mp3`,
    `https://everyayah.com/data/Minshawy_Teacher_128kbps/${surahPadded}${ayahPadded}.mp3`
  ];
}

export const MINSHAWI_FULL_SURAHS: MinshawiSurahItem[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', ayahCount: 7, revelationType: 'Meccan', pageNumber: 1, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/001.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/001.mp3' },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', ayahCount: 286, revelationType: 'Medinan', pageNumber: 2, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/002.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/002.mp3' },
  { number: 3, name: 'آل عمران', englishName: 'Aal-Imran', ayahCount: 200, revelationType: 'Medinan', pageNumber: 50, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/003.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/003.mp3' },
  { number: 4, name: 'النساء', englishName: 'An-Nisa', ayahCount: 176, revelationType: 'Medinan', pageNumber: 77, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/004.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/004.mp3' },
  { number: 5, name: 'المائدة', englishName: 'Al-Maidah', ayahCount: 120, revelationType: 'Medinan', pageNumber: 106, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/005.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/005.mp3' },
  { number: 6, name: 'الأنعام', englishName: 'Al-Anam', ayahCount: 165, revelationType: 'Meccan', pageNumber: 128, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/006.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/006.mp3' },
  { number: 7, name: 'الأعراف', englishName: 'Al-Araf', ayahCount: 206, revelationType: 'Meccan', pageNumber: 151, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/007.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/007.mp3' },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', ayahCount: 75, revelationType: 'Medinan', pageNumber: 177, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/008.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/008.mp3' },
  { number: 9, name: 'التوبة', englishName: 'At-Tawbah', ayahCount: 129, revelationType: 'Medinan', pageNumber: 187, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/009.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/009.mp3' },
  { number: 10, name: 'يونس', englishName: 'Yunus', ayahCount: 109, revelationType: 'Meccan', pageNumber: 208, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/010.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/010.mp3' },
  { number: 11, name: 'هود', englishName: 'Hud', ayahCount: 123, revelationType: 'Meccan', pageNumber: 221, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/011.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/011.mp3' },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', ayahCount: 111, revelationType: 'Meccan', pageNumber: 235, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/012.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/012.mp3' },
  { number: 13, name: 'الرعد', englishName: 'Ar-Rad', ayahCount: 43, revelationType: 'Medinan', pageNumber: 249, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/013.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/013.mp3' },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', ayahCount: 52, revelationType: 'Meccan', pageNumber: 255, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/014.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/014.mp3' },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', ayahCount: 99, revelationType: 'Meccan', pageNumber: 262, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/015.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/015.mp3' },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', ayahCount: 128, revelationType: 'Meccan', pageNumber: 267, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/016.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/016.mp3' },
  { number: 17, name: 'الإسراء', englishName: 'Al-Isra', ayahCount: 111, revelationType: 'Meccan', pageNumber: 282, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/017.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/017.mp3' },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', ayahCount: 110, revelationType: 'Meccan', pageNumber: 293, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/018.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/018.mp3' },
  { number: 19, name: 'مريم', englishName: 'Maryam', ayahCount: 98, revelationType: 'Meccan', pageNumber: 305, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/019.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/019.mp3' },
  { number: 20, name: 'طه', englishName: 'Taha', ayahCount: 135, revelationType: 'Meccan', pageNumber: 312, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/020.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/020.mp3' },
  { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', ayahCount: 112, revelationType: 'Meccan', pageNumber: 322, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/021.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/021.mp3' },
  { number: 22, name: 'الحج', englishName: 'Al-Hajj', ayahCount: 78, revelationType: 'Medinan', pageNumber: 332, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/022.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/022.mp3' },
  { number: 23, name: 'المؤمنون', englishName: 'Al-Muminun', ayahCount: 118, revelationType: 'Meccan', pageNumber: 342, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/023.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/023.mp3' },
  { number: 24, name: 'النور', englishName: 'An-Nur', ayahCount: 64, revelationType: 'Medinan', pageNumber: 350, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/024.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/024.mp3' },
  { number: 25, name: 'الفرقان', englishName: 'Al-Furqan', ayahCount: 77, revelationType: 'Meccan', pageNumber: 359, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/025.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/025.mp3' },
  { number: 26, name: 'الشعراء', englishName: 'Ash-Shuara', ayahCount: 227, revelationType: 'Meccan', pageNumber: 367, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/026.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/026.mp3' },
  { number: 27, name: 'النمل', englishName: 'An-Naml', ayahCount: 93, revelationType: 'Meccan', pageNumber: 377, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/027.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/027.mp3' },
  { number: 28, name: 'القصص', englishName: 'Al-Qasas', ayahCount: 88, revelationType: 'Meccan', pageNumber: 385, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/028.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/028.mp3' },
  { number: 29, name: 'العنكبوت', englishName: 'Al-Ankabut', ayahCount: 69, revelationType: 'Meccan', pageNumber: 396, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/029.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/029.mp3' },
  { number: 30, name: 'الروم', englishName: 'Ar-Rum', ayahCount: 60, revelationType: 'Meccan', pageNumber: 404, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/030.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/030.mp3' },
  { number: 31, name: 'لقمان', englishName: 'Luqman', ayahCount: 34, revelationType: 'Meccan', pageNumber: 411, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/031.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/031.mp3' },
  { number: 32, name: 'السجدة', englishName: 'As-Sajdah', ayahCount: 30, revelationType: 'Meccan', pageNumber: 415, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/032.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/032.mp3' },
  { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', ayahCount: 73, revelationType: 'Medinan', pageNumber: 418, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/033.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/033.mp3' },
  { number: 34, name: 'سبأ', englishName: 'Saba', ayahCount: 54, revelationType: 'Meccan', pageNumber: 428, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/034.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/034.mp3' },
  { number: 35, name: 'فاطر', englishName: 'Fatir', ayahCount: 45, revelationType: 'Meccan', pageNumber: 434, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/035.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/035.mp3' },
  { number: 36, name: 'يس', englishName: 'Ya-Sin', ayahCount: 83, revelationType: 'Meccan', pageNumber: 440, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/036.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/036.mp3' },
  { number: 37, name: 'الصافات', englishName: 'As-Saffat', ayahCount: 182, revelationType: 'Meccan', pageNumber: 446, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/037.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/037.mp3' },
  { number: 38, name: 'ص', englishName: 'Sad', ayahCount: 88, revelationType: 'Meccan', pageNumber: 453, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/038.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/038.mp3' },
  { number: 39, name: 'الزمر', englishName: 'Az-Zumar', ayahCount: 75, revelationType: 'Meccan', pageNumber: 458, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/039.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/039.mp3' },
  { number: 40, name: 'غافر', englishName: 'Ghafir', ayahCount: 85, revelationType: 'Meccan', pageNumber: 467, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/040.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/040.mp3' },
  { number: 41, name: 'فصلت', englishName: 'Fussilat', ayahCount: 54, revelationType: 'Meccan', pageNumber: 477, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/041.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/041.mp3' },
  { number: 42, name: 'الشورى', englishName: 'Ash-Shura', ayahCount: 53, revelationType: 'Meccan', pageNumber: 483, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/042.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/042.mp3' },
  { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', ayahCount: 89, revelationType: 'Meccan', pageNumber: 489, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/043.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/043.mp3' },
  { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', ayahCount: 59, revelationType: 'Meccan', pageNumber: 496, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/044.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/044.mp3' },
  { number: 45, name: 'الجاثية', englishName: 'Al-Jathiyah', ayahCount: 37, revelationType: 'Meccan', pageNumber: 499, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/045.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/045.mp3' },
  { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', ayahCount: 35, revelationType: 'Meccan', pageNumber: 502, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/046.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/046.mp3' },
  { number: 47, name: 'محمد', englishName: 'Muhammad', ayahCount: 38, revelationType: 'Medinan', pageNumber: 507, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/047.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/047.mp3' },
  { number: 48, name: 'الفتح', englishName: 'Al-Fath', ayahCount: 29, revelationType: 'Medinan', pageNumber: 511, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/048.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/048.mp3' },
  { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', ayahCount: 18, revelationType: 'Medinan', pageNumber: 515, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/049.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/049.mp3' },
  { number: 50, name: 'ق', englishName: 'Qaf', ayahCount: 45, revelationType: 'Meccan', pageNumber: 518, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/050.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/050.mp3' },
  { number: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', ayahCount: 60, revelationType: 'Meccan', pageNumber: 520, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/051.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/051.mp3' },
  { number: 52, name: 'الطور', englishName: 'At-Tur', ayahCount: 49, revelationType: 'Meccan', pageNumber: 523, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/052.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/052.mp3' },
  { number: 53, name: 'النجم', englishName: 'An-Najm', ayahCount: 62, revelationType: 'Meccan', pageNumber: 526, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/053.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/053.mp3' },
  { number: 54, name: 'القمر', englishName: 'Al-Qamar', ayahCount: 55, revelationType: 'Meccan', pageNumber: 528, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/054.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/054.mp3' },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', ayahCount: 78, revelationType: 'Medinan', pageNumber: 531, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/055.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/055.mp3' },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waqiah', ayahCount: 96, revelationType: 'Meccan', pageNumber: 534, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/056.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/056.mp3' },
  { number: 57, name: 'الحديد', englishName: 'Al-Hadid', ayahCount: 29, revelationType: 'Medinan', pageNumber: 537, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/057.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/057.mp3' },
  { number: 58, name: 'المجادلة', englishName: 'Al-Mujadila', ayahCount: 22, revelationType: 'Medinan', pageNumber: 542, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/058.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/058.mp3' },
  { number: 59, name: 'الحشر', englishName: 'Al-Hashr', ayahCount: 24, revelationType: 'Medinan', pageNumber: 545, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/059.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/059.mp3' },
  { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', ayahCount: 13, revelationType: 'Medinan', pageNumber: 549, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/060.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/060.mp3' },
  { number: 61, name: 'الصف', englishName: 'As-Saff', ayahCount: 14, revelationType: 'Medinan', pageNumber: 551, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/061.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/061.mp3' },
  { number: 62, name: 'الجمعة', englishName: 'Al-Jumuah', ayahCount: 11, revelationType: 'Medinan', pageNumber: 553, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/062.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/062.mp3' },
  { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', ayahCount: 11, revelationType: 'Medinan', pageNumber: 554, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/063.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/063.mp3' },
  { number: 64, name: 'التغابن', englishName: 'At-Taghabun', ayahCount: 18, revelationType: 'Medinan', pageNumber: 556, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/064.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/064.mp3' },
  { number: 65, name: 'الطلاق', englishName: 'At-Talaq', ayahCount: 12, revelationType: 'Medinan', pageNumber: 558, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/065.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/065.mp3' },
  { number: 66, name: 'التحريم', englishName: 'At-Tahrim', ayahCount: 12, revelationType: 'Medinan', pageNumber: 560, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/066.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/066.mp3' },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', ayahCount: 30, revelationType: 'Meccan', pageNumber: 562, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/067.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/067.mp3' },
  { number: 68, name: 'القلم', englishName: 'Al-Qalam', ayahCount: 52, revelationType: 'Meccan', pageNumber: 564, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/068.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/068.mp3' },
  { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', ayahCount: 52, revelationType: 'Meccan', pageNumber: 566, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/069.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/069.mp3' },
  { number: 70, name: 'المعارج', englishName: 'Al-Maarij', ayahCount: 44, revelationType: 'Meccan', pageNumber: 568, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/070.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/070.mp3' },
  { number: 71, name: 'نوح', englishName: 'Nuh', ayahCount: 28, revelationType: 'Meccan', pageNumber: 570, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/071.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/071.mp3' },
  { number: 72, name: 'الجن', englishName: 'Al-Jinn', ayahCount: 28, revelationType: 'Meccan', pageNumber: 572, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/072.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/072.mp3' },
  { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', ayahCount: 20, revelationType: 'Meccan', pageNumber: 574, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/073.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/073.mp3' },
  { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', ayahCount: 56, revelationType: 'Meccan', pageNumber: 575, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/074.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/074.mp3' },
  { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', ayahCount: 40, revelationType: 'Meccan', pageNumber: 577, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/075.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/075.mp3' },
  { number: 76, name: 'الإنسان', englishName: 'Al-Insan', ayahCount: 31, revelationType: 'Medinan', pageNumber: 578, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/076.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/076.mp3' },
  { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', ayahCount: 50, revelationType: 'Meccan', pageNumber: 580, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/077.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/077.mp3' },
  { number: 78, name: 'النبأ', englishName: 'An-Naba', ayahCount: 40, revelationType: 'Meccan', pageNumber: 582, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/078.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/078.mp3' },
  { number: 79, name: 'النازعات', englishName: 'An-Naziat', ayahCount: 46, revelationType: 'Meccan', pageNumber: 583, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/079.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/079.mp3' },
  { number: 80, name: 'عبس', englishName: 'Abasa', ayahCount: 42, revelationType: 'Meccan', pageNumber: 585, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/080.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/080.mp3' },
  { number: 81, name: 'التكوير', englishName: 'At-Takwir', ayahCount: 29, revelationType: 'Meccan', pageNumber: 586, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/081.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/081.mp3' },
  { number: 82, name: 'الانفطار', englishName: 'Al-Infitar', ayahCount: 19, revelationType: 'Meccan', pageNumber: 587, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/082.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/082.mp3' },
  { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', ayahCount: 36, revelationType: 'Meccan', pageNumber: 587, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/083.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/083.mp3' },
  { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaq', ayahCount: 25, revelationType: 'Meccan', pageNumber: 589, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/084.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/084.mp3' },
  { number: 85, name: 'البروج', englishName: 'Al-Buruj', ayahCount: 22, revelationType: 'Meccan', pageNumber: 590, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/085.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/085.mp3' },
  { number: 86, name: 'الطارق', englishName: 'At-Tariq', ayahCount: 17, revelationType: 'Meccan', pageNumber: 591, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/086.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/086.mp3' },
  { number: 87, name: 'الأعلى', englishName: 'Al-Ala', ayahCount: 19, revelationType: 'Meccan', pageNumber: 591, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/087.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/087.mp3' },
  { number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', ayahCount: 26, revelationType: 'Meccan', pageNumber: 592, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/088.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/088.mp3' },
  { number: 89, name: 'الفجر', englishName: 'Al-Fajr', ayahCount: 30, revelationType: 'Meccan', pageNumber: 593, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/089.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/089.mp3' },
  { number: 90, name: 'البلد', englishName: 'Al-Balad', ayahCount: 20, revelationType: 'Meccan', pageNumber: 594, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/090.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/090.mp3' },
  { number: 91, name: 'الشمس', englishName: 'Ash-Shams', ayahCount: 15, revelationType: 'Meccan', pageNumber: 595, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/091.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/091.mp3' },
  { number: 92, name: 'الليل', englishName: 'Al-Layl', ayahCount: 21, revelationType: 'Meccan', pageNumber: 595, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/092.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/092.mp3' },
  { number: 93, name: 'الضحى', englishName: 'Ad-Duha', ayahCount: 11, revelationType: 'Meccan', pageNumber: 596, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/093.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/093.mp3' },
  { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', ayahCount: 8, revelationType: 'Meccan', pageNumber: 596, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/094.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/094.mp3' },
  { number: 95, name: 'التين', englishName: 'At-Tin', ayahCount: 8, revelationType: 'Meccan', pageNumber: 597, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/095.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/095.mp3' },
  { number: 96, name: 'العلق', englishName: 'Al-Alaq', ayahCount: 19, revelationType: 'Meccan', pageNumber: 597, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/096.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/096.mp3' },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr', ayahCount: 5, revelationType: 'Meccan', pageNumber: 598, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/097.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/097.mp3' },
  { number: 98, name: 'البينة', englishName: 'Al-Bayyinah', ayahCount: 8, revelationType: 'Medinan', pageNumber: 598, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/098.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/098.mp3' },
  { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', ayahCount: 8, revelationType: 'Medinan', pageNumber: 599, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/099.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/099.mp3' },
  { number: 100, name: 'العاديات', englishName: 'Al-Adiyat', ayahCount: 11, revelationType: 'Meccan', pageNumber: 599, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/100.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/100.mp3' },
  { number: 101, name: 'القارعة', englishName: 'Al-Qariah', ayahCount: 11, revelationType: 'Meccan', pageNumber: 600, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/101.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/101.mp3' },
  { number: 102, name: 'التكاثر', englishName: 'At-Takathur', ayahCount: 8, revelationType: 'Meccan', pageNumber: 600, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/102.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/102.mp3' },
  { number: 103, name: 'العصر', englishName: 'Al-Asr', ayahCount: 3, revelationType: 'Meccan', pageNumber: 601, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/103.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/103.mp3' },
  { number: 104, name: 'الهمزة', englishName: 'Al-Humazah', ayahCount: 9, revelationType: 'Meccan', pageNumber: 601, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/104.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/104.mp3' },
  { number: 105, name: 'الفيل', englishName: 'Al-Fil', ayahCount: 5, revelationType: 'Meccan', pageNumber: 601, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/105.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/105.mp3' },
  { number: 106, name: 'قريش', englishName: 'Quraysh', ayahCount: 4, revelationType: 'Meccan', pageNumber: 602, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/106.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/106.mp3' },
  { number: 107, name: 'الماعون', englishName: 'Al-Maun', ayahCount: 7, revelationType: 'Meccan', pageNumber: 602, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/107.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/107.mp3' },
  { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', ayahCount: 3, revelationType: 'Meccan', pageNumber: 602, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/108.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/108.mp3' },
  { number: 109, name: 'الكافرون', englishName: 'Al-Kafirun', ayahCount: 6, revelationType: 'Meccan', pageNumber: 603, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/109.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/109.mp3' },
  { number: 110, name: 'النصر', englishName: 'An-Nasr', ayahCount: 3, revelationType: 'Medinan', pageNumber: 603, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/110.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/110.mp3' },
  { number: 111, name: 'المسد', englishName: 'Al-Masad', ayahCount: 5, revelationType: 'Meccan', pageNumber: 603, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/111.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/111.mp3' },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', ayahCount: 4, revelationType: 'Meccan', pageNumber: 604, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/112.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/112.mp3' },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', ayahCount: 5, revelationType: 'Meccan', pageNumber: 604, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/113.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/113.mp3' },
  { number: 114, name: 'الناس', englishName: 'An-Nas', ayahCount: 6, revelationType: 'Meccan', pageNumber: 604, murattalAudioUrl: 'https://server10.mp3quran.net/minsh/114.mp3', mujawwadAudioUrl: 'https://server10.mp3quran.net/minsh_mjwd/114.mp3' }
];

// Curated Masterpieces (روائع التلاوات الخاشعة والمجودة النادرة للشيخ المنشاوي)
export const MINSHAWI_MASTERPIECES: MinshawiRecitationItem[] = [
  {
    id: 'yusuf_masterpiece',
    titleAr: 'سورة يوسف (كاملة بالصوت الباكي الخاشع)',
    titleEn: 'Surah Yusuf - Complete Emotional Masterpiece',
    surahNumber: 12,
    surahName: 'يوسف',
    type: 'mujawwad',
    durationText: '54:12 دقيقة',
    locationAr: 'تسجيل استوديو إذاعة القرآن الكريم بالقاهرة',
    historicalContextAr: 'تُعد هذه التلاوة من أعظم التلاوات المسجلة في تاريخ التلاوة المصرية لما فيها من تصوير درامي إيماني بديع لقصة نبي الله يوسف.',
    audioUrl: 'https://server10.mp3quran.net/minsh_mjwd/012.mp3',
    ayahCount: 111,
    descriptionAr: 'تلاوة مجودة استثنائية تأخذ المستمع في رحلة وجدانية عميقة تشفي الصدور وتبعث السكينة واليقين.'
  },
  {
    id: 'hashr_palestine',
    titleAr: 'سورة الحشر (لو أنزلنا هذا القرآن على جبل)',
    titleEn: 'Surah Al-Hashr - Iconic Historic Recitation',
    surahNumber: 59,
    surahName: 'الحشر',
    type: 'historical',
    durationText: '32:45 دقيقة',
    locationAr: 'تسجيل تاريخي شهير من المسجد الأقصى المبارك والجامع الأموي',
    historicalContextAr: 'أحد أشهر المقاطع التاريخية الخالدة التي أبهرت العالم الإسلامي بخشوع المنشاوي الفريد وانتقالات المقامات القرآنية المحكمة.',
    audioUrl: 'https://server10.mp3quran.net/minsh_mjwd/059.mp3',
    ayahCount: 24,
    descriptionAr: 'المقطع الخالد: «لَوْ أَنزَلْنَا هَٰذَا الْقُرْآنَ عَلَىٰ جَبَلٍ لَّرَأَيْتَهُ خَاشِعًا مُّتَصَدِّعًا مِّنْ خَشْيَةِ اللَّهِ».'
  },
  {
    id: 'maryam_legendary',
    titleAr: 'سورة مريم (كهيعص - ذكر رحمة ربك عبده زكريا)',
    titleEn: 'Surah Maryam - Legendary Tajweed',
    surahNumber: 19,
    surahName: 'مريم',
    type: 'mujawwad',
    durationText: '48:30 دقيقة',
    locationAr: 'حفلة إذاعية مسجلة',
    historicalContextAr: 'أداء ناعم رقيق يبكي القلوب في قصة استجابة الدعاء لسيدنا زكريا وولادة مريم العذراء للمسيح عيسى عليه السلام.',
    audioUrl: 'https://server10.mp3quran.net/minsh_mjwd/019.mp3',
    ayahCount: 98,
    descriptionAr: '«قَالَ رَبِّ إِنِّي وَهَنَ الْعَظْمُ مِنِّي وَاشْتَعَلَ الرَّأْسُ شَيْبًا وَلَمْ أَكُن بِدُعَائِكَ رَبِّ شَقِيًّا».'
  },
  {
    id: 'rahman_beauty',
    titleAr: 'سورة الرحمن (عروس القرآن الكريم)',
    titleEn: 'Surah Ar-Rahman - Bride of the Quran',
    surahNumber: 55,
    surahName: 'الرحمن',
    type: 'mujawwad',
    durationText: '26:18 دقيقة',
    locationAr: 'تسجيلات الإذاعة المصرية الذهبية',
    historicalContextAr: 'نغمات متناسقة مع ترجيع آية «فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ» تجعل العقل يسبح في بديع صنع الله.',
    audioUrl: 'https://server10.mp3quran.net/minsh_mjwd/055.mp3',
    ayahCount: 78,
    descriptionAr: 'تلاوة ساحرة تأخذ العقل في جولة بين نعم الله في الكون والجنة.'
  },
  {
    id: 'qaf_reverence',
    titleAr: 'سورة ق (والقرآن المجيد - خاشعة ومؤثرة)',
    titleEn: 'Surah Qaf - Deep Reverence',
    surahNumber: 50,
    surahName: 'ق',
    type: 'mujawwad',
    durationText: '28:10 دقيقة',
    locationAr: 'تسجيل القاهرة',
    historicalContextAr: 'تلاوة تهز الوجدان وتذكر باليوم الآخر وعظمة الخالق جل وعلا.',
    audioUrl: 'https://server10.mp3quran.net/minsh_mjwd/050.mp3',
    ayahCount: 45,
    descriptionAr: '«وَلَقَدْ خَلَقْنَا الْإِنسَانَ وَنَعْلَمُ مَا تُوَسْوِسُ بِهِ نَفْسُهُ وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ».'
  },
  {
    id: 'waqiah_provision',
    titleAr: 'سورة الواقعة (سورة الغنى وجلب البركة)',
    titleEn: 'Surah Al-Waqiah - Surah of Divine Provision',
    surahNumber: 56,
    surahName: 'الواقعة',
    type: 'mujawwad',
    durationText: '24:50 دقيقة',
    locationAr: 'تسجيل الإذاعة المصرية',
    historicalContextAr: 'سورة الواقعة بصوت الشيخ المنشاوي يحرص الطلاب على الاستماع إليها طلباً للبركة والفتح في المذاكرة والتوفيق.',
    audioUrl: 'https://server10.mp3quran.net/minsh_mjwd/056.mp3',
    ayahCount: 96,
    descriptionAr: 'تلاوة تبعث الأمل واليقين برزق الله والنجاح والتوفيق.'
  },
  {
    id: 'taha_serenity',
    titleAr: 'سورة طه (ما أنزلنا عليك القرآن لتشقى)',
    titleEn: 'Surah Taha - The Divine Comfort',
    surahNumber: 20,
    surahName: 'طه',
    type: 'mujawwad',
    durationText: '42:15 دقيقة',
    locationAr: 'تسجيل استوديو الإذاعة',
    historicalContextAr: '«طه * مَا أَنزَلْنَا عَلَيْكَ الْقُرْآنَ لِتَشْقَىٰ» بل ليكون نوراً وهداية وشفاء لقلوب المتعبين.',
    audioUrl: 'https://server10.mp3quran.net/minsh_mjwd/020.mp3',
    ayahCount: 135,
    descriptionAr: 'تلاوة تهون التعب وتزيل القلق والتوتر الدراسي.'
  },
  {
    id: 'short_surahs_quintessential',
    titleAr: 'قصار السور (الضحى، الشرح، التين، العلق، القدر، الإخلاص والمعوذتين)',
    titleEn: 'Short Surahs - Complete Emotional Quintessence',
    surahNumber: 93,
    surahName: 'الضحى وقصار السور',
    type: 'short_surahs',
    durationText: '35:20 دقيقة',
    locationAr: 'حفلات الجامع الأموي بدمشق',
    historicalContextAr: 'تسجيل تاريخي مهيب جمع فيه الشيخ المنشاوي أواخر القرآن في أداء ارتجالي فريد لا يتكرر.',
    audioUrl: 'https://server10.mp3quran.net/minsh_mjwd/093.mp3',
    ayahCount: 65,
    descriptionAr: '«أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ * وَوَضَعْنَا عَنكَ وِزْرَكَ» تلاوة تطمئن القلوب ليلة الامتحانات.'
  }
];

// Minshawi Biography & Spiritual Quotes
export const MINSHAWI_BIOGRAPHY = {
  fullNameAr: 'الشيخ محمد صديق بن السيد حسن المنشاوي',
  birthAr: 'ولد عام 1920م في مدينة المنشاة بمحافظة سوهاج، مصر',
  deathAr: 'توفي عام 1969م عن عمر يناهز 49 عاماً بعد رحلة عطاء قرآنية مباركة',
  titleAr: '«الصوت الباكي» و«ريحانة القراء»',
  legacyAr: 'نشأ في بيت قرآني عريق وتوارث التلاوة أباً عن جد، تميز بصوته الرخيم الشجي ذي البحة الحنونة الفريدة التي تنفذ مباشرة إلى القلوب بخشوع ومهابة، ولم يقبل أي إغراء دنيوي لإخراج التلاوة عن وقارها الإلهي.',
  famousQuoteAr: '«القرآن نزل بمكة، وقُرئ بمصر» — وكان المنشاوي من أوتاد هذه القراءة الخالدة.'
};
