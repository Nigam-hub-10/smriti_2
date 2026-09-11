/* =========================================================
   Smriti - Speech & Voice Assistance Helper
   Uses Web Speech API (speechSynthesis) with bilingual support
   for English (en-US/en-GB) and Hindi (hi-IN).
   Includes automatic phonetic transliteration fallback if 
   the user's OS does not have a native Hindi voice pack installed.
   ========================================================= */

class SpeechHelper {
  constructor() {
    this.synth = window.speechSynthesis;
    this.enabled = true;
    this.enVoice = null;
    this.hiVoice = null;
    this.inEnVoice = null;
    this.hasNativeHindi = false;
    this.initVoices();

    // Auto-resume speech synthesis if suspended by browser
    if (typeof window !== 'undefined') {
      const resumeAudio = () => {
        if (this.synth && this.synth.paused) {
          this.synth.resume();
        }
      };
      window.addEventListener('click', resumeAudio);
      window.addEventListener('touchstart', resumeAudio);
    }
  }

  initVoices() {
    if (!this.synth) return;
    const loadVoices = () => {
      const voices = this.synth.getVoices() || [];
      if (!voices.length) return;

      // Real Hindi voice detection (Swara, Hemant, Kalpana, Google हिन्दी, hi-IN)
      this.hiVoice = voices.find(v => {
        const l = (v.lang || '').toLowerCase().replace('_', '-');
        const n = (v.name || '').toLowerCase();
        return l.startsWith('hi') || n.includes('hindi') || n.includes('हिन्दी') || n.includes('swara') || n.includes('madhur') || n.includes('hemant') || n.includes('kalpana');
      }) || null;

      this.hasNativeHindi = !!this.hiVoice;

      // Indian English voice (e.g. Microsoft Heera, en-IN)
      this.inEnVoice = voices.find(v => {
        const l = (v.lang || '').toLowerCase().replace('_', '-');
        return l.includes('in') && l.startsWith('en');
      }) || null;

      // Natural English voice
      this.enVoice = voices.find(v => {
        const l = (v.lang || '').toLowerCase();
        const n = (v.name || '').toLowerCase();
        return l.startsWith('en') && (n.includes('natural') || n.includes('google') || n.includes('samantha') || n.includes('david') || n.includes('zira') || n.includes('heera'));
      }) || voices.find(v => (v.lang || '').toLowerCase().startsWith('en')) || voices[0] || null;
    };

    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }

