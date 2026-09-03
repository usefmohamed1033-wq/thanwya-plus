import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import {
  MINSHAWI_FULL_SURAHS,
  MINSHAWI_MASTERPIECES,
  MinshawiSurahItem,
  MinshawiRecitationItem,
  getMinshawiAudioMirrors,
  getMinshawiMasterpieceMirrors,
  getAyahAudioMirrors,
} from '../data/minshawiData';
import { QuranPageData, fetchQuranPage, getTodaysQuranPageNumber } from '../data/quranData';

export interface QuranPlayingItem {
  id: string;
  title: string;
  subTitle: string;
  audioUrls: string[];
  currentUrlIndex: number;
  type: 'wird_ayah' | 'wird_full_page' | 'full_surah_murattal' | 'full_surah_mujawwad' | 'masterpiece' | 'radio';
  ayahIndexInPage?: number;
  pageNum?: number;
}

interface QuranAudioContextType {
  currentPlayingItem: QuranPlayingItem | null;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  isLooping: boolean;
  volume: number;
  audioError: string | null;
  sleepTimerSecondsLeft: number | null;
  activeRecitingAyahNumber: number | null;
  toastMessage: string | null;
  togglePlayAudio: () => void;
  playCurrentSource: (urls: string[], index: number) => void;
  handleSeek: (e: React.ChangeEvent<HTMLInputElement> | number) => void;
  handlePlayPageWirdMinshawi: (pageNum: number, pageData: QuranPageData | null) => void;
  handlePlaySingleAyah: (ayah: any, indexInPage: number, pageNum: number, pageData: QuranPageData | null) => void;
  handlePlaySurah: (surah: MinshawiSurahItem, style: 'murattal' | 'mujawwad') => void;
  handlePlayMasterpiece: (item: MinshawiRecitationItem) => void;
  handlePlayNextSurah: () => void;
  handlePlayPrevSurah: () => void;
  handleSetSleepTimer: (minutes: number | null) => void;
  handleSwitchMirror: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setIsLooping: (loop: boolean | ((prev: boolean) => boolean)) => void;
  setVolume: (vol: number) => void;
  stopAudio: () => void;
  setToastMessage: (msg: string | null) => void;
}

const QuranAudioContext = createContext<QuranAudioContextType | undefined>(undefined);

