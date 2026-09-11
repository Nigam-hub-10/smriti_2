/* =========================================================
   Smriti - Core Application Controller
   Coordinates Patient Experience, Caregiver Analytics,
   Game Lifecycles, and Data Synchronization.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentPortal: 'patient', // 'patient' | 'caregiver'
    activeGame: null,
    barChart: null,
    isHighContrast: false,
    isVoiceEnabled: true
  };

  // DOM Elements
  const patientView = document.getElementById('patient-view');
  const caregiverView = document.getElementById('caregiver-view');
  const btnPortalPatient = document.getElementById('btn-portal-patient');
  const btnPortalCaregiver = document.getElementById('btn-portal-caregiver');
  const gameModal = document.getElementById('game-modal');
  const gameModalClose = document.getElementById('game-modal-close');
  const gameModalTitle = document.getElementById('game-modal-title');
  const gameContainer = document.getElementById('game-container');
  const toggleVoiceBtn = document.getElementById('toggle-voice-btn');
  const toggleContrastBtn = document.getElementById('toggle-contrast-btn');
  const btnOpenProfile = document.getElementById('btn-open-profile');
  const btnEditProfileCg = document.getElementById('btn-edit-profile-cg');
  const profileModal = document.getElementById('profile-modal');
  const profileModalClose = document.getElementById('profile-modal-close');
  const btnCancelProfile = document.getElementById('btn-cancel-profile');
  const profileForm = document.getElementById('profile-form');

  // Caregiver Elements
  const chartCanvas = document.getElementById('score-bar-chart');
  const chartFilterBtns = document.querySelectorAll('.filter-btn');
  const scoreTableBody = document.getElementById('score-table-body');
  const notesList = document.getElementById('caregiver-notes-list');
  const noteForm = document.getElementById('caregiver-note-form');
  const noteInput = document.getElementById('caregiver-note-text');

  // Initialize App
  init();

  function init() {
    setupDateTimeGreeting();
    setupLanguagePreference();
    setupPortalSwitching();
    setupMoodSelection();
    setupGameLaunchers();
    setupCaregiverDashboard();
    setupProfileManagement();
    setupChatbotAssistant();
    setupNewUserWizard();
    setupCommunityHub();
    setupAccessibilityControls();
    listenForDataUpdates();

    // Initial greeting voice cue
    setTimeout(() => {
      const patient = window.smritiData.getPatient();
      const isHindi = window.smritiI18n && window.smritiI18n.getLanguage() === 'hi';
      const hour = new Date().getHours();
      let timeGreeting;
      if (isHindi) {
        timeGreeting = hour < 12 ? 'शुभ प्रभात' : hour < 17 ? 'शुभ दोपहर' : 'शुभ संध्या';
        window.smritiSpeech.speak(`${timeGreeting}, ${patient.preferredName}! आपकी दैनिक गतिविधियों में आपका स्वागत है।`);
      } else {
        timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
        window.smritiSpeech.speak(`${timeGreeting}, ${patient.preferredName}! Welcome to your daily activities.`);
      }
    }, 600);
  }

  /* ---------------------------------------------------------
     Date, Time, and Warm Personalized Greeting
     --------------------------------------------------------- */
  function setupDateTimeGreeting() {
    const today = new Date();
    const isHindi = window.smritiI18n && window.smritiI18n.getLanguage() === 'hi';

    const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayNamesHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    const monthsHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];

    const greetingName = document.getElementById('patient-name-span');
    const dayDisplay = document.getElementById('patient-day-name');
    const dateDisplay = document.getElementById('patient-full-date');

    const patient = window.smritiData.getPatient();
    if (greetingName) greetingName.textContent = patient.preferredName;
    if (dayDisplay) dayDisplay.textContent = isHindi ? dayNamesHi[today.getDay()] : dayNamesEn[today.getDay()];
    if (dateDisplay) {
      if (isHindi) {
        dateDisplay.textContent = `${today.getDate()} ${monthsHi[today.getMonth()]} ${today.getFullYear()}`;
      } else {
        dateDisplay.textContent = `${monthsEn[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
      }
    }
  }

  /* ---------------------------------------------------------
     Portal Switcher & Role Security Management
     --------------------------------------------------------- */
  function setupPortalSwitching() {
    const roleWelcomeModal = document.getElementById('role-welcome-modal');
    const btnSelectPatientRole = document.getElementById('btn-select-patient-role');
    const btnSelectCaretakerRole = document.getElementById('btn-select-caretaker-role');

    const caretakerPinModal = document.getElementById('caretaker-pin-modal');
    const pinModalClose = document.getElementById('pin-modal-close');
    const btnPinCancel = document.getElementById('btn-pin-cancel');
    const caretakerPinForm = document.getElementById('caretaker-pin-form');
    const caretakerPinInput = document.getElementById('caretaker-pin-input');
    const pinErrorMsg = document.getElementById('pin-error-msg');

    // Check first-time role selection
    const savedRole = window.smritiData.getUserRole();
    if (!savedRole && roleWelcomeModal) {
      setTimeout(() => {
        roleWelcomeModal.classList.add('active');
      }, 350);
    }

    if (btnSelectPatientRole) {
      btnSelectPatientRole.addEventListener('click', () => {
        window.smritiData.setUserRole('patient');
        roleWelcomeModal.classList.remove('active');
        switchPortal('patient');
        showToast('Welcome, Patient Mode active');
      });
    }

    if (btnSelectCaretakerRole) {
      btnSelectCaretakerRole.addEventListener('click', () => {
        roleWelcomeModal.classList.remove('active');
        openPinModal();
      });
    }

    // PIN Modal Views and Elements
    const pinViewUnlock = document.getElementById('pin-view-unlock');
    const pinViewChange = document.getElementById('pin-view-change');
    const pinViewForgot = document.getElementById('pin-view-forgot');
    const pinModalTitle = document.getElementById('pin-modal-title');
    const pinCgNameBadge = document.getElementById('pin-caregiver-name-badge');

    // Subview Navigation Buttons
    const btnNavToChangePin = document.getElementById('btn-nav-to-change-pin');
    const btnNavToForgotPin = document.getElementById('btn-nav-to-forgot-pin');
    const btnBackFromChange = document.getElementById('btn-back-from-change');
    const btnBackFromForgot1 = document.getElementById('btn-back-from-forgot-1');
    const btnBackFromForgot2 = document.getElementById('btn-back-from-forgot-2');

    // Change Passcode Elements
    const changePinForm = document.getElementById('change-pin-form');
    const changePinCurrent = document.getElementById('change-pin-current');
    const changePinNew = document.getElementById('change-pin-new');
    const changePinConfirm = document.getElementById('change-pin-confirm');
    const changePinErrorMsg = document.getElementById('change-pin-error-msg');
    const changePinSuccessMsg = document.getElementById('change-pin-success-msg');

    // Forgot Passcode Elements
    const forgotInfoName = document.getElementById('forgot-info-name');
    const forgotInfoPhoneMasked = document.getElementById('forgot-info-phone-masked');
    const forgotStep1 = document.getElementById('forgot-step-1');
    const forgotStep2 = document.getElementById('forgot-step-2');
    const forgotPhoneInput = document.getElementById('forgot-phone-input');
    const forgotPhoneErrorMsg = document.getElementById('forgot-phone-error-msg');
    const btnVerifyPhone = document.getElementById('btn-verify-phone');
    const forgotSimulatedOtp = document.getElementById('forgot-simulated-otp');
    const forgotOtpInput = document.getElementById('forgot-otp-input');
    const forgotNewPin = document.getElementById('forgot-new-pin');
    const forgotConfirmPin = document.getElementById('forgot-confirm-pin');
    const forgotStep2ErrorMsg = document.getElementById('forgot-step2-error-msg');

    let currentSimulatedOtp = null;

    function updatePinModalMeta() {
      const cg = window.smritiData.getCaregiverProfile();
      const pt = window.smritiData.getPatient();
      const cgName = cg.name || pt.caregiverName || 'Sarah Vance';
      const rawPhone = cg.phone || pt.emergencyPhone || '+1 (555) 382-9011';
      const cleanDigits = rawPhone.replace(/\D/g, '');
      const masked = cleanDigits.length >= 4 ? `...${cleanDigits.slice(-4)}` : rawPhone;

      if (pinCgNameBadge) pinCgNameBadge.textContent = cgName;
      if (forgotInfoName) forgotInfoName.textContent = cgName;
      if (forgotInfoPhoneMasked) forgotInfoPhoneMasked.textContent = masked;
    }

    function switchPinSubview(subview) {
      updatePinModalMeta();
      if (pinViewUnlock) pinViewUnlock.style.display = subview === 'unlock' ? 'flex' : 'none';
      if (pinViewChange) pinViewChange.style.display = subview === 'change' ? 'flex' : 'none';
      if (pinViewForgot) pinViewForgot.style.display = subview === 'forgot' ? 'flex' : 'none';

      if (subview === 'unlock') {
        if (pinModalTitle) pinModalTitle.textContent = 'Caregiver Security Access';
        if (caretakerPinInput) {
          caretakerPinInput.value = '';
          setTimeout(() => caretakerPinInput.focus(), 100);
        }
        if (pinErrorMsg) pinErrorMsg.style.display = 'none';
      } else if (subview === 'change') {
        if (pinModalTitle) pinModalTitle.textContent = 'Change Caregiver Passcode';
        if (changePinCurrent) changePinCurrent.value = '';
        if (changePinNew) changePinNew.value = '';
        if (changePinConfirm) changePinConfirm.value = '';
        if (changePinErrorMsg) changePinErrorMsg.style.display = 'none';
        if (changePinSuccessMsg) changePinSuccessMsg.style.display = 'none';
        setTimeout(() => changePinCurrent && changePinCurrent.focus(), 100);
      } else if (subview === 'forgot') {
        if (pinModalTitle) pinModalTitle.textContent = 'Reset Passcode via Phone';
        if (forgotStep1) forgotStep1.style.display = 'flex';
        if (forgotStep2) forgotStep2.style.display = 'none';
        // Prefill registered caretaker phone number for user convenience
        if (forgotPhoneInput) forgotPhoneInput.value = rawPhone || '';
        if (forgotPhoneErrorMsg) forgotPhoneErrorMsg.style.display = 'none';
        if (forgotStep2ErrorMsg) forgotStep2ErrorMsg.style.display = 'none';
        setTimeout(() => forgotPhoneInput && forgotPhoneInput.focus(), 100);
      }
    }

    // Caregiver PIN Modal Open / Close
    function openPinModal(initialSubview = 'unlock') {
      switchPinSubview(initialSubview);
      if (caretakerPinModal) caretakerPinModal.classList.add('active');
    }

    function closePinModal() {
      if (caretakerPinModal) caretakerPinModal.classList.remove('active');
    }

    if (pinModalClose) pinModalClose.addEventListener('click', closePinModal);
    if (btnPinCancel) btnPinCancel.addEventListener('click', closePinModal);

    // Subview Navigation Listeners
    if (btnNavToChangePin) {
      btnNavToChangePin.addEventListener('click', () => switchPinSubview('change'));
    }
    if (btnNavToForgotPin) {
      btnNavToForgotPin.addEventListener('click', () => switchPinSubview('forgot'));
    }
    if (btnBackFromChange) {
      btnBackFromChange.addEventListener('click', () => switchPinSubview('unlock'));
    }
    if (btnBackFromForgot1) {
      btnBackFromForgot1.addEventListener('click', () => switchPinSubview('unlock'));
    }
    if (btnBackFromForgot2) {
      btnBackFromForgot2.addEventListener('click', () => {
        if (forgotStep1) forgotStep1.style.display = 'flex';
        if (forgotStep2) forgotStep2.style.display = 'none';
      });
    }

    // Caregiver Portal Header Direct "Change Passcode" button
    const btnChangePinCg = document.getElementById('btn-change-pin-cg');
    if (btnChangePinCg) {
      btnChangePinCg.addEventListener('click', () => {
        openPinModal('change');
      });
    }

    // Real Notification Helper
    function triggerDesktopSecurityAlert(otp, phoneStr) {
      if (!("Notification" in window)) return;
      const sendNotif = () => {
        try {
          new Notification("Smriti Caregiver Security", {
            body: `Passcode reset code for ${phoneStr}: ${otp}`,
            icon: "🌸"
          });
        } catch(e) {}
      };

      if (Notification.permission === "granted") {
        sendNotif();
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") sendNotif();
        });
      }
    }

    // 1. Verify Standard PIN submission
    if (caretakerPinForm) {
      caretakerPinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const entered = caretakerPinInput.value.trim();
        if (window.smritiData.verifyCaregiverPin(entered)) {
          if (pinErrorMsg) pinErrorMsg.style.display = 'none';
          closePinModal();
          window.smritiData.setUserRole('caregiver');
          switchPortal('caregiver');
          if (window.smritiAudio) window.smritiAudio.playSuccess();
          showToast('Caregiver Portal unlocked!');
        } else {
          if (pinErrorMsg) pinErrorMsg.style.display = 'block';
          caretakerPinInput.value = '';
          if (window.smritiAudio) window.smritiAudio.playPop();
          showToast('Incorrect Caregiver passcode!');
        }
      });
    }

    // 2. Change Passcode submission (when user knows previous passcode)
    if (changePinForm) {
      changePinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const curr = (changePinCurrent?.value || '').trim();
        const next = (changePinNew?.value || '').trim();
        const conf = (changePinConfirm?.value || '').trim();

        if (changePinErrorMsg) changePinErrorMsg.style.display = 'none';
        if (changePinSuccessMsg) changePinSuccessMsg.style.display = 'none';

        if (!window.smritiData.verifyCaregiverPin(curr)) {
          if (changePinErrorMsg) {
            changePinErrorMsg.textContent = '⚠️ Current passcode is incorrect. If forgotten, use the Phone Reset option.';
            changePinErrorMsg.style.display = 'block';
          }
          if (changePinCurrent) changePinCurrent.focus();
          if (window.smritiAudio) window.smritiAudio.playPop();
          return;
        }

        if (next.length < 4) {
          if (changePinErrorMsg) {
            changePinErrorMsg.textContent = '⚠️ New passcode must be at least 4 digits.';
            changePinErrorMsg.style.display = 'block';
          }
          if (changePinNew) changePinNew.focus();
          return;
        }

        if (next !== conf) {
          if (changePinErrorMsg) {
            changePinErrorMsg.textContent = '⚠️ New passcodes do not match.';
            changePinErrorMsg.style.display = 'block';
          }
          if (changePinConfirm) changePinConfirm.focus();
          return;
        }

        // Successfully updated
        window.smritiData.setCaregiverPin(next);
        if (changePinSuccessMsg) {
          changePinSuccessMsg.textContent = '✅ Passcode successfully changed! Unlocking Caregiver Portal...';
          changePinSuccessMsg.style.display = 'block';
        }
        if (window.smritiAudio) window.smritiAudio.playSuccess();
        showToast('Caregiver passcode successfully updated!');

        setTimeout(() => {
          closePinModal();
          window.smritiData.setUserRole('caregiver');
          switchPortal('caregiver');
        }, 800);
      });
    }

    // 3. Forgot Passcode Step 1: Verify Caretaker Phone Number & Dispatch
    if (btnVerifyPhone) {
      btnVerifyPhone.addEventListener('click', () => {
        const entered = (forgotPhoneInput?.value || '').trim();
        const enteredDigits = entered.replace(/\D/g, '');

        if (forgotPhoneErrorMsg) forgotPhoneErrorMsg.style.display = 'none';

        if (enteredDigits.length < 4) {
          if (forgotPhoneErrorMsg) {
            forgotPhoneErrorMsg.textContent = '⚠️ Please enter a valid caretaker phone number.';
            forgotPhoneErrorMsg.style.display = 'block';
          }
          return;
        }

        const cg = window.smritiData.getCaregiverProfile();
        const pt = window.smritiData.getPatient();
        const actualNumbers = [cg.phone, pt.emergencyPhone].filter(Boolean);

        const isMatch = actualNumbers.some(p => {
          const pDigits = p.replace(/\D/g, '');
          return (pDigits.endsWith(enteredDigits) || enteredDigits.endsWith(pDigits) || pDigits === enteredDigits);
        });

        if (!isMatch) {
          const sample = (actualNumbers[0] || '').replace(/\D/g, '');
          const last4 = sample.length >= 4 ? sample.slice(-4) : '...';
          if (forgotPhoneErrorMsg) {
            forgotPhoneErrorMsg.textContent = `⚠️ Number does not match registered caretaker (ends in ...${last4}). Please check your records.`;
            forgotPhoneErrorMsg.style.display = 'block';
          }
          if (window.smritiAudio) window.smritiAudio.playPop();
          return;
        }

        // Generate Real Verification Code
        currentSimulatedOtp = String(Math.floor(1000 + Math.random() * 9000));

        // Dispatch to Server endpoint (logged in server console and sent via SMS gateway if configured)
        fetch('/api/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: entered, otp: currentSimulatedOtp })
        }).catch(() => {});

        // Configure WhatsApp Direct Delivery link to caretaker's mobile
        let waDigits = enteredDigits;
        if (waDigits.length === 10) {
          waDigits = '91' + waDigits;
        }
        const waMsg = encodeURIComponent(`[Smriti Dementia Care] Your Caregiver Passcode Reset Code is: ${currentSimulatedOtp}. Enter this 4-digit code to unlock the Caregiver Portal.`);
        const waUrl = `https://api.whatsapp.com/send?phone=${waDigits}&text=${waMsg}`;
        const btnSendWhatsApp = document.getElementById('btn-send-whatsapp-otp');
        if (btnSendWhatsApp) {
          btnSendWhatsApp.href = waUrl;
        }

        // Automatically open WhatsApp to deliver the code directly to caretaker's phone
        try {
          window.open(waUrl, '_blank');
        } catch(e) {}

        const confirmedPhoneEl = document.getElementById('forgot-confirmed-phone');
        if (confirmedPhoneEl) {
          const last4 = enteredDigits.length >= 4 ? enteredDigits.slice(-4) : '...';
          confirmedPhoneEl.textContent = `+91 ******${last4}`;
        }

        if (forgotStep1) forgotStep1.style.display = 'none';
        if (forgotStep2) forgotStep2.style.display = 'flex';
        if (forgotStep2ErrorMsg) forgotStep2ErrorMsg.style.display = 'none';
        if (forgotOtpInput) {
          forgotOtpInput.value = '';
          setTimeout(() => forgotOtpInput.focus(), 150);
        }
        if (forgotNewPin) forgotNewPin.value = '';
        if (forgotConfirmPin) forgotConfirmPin.value = '';

        if (window.smritiAudio) window.smritiAudio.playChime(3);
        showToast('Verification code dispatched to caretaker mobile!');
      });
    }

    // 4. Forgot Passcode Step 2: Set New Passcode after SMS Verification
    if (forgotStep2) {
      forgotStep2.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredOtp = (forgotOtpInput?.value || '').trim();
        const next = (forgotNewPin?.value || '').trim();
        const conf = (forgotConfirmPin?.value || '').trim();

        if (forgotStep2ErrorMsg) forgotStep2ErrorMsg.style.display = 'none';

        if (enteredOtp !== currentSimulatedOtp) {
          if (forgotStep2ErrorMsg) {
            forgotStep2ErrorMsg.textContent = '⚠️ Invalid SMS verification code. Please check the code.';
            forgotStep2ErrorMsg.style.display = 'block';
          }
          if (window.smritiAudio) window.smritiAudio.playPop();
          return;
        }

        if (next.length < 4) {
          if (forgotStep2ErrorMsg) {
            forgotStep2ErrorMsg.textContent = '⚠️ Passcode must be at least 4 digits.';
            forgotStep2ErrorMsg.style.display = 'block';
          }
          if (forgotNewPin) forgotNewPin.focus();
          return;
        }

        if (next !== conf) {
          if (forgotStep2ErrorMsg) {
            forgotStep2ErrorMsg.textContent = '⚠️ Passcodes do not match.';
            forgotStep2ErrorMsg.style.display = 'block';
          }
          if (forgotConfirmPin) forgotConfirmPin.focus();
          return;
        }

        // Successfully reset
        window.smritiData.setCaregiverPin(next);
        if (window.smritiAudio) window.smritiAudio.playSuccess();
        showToast('🎉 Passcode successfully reset! Unlocking Caregiver Portal.');

        closePinModal();
        window.smritiData.setUserRole('caregiver');
        switchPortal('caregiver');
      });
    }

    // Navigation buttons
    btnPortalPatient.addEventListener('click', () => {
      window.smritiData.setUserRole('patient');
      switchPortal('patient');
    });

    btnPortalCaregiver.addEventListener('click', () => {
      // Require security PIN to access Caregiver Dashboard & Patient Records
      if (state.currentPortal === 'patient') {
        openPinModal();
      } else {
        switchPortal('caregiver');
      }
    });

    // Logout / Switch User Handlers
    const btnLogout = document.getElementById('btn-logout');
    const btnLogoutCg = document.getElementById('btn-logout-cg');

    const handleLogout = () => {
      window.smritiData.setUserRole(null);
      switchPortal('patient');
      showToast('Logged out. Please choose your role.');
      if (roleWelcomeModal) {
        roleWelcomeModal.classList.add('active');
      }
    };

    if (btnLogout) btnLogout.addEventListener('click', handleLogout);
    if (btnLogoutCg) btnLogoutCg.addEventListener('click', handleLogout);
  }

  function switchPortal(portal) {
    state.currentPortal = portal;
    if (portal === 'caregiver') {
      document.body.classList.add('caregiver-mode');
      btnPortalCaregiver.classList.add('active');
      btnPortalPatient.classList.remove('active');
      patientView.classList.add('hidden');
      caregiverView.classList.remove('hidden');

      // Refresh caregiver views & bar graph
      refreshCaregiverDashboard();
      showToast('Unlocked Caregiver Portal');
    } else {
      document.body.classList.remove('caregiver-mode');
      btnPortalPatient.classList.add('active');
      btnPortalCaregiver.classList.remove('active');
      caregiverView.classList.add('hidden');
      patientView.classList.remove('hidden');
      refreshPatientStatus();
    }
  }

  /* ---------------------------------------------------------
     Mood Selection & Check-in
     --------------------------------------------------------- */
  function setupMoodSelection() {
    const moodBtns = document.querySelectorAll('.mood-btn');
    const currentMood = window.smritiData.getCurrentMood();

    moodBtns.forEach(btn => {
      if (btn.getAttribute('data-mood') === currentMood) {
        btn.classList.add('selected');
      }

      btn.addEventListener('click', () => {
        moodBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        const selectedMood = btn.getAttribute('data-mood');
        const moodLabel = btn.querySelector('.mood-label').textContent;
        window.smritiData.setMood(selectedMood);

        const isHindi = window.smritiI18n && window.smritiI18n.getLanguage() === 'hi';
        const speechMsg = isHindi 
          ? `साझा करने के लिए धन्यवाद। हमें पता चला कि आप आज ${moodLabel} महसूस कर रहे हैं।`
          : `Thank you for sharing. We noted that you feel ${moodLabel} today.`;
        window.smritiSpeech.speak(speechMsg);

        const toastMsg = isHindi
          ? `आज का मूड दर्ज किया गया: ${moodLabel}`
          : `Today's feeling recorded: ${moodLabel}`;
        showToast(toastMsg);
      });
    });

    const moodReadBtn = document.getElementById('mood-read-btn');
    if (moodReadBtn) {
      moodReadBtn.addEventListener('click', () => {
        const isHindi = window.smritiI18n && window.smritiI18n.getLanguage() === 'hi';
        const prompt = isHindi
          ? "आज आप कैसा महसूस कर रहे हैं? खुश, शांत, सामान्य या थका हुआ में से चुनें।"
          : "How are you feeling today? Tap happy, calm, okay, or tired to let your caregiver know.";
        window.smritiSpeech.speak(prompt);
      });
    }
  }

  /* ---------------------------------------------------------
     Game Launchers & Modal Handling
     --------------------------------------------------------- */
  function setupGameLaunchers() {
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
      card.addEventListener('click', () => {
        const gameType = card.getAttribute('data-game');
        launchGame(gameType);
      });
    });

    gameModalClose.addEventListener('click', closeGameModal);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && gameModal.classList.contains('active')) {
        closeGameModal();
      }
    });
  }

  function launchGame(gameType) {
    gameModal.classList.add('active');
    gameContainer.innerHTML = '';

    const handleComplete = (score) => {
      refreshPatientStatus();
      showToast(`Game completed! Score: ${score}% logged.`);
    };

    switch (gameType) {
      case 'memory':
        gameModalTitle.innerHTML = '<span>Daily Essentials Match</span>';
        state.activeGame = new window.MemoryGame('game-container', () => closeGameModal());
        break;
      case 'sequencing':
        gameModalTitle.innerHTML = '<span>Daily Routine Sequencing</span>';
        state.activeGame = new window.SequencingGame('game-container', () => closeGameModal());
        break;
      case 'recognition':
        gameModalTitle.innerHTML = '<span>Everyday Object Recognition</span>';
        state.activeGame = new window.RecognitionGame('game-container', () => closeGameModal());
        break;
      case 'garden':
        gameModalTitle.innerHTML = '<span>Calming Focus Garden</span>';
        state.activeGame = new window.FocusGardenGame('game-container', () => closeGameModal());
        break;
    }

    if (state.activeGame) {
      state.activeGame.start();
    }
  }

  function closeGameModal() {
    gameModal.classList.remove('active');
    gameContainer.innerHTML = '';
    state.activeGame = null;
    refreshPatientStatus();
    if (state.currentPortal === 'caregiver') {
      refreshCaregiverDashboard();
    }
  }

  function refreshPatientStatus() {
    const today = window.smritiData.getTodayRecord();
    const pills = {
      memory: document.getElementById('pill-game-memory'),
      sequencing: document.getElementById('pill-game-sequencing'),
      recognition: document.getElementById('pill-game-recognition'),
      garden: document.getElementById('pill-game-garden')
    };

    if (pills.memory && today.memoryScore !== null && today.memoryScore !== undefined) {
      pills.memory.textContent = `Completed (${today.memoryScore}%)`;
      pills.memory.classList.add('done');
    }
    if (pills.sequencing && today.sequencingScore !== null && today.sequencingScore !== undefined) {
      pills.sequencing.textContent = `Completed (${today.sequencingScore}%)`;
      pills.sequencing.classList.add('done');
    }
    if (pills.recognition && today.recognitionScore !== null && today.recognitionScore !== undefined) {
      pills.recognition.textContent = `Completed (${today.recognitionScore}%)`;
      pills.recognition.classList.add('done');
    }
    if (pills.garden && today.gardenScore !== null && today.gardenScore !== undefined) {
      pills.garden.textContent = `Completed (${today.gardenScore}%)`;
      pills.garden.classList.add('done');
    }
  }

  /* ---------------------------------------------------------
     Caregiver Dashboard & Interactive Bar Chart
     --------------------------------------------------------- */
  function setupCaregiverDashboard() {
    // Instantiate Chart
    if (chartCanvas) {
      state.barChart = new window.CognitiveBarChart('score-bar-chart');
    }

    // Chart Filter Buttons
    chartFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        chartFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        if (state.barChart) {
          state.barChart.setFilter(filter);
        }
      });
    });

    // Caregiver Note Form
    if (noteForm) {
      noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = noteInput.value.trim();
        if (!text) return;

        const checkMeds = document.getElementById('check-meds')?.checked;
        const checkHydration = document.getElementById('check-hydrated')?.checked;
        const tags = [];
        if (checkMeds) tags.push('Medication Taken');
        if (checkHydration) tags.push('Hydrated');

        window.smritiData.addNote(text, tags);
        noteInput.value = '';
        if (document.getElementById('check-meds')) document.getElementById('check-meds').checked = false;
        if (document.getElementById('check-hydrated')) document.getElementById('check-hydrated').checked = false;

        renderNotes();
        showToast('Caregiver observation saved');
      });
    }

    // Caregiver Emergency Dial and Quick Action triggers
    const btnCallDoctor = document.getElementById('cg-call-doctor');
    const btnCallCaregiver = document.getElementById('cg-call-caregiver');
    const btnExportReport = document.getElementById('cg-export-report');

    if (btnCallDoctor) {
      btnCallDoctor.addEventListener('click', () => {
        const patient = window.smritiData.getPatient();
        alert(`Contacting ${patient.doctorName || 'Doctor'}\nClinic Phone: ${patient.doctorPhone || '+1 (555) 902-8811'}`);
      });
    }
    if (btnCallCaregiver) {
      btnCallCaregiver.addEventListener('click', () => {
        const patient = window.smritiData.getPatient();
        alert(`Calling Primary Caretaker:\n${patient.caregiverName} (${patient.caregiverRelation || 'Primary Caretaker'})\nPhone: ${patient.emergencyPhone}`);
      });
    }
    if (btnExportReport) {
      btnExportReport.addEventListener('click', () => {
        window.print();
      });
    }

    // Disk Data Backup & Restore
    const btnBackupJson = document.getElementById('cg-backup-json');
    const btnRestoreJson = document.getElementById('cg-restore-json');
    const fileInput = document.getElementById('cg-file-input');

    if (btnBackupJson) {
      btnBackupJson.addEventListener('click', () => {
        window.smritiData.exportJSONBackup();
        showToast('Database exported & backed up to disk!');
      });
    }

    if (btnRestoreJson && fileInput) {
      btnRestoreJson.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = window.smritiData.importJSONBackup(event.target.result);
          if (res.success) {
            showToast('Backup restored successfully!');
            refreshCaregiverDashboard();
            setupDateTimeGreeting();
          } else {
            showToast('Failed to import backup: ' + res.error);
          }
        };
        reader.readAsText(file);
      });
    }

    // Theatre Mode Toggle for Large Screen Immersion
    const btnToggleTheatre = document.getElementById('btn-toggle-theatre');
    const gameModalContent = document.getElementById('game-modal-content');
    if (btnToggleTheatre && gameModalContent) {
      btnToggleTheatre.addEventListener('click', () => {
        gameModalContent.classList.toggle('theatre-mode');
        const isTheatre = gameModalContent.classList.contains('theatre-mode');
        btnToggleTheatre.textContent = isTheatre ? 'Standard Size' : '⛶ Theatre Mode';
      });
    }
  }

  /* ---------------------------------------------------------
     AI Care Companion Chatbot
     --------------------------------------------------------- */
  function setupChatbotAssistant() {
    const chatbotModal = document.getElementById('chatbot-modal');
    const chatbotClose = document.getElementById('chatbot-modal-close');
    const btnHeaderChatbot = document.getElementById('btn-header-chatbot');
    const floatingAiBtn = document.getElementById('floating-ai-btn');
    const msgList = document.getElementById('chatbot-msg-list');
    const form = document.getElementById('chatbot-input-form');
    const textInput = document.getElementById('chatbot-text-input');
    const chipsBar = document.getElementById('chatbot-chips-bar');

    const bot = new window.SmritiChatbot();

    function syncChatbotUI() {
      const isHi = window.smritiI18n && window.smritiI18n.getLanguage() === 'hi';
      const patient = window.smritiData.getPatient();
      const cgName = patient.caregiverName || (isHi ? 'देखभालकर्ता' : 'Caretaker');

      if (textInput) {
        textInput.placeholder = isHi 
          ? "कुछ भी पूछें, जैसे 'मैं कहाँ हूँ?', 'समय क्या हुआ है?', 'सारा को कॉल करो'..."
          : "Ask anything, e.g. 'Call Sarah', 'What time is it?', 'Where is my home?'...";
      }

      if (chipsBar) {
        const chips = chipsBar.querySelectorAll('[data-chip]');
        chips.forEach(chip => {
          const type = chip.getAttribute('data-chip');
          if (type === 'call_caregiver') chip.textContent = isHi ? `📞 कॉल करें: ${cgName}` : `📞 Call ${cgName}`;
          if (type === 'call_doctor') chip.textContent = isHi ? '🩺 डॉक्टर को कॉल करें' : '🩺 Call Doctor';
          if (type === 'location') chip.textContent = isHi ? '📍 मैं कहाँ हूँ?' : '📍 Where am I?';
          if (type === 'date') chip.textContent = isHi ? '⏰ आज कौन सा दिन है?' : '⏰ What day is today?';
          if (type === 'go_garden') chip.textContent = isHi ? '🌸 फूलों का बगीचा' : '🌸 Visit Garden';
          if (type === 'comfort') chip.textContent = isHi ? '💖 मुझे थोड़ी चिंता हो रही है' : '💖 I feel worried';
        });
      }
    }

    const openChat = () => {
      syncChatbotUI();
      renderMessages();
      chatbotModal.classList.add('active');
      setTimeout(() => textInput?.focus(), 150);
    };

    const closeChat = () => {
      chatbotModal.classList.remove('active');
    };

    if (btnHeaderChatbot) btnHeaderChatbot.addEventListener('click', openChat);
    if (floatingAiBtn) floatingAiBtn.addEventListener('click', openChat);
    if (chatbotClose) chatbotClose.addEventListener('click', closeChat);

    window.addEventListener('smriti_language_changed', () => {
      bot.seedWelcome();
      syncChatbotUI();
      renderMessages();
    });

    function renderMessages() {
      if (!msgList) return;
      msgList.innerHTML = bot.messages.map((m) => {
        return `
          <div class="support-msg ${m.sender}">
            <p>${m.text}</p>
            ${m.actions && m.actions.length > 0 ? `
              <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">
                ${m.actions.map(act => `
                  <button class="read-btn bot-action-btn ${act.isPrimary ? 'done' : ''}" data-act="${act.type}" style="font-size:0.88rem; padding:6px 12px;">
                    ${act.label}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }).join('');

      msgList.scrollTop = msgList.scrollHeight;

      // Attach action clicks
      msgList.querySelectorAll('.bot-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const actionType = btn.getAttribute('data-act');
          bot.handleAction(actionType);
        });
      });
    }

    // Quick chips click handler
    if (chipsBar) {
      chipsBar.querySelectorAll('[data-chip]').forEach(chip => {
        chip.addEventListener('click', () => {
          const type = chip.getAttribute('data-chip');
          const isHi = window.smritiI18n && window.smritiI18n.getLanguage() === 'hi';
          if (type === 'comfort') {
            handleUserSend(isHi ? "मुझे थोड़ी चिंता हो रही है" : "I feel a little worried");
          } else {
            bot.handleAction(type);
          }
        });
      });
    }

    function handleUserSend(userText) {
      if (!userText) return;
      bot.messages.push({ sender: 'user', text: userText });
      renderMessages();

      // Bot thinking & answer
      setTimeout(() => {
        try {
          const res = bot.respond(userText) || {};
          const reply = res.reply || (window.smritiI18n && window.smritiI18n.getLanguage() === 'hi' 
            ? "नमस्ते! मैं आपकी क्या सहायता कर सकता हूँ?" 
            : "Hello! How can I assist you today?");
          const actions = res.actions || [];
          bot.messages.push({ sender: 'bot', text: reply, actions });
          renderMessages();
          window.smritiSpeech.speak(reply);
          if (window.smritiAudio) window.smritiAudio.playChime();
        } catch (err) {
          console.error("Chatbot response error:", err);
          const isHi = window.smritiI18n && window.smritiI18n.getLanguage() === 'hi';
          const fallbackReply = isHi 
            ? "मैं यहाँ आपकी सहायता के लिए हूँ। आप बिल्कुल सुरक्षित हैं। क्या आप अपनी देखभालकर्ता को कॉल करना चाहते हैं?"
            : "I am here to help you. You are completely safe. Would you like to call your caretaker?";
          bot.messages.push({ 
            sender: 'bot', 
            text: fallbackReply, 
            actions: [{ label: isHi ? "📞 देखभालकर्ता को कॉल करें" : "📞 Call Caretaker", type: "call_caregiver" }] 
          });
          renderMessages();
          window.smritiSpeech.speak(fallbackReply);
        }
      }, 350);
    }

    if (form && textInput) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const txt = textInput.value.trim();
        if (!txt) return;
        textInput.value = '';
        handleUserSend(txt);
      });
    }
  }

  /* ---------------------------------------------------------
     Patient & Caretaker Profile Management
     --------------------------------------------------------- */
  function setupProfileManagement() {
    const openModal = () => {
      populateProfileForm();
      profileModal.classList.add('active');
    };

    const closeModal = () => {
      profileModal.classList.remove('active');
    };

    if (btnOpenProfile) btnOpenProfile.addEventListener('click', openModal);
    if (btnEditProfileCg) btnEditProfileCg.addEventListener('click', openModal);
    if (profileModalClose) profileModalClose.addEventListener('click', closeModal);
    if (btnCancelProfile) btnCancelProfile.addEventListener('click', closeModal);

    // Populate current values
    function populateProfileForm() {
      const p = window.smritiData.getPatient();
      const cg = window.smritiData.getCaregiverProfile();
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
      };

      setVal('prof-patient-name', p.name);
      setVal('prof-patient-preferred', p.preferredName);
      setVal('prof-patient-age', p.age);
      setVal('prof-patient-stage', p.stage);
      setVal('prof-patient-notes', p.notes);
      const currentLang = (window.smritiI18n && window.smritiI18n.getLanguage()) || 'en';
      setVal('prof-language', currentLang);
      setVal('prof-cg-name', cg.name || p.caregiverName);
      setVal('prof-cg-relation', cg.relation || p.caregiverRelation);
      setVal('prof-cg-phone', cg.phone || p.emergencyPhone);
      setVal('prof-cg-email', cg.email || '');
      setVal('prof-cg-pin', window.smritiData.getCaregiverPin());
      setVal('prof-home-address', p.homeAddress);
      setVal('prof-doc-name', p.doctorName);
      setVal('prof-doc-phone', p.doctorPhone);
    }

    // Save profile form submission
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const cgEmail = document.getElementById('prof-cg-email')?.value.trim() || '';
        const cgPin = document.getElementById('prof-cg-pin')?.value.trim() || '1234';
        const langChoice = document.getElementById('prof-language')?.value || 'en';

        const updated = {
          name: document.getElementById('prof-patient-name').value.trim(),
          preferredName: document.getElementById('prof-patient-preferred').value.trim(),
          age: parseInt(document.getElementById('prof-patient-age').value, 10) || 74,
          stage: document.getElementById('prof-patient-stage').value,
          notes: document.getElementById('prof-patient-notes').value.trim(),
          caregiverName: document.getElementById('prof-cg-name').value.trim(),
          caregiverRelation: document.getElementById('prof-cg-relation').value.trim(),
          emergencyPhone: document.getElementById('prof-cg-phone').value.trim(),
          homeAddress: document.getElementById('prof-home-address').value.trim(),
          doctorName: document.getElementById('prof-doc-name').value.trim(),
          doctorPhone: document.getElementById('prof-doc-phone').value.trim()
        };

        window.smritiData.updatePatientProfile(updated);
        window.smritiData.saveCaregiverProfile({
          name: updated.caregiverName,
          relation: updated.caregiverRelation,
          phone: updated.emergencyPhone,
          email: cgEmail,
          pin: cgPin
        });
        window.smritiData.setCaregiverPin(cgPin);

        if (window.smritiI18n && window.smritiI18n.getLanguage() !== langChoice) {
          window.smritiI18n.setLanguage(langChoice);
        }

        closeModal();

        // Refresh UI
        setupDateTimeGreeting();
        refreshCaregiverDashboard();
        const isHi = window.smritiI18n && window.smritiI18n.getLanguage() === 'hi';
        showToast(isHi ? 'मरीज़ और देखभालकर्ता प्रोफ़ाइल सहेज ली गई!' : 'Patient & Caretaker Profile saved with custom passcode!');
        window.smritiSpeech.speak(isHi 
          ? `${updated.preferredName} और देखभालकर्ता ${updated.caregiverName} की प्रोफ़ाइल अपडेट कर दी गई है।`
          : `Profile updated for ${updated.preferredName} and caretaker ${updated.caregiverName}.`
        );
      });
    }
  }

  function refreshCaregiverDashboard() {
    const patient = window.smritiData.getPatient();
    const metrics = window.smritiData.getSummaryMetrics();
    const today = window.smritiData.getTodayRecord();

    // Patient Profile Banner
    const nameEl = document.getElementById('cg-patient-name');
    const stageEl = document.getElementById('cg-patient-stage');
    const moodEl = document.getElementById('cg-today-mood-pill');
    const gamesCountEl = document.getElementById('cg-today-games-pill');

    if (nameEl) nameEl.textContent = `${patient.name}, ${patient.age}y`;
    if (stageEl) {
      const cgContact = patient.caregiverName ? ` • Primary Caretaker: ${patient.caregiverName} (${patient.emergencyPhone})` : '';
      stageEl.textContent = `${patient.stage}${cgContact}`;
    }
    if (moodEl) moodEl.textContent = (today.mood || 'Happy').toUpperCase();
    if (gamesCountEl) gamesCountEl.textContent = `${today.gamesCompleted || 0} / 4 Done`;

    // Dynamic emergency action button subtitles
    const docMeta = document.getElementById('cg-doc-meta');
    const docTitle = document.getElementById('cg-doc-title');
    if (docMeta) docMeta.textContent = `${patient.doctorName || 'Doctor'} (${patient.doctorPhone || 'Clinic'})`;
    if (docTitle && patient.doctorName) docTitle.textContent = `Contact Doctor: ${patient.doctorName.split(' ')[0]}`;

    const cgMeta = document.getElementById('cg-caregiver-meta');
    const cgTitle = document.getElementById('cg-caregiver-title');
    if (cgMeta) cgMeta.textContent = `${patient.caregiverName}: ${patient.emergencyPhone}`;
    if (cgTitle) cgTitle.textContent = `Call Caretaker (${patient.caregiverRelation || 'Emergency'})`;

    // Metrics Cards
    const valOverall = document.getElementById('metric-val-overall');
    const valMemory = document.getElementById('metric-val-memory');
    const valSeq = document.getElementById('metric-val-seq');
    const valRec = document.getElementById('metric-val-rec');
    const valGarden = document.getElementById('metric-val-garden');

    if (valOverall) valOverall.textContent = `${metrics.overall}%`;
    if (valMemory) valMemory.textContent = `${metrics.memory}%`;
    if (valSeq) valSeq.textContent = `${metrics.seq}%`;
    if (valRec) valRec.textContent = `${metrics.rec}%`;
    if (valGarden) valGarden.textContent = `${metrics.garden}%`;

    // Redraw Bar Chart
    if (state.barChart) {
      setTimeout(() => {
        state.barChart.resizeAndDraw();
      }, 50);
    }

    // Render Table & Notes
    renderScoreTable();
    renderNotes();
  }

  function renderScoreTable() {
    if (!scoreTableBody) return;
    const records = window.smritiData.getRecords().slice(-8).reverse();

    scoreTableBody.innerHTML = records.map(rec => {
      const getTagClass = (score) => {
        if (!score && score !== 0) return 'score-tag';
        if (score >= 80) return 'score-tag high';
        if (score >= 65) return 'score-tag medium';
        return 'score-tag low';
      };

      const moodEmoji = {
        happy: '😊 Happy',
        calm: '😌 Calm',
        neutral: '😐 Neutral',
        tired: '😔 Tired'
      }[rec.mood] || '😊 Happy';

      return `
        <tr>
          <td><strong>${rec.displayDate}</strong> (${rec.weekday})</td>
          <td>
            <span class="${getTagClass(rec.averageScore)}">
              ${rec.averageScore > 0 ? rec.averageScore + '%' : 'Pending'}
            </span>
          </td>
          <td>${rec.memoryScore != null ? rec.memoryScore + '%' : '—'}</td>
          <td>${rec.sequencingScore != null ? rec.sequencingScore + '%' : '—'}</td>
          <td>${rec.recognitionScore != null ? rec.recognitionScore + '%' : '—'}</td>
          <td>${rec.gardenScore != null ? rec.gardenScore + '%' : '—'}</td>
          <td>${moodEmoji}</td>
        </tr>
      `;
    }).join('');
  }

  function renderNotes() {
    if (!notesList) return;
    const notes = window.smritiData.getNotes();

    notesList.innerHTML = notes.map(n => `
      <div class="cg-note-entry">
        <div class="cg-note-time">${n.time}</div>
        <div class="cg-note-text">${n.text}</div>
        ${n.tags && n.tags.length > 0 ? `
          <div class="cg-note-tags">
            ${n.tags.map(t => `<span class="cg-note-tag">${t}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  /* ---------------------------------------------------------
     Accessibility Controls (Speech Voice & High Contrast)
     --------------------------------------------------------- */
  function setupAccessibilityControls() {
    toggleVoiceBtn.addEventListener('click', () => {
      state.isVoiceEnabled = window.smritiSpeech.toggleVoice();
      const isHi = window.smritiI18n && window.smritiI18n.getLanguage() === 'hi';
      if (state.isVoiceEnabled) {
        toggleVoiceBtn.innerHTML = isHi ? '🔊 आवाज़ चालू' : '🔊 Voice On';
        showToast(isHi ? 'ऑडियो वाचन सक्षम किया गया' : 'Audio reading enabled');
      } else {
        toggleVoiceBtn.innerHTML = isHi ? '🔇 आवाज़ बंद' : '🔇 Voice Off';
        showToast(isHi ? 'ऑडियो वाचन म्यूट किया गया' : 'Audio reading muted');
      }
    });

    toggleContrastBtn.addEventListener('click', () => {
      state.isHighContrast = !state.isHighContrast;
      document.body.classList.toggle('high-contrast', state.isHighContrast);
      const isHi = window.smritiI18n && window.smritiI18n.getLanguage() === 'hi';
      showToast(state.isHighContrast 
        ? (isHi ? 'उच्च कंट्रास्ट मोड चालू' : 'High Contrast Mode On') 
        : (isHi ? 'सामान्य कंट्रास्ट मोड चालू' : 'Standard Contrast Mode On')
      );
    });
  }

  /* ---------------------------------------------------------
     Language Preference (English & Hindi)
     --------------------------------------------------------- */
  function setupLanguagePreference() {
    const btnLangEn = document.getElementById('btn-lang-en');
    const btnLangHi = document.getElementById('btn-lang-hi');
    const welcomeLangEn = document.getElementById('welcome-lang-en');
    const welcomeLangHi = document.getElementById('welcome-lang-hi');
    const profLanguage = document.getElementById('prof-language');

    const syncButtonsAndUI = (lang) => {
      document.querySelectorAll('.lang-btn').forEach(b => {
        if (b.getAttribute('data-lang') === lang) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      if (profLanguage) profLanguage.value = lang;
      setupDateTimeGreeting();
      
      // Update voice & contrast button labels
      if (toggleVoiceBtn) {
        toggleVoiceBtn.innerHTML = state.isVoiceEnabled 
          ? (lang === 'hi' ? '🔊 आवाज़ चालू' : '🔊 Voice On')
          : (lang === 'hi' ? '🔇 आवाज़ बंद' : '🔇 Voice Off');
      }
      if (toggleContrastBtn) {
        toggleContrastBtn.innerHTML = lang === 'hi' ? '👁️ उच्च कंट्रास्ट' : '👁️ High Contrast';
      }
    };

    const handleSwitchLang = (lang) => {
      if (!window.smritiI18n) return;
      window.smritiI18n.setLanguage(lang);
      syncButtonsAndUI(lang);

      if (lang === 'hi') {
        showToast('भाषा बदलकर हिंदी कर दी गई है 🇮🇳');
        window.smritiSpeech.speak('नमस्ते! स्मृति में आपका स्वागत है। आपकी दैनिक गतिविधियों में हम आपके साथ हैं।');
      } else {
        showToast('Language changed to English 🇬🇧');
        window.smritiSpeech.speak('Language changed to English. Welcome back.');
      }
    };

    if (btnLangEn) btnLangEn.addEventListener('click', () => handleSwitchLang('en'));
    if (btnLangHi) btnLangHi.addEventListener('click', () => handleSwitchLang('hi'));
    if (welcomeLangEn) welcomeLangEn.addEventListener('click', () => handleSwitchLang('en'));
    if (welcomeLangHi) welcomeLangHi.addEventListener('click', () => handleSwitchLang('hi'));

    if (profLanguage) {
      profLanguage.addEventListener('change', (e) => {
        handleSwitchLang(e.target.value);
      });
    }

    window.addEventListener('smriti_language_changed', (e) => {
      const lang = e.detail?.language || 'en';
      syncButtonsAndUI(lang);
    });

    // Initial sync
    if (window.smritiI18n) {
      syncButtonsAndUI(window.smritiI18n.getLanguage());
    }
  }

  /* ---------------------------------------------------------
     New User Onboarding & Registration Wizard
     --------------------------------------------------------- */
  function setupNewUserWizard() {
    const modal = document.getElementById('new-user-modal');
    const modalClose = document.getElementById('new-user-modal-close');
    const btnOpenFromWelcome = document.getElementById('btn-open-new-user-wizard');
    const roleWelcomeModal = document.getElementById('role-welcome-modal');

    const step1 = document.getElementById('nu-step-1');
    const step2 = document.getElementById('nu-step-2');
    const step3 = document.getElementById('nu-step-3');
    const ind1 = document.getElementById('step-ind-1');
    const ind2 = document.getElementById('step-ind-2');
    const ind3 = document.getElementById('step-ind-3');

    const btnPrev = document.getElementById('btn-nu-prev');
    const btnNext = document.getElementById('btn-nu-next');
    const btnSubmit = document.getElementById('btn-nu-submit');
    const form = document.getElementById('new-user-form');
    const step2Error = document.getElementById('nu-step2-error');

    let currentStep = 1;

    const openModal = () => {
      currentStep = 1;
      showStep(1);
      if (roleWelcomeModal) roleWelcomeModal.classList.remove('active');
      modal?.classList.add('active');
      setTimeout(() => document.getElementById('nu-patient-name')?.focus(), 150);
    };

    const closeModal = () => {
      modal?.classList.remove('active');
    };

    if (btnOpenFromWelcome) btnOpenFromWelcome.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);

    const showStep = (step) => {
      currentStep = step;
      if (step1) step1.style.display = step === 1 ? 'flex' : 'none';
      if (step2) step2.style.display = step === 2 ? 'flex' : 'none';
      if (step3) step3.style.display = step === 3 ? 'flex' : 'none';

      // Indicators
      [ind1, ind2, ind3].forEach((ind, i) => {
        if (!ind) return;
        const num = ind.querySelector('.step-num');
        if (i + 1 === step) {
          ind.classList.add('active');
          ind.classList.remove('completed');
          if (num) num.style.background = '#059669';
        } else if (i + 1 < step) {
          ind.classList.add('completed');
          ind.classList.remove('active');
          if (num) num.style.background = '#10b981';
        } else {
          ind.classList.remove('active', 'completed');
          if (num) num.style.background = '#e2e8f0';
        }
      });

      // Buttons
      if (btnPrev) btnPrev.style.display = step > 1 ? 'block' : 'none';
      if (btnNext) btnNext.style.display = step < 3 ? 'block' : 'none';
      if (btnSubmit) btnSubmit.style.display = step === 3 ? 'block' : 'none';
    };

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (currentStep > 1) showStep(currentStep - 1);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (currentStep === 1) {
          const name = document.getElementById('nu-patient-name')?.value.trim();
          const preferred = document.getElementById('nu-patient-preferred')?.value.trim();
          if (!name || !preferred) {
            showToast('Please enter the patient full name and greeting name');
            return;
          }
          showStep(2);
        } else if (currentStep === 2) {
          const pin = document.getElementById('nu-cg-pin')?.value.trim();
          const pinConfirm = document.getElementById('nu-cg-pin-confirm')?.value.trim();
          if (pin && pin.length < 4) {
            if (step2Error) {
              step2Error.textContent = '⚠️ Passcode must be at least 4 digits.';
              step2Error.style.display = 'block';
            }
            return;
          }
          if (pin && pinConfirm && pin !== pinConfirm) {
            if (step2Error) {
              step2Error.textContent = '⚠️ Passcodes do not match.';
              step2Error.style.display = 'block';
            }
            return;
          }
          if (step2Error) step2Error.style.display = 'none';
          showStep(3);
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const profileData = {
          name: document.getElementById('nu-patient-name')?.value.trim() || 'Patient',
          preferredName: document.getElementById('nu-patient-preferred')?.value.trim() || 'Friend',
          age: parseInt(document.getElementById('nu-patient-age')?.value, 10) || 70,
          gender: document.getElementById('nu-patient-gender')?.value || 'Female',
          stage: document.getElementById('nu-patient-stage')?.value || 'Early-Stage Dementia',
          notes: document.getElementById('nu-patient-notes')?.value.trim() || '',
          caregiverName: document.getElementById('nu-cg-name')?.value.trim() || 'Primary Caregiver',
          caregiverRelation: document.getElementById('nu-cg-relation')?.value.trim() || 'Family Caregiver',
          emergencyPhone: document.getElementById('nu-cg-phone')?.value.trim() || '+1 (555) 000-0000',
          caregiverEmail: document.getElementById('nu-cg-email')?.value.trim() || '',
          pin: document.getElementById('nu-cg-pin')?.value.trim() || '1234',
          doctorName: document.getElementById('nu-doc-name')?.value.trim() || 'Family Physician',
          doctorPhone: document.getElementById('nu-doc-phone')?.value.trim() || '',
          homeAddress: document.getElementById('nu-home-address')?.value.trim() || 'Home'
        };

        const chosenLang = document.getElementById('nu-language')?.value || 'en';

        // Save fresh patient & caretaker
        window.smritiData.createNewPatientProfile(profileData);

        // Language preference sync
        if (window.smritiI18n && window.smritiI18n.getLanguage() !== chosenLang) {
          window.smritiI18n.setLanguage(chosenLang);
        }

        closeModal();
        switchPortal('patient');

        const isHi = chosenLang === 'hi';
        const toastMsg = isHi 
          ? `नमस्ते ${profileData.preferredName}! नई प्रोफ़ाइल सफलतापूर्वक बनाई गई।`
          : `Welcome ${profileData.preferredName}! Fresh care profile initialized.`;
        showToast(toastMsg);

        setTimeout(() => {
          window.smritiSpeech.speak(isHi 
            ? `नमस्ते ${profileData.preferredName}! स्मृति में आपका स्वागत है। आपकी दैनिक गतिविधियों में हम आपके साथ हैं।`
            : `Welcome to Smriti, ${profileData.preferredName}! Your personalized cognitive companion is ready.`
          );
        }, 600);
      });
    }
  }

  /* ---------------------------------------------------------
     Community & Volunteer Contribution Hub
     --------------------------------------------------------- */
  function setupCommunityHub() {
    const modal = document.getElementById('community-hub-modal');
    const modalClose = document.getElementById('community-hub-modal-close');
    const btnHeaderContribute = document.getElementById('btn-header-contribute');
    const btnOpenFromWelcome = document.getElementById('btn-open-community-hub');
    const btnQuickShareTip = document.getElementById('btn-quick-share-tip');
    const roleWelcomeModal = document.getElementById('role-welcome-modal');

    const tabBtns = document.querySelectorAll('.comm-tab-btn');
    const tabPanels = {
      gallery: document.getElementById('panel-comm-gallery'),
      tip: document.getElementById('panel-comm-tip'),
      game: document.getElementById('panel-comm-game'),
      volunteer: document.getElementById('panel-comm-volunteer')
    };

    const container = document.getElementById('community-cards-container');

    const openModal = (defaultTab = 'gallery') => {
      if (roleWelcomeModal) roleWelcomeModal.classList.remove('active');
      switchTab(defaultTab);
      modal?.classList.add('active');
      renderCards();
    };

    const closeModal = () => {
      modal?.classList.remove('active');
    };

    if (btnHeaderContribute) btnHeaderContribute.addEventListener('click', () => openModal('gallery'));
    if (btnOpenFromWelcome) btnOpenFromWelcome.addEventListener('click', () => openModal('gallery'));
    if (btnQuickShareTip) btnQuickShareTip.addEventListener('click', () => switchTab('tip'));
    if (modalClose) modalClose.addEventListener('click', closeModal);

    const switchTab = (tabName) => {
      tabBtns.forEach(b => {
        if (b.getAttribute('data-tab') === tabName) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
        b.style.color = '';
        b.style.borderBottomColor = '';
      });

      Object.entries(tabPanels).forEach(([name, panel]) => {
        if (panel) {
          panel.style.display = name === tabName ? 'flex' : 'none';
        }
      });

      if (tabName === 'gallery') {
        renderCards();
      }
    };

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        switchTab(tab);
      });
    });

    // Form 1: Share Tip
    const formTip = document.getElementById('form-contrib-tip');
    if (formTip) {
      formTip.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = document.getElementById('tip-author')?.value.trim() || 'Caregiver';
        const role = document.getElementById('tip-author-role')?.value || 'Family Caregiver';
        const category = document.getElementById('tip-category')?.value || 'Sundowning & Calming';
        const title = document.getElementById('tip-title')?.value.trim() || 'Caregiver Tip';
        const content = document.getElementById('tip-content')?.value.trim() || '';

        if (!content) return;

        window.smritiData.addCommunityContribution({
          type: 'tip',
          title,
          category,
          author,
          authorRole: role,
          content
        });

        formTip.reset();
        showToast('Thank you! Your caregiving tip has been published to the community.');
        window.smritiSpeech.speak('Thank you for sharing your tip with the caregiver community.');
        switchTab('gallery');
      });
    }

    // Form 2: Contribute Game
    const formGame = document.getElementById('form-contrib-game');
    if (formGame) {
      formGame.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('game-title')?.value.trim() || 'Memory Game';
        const category = document.getElementById('game-category')?.value || 'Object Recognition';
        const author = document.getElementById('game-author')?.value.trim() || 'Contributor';
        const content = document.getElementById('game-content')?.value.trim() || '';

        if (!content) return;

        window.smritiData.addCommunityContribution({
          type: 'game',
          title,
          category,
          author,
          authorRole: 'Activity Contributor',
          content
        });

        formGame.reset();
        showToast('Activity submitted! Thank you for supporting dementia cognitive health.');
        window.smritiSpeech.speak('Thank you for contributing a memory activity.');
        switchTab('gallery');
      });
    }

    // Form 3: Volunteer Support
    const formVolunteer = document.getElementById('form-contrib-volunteer');
    if (formVolunteer) {
      formVolunteer.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('vol-name')?.value.trim() || 'Volunteer';
        const service = document.getElementById('vol-service')?.value || 'Companion Support';
        const city = document.getElementById('vol-city')?.value.trim() || 'Community';
        const notes = document.getElementById('vol-notes')?.value.trim() || '';

        if (!notes) return;

        window.smritiData.addCommunityContribution({
          type: 'volunteer',
          title: `${service} (${city})`,
          category: 'Volunteer Support',
          author: name,
          authorRole: 'Community Volunteer',
          content: notes
        });

        formVolunteer.reset();
        showToast('Thank you for joining as a volunteer supporter!');
        window.smritiSpeech.speak('Thank you for offering your volunteer support.');
        switchTab('gallery');
      });
    }

    // Render Cards in Gallery
    function renderCards() {
      if (!container) return;
      const contributions = window.smritiData.getCommunityContributions();

      container.innerHTML = contributions.map(item => {
        const tagClass = item.type === 'game' ? 'game' : item.type === 'volunteer' ? 'volunteer' : 'tip';
        const typeLabel = item.type === 'game' ? 'Game' : item.type === 'volunteer' ? 'Volunteer' : 'Tip';

        return `
          <div class="community-card" data-id="${item.id}">
            <div class="comm-card-header">
              <div>
                <span class="comm-card-tag ${tagClass}">${typeLabel} • ${item.category}</span>
                <h5 class="comm-card-title">${item.title}</h5>
              </div>
              <button type="button" class="btn-upvote" data-id="${item.id}" title="Support this insight">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <span>${item.upvotes || 0}</span>
              </button>
            </div>
            <p class="comm-card-body">${item.content}</p>
            <div class="comm-card-footer">
              <span>By <strong>${item.author}</strong> (${item.authorRole || 'Contributor'})</span>
              <span>${item.date || 'Recent'}</span>
            </div>
          </div>
        `;
      }).join('');

      // Upvote buttons
      container.querySelectorAll('.btn-upvote').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.getAttribute('data-id'), 10);
          window.smritiData.upvoteCommunityContribution(id);
          if (window.smritiAudio) window.smritiAudio.playChime();
          renderCards();
        });
      });
    }

    window.addEventListener('smriti_community_updated', () => {
      renderCards();
    });
  }

  /* ---------------------------------------------------------
     Live Event Listeners for State Updates
     --------------------------------------------------------- */
  function listenForDataUpdates() {
    window.addEventListener('smriti_score_updated', () => {
      refreshPatientStatus();
      if (state.currentPortal === 'caregiver') {
        refreshCaregiverDashboard();
      }
    });

    window.addEventListener('smriti_mood_updated', () => {
      if (state.currentPortal === 'caregiver') {
        refreshCaregiverDashboard();
      }
    });

    window.addEventListener('smriti_profile_updated', () => {
      setupDateTimeGreeting();
      if (state.currentPortal === 'caregiver') {
        refreshCaregiverDashboard();
      }
    });
  }

  /* ---------------------------------------------------------
     Toast Feedback Helper
     --------------------------------------------------------- */
  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>💬</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
});
