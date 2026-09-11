/* =========================================================
   Game 2: Daily Routine Sequencing - Enhanced
   - 6 rich, realistic daily living routine scenarios
   - 3 and 4-step progressive sequences
   - Random selection on every game so it's always fresh
   - Gentle hints and pleasant audio cues
   ========================================================= */

class SequencingGame {
  constructor(containerId, onComplete) {
    this.container = document.getElementById(containerId);
    this.onComplete = onComplete;

    // Rich Bank of 6 ADL scenarios
    this.routines = [
      {
        id: "tea",
        title: "Making Warm Morning Tea",
        category: "Morning Nutrition",
        steps: [
          { id: 1, text: "Boil fresh water in the kettle", icon: "🫖" },
          { id: 2, text: "Place tea bag or leaves in the cup", icon: "🍵" },
          { id: 3, text: "Pour hot water and let it brew", icon: "🚰" },
          { id: 4, text: "Add a splash of milk or honey and enjoy", icon: "🍯" }
        ]
      },
      {
        id: "teeth",
        title: "Daily Care: Brushing Teeth",
        category: "Hygiene",
        steps: [
          { id: 1, text: "Put toothpaste on your toothbrush", icon: "🪥" },
          { id: 2, text: "Brush gently in small circles", icon: "✨" },
          { id: 3, text: "Rinse mouth thoroughly with clean water", icon: "💧" }
        ]
      },
      {
        id: "medicine",
        title: "Morning Medication Routine",
        category: "Health & Safety",
        steps: [
          { id: 1, text: "Check your labeled medicine box", icon: "📋" },
          { id: 2, text: "Take the morning dose with clean hands", icon: "💊" },
          { id: 3, text: "Drink a full glass of water", icon: "🥛" },
          { id: 4, text: "Close the pillbox safely", icon: "🔒" }
        ]
      },
      {
        id: "hands",
        title: "Washing Hands Thoroughly",
        category: "Hygiene",
        steps: [
          { id: 1, text: "Turn on tap and wet both hands", icon: "🚰" },
          { id: 2, text: "Apply soap and rub palms and fingers", icon: "🧼" },
          { id: 3, text: "Rinse clean and dry with soft towel", icon: "🤲" }
        ]
      },
      {
        id: "dressing",
        title: "Dressing for the Day",
        category: "Independence",
        steps: [
          { id: 1, text: "Choose comfortable, clean clothes", icon: "👔" },
          { id: 2, text: "Put on your shirt or dress carefully", icon: "👕" },
          { id: 3, text: "Fasten comfortable trousers or skirt", icon: "👖" },
          { id: 4, text: "Slip on cozy non-slip shoes", icon: "👟" }
        ]
      },
      {
        id: "bedtime",
        title: "Peaceful Evening Bedtime Routine",
        category: "Evening Comfort",
        steps: [
          { id: 1, text: "Dim the bright lights in the room", icon: "💡" },
          { id: 2, text: "Put on soft, warm nightclothes", icon: "🧦" },
          { id: 3, text: "Sip warm water and relax your shoulders", icon: "🍵" },
          { id: 4, text: "Snuggle into bed with cozy blanket", icon: "🛏️" }
        ]
      },
      {
        id: "grocery",
        title: "Going for a Gentle Grocery Walk",
        category: "Community Living",
        steps: [
          { id: 1, text: "Write down your fresh fruit shopping list", icon: "📝" },
          { id: 2, text: "Take your cloth bag and wallet", icon: "👜" },
          { id: 3, text: "Put on comfortable walking shoes", icon: "👟" },
          { id: 4, text: "Select crisp apples and ripe bananas", icon: "🍎" },
          { id: 5, text: "Walk home safely enjoying the breeze", icon: "🏡" }
        ]
      },
      {
        id: "safety",
        title: "House Safety Check Before Resting",
        category: "Home Safety",
        steps: [
          { id: 1, text: "Check that the kitchen stove is turned off", icon: "🍳" },
          { id: 2, text: "Confirm water taps are closed tight", icon: "🚰" },
          { id: 3, text: "Lock the front door with your key", icon: "🔒" },
          { id: 4, text: "Switch on gentle night lights in hallway", icon: "💡" }
        ]
      }
    ];

    this.currentRoutine = null;
    this.currentPlacements = [];
    this.pool = [];
  }

  start() {
    if (!this.container) return;
    this.pickRandomRoutine();
  }

  pickRandomRoutine() {
    // Pick a random routine from the bank
    const randomIdx = Math.floor(Math.random() * this.routines.length);
    this.currentRoutine = this.routines[randomIdx];
    this.currentPlacements = [];

    // Shuffle pool of steps
    this.pool = [...this.currentRoutine.steps].sort(() => Math.random() - 0.5);

    this.render();
    window.smritiSpeech.speak(`Let's order: ${this.currentRoutine.title}. Tap the steps below in the order you would do them.`);
  }

