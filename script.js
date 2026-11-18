
const questions = [
  {
    name: "Tuzli suv",
    formula: "NaCl + H₂O",
    answer: "solution",
    hint: "Tuz suvda erib, bir xil aralashma hosil qiladi."
  },
  {
    name: "Kislorod",
    formula: "O₂",
    answer: "pure",
    hint: "Bu modda faqat kislorod elementidan tashkil topgan."
  },
  {
    name: "Suv",
    formula: "H₂O",
    answer: "compound",
    hint: "U vodorod va kislorod elementlaridan tuzilgan."
  },
  {
    name: "Havo",
    formula: "N₂ + O₂ + boshqa gazlar",
    answer: "solution",
    hint: "Havo bir nechta gazlarning bir xil aralashmasidir."
  },
  {
    name: "Temir",
    formula: "Fe",
    answer: "pure",
    hint: "Bu kimyoviy elementning belgisi Fe."
  },
  {
    name: "Karbonat angidrid",
    formula: "CO₂",
    answer: "compound",
    hint: "U uglerod va kislorod atomlaridan tashkil topgan."
  },
  {
    name: "Shakarli suv",
    formula: "C₁₂H₂₂O₁₁ + H₂O",
    answer: "solution",
    hint: "Shakar suvda erib, bir xil aralashma hosil qiladi."
  },
  {
    name: "Oltin",
    formula: "Au",
    answer: "pure",
    hint: "Bu qimmatbaho metallning kimyoviy belgisi Au."
  },
  {
    name: "Osh tuzi",
    formula: "NaCl",
    answer: "compound",
    hint: "U natriy va xlor elementlaridan tashkil topgan."
  },
  {
    name: "Sirka eritmasi",
    formula: "CH₃COOH + H₂O",
    answer: "solution",
    hint: "Sirka kislotasi suv bilan aralashgan."
  },
  {
    name: "Vodorod",
    formula: "H₂",
    answer: "pure",
    hint: "Bu oddiy modda vodorod atomlaridan tashkil topgan."
  },
  {
    name: "Ammiak",
    formula: "NH₃",
    answer: "compound",
    hint: "U azot va vodorod elementlaridan tuzilgan."
  },
  {
    name: "Gazlangan suv",
    formula: "H₂O + CO₂",
    answer: "solution",
    hint: "Suv tarkibida erigan karbonat angidrid mavjud."
  },
  {
    name: "Mis",
    formula: "Cu",
    answer: "pure",
    hint: "Bu metallning kimyoviy belgisi Cu."
  },
  {
    name: "Metan",
    formula: "CH₄",
    answer: "compound",
    hint: "U uglerod va vodorod elementlaridan tashkil topgan."
  },
  {
    name: "Spirt va suv aralashmasi",
    formula: "C₂H₅OH + H₂O",
    answer: "solution",
    hint: "Spirt va suv bir xil aralashma hosil qilishi mumkin."
  },
  {
    name: "Azot",
    formula: "N₂",
    answer: "pure",
    hint: "Havoda ko‘p uchraydigan oddiy gaz."
  },
  {
    name: "Kalsiy karbonat",
    formula: "CaCO₃",
    answer: "compound",
    hint: "U kalsiy, uglerod va kislorod elementlaridan tuzilgan."
  },
  {
    name: "Mis kuporosi eritmasi",
    formula: "CuSO₄ + H₂O",
    answer: "solution",
    hint: "Mis sulfat suvda erigan holatda bo‘ladi."
  },
  {
    name: "Olmos",
    formula: "C",
    answer: "pure",
    hint: "Olmos uglerod elementining bir ko‘rinishidir."
  }
];

const ui = {
  score: document.getElementById("score"),
  record: document.getElementById("record"),
  timer: document.getElementById("timer"),
  questionNumber: document.getElementById("questionNumber"),
  correctCount: document.getElementById("correctCount"),
  level: document.getElementById("level"),
  difficulty: document.getElementById("difficulty"),
  progressText: document.getElementById("progressText"),
  progressFill: document.getElementById("progressFill"),
  questionBadge: document.getElementById("questionBadge"),
  substanceName: document.getElementById("substanceName"),
  substanceFormula: document.getElementById("substanceFormula"),
  moleculeVisual: document.getElementById("moleculeVisual"),
  hintBox: document.getElementById("hintBox"),
  hintText: document.getElementById("hintText"),
  feedback: document.getElementById("feedback"),
  streak: document.getElementById("streak"),
  accuracy: document.getElementById("accuracy"),
  startModal: document.getElementById("startModal"),
  resultModal: document.getElementById("resultModal"),
  resultIcon: document.getElementById("resultIcon"),
  resultTitle: document.getElementById("resultTitle"),
  resultMessage: document.getElementById("resultMessage"),
  finalScore: document.getElementById("finalScore"),
  finalCorrect: document.getElementById("finalCorrect"),
  finalAccuracy: document.getElementById("finalAccuracy")
};

