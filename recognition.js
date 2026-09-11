/* =========================================================
   Game 3: Everyday Object Recognition - Enhanced
   - Large bank of 16 diverse everyday items & functions
   - 4 randomized questions per session so it's never repetitive
   - Gentle errorless hints and immediate cheerful voice feedback
   ========================================================= */

class RecognitionGame {
  constructor(containerId, onComplete) {
    this.container = document.getElementById(containerId);
    this.onComplete = onComplete;

    // Comprehensive bank of 16 everyday objects & clues
    this.questionBank = [
      {
        question: "What do we check to see what time of day it is?",
        icon: "⏰",
        options: ["Wall Clock", "Flower Pot", "Teacup", "Spoon"],
        correct: 0,
        hint: "It has hands that tick and tells hours and minutes."
      },
      {
        question: "What keeps you warm and cozy when resting in bed?",
        icon: "🛏️",
        options: ["Warm Blanket", "Telephone", "Door Key", "Newspaper"],
        correct: 0,
        hint: "It's soft and covers you when you sleep."
      },
      {
        question: "What do we put on to read small print clearly?",
        icon: "👓",
        options: ["Reading Glasses", "Teaspoon", "Hairbrush", "Mirror"],
        correct: 0,
        hint: "They sit gently on your nose and help your eyes focus."
      },
      {
        question: "What holds warm soup or tea when taking a comforting sip?",
        icon: "☕",
        options: ["Ceramic Cup", "Shoe", "Notebook", "Umbrella"],
        correct: 0,
        hint: "It has a small handle to hold while drinking."
      },
      {
        question: "What do we use to call and hear our family's voice?",
        icon: "☎️",
        options: ["Telephone", "Flashlight", "Hat", "Cushion"],
        correct: 0,
        hint: "It rings when someone wants to chat with you."
      },
      {
        question: "What helps you clean your teeth and keep breath fresh?",
        icon: "🪥",
        options: ["Toothbrush", "Pencil", "Comb", "Fork"],
        correct: 0,
        hint: "You put paste on its soft bristles every morning."
      },
      {
        question: "What do you carry in your pocket to unlock your front door?",
        icon: "🔑",
        options: ["House Keys", "Postcard", "Sponge", "Napkin"],
        correct: 0,
        hint: "Small metal items that turn in the lock."
      },
      {
        question: "What keeps you dry when it is raining outdoors?",
        icon: "☂️",
        options: ["Rain Umbrella", "Table Lamp", "Plate", "Radio"],
        correct: 0,
        hint: "You open it above your head during rain."
      },
      {
        question: "What do we check on the wall to know the day and month?",
        icon: "📅",
        options: ["Wall Calendar", "Towel", "Window", "Vase"],
        correct: 0,
        hint: "It has boxes for Monday, Tuesday, and all the months."
      },
      {
        question: "What provides gentle support when walking and taking a stroll?",
        icon: "🦯",
        options: ["Walking Cane", "Frying Pan", "Guitar", "Curtain"],
        correct: 0,
        hint: "A sturdy stick to lean on for balance."
      },
      {
        question: "What shows your own friendly reflection when you look into it?",
        icon: "🪞",
        options: ["Looking Mirror", "Teapot", "Doorbell", "Pillow"],
        correct: 0,
        hint: "It is shiny glass that shows your reflection."
      },
      {
        question: "What is used to wash away dirt and lather hands with foam?",
        icon: "🧼",
        options: ["Bar of Soap", "Screwdriver", "Clock", "Coin"],
        correct: 0,
        hint: "It makes fragrant bubbles when rubbed with water."
      },
      {
        question: "What plays cheerful music, radio broadcasts, and songs?",
        icon: "📻",
        options: ["Music Radio", "Kettle", "Bicycle", "Shoe"],
        correct: 0,
        hint: "It brings pleasant melodies right into your room."
      },
      {
        question: "What do we rest our head upon for sweet dreams at night?",
        icon: "🛏️",
        options: ["Soft Pillow", "Bookshelf", "Wall", "Basket"],
        correct: 0,
        hint: "Fluffy and placed on the bed for your head."
      },
      {
        question: "What utensil is best for enjoying warm soup or oatmeal porridge?",
        icon: "🥄",
        options: ["Soup Spoon", "Scissors", "Rake", "Comb"],
        correct: 0,
        hint: "It has a rounded bowl shape for scooping liquids."
      },
      {
        question: "What do we slip onto our feet before going outside for a walk?",
        icon: "👟",
        options: ["Walking Shoes", "Gloves", "Scarf", "Glasses"],
        correct: 0,
        hint: "They protect your feet on garden paths and sidewalks."
      }
    ];

    this.roundsPerGame = 4;
    this.sessionQuestions = [];
    this.currentIndex = 0;
    this.scorePoints = 0;
  }

  start() {
    if (!this.container) return;
    this.currentIndex = 0;
    this.correctCount = 0;
    this.incorrectCount = 0;
    this.hintsUsed = 0;
    this.startTime = Date.now();

    // Pick 4 random questions from the 16 bank
    const shuffled = [...this.questionBank].sort(() => Math.random() - 0.5);
    this.sessionQuestions = shuffled.slice(0, this.roundsPerGame);

    this.renderQuestion();
  }

