// Notification & Study Reminder Service for Thanawy Plus 2027

export interface NotificationSettings {
  enabled: boolean;
  dailyStudyReminder: boolean;
  dailyStudyTime: string; // e.g. "16:00" (4:00 PM)
  calendarSessionReminder: boolean; // Remind when a planned study session day arrives
  quranWirdReminder: boolean;
  quranWirdTime: string; // e.g. "08:00"
  soundAlert: boolean;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  dailyStudyReminder: true,
  dailyStudyTime: '16:00',
  calendarSessionReminder: true,
  quranWirdReminder: true,
  quranWirdTime: '08:30',
  soundAlert: true,
};

class NotificationService {
  private settings: NotificationSettings;
  private listeners: ((settings: NotificationSettings) => void)[] = [];
  private inAppToastListeners: ((toast: { title: string; body: string; type?: 'study' | 'quran' | 'exam' }) => void)[] = [];

  constructor() {
    this.settings = this.loadSettings();
  }

  public loadSettings(): NotificationSettings {
    try {
      const saved = localStorage.getItem('thanawy_notification_settings');
      if (saved) {
        return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load notification settings', e);
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
  }

  public saveSettings(newSettings: Partial<NotificationSettings>): NotificationSettings {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem('thanawy_notification_settings', JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save notification settings', e);
    }
    this.notifyListeners();
    return this.settings;
  }

  public getSettings(): NotificationSettings {
    return this.settings;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.saveSettings({ enabled: true });
        this.sendNotification({
          title: '🎉 تم تفعيل تنبيهات ثانوي بلس 2027 بنجاح!',
          body: 'سنقوم بتذكيرك بمواعيد جلسات المذاكرة والورد اليومي في موعدها المحدد.',
          tag: 'welcome-notification',
        });
      } else {
        this.saveSettings({ enabled: false });
      }
      return permission;
    } catch (e) {
      console.error('Error requesting notification permission:', e);
      return 'denied';
    }
  }

  public playNotificationSound(): void {
    if (!this.settings.soundAlert) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Gentle dual-tone chime
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(440, now); // A4
      osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.2); // E5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  public sendNotification(options: {
    title: string;
    body: string;
    icon?: string;
    tag?: string;
    type?: 'study' | 'quran' | 'exam';
  }): boolean {
    const { title, body, icon = '/src/assets/images/thanawy_app_icon_1787238617980.jpg', tag, type } = options;

    // Play sound if configured
    this.playNotificationSound();

    // Trigger in-app toast listener (always visible to student inside the app)
    this.inAppToastListeners.forEach((fn) => fn({ title, body, type }));

    // If browser notifications are supported and granted, show native notification
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon,
          tag: tag || 'thanawy-reminder',
          dir: 'rtl',
          lang: 'ar',
          badge: icon,
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };

        return true;
      } catch (e) {
        console.warn('Native notification failed, in-app banner was displayed', e);
      }
    }

    return false;
  }

  public subscribe(callback: (settings: NotificationSettings) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  public subscribeToToasts(callback: (toast: { title: string; body: string; type?: 'study' | 'quran' | 'exam' }) => void): () => void {
    this.inAppToastListeners.push(callback);
    return () => {
      this.inAppToastListeners = this.inAppToastListeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => fn(this.settings));
  }
}

export const notificationService = new NotificationService();