const TOTAL_QUESTIONS = questions.length;
const START_TIME = 60;

let gameQuestions = [];
let currentIndex = 0;
let score = 0;
let correctAnswers = 0;
let answeredCount = 0;
let streak = 0;
let bestStreak = 0;
let timeLeft = START_TIME;
let timerInterval = null;
let locked = true;
let gameStarted = false;
let soundEnabled = true;
let hintUsed = false;

let record = 0;

try {
  record = Number(localStorage.getItem("chemSortRecord")) || 0;
} catch (error) {
  record = 0;
}

ui.record.textContent = record;

function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function playSound(frequency = 500, duration = 0.12, type = "sine") {
  if (!soundEnabled) return;

  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.08, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);

    oscillator.onended = () => audioContext.close();
  } catch (error) {
    console.log("Ovoz ishlamadi:", error);
  }
}

function updateStats() {
  ui.score.textContent = score;
  ui.correctCount.textContent = correctAnswers;
  ui.timer.textContent = timeLeft;
  ui.streak.textContent = streak;

  const accuracy = answeredCount
    ? Math.round((correctAnswers / answeredCount) * 100)
    : 0;

  ui.accuracy.textContent = accuracy + "%";

  const progress = Math.round(
    (currentIndex / TOTAL_QUESTIONS) * 100
  );

  ui.progressFill.style.width = progress + "%";
  ui.progressText.textContent = progress + "%";

  ui.questionNumber.textContent = Math.min(
    currentIndex + 1,
    TOTAL_QUESTIONS
  );

  ui.questionBadge.textContent = String(
    Math.min(currentIndex + 1, TOTAL_QUESTIONS)
  ).padStart(2, "0");

  ui.level.textContent = Math.floor(currentIndex / 5) + 1;

  if (currentIndex < 5) {
    ui.difficulty.textContent = "Oson";
  } else if (currentIndex < 12) {
    ui.difficulty.textContent = "O‘rta";
  } else {
    ui.difficulty.textContent = "Qiyin";
  }
}

function showQuestion() {
  if (currentIndex >= TOTAL_QUESTIONS) {
    finishGame();
    return;
  }

  const question = gameQuestions[currentIndex];

  locked = false;
  hintUsed = false;

  ui.substanceName.textContent = question.name;
  ui.substanceFormula.textContent = question.formula;

  ui.hintBox.hidden = true;
  ui.feedback.textContent = "Javobni tanlang yoki moddani qutiga sudrang!";
  ui.feedback.className = "feedback";

  ui.moleculeVisual.querySelector(".atom-main").textContent =
    question.formula.length > 4 ? "?" : question.formula;

  ui.moleculeVisual.setAttribute("draggable", "true");

  document.querySelectorAll(".category-card").forEach(card => {
    card.classList.remove("drag-over");
  });

  updateStats();
}

function showFeedback(message, type) {
  ui.feedback.textContent = message;
  ui.feedback.className = "feedback " + type;
}

function checkAnswer(selectedCategory) {
  if (!gameStarted || locked) return;

  const question = gameQuestions[currentIndex];

  locked = true;
  answeredCount++;

  if (selectedCategory === question.answer) {
    correctAnswers++;

    const bonus = Math.min(streak, 5) * 2;
    const earned = 10 + bonus;

    score += earned;
    streak++;
    bestStreak = Math.max(bestStreak, streak);

    showFeedback("✓ To‘g‘ri! +" + earned + " ball", "correct");
    playSound(720, 0.15);

    if (score > record) {
      record = score;
      ui.record.textContent = record;

      try {
        localStorage.setItem("chemSortRecord", record);
      } catch (error) {
        console.log("Rekord saqlanmadi.");
      }
    }
  } else {
    streak = 0;

    const correctName = getCategoryName(question.answer);

    showFeedback("✕ Noto‘g‘ri! To‘g‘ri javob: " + correctName, "wrong");
    playSound(180, 0.2, "triangle");
  }

  updateStats();

  setTimeout(() => {
    if (!gameStarted) return;

    currentIndex++;
    showQuestion();
  }, 850);
}

function getCategoryName(category) {
  const names = {
    solution: "Eritma",
    pure: "Sof modda",
    compound: "Murakkab modda"
  };

  return names[category] || category;
}

function showHint() {
  if (!gameStarted || locked) return;

  const question = gameQuestions[currentIndex];

  ui.hintText.textContent = question.hint;
  ui.hintBox.hidden = false;

  if (!hintUsed) {
    hintUsed = true;
    showFeedback("💡 Maslahat ko‘rsatildi.", "");
  }

  playSound(450, 0.1);
}

