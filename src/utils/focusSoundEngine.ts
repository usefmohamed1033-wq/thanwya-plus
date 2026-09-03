// High-Fidelity Procedural Focus Audio Engine for Pomodoro
// Zero dependencies, resilient to autoplay policies, provides 7 relaxing soundscapes

export type FocusSoundType =
  | 'none'
  | 'rain'
  | 'storm'
  | 'pink_noise'
  | 'white_noise'
  | 'ocean'
  | 'alpha_waves'
  | 'forest_wind';

export interface SoundPreset {
  id: FocusSoundType;
  name: string;
  emoji: string;
  description: string;
  category: string;
}

export const FOCUS_SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'rain',
    name: 'صوت المطر الهادئ',
    emoji: '🌧️',
    description: 'تساقط قطرات المطر اللطيفة لتهدئة الذهن وتصفية التفكير',
    category: 'طبيعة',
  },
  {
    id: 'storm',
    name: 'مطر غزير مع رعد بعيد',
    emoji: '⛈️',
    description: 'أجواء شتوية دافئة تعزز الانغماس التام في المذاكرة',
    category: 'طبيعة',
  },
  {
    id: 'pink_noise',
    name: 'الضوضاء الوردية (Pink Noise)',
    emoji: '🌸',
    description: 'تردد 1/f مثبت علمياً لتحسين الذاكرة وتثبيت المعلومات',
    category: 'ترددات التركيز',
  },
  {
    id: 'white_noise',
    name: 'الضوضاء البيضاء (White Noise)',
    emoji: '📻',
    description: 'عزل تام للضوضاء الخارجية والأصوات المشتتة في الغرفة',
    category: 'عزل وتشتت',
  },
  {
    id: 'ocean',
    name: 'أمواج البحر الهادئة',
    emoji: '🌊',
    description: 'مد وجزر متوازن يساعد على التنفس العميق والهدوء',
    category: 'طبيعة',
  },
  {
    id: 'alpha_waves',
    name: 'موجات ألفا 432Hz (تركيز عميق)',
    emoji: '🧘',
    description: 'نغمات ثنائية تحفز حالة الاستغراق العقلي (Flow State)',
    category: 'ترددات التركيز',
  },
  {
    id: 'forest_wind',
    name: 'نسيم الغابة وحفيف الأشجار',
    emoji: '🌲',
    description: 'هواء نقي ورياح خفيفة لإنعاش الذهن أثناء الحل الطويل',
    category: 'طبيعة',
  },
];

class FocusAudioEngine {
  private ctx: AudioContext | null = null;
  private currentType: FocusSoundType = 'none';
  private masterGain: GainNode | null = null;
  private volume: number = 0.5;
  private activeNodes: Array<{ stop?: () => void; disconnect: () => void }> = [];
  private intervalIds: number[] = [];
  private analyser: AnalyserNode | null = null;

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentSound(): FocusSoundType {
    return this.currentType;
  }

  public isPlaying(): boolean {
    return this.currentType !== 'none';
  }

  public stop() {
    this.currentType = 'none';
    this.intervalIds.forEach((id) => clearInterval(id));
    this.intervalIds = [];

    for (const node of this.activeNodes) {
      try {
        if (typeof node.stop === 'function') {
          node.stop();
        }
        node.disconnect();
      } catch (e) {}
    }
    this.activeNodes = [];
  }

  public play(type: FocusSoundType) {
    this.stop();
    if (type === 'none') return;

    try {
      const ctx = this.getContext();
      this.currentType = type;

      // Master gain node
      const master = ctx.createGain();
      master.gain.setValueAtTime(this.volume, ctx.currentTime);

      // Analyser for visualizer
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      master.connect(analyser);
      analyser.connect(ctx.destination);

      this.masterGain = master;
      this.analyser = analyser;

      switch (type) {
        case 'rain':
          this.synthesizeRain(ctx, master);
          break;
        case 'storm':
          this.synthesizeStorm(ctx, master);
          break;
        case 'pink_noise':
          this.synthesizePinkNoise(ctx, master);
          break;
        case 'white_noise':
          this.synthesizeWhiteNoise(ctx, master);
          break;
        case 'ocean':
          this.synthesizeOcean(ctx, master);
          break;
        case 'alpha_waves':
          this.synthesizeAlphaWaves(ctx, master);
          break;
        case 'forest_wind':
          this.synthesizeForestWind(ctx, master);
          break;
      }
    } catch (e) {
      console.warn('Audio synthesis initialized with error:', e);
    }
  }

  // 1. Rain Synthesizer
  private synthesizeRain(ctx: AudioContext, destination: GainNode) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 2.8;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.28, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    noiseSource.start();
    this.activeNodes.push(noiseSource, filter, gain);

