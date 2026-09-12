/* =========================================================
   Smriti - Speech & Voice Assistance Helper
   Uses Web Speech API (speechSynthesis) with bilingual support
   for English (en-US/en-GB) and Hindi (hi-IN).
   Includes automatic phonetic transliteration fallback if 
   the user's OS does not have a native Hindi voice pack installed.
   ========================================================= */

class SpeechHelper {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.enabled = true;
    this.enVoice = null;
    this.hiVoice = null;
    this.inEnVoice = null;
    this.hasNativeHindi = false;

    // Sarvam AI Indic Voice Engine State
    this.useSarvam = true;
    this.sarvamActive = false;
    this.sarvamSpeaker = localStorage.getItem('smriti_sarvam_speaker') || 'priya';
    this.sarvamApiKey = localStorage.getItem('smriti_sarvam_key') || '';
    this.currentAudio = null;
    this.isSpeaking = false;

    this.initVoices();
    this.checkSarvamStatus();

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

  async checkSarvamStatus() {
    try {
      const res = await fetch('/api/sarvam/config');
      if (res.ok) {
        const data = await res.json();
        if (data.has_key) {
          this.sarvamActive = true;
          this.sarvamSpeaker = data.speaker || this.sarvamSpeaker;
        } else if (this.sarvamApiKey) {
          // If key stored in local browser, sync to backend
          await this.saveSarvamConfig(this.sarvamApiKey, this.sarvamSpeaker);
        }
        window.dispatchEvent(new CustomEvent('sarvam:status', { 
          detail: { 
            hasKey: this.sarvamActive || !!this.sarvamApiKey, 
            maskedKey: data.masked_key || (this.sarvamApiKey ? this.sarvamApiKey.slice(0, 4) + '...' + this.sarvamApiKey.slice(-4) : ''),
            speaker: this.sarvamSpeaker 
          } 
        }));
      }
    } catch (e) {
      console.warn('Sarvam config check notice:', e);
    }
  }

  async saveSarvamConfig(apiKey, speaker = 'meera') {
    if (apiKey) {
      this.sarvamApiKey = apiKey.trim();
      localStorage.setItem('smriti_sarvam_key', this.sarvamApiKey);
    }
    if (speaker) {
      this.sarvamSpeaker = speaker.trim();
      localStorage.setItem('smriti_sarvam_speaker', this.sarvamSpeaker);
    }

    try {
      const res = await fetch('/api/sarvam/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: this.sarvamApiKey, speaker: this.sarvamSpeaker })
      });
      if (res.ok) {
        const data = await res.json();
        this.sarvamActive = data.has_key;
        window.dispatchEvent(new CustomEvent('sarvam:status', { 
          detail: { 
            hasKey: data.has_key, 
            maskedKey: data.masked_key, 
            speaker: this.sarvamSpeaker 
          } 
        }));
        return { success: true, maskedKey: data.masked_key };
      }
    } catch (e) {
      console.error('Failed to save Sarvam config:', e);
    }
    return { success: false };
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

