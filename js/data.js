/* =========================================================
   Smriti - Data Store & LocalStorage Persistence
   Provides seeded 7-day historical records, score logging,
   patient profile, and cognitive trend analysis.
   ========================================================= */

const STORAGE_KEYS = {
  PATIENT_PROFILE: 'smriti_patient_profile',
  CAREGIVER_PROFILE: 'smriti_caregiver_profile',
  CAREGIVER_PIN: 'smriti_caregiver_pin',
  USER_ROLE: 'smriti_user_role',
  DAILY_RECORDS: 'smriti_daily_records',
  CAREGIVER_NOTES: 'smriti_caregiver_notes',
  CURRENT_MOOD: 'smriti_today_mood',
  APP_SETTINGS: 'smriti_app_settings',
  COMMUNITY_CONTRIBUTIONS: 'smriti_community_contributions'
};

// Default Patient Profile
const DEFAULT_PATIENT = {
  name: "Eleanor Vance",
  preferredName: "Eleanor",
  age: 74,
  gender: "Female",
  stage: "Mild Cognitive Impairment (Early Stage)",
  caregiverName: "Sarah Vance",
  caregiverRelation: "Daughter & Primary Caregiver",
  emergencyPhone: "+1 (555) 382-9011",
  doctorName: "Dr. Arvind Mehta (Neurology)",
  doctorPhone: "+1 (555) 902-8811",
  homeAddress: "Greenwood Villa, Apt 4B",
  notes: "Loves morning chamomile tea and listening to 1960s acoustic melodies."
};

// Default Caretaker / Caregiver Account
const DEFAULT_CAREGIVER = {
  name: "Sarah Vance",
  relation: "Daughter & Primary Caregiver",
  phone: "+1 (555) 382-9011",
  email: "sarah.vance@carefamily.org",
  pin: "1234",
  notes: "Assisting Eleanor with morning medication and daily cognitive check-ins."
};

function getLocalDateStr(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Seed historical 7 days with realistic, encouraging cognitive score progressions
function generateInitialHistoricalRecords() {
  const records = [];
  const today = new Date();
  
  // Create 6 past days + today
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = getLocalDateStr(d);
    
    // Realistic fluctuation across past days
    const baseScores = [
      { memory: 75, sequencing: 80, recognition: 85, garden: 90, mood: 'happy' },
      { memory: 70, sequencing: 85, recognition: 80, garden: 85, mood: 'calm' },
      { memory: 80, sequencing: 75, recognition: 90, garden: 95, mood: 'happy' },
      { memory: 85, sequencing: 90, recognition: 85, garden: 90, mood: 'calm' },
      { memory: 80, sequencing: 85, recognition: 95, garden: 100, mood: 'happy' },
      { memory: 85, sequencing: 90, recognition: 90, garden: 95, mood: 'neutral' }
    ];
    
    if (i === 0) {
      // Today starts fresh so player's live gameplay directly sets today's stats!
      records.push({
        date: dateStr,
        displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
        memoryScore: null,
        sequencingScore: null,
        recognitionScore: null,
        gardenScore: null,
        averageScore: 0,
        mood: 'happy',
        gamesCompleted: 0,
        notesCount: 1
      });
    } else {
      const dayData = baseScores[6 - i] || baseScores[0];
      const avgScore = Math.round((dayData.memory + dayData.sequencing + dayData.recognition + dayData.garden) / 4);

      records.push({
        date: dateStr,
        displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
        memoryScore: dayData.memory,
        sequencingScore: dayData.sequencing,
        recognitionScore: dayData.recognition,
        gardenScore: dayData.garden,
        averageScore: avgScore,
        mood: dayData.mood,
        gamesCompleted: 4,
        notesCount: 0
      });
    }
  }
  return records;
}

const DEFAULT_NOTES = [
  {
    id: 1,
    time: "Today, 10:30 AM",
    text: "Eleanor had a bright morning! Completed routine steps and remembered her glasses placement with minimal cues.",
    tags: ["Medication Taken", "Hydrated"]
  },
  {
    id: 2,
    time: "Yesterday, 04:15 PM",
    text: "Enjoyed the focus garden flower game for 10 minutes. Calmed down nicely before afternoon tea.",
    tags: ["Calm Mood"]
  }
];