  render() {
    const r = this.currentRoutine;
    this.container.innerHTML = `
      <div class="game-arena">
        <div class="game-instruction-banner">
          <div class="game-instruction-text">
            <span>📋 ${r.title} (${r.steps.length} Steps)</span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="read-btn" id="seq-speak-btn">🔊 Read</button>
            <button class="read-btn" id="seq-hint-btn" style="background:#fef3c7; border-color:#fde047; color:#92400e;">💡 Hint</button>
            <button class="read-btn" id="seq-switch-btn" style="background:#eff6ff; border-color:#93c5fd; color:#1d4ed8;">🔀 New Routine</button>
          </div>
        </div>

        <div class="sequencing-container">
          <!-- Ordered Slots -->
          <div class="sequence-slots">
            ${r.steps.map((s, idx) => {
              const placed = this.currentPlacements[idx];
              return `
                <div class="sequence-slot ${placed ? 'filled' : ''}" data-slot="${idx}">
                  <span class="sequence-step-num">Step ${idx + 1}</span>
                  ${placed ? `
                    <div class="sequence-item-card" style="width:100%; border:none; box-shadow:none; padding:8px;">
                      <span class="item-emoji">${placed.icon}</span>
                      <span style="font-size:1.05rem;">${placed.text}</span>
                    </div>
                  ` : `<span style="color:#94a3b8; font-size:0.95rem; margin-top:28px;">Tap next step below</span>`}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Pool of available steps -->
          <div style="font-weight:700; color:#334155; margin-top:10px; font-size:1.1rem;">
            Available Steps (Tap to place into Step ${this.currentPlacements.length + 1}):
          </div>
          <div class="sequence-pool">
            ${this.pool.length > 0 ? this.pool.map((item) => `
              <button class="sequence-item-card" data-id="${item.id}">
                <span class="item-emoji">${item.icon}</span>
                <span>${item.text}</span>
              </button>
            `).join('') : `<span style="color:#059669; font-weight:600; padding:10px;">All steps placed! Checking sequence...</span>`}
          </div>

          ${this.currentPlacements.length > 0 ? `
            <div style="text-align:center; margin-top:10px;">
              <button class="header-action-btn" id="seq-reset-btn" style="margin:auto;">
                🔄 Reset Steps & Try Again
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    document.getElementById('seq-speak-btn').addEventListener('click', () => {
      window.smritiSpeech.speak(`What comes first, second, and next in: ${r.title}? Tap the available steps.`);
    });

    document.getElementById('seq-hint-btn').addEventListener('click', () => {
      const nextNeededStep = r.steps[this.currentPlacements.length];
      if (nextNeededStep) {
        window.smritiSpeech.speak(`Hint: The next step usually involves ${nextNeededStep.text}`);
      }
    });

    document.getElementById('seq-switch-btn').addEventListener('click', () => {
      this.pickRandomRoutine();
    });

    const resetBtn = document.getElementById('seq-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.currentPlacements = [];
        this.pool = [...this.currentRoutine.steps].sort(() => Math.random() - 0.5);
        this.render();
      });
    }

    // Step placement click listeners
    const itemCards = this.container.querySelectorAll('.sequence-pool .sequence-item-card');
    itemCards.forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.getAttribute('data-id'), 10);
        const item = this.pool.find(p => p.id === id);
        if (item) {
          this.handleStepPlaced(item);
        }
      });
    });
  }

  handleStepPlaced(item) {
    this.currentPlacements.push(item);
    this.pool = this.pool.filter(p => p.id !== item.id);
    if (window.smritiAudio) window.smritiAudio.playPop();

    window.smritiSpeech.speak(`Step ${this.currentPlacements.length}: ${item.text}`);

    if (this.currentPlacements.length === this.currentRoutine.steps.length) {
      this.evaluate();
    } else {
      this.render();
    }
  }

  evaluate() {
    this.render();

    let correctCount = 0;
    this.currentPlacements.forEach((placed, idx) => {
      if (placed.id === this.currentRoutine.steps[idx].id) {
        correctCount++;
      }
    });

    const isPerfect = correctCount === this.currentRoutine.steps.length;
    const score = isPerfect ? 100 : Math.max(75, Math.round((correctCount / this.currentRoutine.steps.length) * 100));

    window.smritiData.saveGameScore('sequencing', score);
    if (window.smritiAudio) window.smritiAudio.playWin();

    setTimeout(() => {
      this.container.innerHTML = `
        <div class="game-finish-card">
          <div class="finish-icon">${isPerfect ? '🎉' : '👏'}</div>
          <h3 class="finish-title">${isPerfect ? 'Flawless Daily Routine!' : 'Great Work on Daily Steps!'}</h3>
          <div class="finish-score">Score: ${score}% • ${correctCount} of ${this.currentRoutine.steps.length} Steps Placed Correctly</div>
          <p class="finish-msg">Mastering everyday sequences like ${this.currentRoutine.title} keeps memory confident and self-sufficient.</p>
          <div style="display:flex; gap:12px; margin-top:10px;">
            <button class="header-action-btn" id="seq-another-btn" style="padding:12px 20px;">
              🔄 Try Another Daily Routine
            </button>
            <button class="game-play-btn" id="seq-finish-btn" style="min-width: 180px;">
              Return to Activities
            </button>
          </div>
        </div>
      `;

      window.smritiSpeech.speak(`Terrific routine sequencing! You scored ${score} percent.`);

      document.getElementById('seq-another-btn').addEventListener('click', () => {
        this.pickRandomRoutine();
      });

      document.getElementById('seq-finish-btn').addEventListener('click', () => {
        if (this.onComplete) this.onComplete(score);
      });
    }, 850);
  }
}

window.SequencingGame = SequencingGame;