  stopAllAudio() {
    this.currentSpeechId = (this.currentSpeechId || 0) + 1;
    if (this.abortController) {
      try { this.abortController.abort(); } catch(e) {}
      this.abortController = null;
    }
    if (this.currentAudio) {
      try {
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
      } catch (e) {}
      this.currentAudio = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.isSpeaking = false;
    window.dispatchEvent(new CustomEvent('speech:end'));
  }

  async speak(text, rate = 0.88, pitch = 1.0) {
    if (!this.enabled || !text) return;

    // Immediately cancel and stop any previous playing or pending audio
    this.stopAllAudio();
    const mySpeechId = ++this.currentSpeechId;

    // First attempt Sarvam AI if enabled and key is available
    if (this.useSarvam && (this.sarvamActive || this.sarvamApiKey)) {
      const sarvamSuccess = await this.speakSarvam(text, null, null, mySpeechId);
      if (sarvamSuccess) {
        return;
      }
    }

    // Seamless fallback to browser Web Speech API if this request is still current
    if (mySpeechId === this.currentSpeechId) {
      this.speakWebSpeech(text, rate, pitch, mySpeechId);
    }
  }

  async speakSarvam(text, langCode = null, speaker = null, mySpeechId = null) {
    if (!mySpeechId) {
      this.stopAllAudio();
      mySpeechId = ++this.currentSpeechId;
    }

    if (!speaker) {
      speaker = this.sarvamSpeaker || 'priya';
    }

    if (!langCode) {
      const isHindiMode = window.smritiI18n && window.smritiI18n.getLanguage() === 'hi';
      const hasDevanagari = any => /[\u0900-\u097F]/.test(any);
      langCode = (isHindiMode || hasDevanagari(text)) ? 'hi-IN' : 'en-IN';
    }

    try {
      this.abortController = new AbortController();

      window.dispatchEvent(new CustomEvent('speech:start', { 
        detail: { provider: 'sarvam', speaker, text } 
      }));

      const payload = {
        text: text.slice(0, 500),
        language_code: langCode,
        speaker: speaker
      };
      if (this.sarvamApiKey) {
        payload.api_key = this.sarvamApiKey;
      }

      const res = await fetch('/api/sarvam/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: this.abortController.signal
      });

      // If user performed another action or another speech was queued while fetching, abort immediately!
      if (mySpeechId !== this.currentSpeechId) {
        return false;
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        console.warn('Sarvam AI response not ok:', errJson);
        window.dispatchEvent(new CustomEvent('speech:end'));
        return false;
      }

      const data = await res.json();
      if (mySpeechId !== this.currentSpeechId) {
        return false;
      }

      if (data.status === 'success' && data.audio_base64) {
        // Double check no other audio or synth is active
        if (this.currentAudio) {
          try {
            this.currentAudio.onended = null;
            this.currentAudio.onerror = null;
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio.src = '';
          } catch(e) {}
          this.currentAudio = null;
        }
        if (this.synth) {
          try { this.synth.cancel(); } catch(e) {}
        }

        if (mySpeechId !== this.currentSpeechId) {
          return false;
        }

        const audio = new Audio('data:audio/wav;base64,' + data.audio_base64);
        this.currentAudio = audio;
        this.isSpeaking = true;

        audio.onended = () => {
          if (mySpeechId === this.currentSpeechId) {
            this.isSpeaking = false;
            this.currentAudio = null;
            window.dispatchEvent(new CustomEvent('speech:end'));
          }
        };

        audio.onerror = (err) => {
          console.error('Sarvam audio playback error:', err);
          if (mySpeechId === this.currentSpeechId) {
            this.isSpeaking = false;
            this.currentAudio = null;
            window.dispatchEvent(new CustomEvent('speech:end'));
          }
        };

        try {
          await audio.play();
          return true;
        } catch (playErr) {
          if (mySpeechId === this.currentSpeechId) {
            this.isSpeaking = false;
            this.currentAudio = null;
          }
          return false;
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.warn('Sarvam AI voice call failed, switching to local voice:', e);
      }
      if (mySpeechId === this.currentSpeechId) {
        window.dispatchEvent(new CustomEvent('speech:end'));
      }
    }
    return false;
  }

  speakWebSpeech(text, rate = 0.88, pitch = 1.0, mySpeechId = null) {
    if (!this.synth || !this.enabled || !text) return;

    if (mySpeechId && mySpeechId !== this.currentSpeechId) {
      return;
    }

    // Forcefully stop any HTML audio before web speech starts
    if (this.currentAudio) {
      try {
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
      } catch (e) {}
      this.currentAudio = null;
    }

    try {
      this.synth.cancel();
      if (this.synth.paused) {
        this.synth.resume();
      }
    } catch (e) {}

    const isHindi = window.smritiI18n && window.smritiI18n.getLanguage() === 'hi';
    window.dispatchEvent(new CustomEvent('speech:start', { 
      detail: { provider: 'webspeech', lang: isHindi ? 'hi' : 'en', text } 
    }));

    if (isHindi && this.hiVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.hiVoice.lang || 'hi-IN';
      utterance.voice = this.hiVoice;
      utterance.rate = rate;
      utterance.pitch = pitch;

      utterance.onend = () => {
        if (mySpeechId === this.currentSpeechId || !mySpeechId) {
          this.isSpeaking = false;
          window.dispatchEvent(new CustomEvent('speech:end'));
        }
      };
      utterance.onerror = (e) => {
        console.warn('Native Hindi voice error, falling back to phonetic voice:', e);
        if (mySpeechId === this.currentSpeechId || !mySpeechId) {
          this.speakPhonetic(text, rate, pitch, mySpeechId);
        }
      };

      this.isSpeaking = true;
      this.synth.speak(utterance);
    } else if (isHindi && !this.hiVoice) {
      this.speakPhonetic(text, rate, pitch, mySpeechId);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      if (this.enVoice) utterance.voice = this.enVoice;
      utterance.rate = rate;
      utterance.pitch = pitch;

      utterance.onend = () => {
        if (mySpeechId === this.currentSpeechId || !mySpeechId) {
          this.isSpeaking = false;
          window.dispatchEvent(new CustomEvent('speech:end'));
        }
      };
      utterance.onerror = () => {
        if (mySpeechId === this.currentSpeechId || !mySpeechId) {
          this.isSpeaking = false;
          window.dispatchEvent(new CustomEvent('speech:end'));
        }
      };

      this.isSpeaking = true;
      this.synth.speak(utterance);
    }
  }

  speakPhonetic(text, rate = 0.88, pitch = 1.0, mySpeechId = null) {
    if (mySpeechId && mySpeechId !== this.currentSpeechId) return;
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

    utterance.onend = () => {
      if (mySpeechId === this.currentSpeechId || !mySpeechId) {
        this.isSpeaking = false;
        window.dispatchEvent(new CustomEvent('speech:end'));
      }
    };
    utterance.onerror = () => {
      if (mySpeechId === this.currentSpeechId || !mySpeechId) {
        this.isSpeaking = false;
        window.dispatchEvent(new CustomEvent('speech:end'));
      }
    };

    this.isSpeaking = true;
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