const DEFAULT_COMMUNITY_CONTRIBUTIONS = [
  {
    id: 1,
    type: 'tip',
    title: "Gentle Morning Musical Awakening",
    category: "Sundowning & Calm",
    author: "Dr. Arvind Mehta",
    authorRole: "Neurologist & Volunteer",
    date: "2 days ago",
    upvotes: 24,
    content: "Playing soft 432Hz ambient melodies or classical Indian sitar upon waking helps reduce morning disorientation and eases the transition into breakfast."
  },
  {
    id: 2,
    type: 'game',
    title: "Spice & Fragrance Nostalgia",
    category: "Sensory & Everyday Recognition",
    author: "Pooja Deshmukh",
    authorRole: "Caregiver & OT",
    date: "3 days ago",
    upvotes: 19,
    content: "Encourage identifying familiar kitchen spices (cardamom, cinnamon, mint). Olfactory scent pathways are deeply preserved and stimulate spontaneous memory recall."
  },
  {
    id: 3,
    type: 'volunteer',
    title: "Weekly Companion Calls & Gentle Poetry",
    category: "Companion Support",
    author: "Rohit Verma",
    authorRole: "Senior Companion Volunteer",
    date: "Just now",
    upvotes: 15,
    content: "Available for 15-minute soothing video calls or tele-poetry reading for patients feeling lonely during late afternoons."
  }
];

class DataStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PATIENT_PROFILE)) {
      localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, JSON.stringify(DEFAULT_PATIENT));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CAREGIVER_PROFILE)) {
      localStorage.setItem(STORAGE_KEYS.CAREGIVER_PROFILE, JSON.stringify(DEFAULT_CAREGIVER));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CAREGIVER_PIN)) {
      localStorage.setItem(STORAGE_KEYS.CAREGIVER_PIN, '1234');
    }
    if (!localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS)) {
      localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(generateInitialHistoricalRecords()));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CAREGIVER_NOTES)) {
      localStorage.setItem(STORAGE_KEYS.CAREGIVER_NOTES, JSON.stringify(DEFAULT_NOTES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_MOOD)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_MOOD, 'happy');
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMMUNITY_CONTRIBUTIONS)) {
      localStorage.setItem(STORAGE_KEYS.COMMUNITY_CONTRIBUTIONS, JSON.stringify(DEFAULT_COMMUNITY_CONTRIBUTIONS));
    }

    // Attempt initial sync with local persistent server file database
    this.syncWithServer();
  }

  async syncWithServer() {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const remote = await res.json();
        if (remote && remote.dailyRecords && remote.dailyRecords.length > 0) {
          if (remote.patientProfile) localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, JSON.stringify(remote.patientProfile));
          if (remote.caregiverProfile) localStorage.setItem(STORAGE_KEYS.CAREGIVER_PROFILE, JSON.stringify(remote.caregiverProfile));
          if (remote.caregiverPin) localStorage.setItem(STORAGE_KEYS.CAREGIVER_PIN, remote.caregiverPin);
          if (remote.dailyRecords) localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(remote.dailyRecords));
          if (remote.caregiverNotes) localStorage.setItem(STORAGE_KEYS.CAREGIVER_NOTES, JSON.stringify(remote.caregiverNotes));
          if (remote.todayMood) localStorage.setItem(STORAGE_KEYS.CURRENT_MOOD, remote.todayMood);
          if (remote.communityContributions) localStorage.setItem(STORAGE_KEYS.COMMUNITY_CONTRIBUTIONS, JSON.stringify(remote.communityContributions));
          
          window.dispatchEvent(new CustomEvent('smriti_score_updated', { detail: {} }));
          window.dispatchEvent(new CustomEvent('smriti_profile_updated', { detail: { profile: remote.patientProfile } }));
          window.dispatchEvent(new CustomEvent('smriti_community_updated', { detail: { contributions: remote.communityContributions } }));
        } else {
          // Push initial data to server disk file
          this.persistToServer();
        }
      }
    } catch(err) {
      // Server offline / standalone mode fallback
    }
  }

  async persistToServer() {
    try {
      const payload = {
        patientProfile: this.getPatient(),
        caregiverProfile: this.getCaregiverProfile(),
        caregiverPin: this.getCaregiverPin(),
        dailyRecords: this.getRecords(),
        caregiverNotes: this.getNotes(),
        todayMood: this.getCurrentMood(),
        userRole: this.getUserRole(),
        communityContributions: this.getCommunityContributions(),
        lastSaved: new Date().toISOString()
      };

      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch(err) {
      // Storage safe in localStorage fallback
    }
  }

  exportJSONBackup() {
    const payload = {
      app: "Smriti Dementia Care",
      version: "2.0",
      exportDate: new Date().toISOString(),
      patientProfile: this.getPatient(),
      caregiverProfile: this.getCaregiverProfile(),
      dailyRecords: this.getRecords(),
      caregiverNotes: this.getNotes()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `smriti_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  }

  importJSONBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.patientProfile) localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, JSON.stringify(data.patientProfile));
      if (data.caregiverProfile) localStorage.setItem(STORAGE_KEYS.CAREGIVER_PROFILE, JSON.stringify(data.caregiverProfile));
      if (data.dailyRecords) localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(data.dailyRecords));
      if (data.caregiverNotes) localStorage.setItem(STORAGE_KEYS.CAREGIVER_NOTES, JSON.stringify(data.caregiverNotes));
      
      this.persistToServer();
      window.dispatchEvent(new CustomEvent('smriti_score_updated', { detail: {} }));
      window.dispatchEvent(new CustomEvent('smriti_profile_updated', { detail: { profile: data.patientProfile } }));
      return { success: true };
    } catch(e) {
      return { success: false, error: e.message };
    }
  }

  exportCSVReport() {
    const records = this.getRecords();
    let csv = "Date,Weekday,AverageScore,MemoryScore,SequencingScore,RecognitionScore,GardenScore,Mood,GamesCompleted\n";
    records.forEach(r => {
      csv += `"${r.displayDate}","${r.weekday}",${r.averageScore || 0},${r.memoryScore != null ? r.memoryScore : ""},${r.sequencingScore != null ? r.sequencingScore : ""},${r.recognitionScore != null ? r.recognitionScore : ""},${r.gardenScore != null ? r.gardenScore : ""},"${r.mood || ''}",${r.gamesCompleted || 0}\n`;
    });

    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `smriti_cognitive_records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  }

  getCaregiverProfile() {
    const saved = localStorage.getItem(STORAGE_KEYS.CAREGIVER_PROFILE);
    if (!saved) return DEFAULT_CAREGIVER;
    try {
      return { ...DEFAULT_CAREGIVER, ...JSON.parse(saved) };
    } catch(e) {
      return DEFAULT_CAREGIVER;
    }
  }

  saveCaregiverProfile(profile) {
    const current = this.getCaregiverProfile();
    const merged = { ...current, ...profile };
    localStorage.setItem(STORAGE_KEYS.CAREGIVER_PROFILE, JSON.stringify(merged));
    
    // Also sync with patient profile's caretaker info
    const patient = this.getPatient();
    patient.caregiverName = merged.name || patient.caregiverName;
    patient.caregiverRelation = merged.relation || patient.caregiverRelation;
    patient.emergencyPhone = merged.phone || patient.emergencyPhone;
    localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, JSON.stringify(patient));

    window.dispatchEvent(new CustomEvent('smriti_caregiver_profile_updated', { detail: { profile: merged } }));
    window.dispatchEvent(new CustomEvent('smriti_profile_updated', { detail: { profile: patient } }));
    return merged;
  }

  getCaregiverPin() {
    return localStorage.getItem(STORAGE_KEYS.CAREGIVER_PIN) || '1234';
  }

  setCaregiverPin(newPin) {
    if (!newPin) return false;
    const pin = String(newPin).trim();
    localStorage.setItem(STORAGE_KEYS.CAREGIVER_PIN, pin);
    const cg = this.getCaregiverProfile();
    cg.pin = pin;
    localStorage.setItem(STORAGE_KEYS.CAREGIVER_PROFILE, JSON.stringify(cg));
    this.persistToServer();
    return true;
  }

  verifyCaregiverPin(enteredPin) {
    const actual = this.getCaregiverPin();
    return String(enteredPin).trim() === String(actual).trim();
  }

  getUserRole() {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE) || null;
  }

  setUserRole(role) {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
    window.dispatchEvent(new CustomEvent('smriti_role_changed', { detail: { role } }));
  }

  getPatient() {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENT_PROFILE);
    if (!saved) return DEFAULT_PATIENT;
    try {
      return { ...DEFAULT_PATIENT, ...JSON.parse(saved) };
    } catch(e) {
      return DEFAULT_PATIENT;
    }
  }

  updatePatientProfile(updatedProfile) {
    const current = this.getPatient();
    const merged = { ...current, ...updatedProfile };
    localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('smriti_profile_updated', { detail: { profile: merged } }));
    return merged;
  }

  getRecords() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS)) || [];
  }

  getTodayRecord() {
    const records = this.getRecords();
    const todayStr = getLocalDateStr();
    let record = records.find(r => r.date === todayStr);
    
    if (!record) {
      const today = new Date();
      record = {
        date: todayStr,
        displayDate: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weekday: today.toLocaleDateString('en-US', { weekday: 'short' }),
        memoryScore: null,
        sequencingScore: null,
        recognitionScore: null,
        gardenScore: null,
        averageScore: 0,
        mood: this.getCurrentMood(),
        gamesCompleted: 0
      };
      records.push(record);
      localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(records));
    }
    return record;
  }

  saveGameScore(gameType, score) {
    const records = this.getRecords();
    const todayStr = getLocalDateStr();
    let record = records.find(r => r.date === todayStr);

    if (!record) {
      record = this.getTodayRecord();
    }

    if (gameType === 'memory') record.memoryScore = score;
    if (gameType === 'sequencing') record.sequencingScore = score;
    if (gameType === 'recognition') record.recognitionScore = score;
    if (gameType === 'garden') record.gardenScore = score;

    // Recalculate average and games completed dynamically
    const scores = [record.memoryScore, record.sequencingScore, record.recognitionScore, record.gardenScore].filter(s => s !== null && s !== undefined);
    record.gamesCompleted = scores.length;
    record.averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : score;
    record.mood = this.getCurrentMood();

    const idx = records.findIndex(r => r.date === todayStr);
    if (idx >= 0) {
      records[idx] = record;
    } else {
      records.push(record);
    }
    localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(records));
    this.persistToServer();
    
    // Broadcast event for live UI update across all active portals and charts
    window.dispatchEvent(new CustomEvent('smriti_score_updated', { detail: { gameType, score, record } }));
    return record;
  }

  getCurrentMood() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_MOOD) || 'happy';
  }

  setMood(mood) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_MOOD, mood);
    const todayRecord = this.getTodayRecord();
    todayRecord.mood = mood;
    const records = this.getRecords();
    const idx = records.findIndex(r => r.date === todayRecord.date);
    if (idx >= 0) records[idx] = todayRecord;
    localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(records));
    this.persistToServer();
    window.dispatchEvent(new CustomEvent('smriti_mood_updated', { detail: { mood } }));
  }

  getNotes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CAREGIVER_NOTES)) || [];
  }

  addNote(text, tags = []) {
    const notes = this.getNotes();
    const newNote = {
      id: Date.now(),
      time: "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
      tags
    };
    notes.unshift(newNote);
    localStorage.setItem(STORAGE_KEYS.CAREGIVER_NOTES, JSON.stringify(notes));
    this.persistToServer();
    window.dispatchEvent(new CustomEvent('smriti_notes_updated', { detail: { note: newNote } }));
    return newNote;
  }

  getSummaryMetrics() {
    const today = this.getTodayRecord();
    const records = this.getRecords();

    // Baseline historical averages for past days
    const pastRecords = records.filter(r => r.date !== today.date);
    const avg = (arr, fallback) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : fallback;

    const histMem = avg(pastRecords.map(r => r.memoryScore).filter(s => s != null), 80);
    const histSeq = avg(pastRecords.map(r => r.sequencingScore).filter(s => s != null), 85);
    const histRec = avg(pastRecords.map(r => r.recognitionScore).filter(s => s != null), 85);
    const histGar = avg(pastRecords.map(r => r.gardenScore).filter(s => s != null), 90);

    // Prioritize today's live performance immediately when game has been played today
    const memory = today.memoryScore != null ? today.memoryScore : histMem;
    const seq = today.sequencingScore != null ? today.sequencingScore : histSeq;
    const rec = today.recognitionScore != null ? today.recognitionScore : histRec;
    const garden = today.gardenScore != null ? today.gardenScore : histGar;

    // Active scores calculation
    const activeTodayScores = [today.memoryScore, today.sequencingScore, today.recognitionScore, today.gardenScore].filter(s => s != null);
    const overall = activeTodayScores.length > 0
      ? Math.round(activeTodayScores.reduce((a, b) => a + b, 0) / activeTodayScores.length)
      : Math.round((memory + seq + rec + garden) / 4);

    return {
      overall,
      memory,
      seq,
      rec,
      garden,
      todayPlayed: activeTodayScores.length,
      today
    };
  }

  /* ---------------------------------------------------------
     Community & Volunteer Contributions
     --------------------------------------------------------- */
  getCommunityContributions() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMUNITY_CONTRIBUTIONS);
      return saved ? JSON.parse(saved) : DEFAULT_COMMUNITY_CONTRIBUTIONS;
    } catch(e) {
      return DEFAULT_COMMUNITY_CONTRIBUTIONS;
    }
  }

  addCommunityContribution(contribution) {
    const list = this.getCommunityContributions();
    const newEntry = {
      id: Date.now(),
      type: contribution.type || 'tip', // 'tip' | 'game' | 'volunteer'
      title: contribution.title || 'Community Insight',
      category: contribution.category || 'General Care',
      author: contribution.author || 'Anonymous Caregiver',
      authorRole: contribution.authorRole || 'Community Supporter',
      date: 'Just now',
      upvotes: 1,
      content: contribution.content || ''
    };
    list.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_CONTRIBUTIONS, JSON.stringify(list));
    this.persistToServer();
    window.dispatchEvent(new CustomEvent('smriti_community_updated', { detail: { contribution: newEntry } }));
    return newEntry;
  }

  upvoteCommunityContribution(id) {
    const list = this.getCommunityContributions();
    const item = list.find(c => c.id === id);
    if (item) {
      item.upvotes = (item.upvotes || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.COMMUNITY_CONTRIBUTIONS, JSON.stringify(list));
      this.persistToServer();
      window.dispatchEvent(new CustomEvent('smriti_community_updated', { detail: { list } }));
    }
    return item;
  }

  /* ---------------------------------------------------------
     New User & Fresh Care Profile Initialization
     --------------------------------------------------------- */
  createNewPatientProfile(profileData) {
    // 1. Construct Patient Record
    const newPatient = {
      name: profileData.name || "Patient",
      preferredName: profileData.preferredName || (profileData.name ? profileData.name.split(' ')[0] : "Friend"),
      age: parseInt(profileData.age, 10) || 70,
      gender: profileData.gender || "Other",
      stage: profileData.stage || "Mild Cognitive Impairment (Early Stage)",
      caregiverName: profileData.caregiverName || "Primary Caregiver",
      caregiverRelation: profileData.caregiverRelation || "Family Caregiver",
      emergencyPhone: profileData.emergencyPhone || "",
      doctorName: profileData.doctorName || "Family Physician",
      doctorPhone: profileData.doctorPhone || "",
      homeAddress: profileData.homeAddress || "Family Residence",
      notes: profileData.notes || "New profile registered."
    };

    // 2. Construct Caretaker Account
    const newCaregiver = {
      name: profileData.caregiverName || "Primary Caregiver",
      relation: profileData.caregiverRelation || "Family Caregiver",
      phone: profileData.emergencyPhone || "",
      email: profileData.caregiverEmail || "",
      pin: profileData.pin || "1234",
      notes: `Care journey initiated for ${newPatient.name}.`
    };

    // 3. Save to localStorage
    localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, JSON.stringify(newPatient));
    localStorage.setItem(STORAGE_KEYS.CAREGIVER_PROFILE, JSON.stringify(newCaregiver));
    localStorage.setItem(STORAGE_KEYS.CAREGIVER_PIN, newCaregiver.pin);
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'patient');
    localStorage.setItem(STORAGE_KEYS.CURRENT_MOOD, 'happy');

    // 4. Initialize fresh welcoming records & note
    const freshRecords = generateInitialHistoricalRecords();
    localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(freshRecords));

    const welcomeNote = [
      {
        id: Date.now(),
        time: "Today, Just now",
        text: `Welcome! Profile registered for ${newPatient.preferredName}. Daily cognitive companion routines initialized.`,
        tags: ["Profile Setup", "Care Started"]
      }
    ];
    localStorage.setItem(STORAGE_KEYS.CAREGIVER_NOTES, JSON.stringify(welcomeNote));

    // 5. Persist to server disk
    this.persistToServer();

    // 6. Broadcast events
    window.dispatchEvent(new CustomEvent('smriti_profile_updated', { detail: { profile: newPatient } }));
    window.dispatchEvent(new CustomEvent('smriti_score_updated', { detail: {} }));
    window.dispatchEvent(new CustomEvent('smriti_notes_updated', { detail: {} }));
    window.dispatchEvent(new CustomEvent('smriti_new_user_initialized', { detail: { patient: newPatient, caregiver: newCaregiver } }));

    return { patient: newPatient, caregiver: newCaregiver };
  }
}

window.smritiData = new DataStore();