  renderQuestion() {
    const q = this.sessionQuestions[this.currentIndex];

    // Shuffle options while tracking correct
    const optionsWithMeta = q.options.map((text, idx) => ({ text, isCorrect: idx === q.correct }));
    optionsWithMeta.sort(() => Math.random() - 0.5);

    this.container.innerHTML = `
      <div class="game-arena">
        <div class="game-instruction-banner">
          <div class="game-instruction-text">
            <span>Question ${this.currentIndex + 1} of ${this.sessionQuestions.length}</span>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="read-btn" id="rec-speak-btn">🔊 Read Aloud</button>
            <button class="read-btn" id="rec-hint-btn" style="background:#fef3c7; border-color:#fde047; color:#92400e;">💡 Gentle Hint</button>
          </div>
        </div>

        <div class="recognition-arena">
          <div class="recognition-prompt-box">
            <div class="recognition-big-icon">${q.icon}</div>
            <div class="recognition-question">${q.question}</div>
          </div>

          <div class="recognition-options-grid">
            ${optionsWithMeta.map((opt) => `
              <button class="recognition-opt-btn" data-correct="${opt.isCorrect}">
                ${opt.text}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const speakPrompt = () => {
      if (window.smritiSpeech) window.smritiSpeech.stopAllAudio();
      window.smritiSpeech.speak(q.question);
    };

    document.getElementById('rec-speak-btn').addEventListener('click', speakPrompt);
    document.getElementById('rec-hint-btn').addEventListener('click', () => {
      this.hintsUsed = (this.hintsUsed || 0) + 1;
      if (window.smritiSpeech) window.smritiSpeech.stopAllAudio();
      window.smritiSpeech.speak(`Hint: ${q.hint}`);
    });

    speakPrompt();

    const optButtons = this.container.querySelectorAll('.recognition-opt-btn');
    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        this.handleAnswer(btn, isCorrect, optButtons);
      });
    });
  }

  handleAnswer(selectedBtn, isCorrect, allButtons) {
    allButtons.forEach(b => b.style.pointerEvents = 'none');
    if (window.smritiSpeech) window.smritiSpeech.stopAllAudio();

    if (isCorrect) {
      selectedBtn.classList.add('correct');
      this.correctCount = (this.correctCount || 0) + 1;
      if (window.smritiAudio) window.smritiAudio.playSuccess();
      window.smritiSpeech.speak("That's right! Wonderful answer!");
    } else {
      selectedBtn.classList.add('wrong');
      this.incorrectCount = (this.incorrectCount || 0) + 1;
      allButtons.forEach(b => {
        if (b.getAttribute('data-correct') === 'true') {
          b.classList.add('correct');
        }
      });
      if (window.smritiAudio) window.smritiAudio.playPop();
      window.smritiSpeech.speak("Good try! The highlighted green choice is the match.");
    }

    setTimeout(() => {
      if (window.smritiSpeech) window.smritiSpeech.stopAllAudio();
      this.currentIndex++;
      if (this.currentIndex < this.sessionQuestions.length) {
        this.renderQuestion();
      } else {
        this.finish();
      }
    }, 1400);
  }

  finish() {
    const total = this.sessionQuestions.length || 4;
    const elapsedSeconds = Math.max(5, Math.round((Date.now() - (this.startTime || Date.now())) / 1000));
    const accRatio = this.correctCount / total;
    
    // Average seconds per question (gentle cognitive benchmark: ~7s per item)
    const avgSec = elapsedSeconds / total;
    let speedScore = 100;
    if (avgSec > 7) {
      speedScore = Math.max(45, Math.round(100 - (avgSec - 7) * 3));
    } else {
      speedScore = Math.min(100, Math.round(85 + (7 - avgSec) * 2));
    }

    const deductions = ((this.hintsUsed || 0) * 4) + ((this.incorrectCount || 0) * 5);
    const rawScore = Math.round((accRatio * 65) + (speedScore * 0.35) - deductions);
    const score = Math.max(25, Math.min(100, rawScore));

    window.smritiData.saveGameScore('recognition', score);
    if (window.smritiAudio) window.smritiAudio.playWin();

    this.container.innerHTML = `
      <div class="game-finish-card">
        <div class="finish-icon">${score >= 80 ? '💡' : (score >= 60 ? '🌟' : '👏')}</div>
        <h3 class="finish-title">${score >= 80 ? 'Fabulous Everyday Recall!' : 'Good Effort on Everyday Recall!'}</h3>
        <div class="finish-score">Score: ${score}% • Precision: ${this.correctCount}/${total} Items • Avg Time: ${avgSec.toFixed(1)}s/item • Hints: ${this.hintsUsed || 0}</div>
        <p class="finish-msg">Connecting everyday items with what they do in ${elapsedSeconds} seconds keeps your memory sharp, active, and vibrant.</p>
        <div style="display:flex; gap:12px; margin-top:10px;">
          <button class="header-action-btn" id="rec-play-again-btn" style="padding:12px 20px;">
            🔄 Play Again (New Clues)
          </button>
          <button class="game-play-btn" id="rec-finish-btn" style="min-width: 180px;">
            Return to Activities
          </button>
        </div>
      </div>
    `;

    window.smritiSpeech.speak(`Wonderful job on object recall! You scored ${score} percent.`);

    document.getElementById('rec-play-again-btn').addEventListener('click', () => {
      if (window.smritiSpeech) window.smritiSpeech.stopAllAudio();
      this.start();
    });

    document.getElementById('rec-finish-btn').addEventListener('click', () => {
      if (window.smritiSpeech) window.smritiSpeech.stopAllAudio();
      if (this.onComplete) this.onComplete(score);
    });
  }
}

window.RecognitionGame = RecognitionGame;
