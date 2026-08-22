/**
 * High-Fidelity Voice Assistant Engine
 * Automatically detects and prioritizes Neural & Natural speech models
 * (Microsoft Online Natural, Google Neural, Apple Natural, Wavenet)
 * for human-like conversational fluency similar to ChatGPT Voice.
 */

class VoiceAssistantEngine {
  constructor() {
    this.voices = [];
    this.isInitialized = false;
    this.currentUtterance = null;
    this.initVoices();
  }

  initVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices() || [];
      if (available.length > 0) {
        this.voices = available;
        this.isInitialized = true;
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  /**
   * Selects the highest quality natural neural voice for a persona or gender
   */
  getBestVoice(persona = 'general', gender = 'neutral') {
    if (!this.voices || this.voices.length === 0) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        this.voices = window.speechSynthesis.getVoices() || [];
      }
    }

    const voiceList = this.voices || [];
    if (voiceList.length === 0) return null;

    // High priority natural neural voice identifiers across Chrome, Edge, Safari, Windows, macOS
    const naturalPatterns = [
      /natural/i,
      /neural/i,
      /online/i,
      /wavenet/i,
      /google us english/i,
      /google uk english/i,
      /samantha/i,
      /siri/i,
      /victoria/i,
      /daniel/i,
      /guy/i,
      /jenny/i,
      /aria/i,
      /christopher/i,
    ];

    // Priority 1: Natural English voices
    const englishVoices = voiceList.filter((v) => v.lang.startsWith('en'));

    if (gender === 'female' || persona === 'maya' || ['yc', 'microsoft', 'meta'].includes(persona)) {
      const femaleNeural = englishVoices.find((v) =>
        naturalPatterns.some((p) => p.test(v.name)) && /female|jenny|aria|samantha|victoria|zira/i.test(v.name)
      );
      if (femaleNeural) return femaleNeural;

      const anyFemale = englishVoices.find((v) => /female|jenny|aria|samantha|victoria|zira/i.test(v.name));
      if (anyFemale) return anyFemale;
    } else {
      const maleNeural = englishVoices.find((v) =>
        naturalPatterns.some((p) => p.test(v.name)) && /male|guy|christopher|alex|daniel|george/i.test(v.name)
      );
      if (maleNeural) return maleNeural;

      const anyMale = englishVoices.find((v) => /male|guy|christopher|alex|daniel|george/i.test(v.name));
      if (anyMale) return anyMale;
    }

    // Fallback to any natural neural voice
    const anyNeural = englishVoices.find((v) => naturalPatterns.some((p) => p.test(v.name)));
    if (anyNeural) return anyNeural;

    // Fallback to default English voice
    return englishVoices.find((v) => v.default) || englishVoices[0] || voiceList[0];
  }

  /**
   * Speaks text with natural pacing, dynamic inflection, and callback listeners
   */
  speak(text, {
    persona = 'general',
    gender = 'neutral',
    rate = 1.0,
    pitch = 1.0,
    onStart = null,
    onEnd = null,
    onError = null,
  } = {}) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    this.stop();
    window.speechSynthesis.resume();

    // Clean markdown and code noise for crystal clear speech
    const cleanText = (text || '')
      .replace(/[*#`_~[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const selectedVoice = this.getBestVoice(persona, gender);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Fluid human parameters
    utterance.rate = Math.max(0.85, Math.min(1.2, rate));
    utterance.pitch = Math.max(0.9, Math.min(1.1, pitch));

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      this.currentUtterance = null;
      if (onError) onError(err);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }
}

export const voiceAssistant = new VoiceAssistantEngine();
export default voiceAssistant;