  toPhoneticHindi(text) {
    if (!text) return '';
    // High-frequency curated phrase replacements for natural prosody
    const phrases = [
      [/नमस्ते/g, 'Namaste'],
      [/प्रणाम/g, 'Pranaam'],
      [/सुप्रभात/g, 'Suprabhat'],
      [/शुभ प्रभात/g, 'Shubh Prabhat'],
      [/शुभ दोपहर/g, 'Shubh Dopahar'],
      [/शुभ संध्या/g, 'Shubh Sandhya'],
      [/स्मृति/g, 'Smriti'],
      [/एआई/g, 'AI'],
      [/साथी/g, 'saathi'],
      [/सहायता/g, 'sahayata'],
      [/देखभालकर्ता/g, 'caretaker'],
      [/डॉक्टर/g, 'Doctor'],
      [/कॉल/g, 'call'],
      [/करें/g, 'karein'],
      [/करो/g, 'karo'],
      [/बगीचा/g, 'bageecha'],
      [/फूलों/g, 'phoolon'],
      [/शांत/g, 'shaant'],
      [/सुरक्षित/g, 'surakshit'],
      [/चिंता/g, 'chinta'],
      [/घर/g, 'ghar'],
      [/तारीख/g, 'tareekh'],
      [/समय/g, 'samay'],
      [/दिन/g, 'din'],
      [/महसूस/g, 'mehsoos'],
      [/खुश/g, 'khush'],
      [/थका/g, 'thaka'],
      [/सामान्य/g, 'saamanya'],
      [/धन्यवाद/g, 'dhanyavaad'],
      [/साझा/g, 'saajha'],
      [/हाँ/g, 'haan'],
      [/नहीं/g, 'nahin'],
      [/आप/g, 'aap'],
      [/मैं/g, 'main'],
      [/हैं/g, 'hain'],
      [/हूँ/g, 'hoon'],
      [/है/g, 'hai'],
      [/का/g, 'ka'],
      [/की/g, 'kee'],
      [/के/g, 'ke'],
      [/को/g, 'ko'],
      [/से/g, 'se'],
      [/में/g, 'mein'],
      [/पर/g, 'par'],
      [/लिए/g, 'liye'],
      [/बहुत/g, 'bahut'],
      [/अच्छा/g, 'achha'],
      [/पानी/g, 'paani'],
      [/चाय/g, 'chaay'],
      [/दवा/g, 'dawa']
    ];

    let result = text;
    for (const [re, rep] of phrases) {
      result = result.replace(re, rep);
    }

    const charMap = {
      'अ':'a','आ':'aa','इ':'i','ई':'ee','उ':'u','ऊ':'oo','ए':'e','ऐ':'ai','ओ':'o','औ':'au',
      'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ng',
      'च':'ch','छ':'chh','ज':'j','झ':'jh','ञ':'ny',
      'ट':'t','ठ':'th','ड':'d','ढ':'dh','ण':'n',
      'त':'t','थ':'th','द':'d','ध':'dh','न':'n',
      'प':'p','फ':'ph','ब':'b','भ':'bh','म':'m',
      'य':'y','र':'r','ल':'l','व':'v','श':'sh','ष':'sh','स':'s','ह':'h',
      'ा':'aa','ि':'i','ी':'ee','ु':'u','ू':'oo','े':'e','ै':'ai','ो':'o','ौ':'au','्':'',
      'ं':'n','ः':'h','ँ':'n','़':'','।':'.'
    };

    return result.split('').map(c => charMap[c] !== undefined ? charMap[c] : c).join('');
  }

  speak(text, rate = 0.88, pitch = 1.0) {
    if (!this.synth || !this.enabled || !text) return;

    // Resume synth if browser suspended it
    if (this.synth.paused) {
      this.synth.resume();
    }
    this.synth.cancel();

    const isHindi = window.smritiI18n && window.smritiI18n.getLanguage() === 'hi';

    // If Hindi mode is active and we have a native Hindi voice:
    if (isHindi && this.hiVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.hiVoice.lang || 'hi-IN';
      utterance.voice = this.hiVoice;
      utterance.rate = rate;
      utterance.pitch = pitch;

      // If native Hindi voice encounters any synthesis issue, fallback to phonetic voice
      utterance.onerror = (e) => {
        console.warn('Native Hindi voice error, falling back to phonetic voice:', e);
        this.speakPhonetic(text, rate, pitch);
      };

      this.synth.speak(utterance);
    } else if (isHindi && !this.hiVoice) {
      // No native Hindi voice installed on OS -> use clear phonetic speech
      this.speakPhonetic(text, rate, pitch);
    } else {
      // English Mode
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      if (this.enVoice) utterance.voice = this.enVoice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      this.synth.speak(utterance);
    }
  }

  speakPhonetic(text, rate = 0.88, pitch = 1.0) {
    const phoneticText = this.toPhoneticHindi(text);
    const utterance = new SpeechSynthesisUtterance(phoneticText);
    utterance.lang = this.inEnVoice ? 'en-IN' : 'en-US';
    if (this.inEnVoice) {
      utterance.voice = this.inEnVoice;
    } else if (this.enVoice) {
      utterance.voice = this.enVoice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    this.synth.speak(utterance);
  }

  toggleVoice() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.synth) {
      this.synth.cancel();
    }
    return this.enabled;
  }
}

window.smritiSpeech = new SpeechHelper();
