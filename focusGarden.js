/* =========================================================
   Game 4: Calming Focus Garden - Multi-Level Advanced
   Features:
   - 4 Scalable Cognitive & Mindfulness Levels:
     Level 1: Gentle Floral Awakening (Visual & Sensory Focus)
     Level 2: Fluttering Pollinators (Visual Tracking & Timing - Butterfly & Bee)
     Level 3: Zen Chime Sequence (Auditory-Spatial Sequence Recall - Melodic Simon)
     Level 4: Master Botanist Challenge (Multi-Target Color & Category Sorting)
   - Real-time pentatonic chimes, stars, and calming sensory feedback
   ========================================================= */

class FocusGardenGame {
  constructor(containerId, onComplete) {
    this.container = document.getElementById(containerId);
    this.onComplete = onComplete;

    this.flowerTypes = [
      { id: 'sunflower', name: 'Golden Sunflower', icon: '🌻', color: 'yellow', note: 523.25 }, // C5
      { id: 'rose', name: 'Pink Blossom', icon: '🌸', color: 'pink', note: 587.33 },     // D5
      { id: 'tulip', name: 'Spring Tulip', icon: '🌷', color: 'pink', note: 659.25 },     // E5
      { id: 'daisy', name: 'White Daisy', icon: '🌼', color: 'yellow', note: 783.99 },    // G5
      { id: 'hibiscus', name: 'Red Hibiscus', icon: '🌺', color: 'red', note: 880.00 },   // A5
      { id: 'lotus', name: 'Peaceful Lotus', icon: '🪷', color: 'purple', note: 1046.50 }, // C6
      { id: 'lavender', name: 'Sweet Lavender', icon: '🪻', color: 'purple', note: 659.25 },
      { id: 'clover', name: 'Lucky Clover', icon: '☘️', color: 'green', note: 587.33 },
      { id: 'leaf', name: 'Autumn Maple', icon: '🍁', color: 'orange', note: 523.25 }
    ];

    this.level = 1;
    this.rounds = 3;
    this.currentRound = 0;
    this.sequence = [];
    this.playerStep = 0;
    this.score = 100;
  }

  start() {
    if (!this.container) return;
    this.renderLevelSelect();
  }

