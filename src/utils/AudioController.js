class AudioController {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.droneGain = null;
    this.initialized = false;
    this.isMuted = true;
  }

  init() {
    if (this.initialized) return;
    
    // Initialize Web Audio API
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0; // Start muted
    
    // Create ambient drone (Deep cinematic hum)
    this.droneGain = this.ctx.createGain();
    this.droneGain.connect(this.masterGain);
    this.droneGain.gain.value = 0.15;

    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.value = 55; // Low A
    this.droneOsc1.connect(this.droneGain);
    this.droneOsc1.start();

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.value = 110; // Octave higher
    
    // Add slow LFO to drone 2 for a "breathing" effect
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 5;
    lfo.connect(lfoGain);
    lfoGain.connect(this.droneOsc2.frequency);
    lfo.start();

    this.droneOsc2.connect(this.droneGain);
    this.droneOsc2.start();

    this.initialized = true;
  }

  toggleMute() {
    if (!this.initialized) this.init();
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    
    // Smoothly ramp volume
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 1, now + 1.0);
    
    return !this.isMuted;
  }

  playHoverSound() {
    if (!this.initialized || this.isMuted) return;
    
    const now = this.ctx.currentTime;
    
    // Create a high-tech "blip" sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + 0.1);
  }
}

export const audioController = new AudioController();
