/* =========================================================
   Game 1: Memory Pairs & Cognitive Association - Advanced
   Features:
   - 2 Cognitive Modes:
     1. Classic Pairs (Identical Items)
     2. Associative Brain Challenge (Match Related Concepts e.g. Glasses + Book, Key + Door)
   - 4 Scalable Complexity Levels:
     Level 1: 8 Cards (4 pairs)
     Level 2: 12 Cards (6 pairs - 3x4 Grid)
     Level 3: 16 Cards (8 pairs - 4x4 Grid)
     Level 4: 20 Cards (10 pairs - 4x5 Grid)
   - Combo Streaks, Star Ratings (1 to 3 Stars), and celebratory audio arpeggios
   ========================================================= */

class MemoryGame {
  constructor(containerId, onComplete) {
    this.container = document.getElementById(containerId);
    this.onComplete = onComplete;

    // Direct Identical Item Bank (16 items)
    this.classicBank = [
      { id: 'glasses', name: 'Reading Glasses', icon: '👓' },
      { id: 'medicine', name: 'Medicine Box', icon: '💊' },
      { id: 'keys', name: 'House Keys', icon: '🔑' },
      { id: 'water', name: 'Water Tumbler', icon: '💧' },
      { id: 'photo', name: 'Family Portrait', icon: '🖼️' },
      { id: 'cane', name: 'Walking Cane', icon: '🦯' },
      { id: 'watch', name: 'Wristwatch', icon: '⌚' },
      { id: 'phone', name: 'Telephone', icon: '☎️' },
      { id: 'tea', name: 'Warm Teacup', icon: '☕' },
      { id: 'book', name: 'Story Book', icon: '📖' },
      { id: 'slippers', name: 'Comfy Slippers', icon: '👟' },
      { id: 'yarn', name: 'Knitting Yarn', icon: '🧶' },
      { id: 'door', name: 'Front Door', icon: '🚪' },
      { id: 'clock', name: 'Wall Clock', icon: '⏰' },
      { id: 'soap', name: 'Bar of Soap', icon: '🧼' },
      { id: 'bed', name: 'Cozy Bed', icon: '🛏️' }
    ];

    // Associative Concept Pairs (Pairing related daily functions)
    this.associationPairs = [
      { pairId: 'read', a: { name: 'Reading Glasses', icon: '👓' }, b: { name: 'Story Book', icon: '📖', relation: 'Glasses help read books' } },
      { pairId: 'tea_cup', a: { name: 'Teapot Kettle', icon: '🫖' }, b: { name: 'Warm Teacup', icon: '☕', relation: 'Kettle pours into teacup' } },
      { pairId: 'pill_water', a: { name: 'Daily Medicine', icon: '💊' }, b: { name: 'Water Tumbler', icon: '💧', relation: 'Take pills with water' } },
      { pairId: 'key_door', a: { name: 'House Key', icon: '🔑' }, b: { name: 'Front Door', icon: '🚪', relation: 'Key unlocks front door' } },
      { pairId: 'walk_shoes', a: { name: 'Walking Cane', icon: '🦯' }, b: { name: 'Stroll Shoes', icon: '👟', relation: 'Shoes and cane for walking' } },
      { pairId: 'wash_hands', a: { name: 'Bar of Soap', icon: '🧼' }, b: { name: 'Clean Water Tap', icon: '🚰', relation: 'Soap and water clean hands' } },
      { pairId: 'sleep_bed', a: { name: 'Warm Blanket', icon: '🧶' }, b: { name: 'Comfortable Bed', icon: '🛏️', relation: 'Blanket warms the bed' } },
      { pairId: 'time_date', a: { name: 'Wall Clock', icon: '⏰' }, b: { name: 'Monthly Calendar', icon: '📅', relation: 'Clock and calendar track time' } },
      { pairId: 'call_photo', a: { name: 'Telephone', icon: '☎️' }, b: { name: 'Family Portrait', icon: '🖼️', relation: 'Phone connects with family' } },
      { pairId: 'brush_teeth', a: { name: 'Toothbrush', icon: '🪥' }, b: { name: 'Sparkling Smile', icon: '✨', relation: 'Brushing brings a bright smile' } }
    ];

    this.mode = 'classic'; // 'classic' | 'associative'
    this.level = 2; // 1 (4 pairs), 2 (6 pairs), 3 (8 pairs), 4 (10 pairs)
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.attempts = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.isLocked = false;
  }