function skipQuestion() {
  if (!gameStarted || locked) return;

  locked = true;
  answeredCount++;
  streak = 0;

  score = Math.max(0, score - 2);

  showFeedback(
    "Savol o‘tkazildi. To‘g‘ri javob: " +
    getCategoryName(gameQuestions[currentIndex].answer),
    "wrong"
  );

  playSound(250, 0.1);

  updateStats();

  setTimeout(() => {
    if (!gameStarted) return;

    currentIndex++;
    showQuestion();
  }, 850);
}

function startTimer() {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (!gameStarted) return;

    timeLeft--;
    ui.timer.textContent = timeLeft;

    if (timeLeft <= 10) {
      ui.timer.style.color = "#ff7777";
    } else {
      ui.timer.style.color = "";
    }

    if (timeLeft <= 0) {
      finishGame();
    }
  }, 1000);
}

function startGame() {
  clearInterval(timerInterval);

  gameQuestions = shuffle(questions);
  currentIndex = 0;
  score = 0;
  correctAnswers = 0;
  answeredCount = 0;
  streak = 0;
  bestStreak = 0;
  timeLeft = START_TIME;
  locked = false;
  gameStarted = true;

  ui.timer.style.color = "";
  ui.startModal.hidden = true;
  ui.resultModal.hidden = true;

  updateStats();
  showQuestion();
  startTimer();

  playSound(600, 0.16);
}

function finishGame() {
  if (!gameStarted) return;

  gameStarted = false;
  locked = true;

  clearInterval(timerInterval);

  const accuracy = answeredCount
    ? Math.round((correctAnswers / answeredCount) * 100)
    : 0;

  ui.progressFill.style.width = "100%";
  ui.progressText.textContent = "100%";

  ui.finalScore.textContent = score;
  ui.finalCorrect.textContent =
    correctAnswers + "/" + TOTAL_QUESTIONS;
  ui.finalAccuracy.textContent = accuracy + "%";

  if (accuracy >= 80) {
    ui.resultIcon.textContent = "🏆";
    ui.resultTitle.textContent = "Ajoyib kimyogar!";
    ui.resultMessage.textContent =
      "Juda yaxshi! Sen moddalarni a’lo darajada ajratding.";
  } else if (accuracy >= 50) {
    ui.resultIcon.textContent = "🧪";
    ui.resultTitle.textContent = "Yaxshi natija!";
    ui.resultMessage.textContent =
      "Yana mashq qil va bilimlaringni mustahkamla.";
  } else {
    ui.resultIcon.textContent = "📚";
    ui.resultTitle.textContent = "Yana urinib ko‘r!";
    ui.resultMessage.textContent =
      "Har bir urinish yangi bilim beradi. Sen buni uddalaysan!";
  }

  ui.resultModal.hidden = false;
  playSound(800, 0.25);
}

function restartGame() {
  clearInterval(timerInterval);
  gameStarted = false;
  locked = true;

  ui.resultModal.hidden = true;
  ui.startModal.hidden = false;

  ui.score.textContent = "0";
  ui.timer.textContent = START_TIME;
  ui.timer.style.color = "";
  ui.correctCount.textContent = "0";
  ui.streak.textContent = "0";
  ui.accuracy.textContent = "0%";
  ui.progressFill.style.width = "0%";
  ui.progressText.textContent = "0%";
  ui.questionNumber.textContent = "1";
  ui.level.textContent = "1";
  ui.difficulty.textContent = "Aralash";
}

document.getElementById("startBtn").addEventListener("click", startGame);

document.getElementById("playAgainBtn").addEventListener("click", startGame);

document.getElementById("restartBtn").addEventListener("click", restartGame);

document.getElementById("hintBtn").addEventListener("click", showHint);

document.getElementById("skipBtn").addEventListener("click", skipQuestion);

document.getElementById("soundBtn").addEventListener("click", () => {
  soundEnabled = !soundEnabled;

  document.getElementById("soundBtn").textContent =
    soundEnabled ? "🔊" : "🔇";

  if (soundEnabled) playSound(600, 0.12);
});

document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    checkAnswer(card.dataset.category);
  });

  card.addEventListener("dragover", event => {
    event.preventDefault();

    if (gameStarted && !locked) {
      card.classList.add("drag-over");
    }
  });

  card.addEventListener("dragleave", () => {
    card.classList.remove("drag-over");
  });

  card.addEventListener("drop", event => {
    event.preventDefault();
    card.classList.remove("drag-over");

    checkAnswer(card.dataset.category);
  });
});

ui.moleculeVisual.addEventListener("dragstart", event => {
  if (!gameStarted || locked) {
    event.preventDefault();
    return;
  }

  event.dataTransfer.setData("text/plain", "chem-sort-substance");
});

document.querySelectorAll(".category-card").forEach(card => {
  card.setAttribute("aria-label", getCategoryName(card.dataset.category));
});

// O‘yin boshlanishidan oldingi ko‘rinish
restartGame();
