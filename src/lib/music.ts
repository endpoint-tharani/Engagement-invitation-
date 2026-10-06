/**
 * Background music.
 * Plays the file named in invitation.music.file (from src/assets/music/), or —
 * when none is set — a soft music-box rendition of Pachelbel's Canon in D
 * (public domain), synthesised with the Web Audio API so no file is needed.
 */

export interface MusicPlayer {
  play(): Promise<void>;
  /** `immediate` skips the fade-out (used when the tab is hidden). */
  pause(immediate?: boolean): void;
}

const files = import.meta.glob<string>("../assets/music/*.{mp3,m4a,ogg,wav,aac}", {
  eager: true,
  query: "?url",
  import: "default",
});

export function createMusicPlayer(file: string, volume: number): MusicPlayer {
  const src = file ? files[`../assets/music/${file}`] : undefined;
  if (file && !src && import.meta.env.DEV) {
    console.warn(`[invitation] Music "${file}" was not found in src/assets/music/ — using the built-in melody`);
  }
  return src ? new FilePlayer(src, volume) : new MusicBoxPlayer(volume);
}

/* ───────────────────────── audio file ───────────────────────── */

class FilePlayer implements MusicPlayer {
  private audio: HTMLAudioElement;
  private frame = 0;
  private volume: number;

  constructor(src: string, volume: number) {
    this.volume = volume;
    this.audio = new Audio(src);
    this.audio.loop = true;
    this.audio.preload = "none";
    this.audio.volume = 0;
  }

  async play() {
    cancelAnimationFrame(this.frame);
    await this.audio.play();
    this.fadeTo(this.volume, 2200);
  }

  pause(immediate = false) {
    if (immediate) {
      cancelAnimationFrame(this.frame);
      this.audio.pause();
      return;
    }
    this.fadeTo(0, 600, () => this.audio.pause());
  }

  private fadeTo(target: number, ms: number, done?: () => void) {
    cancelAnimationFrame(this.frame);
    const from = this.audio.volume;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / ms);
      this.audio.volume = from + (target - from) * progress;
      if (progress < 1) this.frame = requestAnimationFrame(step);
      else done?.();
    };
    this.frame = requestAnimationFrame(step);
  }
}

/* ───────────────────── synthesised music box ───────────────────── */

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

const EIGHTH = 60 / 76 / 2; // 76 bpm
const STEPS_PER_CHORD = 4;

// Canon in D: D – A – Bm – F#m – G – D – G – A
const CHORDS = [
  { bass: 50, notes: [62, 66, 69] },
  { bass: 45, notes: [61, 64, 69] },
  { bass: 47, notes: [62, 66, 71] },
  { bass: 42, notes: [61, 66, 69] },
  { bass: 43, notes: [62, 67, 71] },
  { bass: 50, notes: [62, 66, 69] },
  { bass: 43, notes: [62, 67, 71] },
  { bass: 45, notes: [61, 64, 69] },
];

// Melody per chord: [note on beat 1, optional note on beat 2]
const PHRASES: { melody: (readonly number[])[]; arpeggio: boolean }[] = [
  { melody: [[78], [76], [74], [73], [71], [69], [71], [73]], arpeggio: true },
  { melody: [[86], [85], [83], [81], [79], [78], [79], [76]], arpeggio: true },
  {
    melody: [[78, 81], [76, 73], [74, 78], [73, 69], [71, 74], [69, 74], [71, 67], [73, 76]],
    arpeggio: true,
  },
  { melody: [[78], [76], [74], [73], [71], [69], [71], [73]], arpeggio: false },
];

const STEPS_PER_PHRASE = CHORDS.length * STEPS_PER_CHORD;
const TOTAL_STEPS = STEPS_PER_PHRASE * PHRASES.length;
const ARPEGGIO = [0, 1, 2, 1];

class MusicBoxPlayer implements MusicPlayer {
  private ctx?: AudioContext;
  private master?: GainNode;
  private bus?: GainNode;
  private padBus?: GainNode;
  private timer = 0;
  private suspendTimer = 0;
  private step = 0;
  private nextTime = 0;
  private volume: number;

  constructor(volume: number) {
    this.volume = volume;
  }

