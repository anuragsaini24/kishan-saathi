// Web Speech API wrapper for Hindi (hi-IN) and English (en-IN / en-US)
export class VoiceService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static recognition: any = null;

  static isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  static isSpeechSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  static speak(text: string, lang: 'hi' | 'en' = 'hi', onEnd?: () => void) {
    if (!this.synth) return;

    // Cancel ongoing speech
    this.synth.cancel();

    // Clean text of markdown characters
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // slightly slower for clarity for farmers
    utterance.pitch = 1.0;

    // Pick a good Hindi/Indian voice if available
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find((v) =>
      lang === 'hi'
        ? v.lang.includes('hi') || v.name.toLowerCase().includes('hindi')
        : v.lang.includes('en-IN') || v.name.toLowerCase().includes('india')
    );

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    this.synth.speak(utterance);
  }

  static stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  static createRecognition(
    lang: 'hi' | 'en' = 'hi',
    onResult: (text: string, isFinal: boolean) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ) {
    if (typeof window === 'undefined') return null;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      onError(new Error('Speech recognition is not supported in this browser.'));
      return null;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      onResult(finalTranscript || interimTranscript, Boolean(finalTranscript));
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition event error:', event.error);
      onError(event.error);
    };

    recognition.onend = () => {
      onEnd();
    };

    return recognition;
  }
}