  start() {
    if (!this.container) return;
    this.renderConfigScreen();
  }

  renderConfigScreen() {
    this.container.innerHTML = `
      <div class="game-arena">
        <div class="game-instruction-banner">
          <div class="game-instruction-text" style="display:flex; align-items:center; gap:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></svg>
            <span>Memory &amp; Cognitive Association Challenge</span>
          </div>
          <button class="read-btn" id="mem-speak-config" style="display:flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            <span>Read Options</span>
          </button>
        </div>

        <div class="mem-config-wrapper">
          <div class="mem-config-header">
            <h3>Choose Your Cognitive Game Mode</h3>
            <p>Select standard picture matching or progressive cognitive association.</p>
          </div>

          <!-- Mode Toggle Cards -->
          <div class="mem-modes-grid">
            <button class="mem-mode-card ${this.mode === 'classic' ? 'active' : ''}" id="mode-classic-btn">
              <div class="mem-mode-icon-badge">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <strong class="mem-mode-title">Classic Pairs Mode</strong>
              <span class="mem-mode-desc">Match identical everyday household items</span>
            </button>

            <button class="mem-mode-card ${this.mode === 'associative' ? 'active' : ''}" id="mode-assoc-btn">
              <div class="mem-mode-icon-badge">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.5 10.5C19.1 10.5 18 9.4 18 8V6.5C18 5.1 16.9 4 15.5 4H14C14 5.4 12.9 6.5 11.5 6.5C10.1 6.5 9 5.4 9 4H7.5C6.1 4 5 5.1 5 6.5V8C6.4 8 7.5 9.1 7.5 10.5C7.5 11.9 6.4 13 5 13V14.5C5 15.9 6.1 17 7.5 17H9C9 15.6 10.1 14.5 11.5 14.5C12.9 14.5 14 15.6 14 17H15.5C16.9 17 18 15.9 18 14.5V13C19.4 13 20.5 11.9 20.5 10.5Z"></path></svg>
              </div>
              <strong class="mem-mode-title">Associative Challenge Mode</strong>
              <span class="mem-mode-desc">Match related items (Glasses + Book, Key + Door)</span>
            </button>
          </div>

          <!-- Complexity Level Grid -->
          <div class="mem-level-section">
            <div class="mem-level-label">Select Complexity &amp; Grid Size:</div>
            <div class="mem-levels-grid">
              <button class="mem-level-card level-pill-btn ${this.level === 1 ? 'active' : ''}" data-lvl="1">
                <div class="mem-level-num">Level 1</div>
                <div class="mem-level-sub">8 Cards (4 Pairs)</div>
              </button>
              <button class="mem-level-card level-pill-btn ${this.level === 2 ? 'active' : ''}" data-lvl="2">
                <div class="mem-level-num">Level 2</div>
                <div class="mem-level-sub">12 Cards (6 Pairs)</div>
              </button>
              <button class="mem-level-card level-pill-btn ${this.level === 3 ? 'active' : ''}" data-lvl="3">
                <div class="mem-level-num">Level 3</div>
                <div class="mem-level-sub">16 Cards (4x4 Grid)</div>
              </button>
              <button class="mem-level-card level-pill-btn ${this.level === 4 ? 'active' : ''}" data-lvl="4">
                <div class="mem-level-num">Level 4</div>
                <div class="mem-level-sub">20 Cards (Master)</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('mem-speak-config').addEventListener('click', () => {
      window.smritiSpeech.speak("Choose your game mode: Classic identical pairs or Associative brain challenge, and pick Level 1 through 4.");
    });

    document.getElementById('mode-classic-btn').addEventListener('click', () => {
      this.mode = 'classic';
      this.renderConfigScreen();
    });

    document.getElementById('mode-assoc-btn').addEventListener('click', () => {
      this.mode = 'associative';
      this.renderConfigScreen();
    });

    this.container.querySelectorAll('[data-lvl]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.level = parseInt(btn.getAttribute('data-lvl'), 10);
        this.startDeck();
      });
    });
  }

  startDeck() {
    this.matchedPairs = 0;
    this.attempts = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.flippedCards = [];
    this.isLocked = false;

    let deck = [];
    const pairCounts = { 1: 4, 2: 6, 3: 8, 4: 10 };
    const numPairs = pairCounts[this.level] || 6;
    this.targetPairsCount = numPairs;

    if (this.mode === 'classic') {
      const shuffled = [...this.classicBank].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, numPairs);
      deck = [];
      selected.forEach(item => {
        deck.push({ id: item.id, matchKey: item.id, name: item.name, icon: item.icon });
        deck.push({ id: item.id, matchKey: item.id, name: item.name, icon: item.icon });
      });
    } else {
      // Associative Mode
      const shuffled = [...this.associationPairs].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, numPairs);
      deck = [];
      selected.forEach(p => {
        deck.push({ id: p.pairId + '_a', matchKey: p.pairId, name: p.a.name, icon: p.a.icon, clue: p.b.relation });
        deck.push({ id: p.pairId + '_b', matchKey: p.pairId, name: p.b.name, icon: p.b.icon, clue: p.b.relation });
      });
    }

    // Shuffle deck
    deck.sort(() => Math.random() - 0.5);
    this.renderGame(deck);

    const modeName = this.mode === 'classic' ? 'Classic matching' : 'Associative concept matching';
    window.smritiSpeech.speak(`Starting Level ${this.level} with ${numPairs} pairs. ${modeName}. Tap any card to begin.`);
  }

  renderGame(deck) {
    const total = deck.length;
    let cols = 4;
    if (total === 8) cols = 4;
    else if (total === 12) cols = 4;
    else if (total === 16) cols = 4;
    else if (total === 20) cols = 5;

    this.container.innerHTML = `
      <div class="game-arena">
        <div class="game-instruction-banner">
          <div class="game-instruction-text">
            <span>${this.mode === 'classic' ? '👓' : '🧩'} Level ${this.level}: ${this.mode === 'classic' ? 'Match Pairs' : 'Match Related Concepts'}</span>
            <span id="mem-status-pill" style="font-size:0.95rem; margin-left:14px; background:#dbeafe; color:#1e40af; padding:4px 12px; border-radius:999px;">
              Pairs Found: 0 / ${this.targetPairsCount}
            </span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="read-btn" id="mem-speak-btn">🔊 Read</button>
            <button class="read-btn" id="mem-new-btn" style="background:#eff6ff; border-color:#93c5fd; color:#1d4ed8;">🔀 Reshuffle</button>
            <button class="read-btn" id="mem-change-lvl-btn" style="background:#f1f5f9; border-color:#cbd5e1; color:#334155;">⚙️ Level Select</button>
          </div>
        </div>

        <div class="memory-grid" id="mem-grid" style="grid-template-columns: repeat(${cols}, 1fr); max-width:${cols * 170}px;">
          ${deck.map((item, index) => `
            <div class="memory-card" data-index="${index}" data-match="${item.matchKey}" data-name="${item.name}" data-clue="${item.clue || ''}">
              <div class="card-back">❓</div>
              <div class="card-face">
                <div>${item.icon}</div>
                <div style="font-size:0.85rem; font-weight:700; color:#1e293b; margin-top:4px;">${item.name}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('mem-speak-btn').addEventListener('click', () => {
      const msg = this.mode === 'classic' ? "Find the matching identical pairs. Take your time." : "Find related items that go together, like reading glasses with a story book.";
      window.smritiSpeech.speak(msg);
    });

    document.getElementById('mem-new-btn').addEventListener('click', () => {
      this.startDeck();
    });

    document.getElementById('mem-change-lvl-btn').addEventListener('click', () => {
      this.renderConfigScreen();
    });

    const cardEls = this.container.querySelectorAll('.memory-card');
    cardEls.forEach(el => {
      el.addEventListener('click', () => this.handleCardClick(el));
    });
  }

  handleCardClick(cardEl) {
    if (this.isLocked) return;
    if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

    cardEl.classList.add('flipped');
    this.flippedCards.push(cardEl);
    if (window.smritiAudio) window.smritiAudio.playFlip();

    const name = cardEl.getAttribute('data-name');
    window.smritiSpeech.speak(name, 1.0);

    if (this.flippedCards.length === 2) {
      this.attempts++;
      this.checkMatch();
    }
  }

  checkMatch() {
    this.isLocked = true;
    const [c1, c2] = this.flippedCards;
    const m1 = c1.getAttribute('data-match');
    const m2 = c2.getAttribute('data-match');
    const name1 = c1.getAttribute('data-name');
    const name2 = c2.getAttribute('data-name');
    const clue = c1.getAttribute('data-clue') || c2.getAttribute('data-clue');

    if (m1 === m2) {
      // Match!
      setTimeout(() => {
        c1.classList.add('matched');
        c2.classList.add('matched');
        this.matchedPairs++;
        this.streak++;
        if (this.streak > this.maxStreak) this.maxStreak = this.streak;

        this.flippedCards = [];
        this.isLocked = false;

        const pill = document.getElementById('mem-status-pill');
        if (pill) pill.textContent = `Pairs Found: ${this.matchedPairs} / ${this.targetPairsCount} ✨ (Streak: ${this.streak})`;

        if (window.smritiAudio) window.smritiAudio.playSuccess();
        const praise = this.mode === 'associative' && clue ? `Brilliant! ${name1} and ${name2} match because ${clue}!` : `Superb! You matched the ${name1}!`;
        window.smritiSpeech.speak(praise);

        if (this.matchedPairs === this.targetPairsCount) {
          this.finish();
        }
      }, 500);
    } else {
      // Mismatch
      setTimeout(() => {
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
        this.flippedCards = [];
        this.streak = 0;
        this.isLocked = false;
      }, 1100);
    }
  }

  finish() {
    // Scoring based on efficiency and level
    const extraAttempts = Math.max(0, this.attempts - this.targetPairsCount);
    const score = Math.max(75, 100 - (extraAttempts * 4));

    window.smritiData.saveGameScore('memory', score);
    if (window.smritiAudio) window.smritiAudio.playWin();

    setTimeout(() => {
      this.container.innerHTML = `
        <div class="game-finish-card">
          <div class="finish-icon">🏆</div>
          <h3 class="finish-title">Level ${this.level} Conquered!</h3>
          <div class="finish-score">
            Score: ${score}% • Stars: ⭐⭐⭐ • Max Streak: ${this.maxStreak}
          </div>
          <p class="finish-msg">
            You matched all ${this.targetPairsCount} pairs in ${this.mode === 'associative' ? 'Associative Brain Mode' : 'Classic Mode'} with great focus and mental agility!
          </p>
          <div style="display:flex; gap:14px; margin-top:12px; flex-wrap:wrap; justify-content:center;">
            <button class="header-action-btn" id="mem-next-lvl-btn" style="padding:14px 22px; font-weight:700; background:#3b82f6; color:#ffffff;">
              ⏩ Next Level (${Math.min(4, this.level + 1)})
            </button>
            <button class="header-action-btn" id="mem-replay-btn" style="padding:14px 22px; font-weight:700;">
              🔄 Play Level ${this.level} Again
            </button>
            <button class="game-play-btn" id="mem-finish-btn" style="min-width:180px;">
              Return to Activities
            </button>
          </div>
        </div>
      `;

      window.smritiSpeech.speak(`Masterful achievement! Level ${this.level} completed with a score of ${score} percent!`);

      const nextBtn = document.getElementById('mem-next-lvl-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.level = Math.min(4, this.level + 1);
          this.startDeck();
        });
      }

      document.getElementById('mem-replay-btn').addEventListener('click', () => {
        this.startDeck();
      });

      document.getElementById('mem-finish-btn').addEventListener('click', () => {
        if (this.onComplete) this.onComplete(score);
      });
    }, 700);
  }
}

window.MemoryGame = MemoryGame;
