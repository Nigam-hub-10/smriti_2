/* =========================================================
   Smriti - Bilingual Translation & Internationalization (i18n)
   Supports English and Hindi (हिंदी) with dynamic DOM updates,
   Web Speech Hindi voice synthesis, and localized chatbot.
   ========================================================= */

const STORAGE_LANG_KEY = 'smriti_selected_language';

const TRANSLATIONS = {
  en: {
    // Header & Navigation
    brandTitle: "Smriti",
    brandSubtitle: "Dementia Care & Companion",
    navPatient: "Patient Mode",
    navCaregiver: "Caregiver Portal",
    navChatbot: "🤖 AI Companion",
    voiceOn: "🔊 Voice On",
    voiceOff: "🔇 Voice Off",
    contrast: "👁️ High Contrast",
    logout: "🚪 Log Out / Switch",

    // Role Selection Modal
    roleWelcomeTitle: "🌸 Welcome to Smriti",
    roleWelcomeSubtitle: "Please select who is using the application today:",
    rolePatientTitle: "I am the Patient",
    rolePatientDesc: "Play daily memory games & calming activities",
    roleCaregiverTitle: "I am the Caretaker",
    roleCaregiverDesc: "Passcode protected graphs & clinical logs",
    selectLanguagePrompt: "Language / भाषा:",

    // Patient View
    welcomeBack: "Welcome back, {name}!",
    patientHeroDesc: "Today is a fresh, beautiful day. Take your time and enjoy gentle activities created to keep your mind smiling and clear.",
    moodQuestion: "😊 How are you feeling right now?",
    readAloud: "🔊 Read Aloud",
    moodHappy: "Happy",
    moodCalm: "Peaceful",
    moodNeutral: "Just Okay",
    moodTired: "A Bit Tired",
    todayActivities: "🎯 Today's Gentle Activities",
    noTimers: "No timers • Relaxing & fun",

    // Games
    game1Title: "Daily Essentials Match",
    game1Desc: "Match familiar everyday household items. Gentle on memory, no time pressure.",
    game2Title: "Daily Routine Sequencing",
    game2Desc: "Order familiar steps of daily activities like brewing tea or watering plants.",
    game3Title: "Everyday Object Recognition",
    game3Desc: "Recognize essential items and what they are used for. Clear hints with voice.",
    game4Title: "Calming Focus Garden",
    game4Desc: "Gentle flower blossoming exercises to ground thoughts and ease wandering mind.",
    playActivity: "Play Activity",
    completed: "Completed Today",

    // Emergency Bar
    emergencyTitle: "Quick Help & Caregiver Contact",
    emergencyDesc: "Tap to connect instantly with your family or physician.",
    callCaretaker: "📞 Call Caretaker",
    callDoctor: "🩺 Call Doctor",

    // Caretaker Security Modal
    caregiverSecurityTitle: "🔒 Caregiver Security Access",
    enterPinPrompt: "Enter Caregiver Passcode to access patient score graphs, trends, and clinical notes.",
    incorrectPin: "⚠️ Incorrect passcode. Please try again or use the reset options below.",
    defaultPinHint: "💡 Default passcode: 1234",
    unlockBtn: "Unlock 🔓",
    changePinNav: "🔑 I know previous passcode • Change Passcode",
    forgotPinNav: "📱 Forgot Passcode? • Reset via Caretaker Phone",
    cancelBtn: "Cancel",

    // Change Passcode
    changePasscodeTitle: "🔑 Change Caregiver Passcode",
    changePasscodeDesc: "Enter your current passcode followed by your new passcode.",
    currentPinLabel: "Current Passcode *",
    newPinLabel: "New Passcode (4-8 digits) *",
    confirmPinLabel: "Confirm New Passcode *",
    savePasscodeBtn: "Save Passcode 💾",

    // Forgot Passcode
    resetPhoneTitle: "📱 Reset Passcode via Caretaker Phone",
    resetPhoneDesc: "Verify identity using the registered caretaker phone number.",
    enterPhoneLabel: "Enter Caretaker Phone Number *",
    sendCodeBtn: "Send Code 📲",
    codeSentTitle: "Code Sent to Caretaker Mobile",
    securityPolicyActive: "🔒 Security Policy Active: The verification code is strictly sent to the caretaker's mobile and is never revealed on this patient screen.",
    checkWhatsAppBtn: "💬 Check / Open Code on WhatsApp",
    enterOtpLabel: "Enter 4-Digit Code Received on Mobile *",
    resetUnlockBtn: "Reset & Unlock 🔓",

    // Caregiver Dashboard
    cgCognitiveTracking: "Cognitive Performance Tracking",
    cgCognitiveSubtitle: "Daily average score across all 4 memory and routine activities",
    cgExportCsv: "📊 Export Report (CSV)",
    cgSaveBackup: "💾 Save Backup",
    cgEditProfile: "✏️ Edit Profile & Caretaker Details",
    cgChangePasscodeBtn: "🔒 Change Passcode",
    cgLogoutBtn: "🚪 Log Out Caregiver Session",
    cgDailyActivityLog: "Daily Activity Log",
    cgCaregiverNotes: "Caregiver Notes & Clinical Observations",
    cgAddNoteBtn: "Add Caregiver Note",

    // New User Onboarding & Community Hub
    newUserRegisterBtn: "New User? Register Profile",
    communityHubBtn: "Contribute & Volunteer Hub",
    newUserHint: "First time here? Set up a new patient profile or share tips to support dementia families worldwide.",
    newUserModalTitle: "Register New Patient & Caretaker Profile",
    newUserModalSubtitle: "Personalized Setup for Fresh Cognitive Care Journey",
    step1Title: "Patient Info",
    step2Title: "Caretaker & PIN",
    step3Title: "Doctor & Preferences",
    nuStep1Header: "👤 Patient Personal Details",
    nuStep2Header: "🛡️ Caretaker Account & Passcode",
    nuStep3Header: "🩺 Clinic Contacts & Preferences",
    patientFullNameLabel: "Patient Full Name *",
    patientPreferredNameLabel: "Preferred Greeting Name *",
    patientAgeLabel: "Age (Years) *",
    patientConditionLabel: "Current Condition / Stage",
    patientComfortNotesLabel: "Comfort Notes, Hobbies & Likes",
    cgFullNameLabel: "Primary Caretaker Full Name *",
    cgRelationLabel: "Relationship to Patient *",
    cgPhoneLabel: "Emergency Phone Number *",
    cgPinLabel: "Caregiver Portal Passcode (4-8 digits) *",
    cgPinConfirmLabel: "Confirm Passcode *",
    docNameLabel: "Doctor / Clinic Name",
    docPhoneLabel: "Doctor Phone Number",
    homeAddressLabel: "Patient Home Address",
    languageChoiceLabel: "Language Preference / पसंदीदा भाषा",
    btnPrev: "← Previous",
    btnNext: "Next Step →",
    btnCompleteProfile: "Complete Setup & Begin Care 🌸",
    communityHubTitle: "Smriti Community & Contributor Hub",
    communityHubSubtitle: "Share Caregiving Insights, Add Memory Activities & Volunteer Support",
    tabCommunityFeed: "Community Insights",
    tabShareTip: "Share Caregiver Tip",
    tabSuggestGame: "Contribute Memory Activity",
    tabVolunteer: "Volunteer Support",
    insightsHeader: "Caregiver Community Knowledge Base",
    insightsSub: "Practical clinical tips & memory exercises shared by families and dementia specialists",
    btnShareNew: "Share Your Contribution",
    tipFormHeader: "💡 Share Practical Caregiving Insight",
    tipFormSub: "Share strategies that helped calm wandering, facilitate sleep, or make daily routines peaceful.",
    authorNameLabel: "Your Name *",
    authorRoleLabel: "Your Role",
    tipCategoryLabel: "Category",
    tipTitleLabel: "Insight Title *",
    tipContentLabel: "Your Practical Tip or Strategy *",
    gameFormHeader: "🎮 Contribute a Memory or Calming Exercise",
    gameFormSub: "Propose familiar everyday association games, song recall, or nostalgic touchpoints.",
    gameTitleLabel: "Activity Title *",
    gameCategoryLabel: "Cognitive Target",
    gameContentLabel: "Activity Description & Prompt Steps *",
    volunteerFormHeader: "🙋 Join as a Volunteer / Community Supporter",
    volunteerFormSub: "Offer companionship, daily check-in calls, or respite care assistance to families in need."
  },
  hi: {
    // Header & Navigation
    brandTitle: "स्मृति",
    brandSubtitle: "डिमेंशिया देखभाल और साथी",
    navPatient: "रोगी मोड",
    navCaregiver: "देखभालकर्ता पोर्टल",
    navChatbot: "🤖 एआई साथी",
    voiceOn: "🔊 आवाज़ चालू",
    voiceOff: "🔇 आवाज़ बंद",
    contrast: "👁️ उच्च कंट्रास्ट",
    logout: "🚪 लॉग आउट / बदलें",

    // Role Selection Modal
    roleWelcomeTitle: "🌸 स्मृति में आपका स्वागत है",
    roleWelcomeSubtitle: "कृपया चुनें कि आज इस ऐप का उपयोग कौन कर रहा है:",
    rolePatientTitle: "मैं रोगी हूँ",
    rolePatientDesc: "दैनिक याददाश्त खेल और शांत गतिविधियाँ खेलें",
    roleCaregiverTitle: "मैं देखभालकर्ता हूँ",
    roleCaregiverDesc: "पासकोड सुरक्षित प्रगति ग्राफ़ और नैदानिक रिकॉर्ड",
    selectLanguagePrompt: "भाषा चुनें / Language:",

    // Patient View
    welcomeBack: "पुनः स्वागत है, {name}!",
    patientHeroDesc: "आज का दिन बहुत सुंदर और शांत है। अपना समय लें और अपने मन को प्रसन्न और स्पष्ट रखने के लिए बनाई गई इन कोमल गतिविधियों का आनंद लें।",
    moodQuestion: "😊 आज आप इस समय कैसा महसूस कर रहे हैं?",
    readAloud: "🔊 बोलकर सुनाएं",
    moodHappy: "प्रसन्न",
    moodCalm: "शांत",
    moodNeutral: "सामान्य",
    moodTired: "थोड़ा थका हुआ",
    todayActivities: "🎯 आज की कोमल गतिविधियाँ",
    noTimers: "कोई समय सीमा नहीं • शांत और सुखद",

    // Games
    game1Title: "दैनिक आवश्यक वस्तुएं मिलान",
    game1Desc: "दैनिक घरेलू वस्तुओं के जोड़ों को पहचानें और मिलाएं। मन पर कोई दबाव नहीं।",
    game2Title: "दैनिक दिनचर्या क्रम",
    game2Desc: "दैनिक गतिविधियों (जैसे चाय बनाना या पौधे सींचना) के सही क्रम को सजाएं।",
    game3Title: "दैनिक वस्तु पहचान",
    game3Desc: "आवश्यक वस्तुओं और उनके उपयोग को पहचानें। बोलकर स्पष्ट संकेत उपलब्ध हैं।",
    game4Title: "शांत एकाग्रता बगीचा",
    game4Desc: "खिलते हुए सुंदर फूलों के साथ मन को शांत और एकाग्र करने की सुखद गतिविधि।",
    playActivity: "गतिविधि खेलें",
    completed: "आज पूर्ण हुआ",

    // Emergency Bar
    emergencyTitle: "त्वरित सहायता और संपर्क",
    emergencyDesc: "अपने परिवार या चिकित्सक से तुरंत संपर्क करने के लिए स्पर्श करें।",
    callCaretaker: "📞 देखभालकर्ता को कॉल करें",
    callDoctor: "🩺 डॉक्टर को कॉल करें",

    // Caretaker Security Modal
    caregiverSecurityTitle: "🔒 देखभालकर्ता सुरक्षा पहुंच",
    enterPinPrompt: "मरीज़ के स्कोर ग्राफ़, मानसिक रुझान और रिकॉर्ड देखने के लिए देखभालकर्ता पासकोड दर्ज करें।",
    incorrectPin: "⚠️ गलत पासकोड। कृपया पुनः प्रयास करें या नीचे दिए गए रीसेट विकल्प का उपयोग करें।",
    defaultPinHint: "💡 डिफ़ॉल्ट पासकोड: 1234",
    unlockBtn: "अनलॉक करें 🔓",
    changePinNav: "🔑 मुझे पिछला पासकोड याद है • पासकोड बदलें",
    forgotPinNav: "📱 पासकोड भूल गए? • फ़ोन नंबर से रीसेट करें",
    cancelBtn: "रद्द करें",

    // Change Passcode
    changePasscodeTitle: "🔑 देखभालकर्ता पासकोड बदलें",
    changePasscodeDesc: "अपना वर्तमान पासकोड और नया 4-अंकीय पासकोड दर्ज करें।",
    currentPinLabel: "वर्तमान पासकोड *",
    newPinLabel: "नया पासकोड (4-8 अंक) *",
    confirmPinLabel: "नए पासकोड की पुष्टि करें *",
    savePasscodeBtn: "पासकोड सहेजें 💾",

    // Forgot Passcode
    resetPhoneTitle: "📱 देखभालकर्ता फ़ोन से पासकोड रीसेट",
    resetPhoneDesc: "पंजीकृत देखभालकर्ता मोबाइल नंबर का उपयोग करके पहचान सत्यापित करें।",
    enterPhoneLabel: "देखभालकर्ता फ़ोन नंबर दर्ज करें *",
    sendCodeBtn: "कोड भेजें 📲",
    codeSentTitle: "कोड देखभालकर्ता के मोबाइल पर भेजा गया",
    securityPolicyActive: "🔒 सुरक्षा नीति सक्रिय: सत्यापन कोड केवल देखभालकर्ता के मोबाइल पर भेजा गया है और इस स्क्रीन पर नहीं दिखाया जाता।",
    checkWhatsAppBtn: "💬 व्हाट्सएप पर कोड देखें / खोलें",
    enterOtpLabel: "मोबाइल पर प्राप्त 4-अंकीय कोड दर्ज करें *",
    resetUnlockBtn: "रीसेट और अनलॉक करें 🔓",

    // Caregiver Dashboard
    cgCognitiveTracking: "संज्ञानात्मक प्रदर्शन ट्रैकिंग",
    cgCognitiveSubtitle: "सभी 4 याददाश्त और दिनचर्या गतिविधियों का दैनिक औसत स्कोर",
    cgExportCsv: "📊 रिपोर्ट डाउनलोड करें (CSV)",
    cgSaveBackup: "💾 बैकअप सहेजें",
    cgEditProfile: "✏️ प्रोफ़ाइल और देखभालकर्ता विवरण बदलें",
    cgChangePasscodeBtn: "🔒 पासकोड बदलें",
    cgLogoutBtn: "🚪 देखभालकर्ता सत्र से लॉग आउट करें",
    cgDailyActivityLog: "दैनिक गतिविधि लॉग",
    cgCaregiverNotes: "देखभालकर्ता टिप्पणियाँ और अवलोकन",
    cgAddNoteBtn: "टिप्पणी जोड़ें",

    // New User Onboarding & Community Hub (Hindi)
    newUserRegisterBtn: "✨ नया उपयोगकर्ता? प्रोफ़ाइल बनाएं",
    communityHubBtn: "🤝 योगदान एवं स्वयंसेवक केंद्र",
    newUserHint: "पहली बार आए हैं? एक नई मरीज़ प्रोफ़ाइल बनाएं या परिवारों की सहायता के लिए अपने सुझाव साझा करें।",
    newUserModalTitle: "नई मरीज़ एवं देखभालकर्ता प्रोफ़ाइल बनाएं",
    newUserModalSubtitle: "नई संज्ञानात्मक देखभाल यात्रा के लिए व्यक्तिगत सेटअप",
    step1Title: "रोगी विवरण",
    step2Title: "देखभालकर्ता और पिन",
    step3Title: "डॉक्टर और प्राथमिकताएं",
    nuStep1Header: "👤 रोगी का व्यक्तिगत विवरण",
    nuStep2Header: "🛡️ देखभालकर्ता खाता और पासकोड",
    nuStep3Header: "🩺 क्लिनिक संपर्क और प्राथमिकताएं",
    patientFullNameLabel: "रोगी का पूरा नाम *",
    patientPreferredNameLabel: "संबोधन नाम (अभिवादन हेतु) *",
    patientAgeLabel: "आयु (वर्ष) *",
    patientConditionLabel: "वर्तमान स्थिति / डिमेंशिया चरण",
    patientComfortNotesLabel: "आराम देने वाली बातें, रुचियां व पसंद",
    cgFullNameLabel: "मुख्य देखभालकर्ता का पूरा नाम *",
    cgRelationLabel: "रोगी से संबंध *",
    cgPhoneLabel: "आपातकालीन फ़ोन नंबर *",
    cgPinLabel: "देखभालकर्ता पासकोड (4-8 अंक) *",
    cgPinConfirmLabel: "पासकोड की पुष्टि करें *",
    docNameLabel: "डॉक्टर / क्लिनिक का नाम",
    docPhoneLabel: "डॉक्टर का फ़ोन नंबर",
    homeAddressLabel: "रोगी के घर का पता",
    languageChoiceLabel: "पसंदीदा भाषा / Language Preference",
    btnPrev: "← पिछला",
    btnNext: "अगला चरण →",
    btnCompleteProfile: "सेटअप पूरा करें व देखभाल शुरू करें 🌸",
    communityHubTitle: "स्मृति समुदाय एवं योगदानकर्ता केंद्र",
    communityHubSubtitle: "देखभाल संबंधी अनुभव साझा करें, याददाश्त खेल जोड़ें व स्वयंसेवक बनें",
    tabCommunityFeed: "सामुदायिक सुझाव",
    tabShareTip: "सुझाव साझा करें",
    tabSuggestGame: "याददाश्त गतिविधि जोड़ें",
    tabVolunteer: "स्वयंसेवक सहायता",
    insightsHeader: "देखभालकर्ता सामुदायिक ज्ञानकोष",
    insightsSub: "परिवारों और विशेषज्ञों द्वारा साझा किए गए व्यावहारिक चिकित्सकीय उपाय व याददाश्त अभ्यास",
    btnShareNew: "अपना योगदान साझा करें",
    tipFormHeader: "💡 व्यावहारिक देखभाल सुझाव साझा करें",
    tipFormSub: "वे उपाय साझा करें जिन्होंने भटकाव शांत करने, नींद में सुधार लाने या दिनचर्या सहज बनाने में मदद की।",
    authorNameLabel: "आपका नाम *",
    authorRoleLabel: "आपकी भूमिका",
    tipCategoryLabel: "श्रेणी",
    tipTitleLabel: "सुझाव का शीर्षक *",
    tipContentLabel: "आपका व्यावहारिक सुझाव या उपाय *",
    gameFormHeader: "🎮 संज्ञानात्मक या शांत करने वाला अभ्यास जोड़ें",
    gameFormSub: "घरेलू वस्तुओं, गीतों या पुरानी यादों से जुड़े गतिविधि विचार प्रस्तावित करें।",
    gameTitleLabel: "गतिविधि का शीर्षक *",
    gameCategoryLabel: "संज्ञानात्मक लक्ष्य",
    gameContentLabel: "गतिविधि विवरण व चरण *",
    volunteerFormHeader: "🙋 स्वयंसेवक / सामुदायिक सहायक के रूप में जुड़ें",
    volunteerFormSub: "ज़रूरतमंद परिवारों को साथी के रूप में फ़ोन कॉल, हाल-चाल या सहायता सेवाएँ प्रदान करें।"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem(STORAGE_LANG_KEY) || 'en';
    this.translations = TRANSLATIONS;
  }

  getLanguage() {
    return this.currentLang;
  }

  setLanguage(lang) {
    if (lang !== 'en' && lang !== 'hi') lang = 'en';
    this.currentLang = lang;
    localStorage.setItem(STORAGE_LANG_KEY, lang);
    this.applyTranslations();
    window.dispatchEvent(new CustomEvent('smriti_language_changed', { detail: { language: lang } }));
  }

  t(key, params = {}) {
    const dict = this.translations[this.currentLang] || this.translations.en;
    let text = dict[key] || this.translations.en[key] || key;
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, v);
    }
    return text;
  }

  applyTranslations() {
    const isHindi = this.currentLang === 'hi';
    document.documentElement.lang = isHindi ? 'hi' : 'en';

    // Update Language Button Active States
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === this.currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key);
      }
    });

    // Specific UI Elements
    this.updateSpecificElements();
  }

  updateSpecificElements() {
    const isHi = this.currentLang === 'hi';

    // Portals Nav
    const btnPatient = document.getElementById('btn-portal-patient');
    if (btnPatient) btnPatient.textContent = this.t('navPatient');

    const btnCaregiver = document.getElementById('btn-portal-caregiver');
    if (btnCaregiver) btnCaregiver.textContent = this.t('navCaregiver');

    const btnChatbot = document.getElementById('btn-header-chatbot');
    if (btnChatbot) btnChatbot.textContent = this.t('navChatbot');

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.textContent = this.t('logout');

    const btnContribute = document.getElementById('btn-header-contribute');
    if (btnContribute) btnContribute.textContent = isHi ? '🤝 योगदान / नया यूज़र' : '🤝 Contribute / New User';

    // Hero Description
    const heroDesc = document.querySelector('.patient-hero-content p');
    if (heroDesc) heroDesc.textContent = this.t('patientHeroDesc');

    // Mood Question
    const moodTitle = document.querySelector('.mood-title-area h3');
    if (moodTitle) moodTitle.textContent = this.t('moodQuestion');

    const moodReadBtn = document.getElementById('mood-read-btn');
    if (moodReadBtn) moodReadBtn.textContent = this.t('readAloud');

    // Mood Labels
    const moodLabels = document.querySelectorAll('.mood-btn .mood-label');
    if (moodLabels.length >= 4) {
      moodLabels[0].textContent = this.t('moodHappy');
      moodLabels[1].textContent = this.t('moodCalm');
      moodLabels[2].textContent = this.t('moodNeutral');
      moodLabels[3].textContent = this.t('moodTired');
    }

    // Section Headline
    const sectionH3 = document.querySelector('.section-headline h3');
    if (sectionH3) sectionH3.textContent = this.t('todayActivities');

    const sectionSpan = document.querySelector('.section-headline span');
    if (sectionSpan) sectionSpan.textContent = this.t('noTimers');

    // 4 Game Cards
    const g1Title = document.querySelector('#game-card-memory .game-card-title');
    if (g1Title) g1Title.textContent = this.t('game1Title');
    const g1Desc = document.querySelector('#game-card-memory .game-card-desc');
    if (g1Desc) g1Desc.textContent = this.t('game1Desc');

    const g2Title = document.querySelector('#game-card-sequencing .game-card-title');
    if (g2Title) g2Title.textContent = this.t('game2Title');
    const g2Desc = document.querySelector('#game-card-sequencing .game-card-desc');
    if (g2Desc) g2Desc.textContent = this.t('game2Desc');

    const g3Title = document.querySelector('#game-card-recognition .game-card-title');
    if (g3Title) g3Title.textContent = this.t('game3Title');
    const g3Desc = document.querySelector('#game-card-recognition .game-card-desc');
    if (g3Desc) g3Desc.textContent = this.t('game3Desc');

    const g4Title = document.querySelector('#game-card-garden .game-card-title');
    if (g4Title) g4Title.textContent = this.t('game4Title');
    const g4Desc = document.querySelector('#game-card-garden .game-card-desc');
    if (g4Desc) g4Desc.textContent = this.t('game4Desc');

    // Game Action Buttons
    document.querySelectorAll('.btn-play-game').forEach(btn => {
      btn.textContent = this.t('playActivity');
    });

    // Emergency Bar
    const emH3 = document.querySelector('.emergency-text-col h3');
    if (emH3) emH3.textContent = this.t('emergencyTitle');

    const emP = document.querySelector('.emergency-text-col p');
    if (emP) emP.textContent = this.t('emergencyDesc');

    const btnCallCg = document.getElementById('btn-call-caretaker');
    if (btnCallCg) btnCallCg.textContent = this.t('callCaretaker');

    const btnCallDoc = document.getElementById('btn-call-doctor');
    if (btnCallDoc) btnCallDoc.textContent = this.t('callDoctor');

    // Caregiver Dashboard Buttons
    const btnEditCg = document.getElementById('btn-edit-profile-cg');
    if (btnEditCg) btnEditCg.textContent = this.t('cgEditProfile');

    const btnChangePinCg = document.getElementById('btn-change-pin-cg');
    if (btnChangePinCg) btnChangePinCg.textContent = this.t('cgChangePasscodeBtn');

    const btnLogoutCg = document.getElementById('btn-logout-cg');
    if (btnLogoutCg) btnLogoutCg.textContent = this.t('cgLogoutBtn');

    const btnExportCsv = document.getElementById('btn-export-csv');
    if (btnExportCsv) btnExportCsv.textContent = this.t('cgExportCsv');

    const btnBackupJson = document.getElementById('btn-backup-json');
    if (btnBackupJson) btnBackupJson.textContent = this.t('cgSaveBackup');

    const btnSaveNote = document.getElementById('btn-save-note');
    if (btnSaveNote) btnSaveNote.textContent = this.t('cgAddNoteBtn');
  }
}

window.smritiI18n = new I18nManager();