export const QuranAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentPlayingItem, setCurrentPlayingItem] = useState<QuranPlayingItem | null>(() => {
    try {
      const saved = localStorage.getItem('thanawy_quran_last_item');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeedState] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(1.0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [activeRecitingAyahNumber, setActiveRecitingAyahNumber] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [sleepTimerSecondsLeft, setSleepTimerSecondsLeft] = useState<number | null>(null);

  // Save last played item
  useEffect(() => {
    if (currentPlayingItem) {
      try {
        localStorage.setItem('thanawy_quran_last_item', JSON.stringify(currentPlayingItem));
      } catch (e) {}
    }
  }, [currentPlayingItem]);

  // Audio Play engine
  const playCurrentSource = (urls: string[], index: number) => {
    if (!audioRef.current || urls.length === 0) return;
    const url = urls[index % urls.length];

    setIsBuffering(true);
    setAudioError(null);
    audioRef.current.src = url;
    audioRef.current.playbackRate = playbackSpeed;
    audioRef.current.loop = isLooping;
    audioRef.current.volume = volume;

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch((err) => {
          console.warn('Quran Audio play rejection:', err);
          if (index < urls.length - 1) {
            setCurrentPlayingItem((prev) => (prev ? { ...prev, currentUrlIndex: index + 1 } : null));
            playCurrentSource(urls, index + 1);
          } else {
            setIsBuffering(false);
            setIsPlaying(false);
            setAudioError('تمت تجربة الخوادم، انقر على زر التشغيل للبدء أو تحقق من اتصالك بالإنترنت.');
          }
        });
    }
  };

  const handleSwitchMirror = () => {
    if (!currentPlayingItem || currentPlayingItem.audioUrls.length <= 1) return;
    const nextIdx = (currentPlayingItem.currentUrlIndex + 1) % currentPlayingItem.audioUrls.length;
    setCurrentPlayingItem({ ...currentPlayingItem, currentUrlIndex: nextIdx });
    playCurrentSource(currentPlayingItem.audioUrls, nextIdx);
    setToastMessage(`🔄 تم التحويل إلى خادم الصوت (${nextIdx + 1}/${currentPlayingItem.audioUrls.length})`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAudioEnded = async () => {
    if (isLooping) return;

    if (currentPlayingItem?.type === 'wird_full_page' && currentPlayingItem.pageNum) {
      const pageNum = currentPlayingItem.pageNum;
      const pageData = await fetchQuranPage(pageNum);
      const currentAyahIdx = currentPlayingItem.ayahIndexInPage ?? 0;
      const nextAyahIdx = currentAyahIdx + 1;

      if (pageData && pageData.ayahs && nextAyahIdx < pageData.ayahs.length) {
        const nextAyah = pageData.ayahs[nextAyahIdx];
        setActiveRecitingAyahNumber(nextAyah.number);
        const mirrors = getAyahAudioMirrors(nextAyah.surahNumber, nextAyah.numberInSurah);

        const newItem: QuranPlayingItem = {
          id: `wird-page-${pageNum}-ayah-${nextAyah.numberInSurah}`,
          title: `سورة ${pageData.surahName} — آية ${nextAyah.numberInSurah}`,
          subTitle: 'الشيخ محمد صديق المنشاوي (المصحف المرتل)',
          audioUrls: mirrors,
          currentUrlIndex: 0,
          type: 'wird_full_page',
          ayahIndexInPage: nextAyahIdx,
          pageNum,
        };

        setCurrentPlayingItem(newItem);
        playCurrentSource(mirrors, 0);
        return;
      } else {
        setIsPlaying(false);
        setActiveRecitingAyahNumber(null);
        setToastMessage('✨ اكتملت تلاوة صفحة الورد اليومي بصوت الشيخ المنشاوي.');
        setTimeout(() => setToastMessage(null), 4000);
        return;
      }
    }

    if (currentPlayingItem?.type.startsWith('full_surah')) {
      handlePlayNextSurah();
      return;
    }

    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleAudioError = () => {
    if (!currentPlayingItem) return;
    const { audioUrls, currentUrlIndex } = currentPlayingItem;
    if (currentUrlIndex < audioUrls.length - 1) {
      const nextIndex = currentUrlIndex + 1;
      setCurrentPlayingItem((prev) => (prev ? { ...prev, currentUrlIndex: nextIndex } : null));
      playCurrentSource(audioUrls, nextIndex);
    } else {
      setIsBuffering(false);
      setIsPlaying(false);
      setAudioError('تعذر تحميل هذا المقطع حالياً، تم فحص الخوادم البديلة.');
    }
  };

  // Sleep Timer
  useEffect(() => {
    if (sleepTimerSecondsLeft === null) return;
    if (sleepTimerSecondsLeft <= 0) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      setSleepTimerSecondsLeft(null);
      setToastMessage('⏱️ انتهى مؤقت الاستماع التلقائي لتلاوة الشيخ المنشاوي.');
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    const timer = setInterval(() => {
      setSleepTimerSecondsLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepTimerSecondsLeft]);

  const togglePlayAudio = () => {
    if (!currentPlayingItem) {
      handlePlayMasterpiece(MINSHAWI_MASTERPIECES[0]);
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.src) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          playCurrentSource(currentPlayingItem.audioUrls, currentPlayingItem.currentUrlIndex);
        });
      } else {
        playCurrentSource(currentPlayingItem.audioUrls, currentPlayingItem.currentUrlIndex);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement> | number) => {
    const time = typeof e === 'number' ? e : parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handlePlayPageWirdMinshawi = (pageNum: number, pageData: QuranPageData | null) => {
    if (!pageData || !pageData.ayahs || pageData.ayahs.length === 0) return;
    const firstAyah = pageData.ayahs[0];
    setActiveRecitingAyahNumber(firstAyah.number);
    const mirrors = getAyahAudioMirrors(firstAyah.surahNumber, firstAyah.numberInSurah);

    const newItem: QuranPlayingItem = {
      id: `wird-page-${pageNum}-ayah-${firstAyah.numberInSurah}`,
      title: `ورد صفحة ${pageNum} — سورة ${pageData.surahName} (آية ${firstAyah.numberInSurah})`,
      subTitle: 'الشيخ محمد صديق المنشاوي (المصحف المرتل)',
      audioUrls: mirrors,
      currentUrlIndex: 0,
      type: 'wird_full_page',
      ayahIndexInPage: 0,
      pageNum,
    };

    setCurrentPlayingItem(newItem);
    playCurrentSource(mirrors, 0);
  };

  const handlePlaySingleAyah = (
    ayah: any,
    indexInPage: number,
    pageNum: number,
    pageData: QuranPageData | null
  ) => {
    setActiveRecitingAyahNumber(ayah.number);
    const mirrors = getAyahAudioMirrors(ayah.surahNumber, ayah.numberInSurah);

    const newItem: QuranPlayingItem = {
      id: `wird-page-${pageNum}-ayah-${ayah.numberInSurah}`,
      title: `سورة ${pageData?.surahName || 'المصحف'} — آية ${ayah.numberInSurah}`,
      subTitle: 'الشيخ محمد صديق المنشاوي (المصحف المرتل)',
      audioUrls: mirrors,
      currentUrlIndex: 0,
      type: 'wird_full_page',
      ayahIndexInPage: indexInPage,
      pageNum,
    };

    setCurrentPlayingItem(newItem);
    playCurrentSource(mirrors, 0);
  };

  const handlePlaySurah = (surah: MinshawiSurahItem, style: 'murattal' | 'mujawwad') => {
    const mirrors = getMinshawiAudioMirrors(surah.number, style);
    const styleLabel = style === 'murattal' ? 'المصحف المرتل' : 'المصحف المجود والتلاوات الخاشعة';

    const newItem: QuranPlayingItem = {
      id: `surah-${surah.number}-${style}`,
      title: `سورة ${surah.name} (${surah.englishName})`,
      subTitle: `الشيخ محمد صديق المنشاوي • ${styleLabel}`,
      audioUrls: mirrors,
      currentUrlIndex: 0,
      type: style === 'murattal' ? 'full_surah_murattal' : 'full_surah_mujawwad',
    };

    setActiveRecitingAyahNumber(null);
    setCurrentPlayingItem(newItem);
    playCurrentSource(mirrors, 0);
  };

  const handlePlayMasterpiece = (item: MinshawiRecitationItem) => {
    const mirrors = getMinshawiMasterpieceMirrors(item.surahNumber);

    const newItem: QuranPlayingItem = {
      id: item.id,
      title: item.titleAr,
      subTitle: `${item.locationAr || 'إذاعة القرآن الكريم'} • ${item.durationText}`,
      audioUrls: mirrors,
      currentUrlIndex: 0,
      type: 'masterpiece',
    };

    setActiveRecitingAyahNumber(null);
    setCurrentPlayingItem(newItem);
    playCurrentSource(mirrors, 0);
  };

  const handlePlayNextSurah = () => {
    if (!currentPlayingItem) return;
    const match = currentPlayingItem.id.match(/^surah-(\d+)-(murattal|mujawwad)$/);
    if (match) {
      const currentNum = parseInt(match[1], 10);
      const currentStyle = match[2] as 'murattal' | 'mujawwad';
      const nextNum = currentNum < 114 ? currentNum + 1 : 1;
      const nextSurah = MINSHAWI_FULL_SURAHS.find((s) => s.number === nextNum);
      if (nextSurah) {
        handlePlaySurah(nextSurah, currentStyle);
      }
    }
  };

  const handlePlayPrevSurah = () => {
    if (!currentPlayingItem) return;
    const match = currentPlayingItem.id.match(/^surah-(\d+)-(murattal|mujawwad)$/);
    if (match) {
      const currentNum = parseInt(match[1], 10);
      const currentStyle = match[2] as 'murattal' | 'mujawwad';
      const prevNum = currentNum > 1 ? currentNum - 1 : 114;
      const prevSurah = MINSHAWI_FULL_SURAHS.find((s) => s.number === prevNum);
      if (prevSurah) {
        handlePlaySurah(prevSurah, currentStyle);
      }
    }
  };

  const handleSetSleepTimer = (minutes: number | null) => {
    if (minutes === null) {
      setSleepTimerSecondsLeft(null);
      setToastMessage('تم إلغاء مؤقت الإيقاف التلقائي.');
    } else {
      setSleepTimerSecondsLeft(minutes * 60);
      setToastMessage(`⏱️ سيتم إيقاف التلاوة تلقائياً بعد ${minutes} دقيقة.`);
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const setPlaybackSpeed = (speed: number) => {
    setPlaybackSpeedState(speed);
    if (audioRef.current) audioRef.current.playbackRate = speed;
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setCurrentPlayingItem(null);
    setActiveRecitingAyahNumber(null);
  };

  return (
    <QuranAudioContext.Provider
      value={{
        currentPlayingItem,
        isPlaying,
        isBuffering,
        currentTime,
        duration,
        playbackSpeed,
        isLooping,
        volume,
        audioError,
        sleepTimerSecondsLeft,
        activeRecitingAyahNumber,
        toastMessage,
        togglePlayAudio,
        playCurrentSource,
        handleSeek,
        handlePlayPageWirdMinshawi,
        handlePlaySingleAyah,
        handlePlaySurah,
        handlePlayMasterpiece,
        handlePlayNextSurah,
        handlePlayPrevSurah,
        handleSetSleepTimer,
        handleSwitchMirror,
        setPlaybackSpeed,
        setIsLooping,
        setVolume,
        stopAudio,
        setToastMessage,
      }}
    >
      {/* Global Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
        crossOrigin="anonymous"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setIsPlaying(true);
        }}
      />
      {children}
    </QuranAudioContext.Provider>
  );
};

export const useQuranAudio = () => {
  const context = useContext(QuranAudioContext);
  if (!context) {
    throw new Error('useQuranAudio must be used within a QuranAudioProvider');
  }
  return context;
};
