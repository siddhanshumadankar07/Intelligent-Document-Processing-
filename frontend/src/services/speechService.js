/**
 * Web Speech API wrapper for speech recognition and speech synthesis
 */

class SpeechService {
  constructor() {
    this.recognition = null;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isListening = false;
    this.initRecognition();
  }

  initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  isSpeechSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  isSynthesisSupported() {
    return !!(typeof window !== 'undefined' && window.speechSynthesis);
  }

  startListening({ onResult, onError, onEnd, lang = 'en-US' }) {
    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      onError?.('Speech recognition is not supported in this browser.');
      return;
    }

    this.recognition.lang = lang;
    this.isListening = true;

    this.recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onResult?.(transcript, event.results[0].isFinal);
    };

    this.recognition.onerror = (err) => {
      this.isListening = false;
      onError?.(err.error || 'Speech recognition error');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd?.();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Speech recognition already active or error starting:', e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (_) {}
      this.isListening = false;
    }
  }

  speak(text, { voiceName = null, rate = 1.0, pitch = 1.0, lang = 'en-US', onEnd = null } = {}) {
    if (!this.synth) return;

    this.stopSpeaking();

    // Clean markdown symbols from spoken text
    const cleanText = text
      .replace(/[*#_`~]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/•/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = Math.max(0.7, Math.min(1.5, rate));
    utterance.pitch = pitch;
    utterance.lang = lang;

    if (voiceName) {
      const voices = this.synth.getVoices();
      const selected = voices.find((v) => v.name.includes(voiceName) || v.lang === lang);
      if (selected) utterance.voice = selected;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  getVoices() {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }
}

export const speechService = new SpeechService();