  async play() {
    window.clearTimeout(this.suspendTimer);
    // Must be created synchronously inside the user's click for mobile browsers.
    const ctx = this.ctx ?? this.setup();
    if (ctx.state !== "running") await ctx.resume();

    const now = ctx.currentTime;
    const gain = this.master!.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(this.volume, now + 2.5);

    if (this.nextTime < now) this.nextTime = now + 0.12;
    if (!this.timer) {
      this.timer = window.setInterval(this.schedule, 60);
      this.schedule();
    }
  }

  pause(immediate = false) {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    window.clearInterval(this.timer);
    this.timer = 0;

    const fade = immediate ? 0.05 : 0.6;
    const now = ctx.currentTime;
    const gain = this.master.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(0, now + fade);
    this.suspendTimer = window.setTimeout(() => void ctx.suspend(), fade * 1000 + 50);
  }

  private setup() {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.ratio.value = 3;
    compressor.connect(ctx.destination);

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(compressor);

    // Soft hall reverb from a generated impulse response
    const reverb = ctx.createConvolver();
    const length = Math.floor(ctx.sampleRate * 3.4);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3.4;
    }
    reverb.buffer = impulse;
    const wet = ctx.createGain();
    wet.gain.value = 0.42;
    reverb.connect(wet).connect(master);

    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 3400;
    const dry = ctx.createGain();
    dry.gain.value = 0.75;
    tone.connect(dry).connect(master);
    tone.connect(reverb);

    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 900;
    padFilter.connect(master);
    padFilter.connect(reverb);

    const bus = ctx.createGain();
    bus.connect(tone);
    const padBus = ctx.createGain();
    padBus.connect(padFilter);

    Object.assign(this, { ctx, master, bus, padBus });
    return ctx;
  }

  private schedule = () => {
    const ctx = this.ctx!;
    if (this.nextTime < ctx.currentTime) this.nextTime = ctx.currentTime + 0.05;
    while (this.nextTime < ctx.currentTime + 0.3) {
      this.playStep(this.step, this.nextTime);
      this.nextTime += EIGHTH;
      this.step = (this.step + 1) % TOTAL_STEPS;
    }
  };

  private playStep(step: number, time: number) {
    const phrase = PHRASES[Math.floor(step / STEPS_PER_PHRASE)];
    const inPhrase = step % STEPS_PER_PHRASE;
    const chordIndex = Math.floor(inPhrase / STEPS_PER_CHORD);
    const beat = inPhrase % STEPS_PER_CHORD;
    const chord = CHORDS[chordIndex];
    const melody = phrase.melody[chordIndex];
    const human = () => time + Math.random() * 0.012;

    if (beat === 0) {
      this.bell(chord.bass, human(), 0.13, 3.2);
      this.bell(chord.bass + 12, human(), 0.045, 2.4);
      this.pad(chord.notes, time, EIGHTH * STEPS_PER_CHORD);
      this.bell(melody[0], human(), 0.2, 2.8);
    }
    if (beat === 2 && melody[1]) this.bell(melody[1], human(), 0.17, 2.4);
    if (phrase.arpeggio) this.bell(chord.notes[ARPEGGIO[beat]], human(), beat === 0 ? 0.05 : 0.07, 1.7);
  }

  /** Music-box tine: a sine with a couple of quickly fading overtones. */
  private bell(midi: number, time: number, gain: number, decay: number) {
    const ctx = this.ctx!;
    const frequency = hz(midi);
    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(gain, time + 0.006);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + decay);
    envelope.connect(this.bus!);

    for (const [ratio, level, life] of [
      [1, 1, 1],
      [2, 0.3, 0.5],
      [4.02, 0.1, 0.2],
    ]) {
      const osc = ctx.createOscillator();
      osc.frequency.value = frequency * ratio;
      const partial = ctx.createGain();
      partial.gain.setValueAtTime(level, time);
      partial.gain.exponentialRampToValueAtTime(0.0001, time + decay * life);
      osc.connect(partial).connect(envelope);
      osc.start(time);
      osc.stop(time + decay + 0.05);
    }
  }

  /** Warm sustained chord underneath. */
  private pad(notes: number[], time: number, duration: number) {
    const ctx = this.ctx!;
    for (const midi of notes) {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = hz(midi - 12);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(0.028, time + 0.6);
      gain.gain.setValueAtTime(0.028, time + duration);
      gain.gain.linearRampToValueAtTime(0.0001, time + duration + 0.9);
      osc.connect(gain).connect(this.padBus!);
      osc.start(time);
      osc.stop(time + duration + 1);
    }
  }
}
