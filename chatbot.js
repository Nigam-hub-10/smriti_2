/* =========================================================
   Smriti AI Companion Chatbot - Intelligent NLP Engine
   Tailored with compassionate dementia-care communication:
   - Understands greetings, self-reassurance, questions, jokes
   - Provides direct one-touch calls to caretaker & doctor
   - Non-repetitive dynamic responses with voice read-aloud
   ========================================================= */

class SmritiChatbot {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.messages = [];
    this.fallbackCounter = 0;
    this.init();
  }

  init() {
    this.seedWelcome();
  }

  seedWelcome() {
    const isHi = window.smritiI18n && window.smritiI18n.getLanguage() === 'hi';
    const patient = window.smritiData ? window.smritiData.getPatient() : { preferredName: "friend", caregiverName: "your caretaker" };
    
    if (isHi) {
      this.messages = [
        {
          sender: 'bot',
          text: `नमस्ते ${patient.preferredName || 'मित्र'}! मैं आपका स्मृति एआई साथी हूँ। आप मुझसे बात कर सकते हैं, पूछ सकते हैं 'क्या मैं ठीक हूँ?', समय या तारीख जान सकते हैं, या अपनी देखभालकर्ता ${patient.caregiverName || 'को'} कॉल कर सकते हैं। आज आप कैसा महसूस कर रहे हैं?`,
          actions: [
            { label: `📞 कॉल करें: ${patient.caregiverName || 'देखभालकर्ता'}`, type: 'call_caregiver' },
            { label: '🩺 डॉक्टर को कॉल करें', type: 'call_doctor' },
            { label: '📍 मैं कहाँ हूँ?', type: 'location' },
            { label: '🌸 फूलों का बगीचा', type: 'go_garden' }
          ]
        }
      ];
    } else {
      this.messages = [
        {
          sender: 'bot',
          text: `Hello ${patient.preferredName || 'friend'}! I am your Smriti Care Companion. You can say 'Hello', ask 'Am I okay?', ask what day it is, or tap below to call ${patient.caregiverName || 'your caretaker'}. How are you feeling today?`,
          actions: [
            { label: `📞 Call ${patient.caregiverName || 'Caretaker'}`, type: 'call_caregiver' },
            { label: '🩺 Call Doctor', type: 'call_doctor' },
            { label: '📍 Where am I?', type: 'location' },
            { label: '🌸 Visit Flower Garden', type: 'go_garden' }
          ]
        }
      ];
    }
  }

  respond(userQuery) {
    const raw = (userQuery || '').trim();
    const query = raw.toLowerCase().replace(/[?!.,]/g, '').trim();
    const patient = window.smritiData ? window.smritiData.getPatient() : {};
    const today = new Date();

    let reply = "";
    let actions = [];

    // Keyword matching helper functions
    const hasAny = (keywords) => keywords.some(k => query.includes(k.toLowerCase()));
    const isExact = (keywords) => keywords.some(k => query === k.toLowerCase());

    const isHi = (window.smritiI18n && window.smritiI18n.getLanguage() === 'hi') || hasAny(['नमस्ते', 'प्रणाम', 'कहाँ', 'कौन', 'कॉल', 'मदद', 'डॉक्टर', 'दिन', 'समय', 'ठीक', 'घर', 'नाम', 'पानी', 'चाय', 'दवा', 'दर्द', 'चिंता']);

    // 1. Greetings ("hello", "hi", "hey", "नमस्ते", "सुप्रभात")
    if (isExact(['hello', 'hi', 'hey', 'hiya', 'namaste', 'good morning', 'good afternoon', 'good evening', 'नमस्ते', 'प्रणाम', 'सुप्रभात', 'शुभ संध्या', 'नमस्कार']) || query.startsWith('hello') || query.startsWith('hi ') || query.startsWith('hey') || query.startsWith('नमस्ते') || query.startsWith('good morning')) {
      if (isHi) {
        const greetingsHi = [
          `नमस्ते ${patient.preferredName || 'मित्र'}! आपसे बात करके बहुत खुशी हुई। आज आपका दिन कैसा बीत रहा है?`,
          `प्रणाम ${patient.preferredName || 'जी'}! आपका दिन बहुत शांत और सुखद रहे। बताइए, मैं आपकी क्या सहायता कर सकता हूँ?`,
          `सुप्रभात ${patient.preferredName || 'मित्र'}! आशा है आपकी सुबह बहुत सुखद रही होगी। क्या आप कोई गतिविधि खेलना चाहते हैं?`
        ];
        reply = greetingsHi[Math.floor(Math.random() * greetingsHi.length)];
        actions.push({ label: '🌸 फूलों का बगीचा', type: 'go_garden' });
        actions.push({ label: `📞 कॉल करें: ${patient.caregiverName || 'देखभालकर्ता'}`, type: 'call_caregiver' });
      } else {
        const greetings = [
          `Hello ${patient.preferredName || 'there'}! It's so lovely to chat with you today. How is your day going?`,
          `Hi ${patient.preferredName || 'there'}! A warm welcome to you. The day is bright and peaceful. What can I do for you?`,
          `Good to see you, ${patient.preferredName || 'my friend'}! I hope you are having a serene morning. How can I assist you right now?`
        ];
        reply = greetings[Math.floor(Math.random() * greetings.length)];
        actions.push({ label: '🌸 Visit Flower Garden', type: 'go_garden' });
        actions.push({ label: `📞 Call ${patient.caregiverName || 'Caretaker'}`, type: 'call_caregiver' });
      }
    }

    // 2. Self-Reassurance / "Am I okay?" / "I am okay?" / "क्या मैं ठीक हूँ?"
    else if (hasAny(['okay', 'ok', 'safe', 'alright', 'fine', 'good', 'am i okay', 'i am okay', 'am i safe', 'is everything ok', 'am i alright', 'ठीक', 'सुरक्षित', 'सब ठीक', 'घबराहट'])) {
      if (isHi) {
        reply = `हाँ ${patient.preferredName || 'जी'}, आप बिल्कुल सुरक्षित हैं! आप अपने घर ${patient.homeAddress || 'ग्रीनवुड विला'} में आराम से हैं। आपकी देखभालकर्ता ${patient.caregiverName || 'सारा'} आपका बहुत स्नेह से ध्यान रखती हैं। चिंता की कोई बात नहीं है।`;
        actions.push({ label: `📞 ${patient.caregiverName || 'देखभालकर्ता'} से बात करें`, type: 'call_caregiver', isPrimary: true });
        actions.push({ label: '🌸 शांत बगीचे में टहलें', type: 'go_garden' });
      } else {
        reply = `Yes, ${patient.preferredName || 'Eleanor'}, you are doing wonderfully! You are completely safe and comfortable in your home at ${patient.homeAddress || 'Greenwood Villa'}. Your caretaker ${patient.caregiverName || 'Sarah'} loves you and is right here supporting you. Everything is in peaceful order.`;
        actions.push({ label: `📞 Talk with ${patient.caregiverName || 'Caretaker'}`, type: 'call_caregiver', isPrimary: true });
        actions.push({ label: '🌸 Relax in Garden', type: 'go_garden' });
      }
    }

    // 3. Who Am I / Identity Questions ("मैं कौन हूँ")
    else if (hasAny(['who am i', 'my name', 'what is my name', 'who i am', 'मैं कौन हूँ', 'मेरा नाम'])) {
      if (isHi) {
        reply = `आप ${patient.name || 'Eleanor Vance'} हैं, एक बहुत ही आदरणीय और प्यारे व्यक्ति। आपकी उम्र ${patient.age || 74} वर्ष है और आपका परिवार आपसे बहुत स्नेह करता है।`;
        actions.push({ label: `📞 ${patient.caregiverName || 'देखभालकर्ता'} को कॉल करें`, type: 'call_caregiver' });
        actions.push({ label: '📍 मेरा घर का पता', type: 'location' });
      } else {
        reply = `You are ${patient.name || 'Eleanor Vance'}, a wonderful and cherished person. You are ${patient.age || 74} years old, and everyone in your family cares deeply for you.`;
        actions.push({ label: `📞 Call ${patient.caregiverName || 'Caretaker'}`, type: 'call_caregiver' });
        actions.push({ label: '📍 My Home Address', type: 'location' });
      }
    }

    // 4. Who Are You / What is Smriti
    else if (hasAny(['who are you', 'what are you', 'what is this', 'what is smriti', 'स्मृति क्या है', 'तुम कौन हो', 'आप कौन हैं'])) {
      if (isHi) {
        reply = `मैं स्मृति हूँ, आपका व्यक्तिगत एआई देखभाल साथी। मैं आपकी दैनिक दिनचर्या में सहायता करने, मस्तिष्क को सक्रिय रखने और डॉक्टर या ${patient.caregiverName || 'देखभालकर्ता'} से एक स्पर्श में संपर्क कराने के लिए यहाँ हूँ।`;
        actions.push({ label: '🎮 याददाश्त खेल खेलें', type: 'go_memory' });
        actions.push({ label: '🌸 फूलों का बगीचा', type: 'go_garden' });
      } else {
        reply = `I am Smriti, your personal AI Care Companion. I'm here to gently help you with daily routines, keep your memory sharp with relaxing games, and make it easy to contact your doctor or ${patient.caregiverName || 'caretaker'} with a single tap.`;
        actions.push({ label: '🎮 Play a Memory Game', type: 'go_memory' });
        actions.push({ label: '🌸 Visit Flower Garden', type: 'go_garden' });
      }
    }

    // 5. Who is Caregiver / Family ("who is sarah", "मेरी देखभालकर्ता")
    else if (hasAny(['who is sarah', 'who is caretaker', 'who is my daughter', 'my son', 'family', 'देखभालकर्ता कौन', 'सारा कौन', 'मेरी बेटी'])) {
      if (isHi) {
        reply = `${patient.caregiverName || 'Sarah Vance'} आपकी प्रिय ${patient.caregiverRelation || 'बेटी और मुख्य देखभालकर्ता'} हैं। वे हमेशा आपके स्वास्थ्य और प्रसन्नता का ध्यान रखती हैं। क्या आप उनसे बात करना चाहते हैं?`;
        actions.push({ label: `📞 ${patient.caregiverName || 'सारा'} को अभी कॉल करें`, type: 'call_caregiver', isPrimary: true });
      } else {
        reply = `${patient.caregiverName || 'Sarah Vance'} is your loving ${patient.caregiverRelation || 'daughter and primary caretaker'}. She is always looking out for your health and happiness. Would you like to call her now?`;
        actions.push({ label: `📞 Call ${patient.caregiverName || 'Sarah'} Now`, type: 'call_caregiver', isPrimary: true });
      }
    }

    // 6. Call Caretaker / Family Intent ("कॉल करो")
    else if (hasAny(['call', 'phone', 'dial', 'speak to', 'talk to', 'कॉल', 'फ़ोन', 'बात', 'मिलाओ']) && hasAny(['caretaker', 'sarah', 'daughter', 'son', 'nurse', 'family', 'caregiver', 'mom', 'dad', 'someone', 'देखभालकर्ता', 'सारा', 'बेटी'])) {
      if (isHi) {
        reply = `मैं अभी आपकी देखभालकर्ता ${patient.caregiverName || 'से'} आपके फ़ोन ${patient.emergencyPhone || ''} पर बात करवाता हूँ। नीचे दिए गए हरे बटन को स्पर्श करें।`;
        actions.push({ label: `📞 कॉल करें: ${patient.caregiverName || 'देखभालकर्ता'}`, type: 'call_caregiver', isPrimary: true });
      } else {
        reply = `I can connect you with ${patient.caregiverName || 'your caretaker'} right now at ${patient.emergencyPhone || 'their phone'}. Just tap the green button below.`;
        actions.push({ label: `📞 Dial ${patient.caregiverName || 'Caretaker'} (${patient.emergencyPhone || 'Call'})`, type: 'call_caregiver', isPrimary: true });
      }
    }

    // 7. Doctor / Illness / Pain / Medical Emergency ("डॉक्टर", "दर्द")
    else if (hasAny(['doctor', 'hospital', 'pain', 'sick', 'clinic', 'headache', 'emergency', 'hurt', 'dizzy', 'unwell', 'nurse', 'डॉक्टर', 'दर्द', 'अस्पताल', 'बीमार', 'दवा'])) {
      if (isHi) {
        reply = `मैं आपके साथ हूँ। यदि आपको कोई अस्वस्थता या तकलीफ़ महसूस हो रही है, तो आइए तुरंत डॉक्टर ${patient.doctorName || 'डॉ. अरविंद मेहता'} या देखभालकर्ता ${patient.caregiverName || 'को'} सूचित करें।`;
        actions.push({ label: `🩺 डॉक्टर ${patient.doctorName || ''} को कॉल करें`, type: 'call_doctor', isPrimary: true });
        actions.push({ label: `📞 देखभालकर्ता को सूचित करें`, type: 'call_caregiver' });
      } else {
        reply = `I am right here with you. If you feel any discomfort or want a checkup, let's call ${patient.doctorName || 'Dr. Arvind Mehta'} or notify ${patient.caregiverName || 'your caretaker'} immediately.`;
        actions.push({ label: `🩺 Call ${patient.doctorName || 'Doctor'}`, type: 'call_doctor', isPrimary: true });
        actions.push({ label: `📞 Alert ${patient.caregiverName || 'Caretaker'}`, type: 'call_caregiver' });
      }
    }

    // 8. Location / Orientation / Where Am I ("मैं कहाँ हूँ")
    else if (hasAny(['where am i', 'where i am', 'my home', 'address', 'lost', 'where is this', 'room', 'मैं कहाँ हूँ', 'मेरा घर', 'कहाँ हूँ'])) {
      if (isHi) {
        reply = `आप अपने परिचित और सुरक्षित घर में हैं: ${patient.homeAddress || 'Greenwood Villa, Apt 4B'}। यहाँ सब कुछ शांत और सुरक्षित है।`;
        actions.push({ label: '📍 घर का पता देखें', type: 'location' });
        actions.push({ label: `📞 देखभालकर्ता को कॉल करें`, type: 'call_caregiver' });
      } else {
        reply = `You are safe at your home: ${patient.homeAddress || 'Greenwood Villa, Apt 4B'}. You are in your familiar, peaceful environment. Everything is alright.`;
        actions.push({ label: '📍 View Address Details', type: 'location' });
        actions.push({ label: `📞 Call ${patient.caregiverName || 'Caretaker'}`, type: 'call_caregiver' });
      }
    }

    // 9. Time, Day & Calendar Questions ("समय", "तारीख")
    else if (hasAny(['time', 'clock', 'what day', 'what date', 'month', 'year', 'today', 'day is it', 'day today', 'समय', 'दिन', 'तारीख', 'कितने बजे'])) {
      const timeStr = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (isHi) {
        const dayNamesHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
        const monthsHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
        const dateStrHi = `${today.getDate()} ${monthsHi[today.getMonth()]} ${today.getFullYear()} (${dayNamesHi[today.getDay()]})`;
        reply = `इस समय ${timeStr} बज रहे हैं, और आज ${dateStrHi} है। आपका दिन शांत और सुखद रहे।`;
        actions.push({ label: '🌸 फूलों का बगीचा', type: 'go_garden' });
      } else {
        const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        reply = `Right now, the time is ${timeStr}, and today is ${dateStr}. You are having a calm and steady day.`;
        actions.push({ label: '🌸 Visit Garden', type: 'go_garden' });
      }
    }

    // 10. Anxiety / Fear / Confusion / Sadness
    else if (hasAny(['anxious', 'scared', 'afraid', 'worried', 'sad', 'confused', 'tired', 'lonely', 'nervous', 'cry'])) {
      reply = `Take a slow, deep breath in and let it gently out. You are safe, loved, and surrounded by people who care for you. ${patient.caregiverName || 'Your caretaker'} is always thinking of you. Would you like to hear a calming melody or visit the peaceful flower garden?`;
      actions.push({ label: '🌸 Visit Calming Garden', type: 'go_garden', isPrimary: true });
      actions.push({ label: `📞 Talk to ${patient.caregiverName || 'Caretaker'}`, type: 'call_caregiver' });
    }

    // 11. Activities / "What should I do?" / "I am bored"
    else if (hasAny(['do', 'play', 'game', 'bored', 'activity', 'activities', 'exercise'])) {
      reply = `We have four wonderful cognitive activities ready for you: Daily Essentials Match, Routine Steps, Everyday Item Recall, and the Calming Flower Garden! Playing them keeps memory vibrant. Which would you like to try?`;
      actions.push({ label: '👓 Daily Essentials Match', type: 'go_memory' });
      actions.push({ label: '📋 Routine Steps', type: 'go_seq' });
      actions.push({ label: '💡 Item Recall', type: 'go_rec' });
      actions.push({ label: '🌸 Flower Garden', type: 'go_garden' });
    }

    // 12. Medicine & Health Reminders
    else if (hasAny(['medicine', 'pill', 'tablet', 'dose', 'prescription'])) {
      reply = `Your medication routine is safely logged with ${patient.caregiverName || 'your caretaker'}. Make sure to take pills with a full glass of cool water! Would you like to call ${patient.caregiverName || 'your caretaker'} to confirm?`;
      actions.push({ label: `📞 Confirm with ${patient.caregiverName || 'Caretaker'}`, type: 'call_caregiver' });
    }

    // 13. Tea, Water, Food, Refreshment
    else if (hasAny(['tea', 'water', 'drink', 'thirsty', 'hungry', 'eat', 'breakfast', 'lunch', 'dinner', 'coffee'])) {
      reply = `Staying hydrated and drinking fresh water is wonderful for your energy and clarity! ${patient.notes ? `Reminder: ${patient.notes}` : 'Take a few refreshing sips of water or warm tea whenever you like.'}`;
      actions.push({ label: '🌸 Relax in Garden', type: 'go_garden' });
    }

    // 14. Compliments, Gratitude, Love ("thank you", "thanks", "i love you", "nice")
    else if (hasAny(['thank', 'thanks', 'love you', 'nice', 'kind', 'good bot', 'sweet'])) {
      reply = `You are so kind and thoughtful, ${patient.preferredName || 'Eleanor'}! Your warm words bring a smile to my day. I am always happy to be your companion.`;
    }

    // 15. Jokes & Humor ("tell me a joke", "laugh", "funny")
    else if (hasAny(['joke', 'laugh', 'funny', 'smile', 'story'])) {
      const jokes = [
        "Why did the gardener plant light bulbs? Because they wanted to grow a power plant! 😊🌻",
        "What do clouds wear under their raincoats? Thunder-wear! ☁️😄",
        "Why do birds fly south for the winter? Because it's too far to walk! 🐦✨"
      ];
      reply = jokes[Math.floor(Math.random() * jokes.length)];
      actions.push({ label: '🌸 Visit Flower Garden', type: 'go_garden' });
    }

    // 16. Dynamic Intelligent Fallbacks (Never the same repetitious text!)
    else {
      this.fallbackCounter++;
      const fallbacks = [
        `I hear you, ${patient.preferredName || 'Eleanor'}. I am always here by your side. You can ask me about your home, what time it is, or tap below to speak directly with ${patient.caregiverName || 'your caretaker'}.`,
        `That's a thoughtful question, ${patient.preferredName || 'Eleanor'}. You are safe and doing very well today. If you need any assistance, ${patient.caregiverName || 'Sarah'} is just one tap away.`,
        `I am listening, ${patient.preferredName || 'Eleanor'}! Remember that you are surrounded by care and warmth. Would you like to relax in the flower garden or call ${patient.caregiverName || 'your caretaker'}?`,
        `Thank you for sharing that with me. Everything is peaceful and alright. If you ever feel unsure, you can tap to call ${patient.caregiverName || 'your caretaker'} anytime.`
      ];
      reply = fallbacks[this.fallbackCounter % fallbacks.length];
      actions.push({ label: `📞 Call ${patient.caregiverName || 'Caretaker'}`, type: 'call_caregiver' });
      actions.push({ label: '🩺 Call Doctor', type: 'call_doctor' });
      actions.push({ label: '📍 Where am I?', type: 'location' });
    }

    return { reply, actions };
  }

  handleAction(type) {
    const patient = window.smritiData ? window.smritiData.getPatient() : {};
    if (type === 'call_caregiver') {
      const name = patient.caregiverName || 'Caretaker';
      const phone = patient.emergencyPhone || '+1 (555) 382-9011';
      window.smritiSpeech.speak(`Calling ${name} at ${phone}.`);
      alert(`Connecting call to Primary Caregiver:\n${name} (${patient.caregiverRelation || 'Caretaker'})\nPhone: ${phone}`);
    } else if (type === 'call_doctor') {
      const doc = patient.doctorName || 'Neurologist / Doctor';
      const phone = patient.doctorPhone || '+1 (555) 902-8811';
      window.smritiSpeech.speak(`Calling ${doc} at ${phone}.`);
      alert(`Connecting call to Attending Physician:\n${doc}\nClinic Phone: ${phone}`);
    } else if (type === 'location') {
      const addr = patient.homeAddress || 'Greenwood Villa, Apt 4B';
      window.smritiSpeech.speak(`You are safely home at ${addr}.`);
      alert(`Home Address:\n${addr}\nYou are safe and in your familiar residence.`);
    } else if (type === 'date') {
      const d = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      window.smritiSpeech.speak(`Today is ${d}, and the time is ${t}.`);
      alert(`Current Date & Time:\n${d}\nTime: ${t}`);
    } else if (type === 'go_garden') {
      this.closeModal();
      const card = document.getElementById('game-card-garden');
      if (card) card.click();
    } else if (type === 'go_memory') {
      this.closeModal();
      const card = document.getElementById('game-card-memory');
      if (card) card.click();
    } else if (type === 'go_seq') {
      this.closeModal();
      const card = document.getElementById('game-card-sequencing');
      if (card) card.click();
    } else if (type === 'go_rec') {
      this.closeModal();
      const card = document.getElementById('game-card-recognition');
      if (card) card.click();
    }
  }

  closeModal() {
    const modal = document.getElementById('chatbot-modal');
    if (modal) modal.classList.remove('active');
  }
}

window.SmritiChatbot = SmritiChatbot;
