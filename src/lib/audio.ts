let audioCtx: AudioContext | null = null;
let isMuted = false;

export const initAudio = () => {
  if (typeof window !== 'undefined' && !audioCtx) {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
};

export const toggleMute = () => {
  isMuted = !isMuted;
  return isMuted;
};

export const getIsMuted = () => isMuted;

// Play a synthesized tone
const playTone = (freq: number, type: OscillatorType, duration: number, vol = 0.1) => {
  if (isMuted || !audioCtx) return;
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  // Envelope to prevent clicking
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

export const playPop = () => {
  playTone(800, 'sine', 0.1, 0.05);
};

export const playDing = () => {
  // A pleasant success chord (C E G C)
  playTone(523.25, 'sine', 0.5, 0.1); // C5
  playTone(659.25, 'sine', 0.5, 0.08); // E5
  playTone(783.99, 'sine', 0.5, 0.06); // G5
  setTimeout(() => playTone(1046.50, 'sine', 0.6, 0.1), 100); // C6 slightly delayed
};

export const playError = () => {
  // A low, mild error buzz
  playTone(150, 'sawtooth', 0.3, 0.05);
  setTimeout(() => playTone(120, 'sawtooth', 0.4, 0.05), 150);
};

export const playClick = () => {
  playTone(400, 'triangle', 0.05, 0.02);
};