    // Random droplet pings
    const interval = window.setInterval(() => {
      if (this.currentType !== 'rain') return;
      if (Math.random() > 0.4) {
        try {
          const osc = ctx.createOscillator();
          const dropGain = ctx.createGain();
          const freq = 1200 + Math.random() * 1400;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

          dropGain.gain.setValueAtTime(0.04 * Math.random(), ctx.currentTime);
          dropGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

          osc.connect(dropGain);
          dropGain.connect(destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.08);
        } catch (e) {}
      }
    }, 280);

    this.intervalIds.push(interval);
  }

  // 2. Storm Synthesizer
  private synthesizeStorm(ctx: AudioContext, destination: GainNode) {
    this.synthesizeRain(ctx, destination);

    // Occasional low rumbling thunder
    const thunderInterval = window.setInterval(() => {
      if (this.currentType !== 'storm') return;
      if (Math.random() > 0.65) {
        try {
          const thunderOsc = ctx.createOscillator();
          const thunderGain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(140, ctx.currentTime);

          thunderOsc.type = 'triangle';
          thunderOsc.frequency.setValueAtTime(55, ctx.currentTime);
          thunderOsc.frequency.linearRampToValueAtTime(35, ctx.currentTime + 2.5);

          thunderGain.gain.setValueAtTime(0.001, ctx.currentTime);
          thunderGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.6);
          thunderGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);

          thunderOsc.connect(filter);
          filter.connect(thunderGain);
          thunderGain.connect(destination);

          thunderOsc.start();
          thunderOsc.stop(ctx.currentTime + 3.0);
        } catch (e) {}
      }
    }, 4500);

    this.intervalIds.push(thunderInterval);
  }

  // 3. Pink Noise (1/f) Synthesizer - Paul Kellet's algorithm
  private synthesizePinkNoise(ctx: AudioContext, destination: GainNode) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);

    noiseSource.connect(gain);
    gain.connect(destination);

    noiseSource.start();
    this.activeNodes.push(noiseSource, gain);
  }

  // 4. White Noise Synthesizer
  private synthesizeWhiteNoise(ctx: AudioContext, destination: GainNode) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.12;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    noiseSource.start();
    this.activeNodes.push(noiseSource, filter, gain);
  }

  // 5. Ocean Waves Synthesizer (LFO tide modulation)
  private synthesizeOcean(ctx: AudioContext, destination: GainNode) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (last + 0.03 * white) / 1.03;
      last = data[i];
      data[i] *= 2.2;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const tideGain = ctx.createGain();
    tideGain.gain.setValueAtTime(0.08, ctx.currentTime);

    // LFO for wave rolling effect
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.14, ctx.currentTime); // 7 second wave cycle

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.18, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(tideGain.gain);

    noiseSource.connect(filter);
    filter.connect(tideGain);
    tideGain.connect(destination);

    noiseSource.start();
    lfo.start();
    this.activeNodes.push(noiseSource, filter, tideGain, lfo, lfoGain);
  }

  // 6. Alpha Waves 432Hz with 10Hz Binaural Flow
  private synthesizeAlphaWaves(ctx: AudioContext, destination: GainNode) {
    const baseFreq = 432;
    const alphaDiff = 10; // 10Hz Alpha range

    const oscLeft = ctx.createOscillator();
    const oscRight = ctx.createOscillator();
    const gain = ctx.createGain();

    oscLeft.type = 'sine';
    oscRight.type = 'sine';

    oscLeft.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    oscRight.frequency.setValueAtTime(baseFreq + alphaDiff, ctx.currentTime);

    gain.gain.setValueAtTime(0.16, ctx.currentTime);

    // Subtle warm overtone
    const oscWarm = ctx.createOscillator();
    oscWarm.type = 'sine';
    oscWarm.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime);
    const warmGain = ctx.createGain();
    warmGain.gain.setValueAtTime(0.04, ctx.currentTime);

    oscLeft.connect(gain);
    oscRight.connect(gain);
    oscWarm.connect(warmGain);
    warmGain.connect(gain);
    gain.connect(destination);

    oscLeft.start();
    oscRight.start();
    oscWarm.start();
    this.activeNodes.push(oscLeft, oscRight, oscWarm, gain, warmGain);
  }

  // 7. Forest Wind & Tree Rustle
  private synthesizeForestWind(ctx: AudioContext, destination: GainNode) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    // Slow wind frequency modulation
    const windLFO = ctx.createOscillator();
    windLFO.type = 'sine';
    windLFO.frequency.setValueAtTime(0.08, ctx.currentTime);
    const windLFOGain = ctx.createGain();
    windLFOGain.gain.setValueAtTime(180, ctx.currentTime);

    windLFO.connect(windLFOGain);
    windLFOGain.connect(filter.frequency);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.24, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    noiseSource.start();
    windLFO.start();
    this.activeNodes.push(noiseSource, filter, windLFO, windLFOGain, gain);
  }
}

export const focusAudioEngine = new FocusAudioEngine();