  renderLevelSelect() {
    this.container.innerHTML = `
      <div class="game-arena">
        <div class="game-instruction-banner">
          <div class="game-instruction-text">
            <span>🌸 Calming Focus Garden: Select Complexity Level</span>
          </div>
          <button class="read-btn" id="garden-speak-levels">🔊 Read Levels</button>
        </div>

        <div style="text-align:center; max-width:740px; margin:16px auto; display:flex; flex-direction:column; gap:20px;">
          <div>
            <h3 style="color:#065f46; font-size:1.8rem; font-weight:800; margin-bottom:6px;">Choose Your Garden Sanctuary Level</h3>
            <p style="color:#4b5563; font-size:1.15rem;">Progress from gentle flower touches to musical pattern sequences and multi-target tracking.</p>
          </div>

          <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:16px;">
            <!-- Level 1 -->
            <button class="game-play-btn" data-g-lvl="1" style="background:#059669; padding:20px; flex-direction:column; gap:8px; border-radius:18px;">
              <span style="font-size:2.4rem;">🌱</span>
              <strong style="font-size:1.25rem;">Level 1: Gentle Awakening</strong>
              <span style="font-size:0.92rem; opacity:0.9;">Touch single blooming flowers with soft cues</span>
            </button>

            <!-- Level 2 -->
            <button class="game-play-btn" data-g-lvl="2" style="background:#0284c7; padding:20px; flex-direction:column; gap:8px; border-radius:18px;">
              <span style="font-size:2.4rem;">🦋</span>
              <strong style="font-size:1.25rem;">Level 2: Fluttering Pollinators</strong>
              <span style="font-size:0.92rem; opacity:0.9;">Track butterflies & bees landing on blossoms</span>
            </button>

            <!-- Level 3 -->
            <button class="game-play-btn" data-g-lvl="3" style="background:#7c3aed; padding:20px; flex-direction:column; gap:8px; border-radius:18px;">
              <span style="font-size:2.4rem;">🎶</span>
              <strong style="font-size:1.25rem;">Level 3: Zen Chime Sequence</strong>
              <span style="font-size:0.92rem; opacity:0.9;">Remember & repeat melodic flower chime order</span>
            </button>

            <!-- Level 4 -->
            <button class="game-play-btn" data-g-lvl="4" style="background:#ea580c; padding:20px; flex-direction:column; gap:8px; border-radius:18px;">
              <span style="font-size:2.4rem;">👑</span>
              <strong style="font-size:1.25rem;">Level 4: Master Botanist</strong>
              <span style="font-size:0.92rem; opacity:0.9;">9-blossom meadow multi-target category sorting</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('garden-speak-levels').addEventListener('click', () => {
      window.smritiSpeech.speak("Choose your garden level: Level 1 Gentle Awakening, Level 2 Fluttering Pollinators, Level 3 Zen Chime Sequence, or Level 4 Master Botanist.");
    });

    this.container.querySelectorAll('[data-g-lvl]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.level = parseInt(btn.getAttribute('data-g-lvl'), 10);
        this.startLevel();
      });
    });
  }

  startLevel() {
    this.currentRound = 0;
    this.correctHits = 0;
    this.mistakes = 0;
    this.startTime = Date.now();
    if (this.level === 1) this.startLevel1();
    else if (this.level === 2) this.startLevel2();
    else if (this.level === 3) this.startLevel3();
    else if (this.level === 4) this.startLevel4();
  }

  /* ---------------------------------------------------------
     LEVEL 1: Gentle Floral Awakening
     --------------------------------------------------------- */
  startLevel1() {
    this.currentRound++;
    this.targetFlower = this.flowerTypes[Math.floor(Math.random() * 6)];
    const promptText = `Find and gently touch the ${this.targetFlower.name} ${this.targetFlower.icon}`;

    this.container.innerHTML = `
      <div class="game-arena">
        <div class="game-instruction-banner">
          <div class="game-instruction-text">
            <span>🌸 Level 1: Gentle Awakening (Round ${this.currentRound}/3)</span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="read-btn" id="g-speak-btn">🔊 Read</button>
            <button class="read-btn" id="g-lvl-change-btn" style="background:#eff6ff; color:#1e40af;">⚙️ Change Level</button>
          </div>
        </div>

        <div class="garden-arena" style="min-height:480px;">
          <div class="garden-prompt-bar">
            <span>Find and touch:</span>
            <strong style="color:#065f46; font-size:1.35rem;">${this.targetFlower.name} ${this.targetFlower.icon}</strong>
          </div>

          <div class="garden-field" style="max-width:540px;">
            ${this.flowerTypes.slice(0, 6).map(f => `
              <button class="garden-flower-btn ${f.id === this.targetFlower.id ? 'active-target' : ''}" data-id="${f.id}">
                ${f.icon}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('g-speak-btn').addEventListener('click', () => window.smritiSpeech.speak(promptText));
    document.getElementById('g-lvl-change-btn').addEventListener('click', () => this.renderLevelSelect());
    window.smritiSpeech.speak(promptText);

    this.container.querySelectorAll('.garden-flower-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.getAttribute('data-id') === this.targetFlower.id) {
          this.correctHits = (this.correctHits || 0) + 1;
          if (window.smritiAudio) window.smritiAudio.playChime();
          btn.style.transform = 'scale(1.3) rotate(15deg)';
          btn.style.borderColor = '#10b981';
          window.smritiSpeech.speak(`Wonderful! The ${this.targetFlower.name} is in full bloom.`);
          setTimeout(() => {
            if (this.currentRound < 3) this.startLevel1();
            else this.finish();
          }, 1100);
        } else {
          this.mistakes = (this.mistakes || 0) + 1;
          btn.style.transform = 'scale(0.92)';
          window.smritiSpeech.speak(`That's pretty too! Let's find the ${this.targetFlower.name}.`);
        }
      });
    });
  }

  /* ---------------------------------------------------------
     LEVEL 2: Fluttering Pollinators & Tracking
     --------------------------------------------------------- */
  startLevel2() {
    this.currentRound++;
    const targetPollinator = this.currentRound === 1 ? '🦋' : this.currentRound === 2 ? '🐝' : '🐞';
    const pollinatorName = this.currentRound === 1 ? 'Blue Butterfly 🦋' : this.currentRound === 2 ? 'Honey Bee 🐝' : 'Ladybug 🐞';
    let luckyIndex = Math.floor(Math.random() * 6);

    const promptText = `A friendly ${pollinatorName} is visiting the garden! Watch where it lands and gently guide it.`;

    this.container.innerHTML = `
      <div class="game-arena">
        <div class="game-instruction-banner">
          <div class="game-instruction-text">
            <span>🦋 Level 2: Fluttering Visitors (Round ${this.currentRound}/3)</span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="read-btn" id="g-speak-btn">🔊 Read</button>
            <button class="read-btn" id="g-lvl-change-btn" style="background:#eff6ff; color:#1e40af;">⚙️ Change Level</button>
          </div>
        </div>

        <div class="garden-arena" style="min-height:480px;">
          <div class="garden-prompt-bar">
            <span>Spot and gently tap the:</span>
            <strong style="color:#0284c7; font-size:1.35rem;">${pollinatorName}</strong>
          </div>

          <div class="garden-field" id="g2-field" style="max-width:540px;">
            ${this.flowerTypes.slice(0, 6).map((f, i) => `
              <button class="garden-flower-btn ${i === luckyIndex ? 'active-target' : ''}" data-idx="${i}">
                ${i === luckyIndex ? targetPollinator : f.icon}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('g-speak-btn').addEventListener('click', () => window.smritiSpeech.speak(promptText));
    document.getElementById('g-lvl-change-btn').addEventListener('click', () => this.renderLevelSelect());
    window.smritiSpeech.speak(promptText);

    this.container.querySelectorAll('.garden-flower-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (idx === luckyIndex) {
          this.correctHits = (this.correctHits || 0) + 1;
          if (window.smritiAudio) window.smritiAudio.playSuccess();
          btn.style.transform = 'scale(1.35) rotate(-12deg)';
          btn.style.borderColor = '#38bdf8';
          window.smritiSpeech.speak(`You guided the friendly ${pollinatorName}!`);
          setTimeout(() => {
            if (this.currentRound < 3) this.startLevel2();
            else this.finish();
          }, 1100);
        } else {
          this.mistakes = (this.mistakes || 0) + 1;
          btn.style.transform = 'scale(0.92)';
          window.smritiSpeech.speak(`Look for the ${pollinatorName} on the blossoms.`);
        }
      });
    });
  }

  /* ---------------------------------------------------------
     LEVEL 3: Zen Chime Sequence (Melodic Pattern Recall)
     --------------------------------------------------------- */
  startLevel3() {
    this.currentRound++;
    const seqLength = this.currentRound + 2; // Round 1: 3 notes, Round 2: 4 notes, Round 3: 5 notes!
    this.sequence = [];
    for (let i = 0; i < seqLength; i++) {
      this.sequence.push(Math.floor(Math.random() * 4));
    }
    this.playerStep = 0;

    const promptText = `Listen to the melody of ${seqLength} blooming flowers, then repeat the sequence in order!`;

    this.container.innerHTML = `
      <div class="game-arena">
        <div class="game-instruction-banner">
          <div class="game-instruction-text">
            <span>🎶 Level 3: Zen Chime Sequence (Pattern of ${seqLength} Flowers)</span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="read-btn" id="g-play-seq-btn" style="background:#fdf4ff; border-color:#d8b4fe; color:#7e22ce;">▶ Replay Melodic Sequence</button>
            <button class="read-btn" id="g-lvl-change-btn" style="background:#eff6ff; color:#1e40af;">⚙️ Change Level</button>
          </div>
        </div>

        <div class="garden-arena" style="min-height:480px;">
          <div class="garden-prompt-bar">
            <span id="g3-status-text">Watch the flowers chime in order...</span>
          </div>

          <div class="garden-field" id="g3-field" style="max-width:440px; grid-template-columns: repeat(2, 1fr); gap:20px;">
            ${this.flowerTypes.slice(0, 4).map((f, i) => `
              <button class="garden-flower-btn" data-seq-idx="${i}" style="height:120px; font-size:3.5rem;">
                ${f.icon}
                <div style="font-size:0.85rem; font-weight:700; color:#475569; margin-top:4px;">${f.name}</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('g-lvl-change-btn').addEventListener('click', () => this.renderLevelSelect());
    document.getElementById('g-play-seq-btn').addEventListener('click', () => this.playSequence());

    window.smritiSpeech.speak(promptText);
    setTimeout(() => this.playSequence(), 1000);
  }

  playSequence() {
    const btns = this.container.querySelectorAll('[data-seq-idx]');
    btns.forEach(b => b.style.pointerEvents = 'none');

    const statusText = document.getElementById('g3-status-text');
    if (statusText) statusText.textContent = "Listening to garden melody...";

    let delay = 300;
    this.sequence.forEach((idx, step) => {
      setTimeout(() => {
        const btn = btns[idx];
        if (btn) {
          btn.classList.add('active-target');
          btn.style.transform = 'scale(1.25)';
          btn.style.borderColor = '#a855f7';
          if (window.smritiAudio) window.smritiAudio.playChime();

          setTimeout(() => {
            btn.classList.remove('active-target');
            btn.style.transform = 'scale(1)';
            btn.style.borderColor = '#6ee7b7';
          }, 450);
        }
      }, delay);
      delay += 750;
    });

    setTimeout(() => {
      if (statusText) statusText.textContent = "Your turn! Tap the flowers in the order they bloomed:";
      btns.forEach(b => b.style.pointerEvents = 'auto');
      this.attachSequencePlayer();
    }, delay + 200);
  }

  attachSequencePlayer() {
    this.playerStep = 0;
    const btns = this.container.querySelectorAll('[data-seq-idx]');

    btns.forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-seq-idx'), 10);
        if (idx === this.sequence[this.playerStep]) {
          // Correct note
          this.correctHits = (this.correctHits || 0) + 1;
          if (window.smritiAudio) window.smritiAudio.playChime();
          btn.style.transform = 'scale(1.2)';
          setTimeout(() => btn.style.transform = 'scale(1)', 200);
          this.playerStep++;

          const statusText = document.getElementById('g3-status-text');
          if (statusText) statusText.textContent = `Correct! (${this.playerStep}/${this.sequence.length} steps matched ✨)`;

          if (this.playerStep === this.sequence.length) {
            // Completed pattern!
            if (window.smritiAudio) window.smritiAudio.playSuccess();
            window.smritiSpeech.speak("Flawless musical harmony!");
            setTimeout(() => {
              if (this.currentRound < 3) this.startLevel3();
              else this.finish();
            }, 1200);
          }
        } else {
          // Mistake in sequence
          this.mistakes = (this.mistakes || 0) + 1;
          if (window.smritiAudio) window.smritiAudio.playPop();
          window.smritiSpeech.speak("Let's listen to the gentle melody one more time.");
          setTimeout(() => this.playSequence(), 900);
        }
      };
    });
  }

  /* ---------------------------------------------------------
     LEVEL 4: Master Botanist 9-Flower Multi-Target Challenge
     --------------------------------------------------------- */
  startLevel4() {
    this.currentRound++;
    let targetTasks = [];
    if (this.currentRound === 1) {
      targetTasks = [
        { color: 'yellow', name: '2 Yellow Sunshine Flowers 🌻 🌼', count: 2 }
      ];
    } else if (this.currentRound === 2) {
      targetTasks = [
        { color: 'purple', name: '2 Purple Lotus & Lavender 🪷 🪻', count: 2 }
      ];
    } else {
      targetTasks = [
        { color: 'pink', name: '3 Pink Blossoms 🌸 🌷', count: 3 }
      ];
    }

    const task = targetTasks[0];
    let completedCount = 0;

    const promptText = `Master Botanist Task: Find and tap ${task.name} in the 9-blossom meadow.`;

    this.container.innerHTML = `
      <div class="game-arena">
        <div class="game-instruction-banner">
          <div class="game-instruction-text">
            <span>👑 Level 4: Master Botanist 9-Meadow (Round ${this.currentRound}/3)</span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="read-btn" id="g-speak-btn">🔊 Read</button>
            <button class="read-btn" id="g-lvl-change-btn" style="background:#eff6ff; color:#1e40af;">⚙️ Change Level</button>
          </div>
        </div>

        <div class="garden-arena" style="min-height:540px;">
          <div class="garden-prompt-bar">
            <span>Target:</span>
            <strong style="color:#c2410c; font-size:1.35rem;">${task.name}</strong>
            <span id="g4-count-badge" style="background:#ffedd5; color:#9a3412; padding:4px 12px; border-radius:999px; margin-left:12px; font-weight:700;">
              0 / ${task.count} collected
            </span>
          </div>

          <div class="garden-field" style="max-width:580px; grid-template-columns: repeat(3, 1fr); gap:16px;">
            ${this.flowerTypes.slice(0, 9).map(f => `
              <button class="garden-flower-btn" data-color="${f.color}" style="min-height:95px; font-size:3.2rem;">
                ${f.icon}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('g-speak-btn').addEventListener('click', () => window.smritiSpeech.speak(promptText));
    document.getElementById('g-lvl-change-btn').addEventListener('click', () => this.renderLevelSelect());
    window.smritiSpeech.speak(promptText);

    this.container.querySelectorAll('.garden-flower-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('collected')) return;

        const color = btn.getAttribute('data-color');
        if (color === task.color) {
          btn.classList.add('collected');
          completedCount++;
          this.correctHits = (this.correctHits || 0) + 1;
          if (window.smritiAudio) window.smritiAudio.playChime();
          btn.style.transform = 'scale(1.25) rotate(10deg)';
          btn.style.background = '#dcfce7';

          const badge = document.getElementById('g4-count-badge');
          if (badge) badge.textContent = `${completedCount} / ${task.count} collected ✨`;

          if (completedCount >= task.count) {
            if (window.smritiAudio) window.smritiAudio.playSuccess();
            window.smritiSpeech.speak("Botanical target achieved!");
            setTimeout(() => {
              if (this.currentRound < 3) this.startLevel4();
              else this.finish();
            }, 1200);
          }
        } else {
          this.mistakes = (this.mistakes || 0) + 1;
          btn.style.transform = 'scale(0.9)';
          setTimeout(() => btn.style.transform = 'scale(1)', 200);
          window.smritiSpeech.speak(`Look for the ${task.color} flowers.`);
        }
      });
    });
  }

  finish() {
    const elapsedSeconds = Math.max(6, Math.round((Date.now() - (this.startTime || Date.now())) / 1000));
    const hits = Math.max(1, this.correctHits || 3);
    const errors = this.mistakes || 0;
    const total = hits + errors;
    const hitRatio = hits / total;
    
    // Pace benchmark based on garden level
    const targetSec = 15 + this.level * 8;
    let speedScore = 100;
    if (elapsedSeconds > targetSec) {
      speedScore = Math.max(45, Math.round(100 - (elapsedSeconds - targetSec) * 2));
    } else {
      speedScore = Math.min(100, Math.round(85 + (targetSec - elapsedSeconds) * 1.5));
    }

    const levelBonus = (this.level - 1) * 3;
    const rawScore = Math.round((hitRatio * 65) + (speedScore * 0.35) + levelBonus - (errors * 4));
    const score = Math.max(30, Math.min(100, rawScore));

    window.smritiData.saveGameScore('garden', score);
    if (window.smritiAudio) window.smritiAudio.playWin();

    setTimeout(() => {
      this.container.innerHTML = `
        <div class="game-finish-card">
          <div class="finish-icon">${score >= 85 ? '🌿' : (score >= 60 ? '🌸' : '🌱')}</div>
          <h3 class="finish-title">Garden Level ${this.level} Complete!</h3>
          <div class="finish-score">
            Calmness & Focus: ${score}% • ${hits} Targets • ${errors} Mistakes • Time: ${elapsedSeconds}s
          </div>
          <p class="finish-msg">
            ${score >= 85 
              ? `Serene precision! You completed Level ${this.level} challenges in ${elapsedSeconds} seconds with mindful observation and high accuracy.` 
              : `Peaceful practice! Gentle sensory tracking through garden blossoms in ${elapsedSeconds} seconds exercises fine motor control and visual pathways.`}
          </p>
          <div style="display:flex; gap:14px; margin-top:12px; flex-wrap:wrap; justify-content:center;">
            <button class="header-action-btn" id="g-next-lvl-btn" style="padding:14px 22px; font-weight:700; background:#059669; color:#ffffff;">
              ⏩ Next Level (${Math.min(4, this.level + 1)})
            </button>
            <button class="header-action-btn" id="g-replay-btn" style="padding:14px 22px; font-weight:700;">
              🔄 Play Level ${this.level} Again
            </button>
            <button class="game-play-btn" id="g-finish-btn" style="min-width:180px;">
              Return to Activities
            </button>
          </div>
        </div>
      `;

      window.smritiSpeech.speak(`Marvelous work! Garden Level ${this.level} completed with a score of ${score} percent.`);

      const nextBtn = document.getElementById('g-next-lvl-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (window.smritiSpeech) window.smritiSpeech.stopAllAudio();
          this.level = Math.min(4, this.level + 1);
          this.startLevel();
        });
      }

      document.getElementById('g-replay-btn').addEventListener('click', () => {
        if (window.smritiSpeech) window.smritiSpeech.stopAllAudio();
        this.startLevel();
      });

      document.getElementById('g-finish-btn').addEventListener('click', () => {
        if (window.smritiSpeech) window.smritiSpeech.stopAllAudio();
        if (this.onComplete) this.onComplete(score);
      });
    }, 700);
  }
}

window.FocusGardenGame = FocusGardenGame;
