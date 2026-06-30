const screens = {
  material: document.getElementById("screen-material"),
  example: document.getElementById("screen-example"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result")
};

const progressText = document.getElementById("progress-text");
const scoreText = document.getElementById("score-text");
const progressFill = document.getElementById("progress-fill");
const questionTag = document.getElementById("question-tag");
const questionText = document.getElementById("question-text");
const questionImageWrapper = document.getElementById("question-image-wrapper");
const optionsContainer = document.getElementById("options-container");
const feedbackBox = document.getElementById("feedback-box");
const nextButton = document.getElementById("next-button");
const finalScore = document.getElementById("final-score");
const resultMessage = document.getElementById("result-message");
const soundToggleButton = document.getElementById("sound-toggle");

let audioContext = null;

// Sebagian soal memakai gambar buatan sendiri agar mudah dipakai saat demo ke dosen.
const questions = [
  {
    question: "Pizza dibagi menjadi 2 bagian sama besar. Jika diambil 1 bagian, pecahannya adalah...",
    options: ["1/2", "1/3", "1/4", "2/1"],
    answer: "1/2",
    explanation: "Jumlah semua bagian ada 2, yang diambil 1 bagian, jadi pecahannya 1/2."
  },
  {
    question: "Satu dari tiga bagian sama besar ditulis sebagai...",
    options: ["1/2", "1/3", "1/4", "3/1"],
    answer: "1/3",
    explanation: "Pecahan 1/3 berarti satu bagian dari tiga bagian yang sama besar."
  },
  {
    question: "Gambar berikut menunjukkan pecahan berapa?",
    image: "assets/images/pizza-1-2.png",
    imageAlt: "Pizza menunjukkan satu dari dua bagian dipilih",
    options: ["1/2", "1/3", "1/4", "1/5"],
    answer: "1/2",
    explanation: "Pizza pada gambar dibagi 2 bagian sama besar, dan 1 bagian ditunjukkan."
  },
  {
    question: "Gambar semangka berikut menunjukkan pecahan berapa?",
    image: "assets/images/watermelon-1-3.png",
    imageAlt: "Semangka menunjukkan satu dari tiga bagian dipilih",
    options: ["1/2", "1/3", "1/4", "1/5"],
    answer: "1/3",
    explanation: "Semangka dibagi 3 bagian sama besar dan 1 bagian ditunjukkan, jadi 1/3."
  },
  {
    question: "Mana pecahan yang menunjukkan satu dari empat bagian sama besar?",
    options: ["1/2", "1/3", "1/4", "4/1"],
    answer: "1/4",
    explanation: "Jika ada 4 bagian sama besar dan yang diambil 1, pecahannya 1/4."
  },
  {
    question: "Gambar pizza berikut menunjukkan pecahan berapa?",
    image: "assets/images/pizza-1-4.png",
    imageAlt: "Pizza menunjukkan satu dari empat bagian dipilih",
    options: ["1/2", "1/3", "1/4", "1/5"],
    answer: "1/4",
    explanation: "Pizza dibagi 4 bagian sama besar dan hanya 1 bagian yang ditunjukkan."
  },
  {
    question: "Mana yang lebih besar jika bendanya sama besar?",
    options: ["1/4", "1/2", "Sama besar", "Tidak bisa dibandingkan"],
    answer: "1/2",
    explanation: "1/2 lebih besar daripada 1/4 karena bendanya dibagi menjadi lebih sedikit bagian."
  },
  {
    question: "Gambar semangka berikut menunjukkan pecahan berapa?",
    image: "assets/images/watermelon-1-2.png",
    imageAlt: "Semangka menunjukkan satu dari dua bagian dipilih",
    options: ["1/2", "1/3", "1/4", "1/5"],
    answer: "1/2",
    explanation: "Semangka dibagi 2 bagian sama besar dan 1 bagian ditunjukkan, jadi pecahannya 1/2."
  },
  {
    question: "Gambar semangka berikut menunjukkan pecahan berapa?",
    image: "assets/images/watermelon-1-4.png",
    imageAlt: "Semangka menunjukkan satu dari empat bagian dipilih",
    options: ["1/2", "1/3", "1/4", "1/5"],
    answer: "1/4",
    explanation: "Semangka dibagi 4 bagian sama besar dan 1 bagian ditunjukkan, jadi 1/4."
  },
  {
    question: "Jika angka bawah pada pecahan pembilang 1 makin besar, ukuran satu bagiannya akan...",
    options: ["Makin besar", "Tetap sama", "Makin kecil", "Tidak berubah"],
    answer: "Makin kecil",
    explanation: "Saat benda dibagi menjadi lebih banyak bagian, setiap bagiannya menjadi lebih kecil."
  },
  {
    question: "Gambar berikut menunjukkan pecahan berapa?",
    image: "assets/images/pizza-1-3.png",
    imageAlt: "Pizza menunjukkan satu dari tiga bagian dipilih",
    options: ["1/2", "1/3", "1/4", "1/5"],
    answer: "1/3",
    explanation: "Pizza dibagi 3 bagian sama besar dan 1 bagian dipilih, maka pecahannya 1/3."
  },
  {
    question: "Jika sebuah benda dibagi menjadi 4 bagian sama besar lalu diambil 1 bagian, pecahan yang benar adalah...",
    options: ["1/2", "1/3", "1/4", "4/4"],
    answer: "1/4",
    explanation: "Jumlah semua bagian ada 4 dan yang diambil 1 bagian, jadi pecahannya 1/4."
  }
];

const state = {
  currentQuestionIndex: 0,
  score: 0,
  hasAnswered: false,
  soundEnabled: true
};

function getAudioContext() {
  if (!state.soundEnabled) {
    return null;
  }

  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return null;
    }

    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

// SFX dibuat dengan Web Audio API supaya tidak perlu file audio tambahan.
function playTone({ frequency, duration, type = "sine", volume = 0.03, delay = 0 }) {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const startTime = context.currentTime + delay;
  const endTime = startTime + duration;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(endTime);
}

function playButtonSound() {
  playTone({ frequency: 540, duration: 0.08, type: "triangle", volume: 0.02 });
}

function playCorrectSound() {
  playTone({ frequency: 523.25, duration: 0.09, type: "triangle", volume: 0.03 });
  playTone({ frequency: 659.25, duration: 0.09, type: "triangle", volume: 0.03, delay: 0.08 });
  playTone({ frequency: 783.99, duration: 0.12, type: "triangle", volume: 0.03, delay: 0.16 });
}

function playWrongSound() {
  playTone({ frequency: 320, duration: 0.11, type: "sawtooth", volume: 0.02 });
  playTone({ frequency: 250, duration: 0.14, type: "sawtooth", volume: 0.02, delay: 0.1 });
}

function playResultSound(score) {
  if (score >= 8) {
    playTone({ frequency: 523.25, duration: 0.1, type: "triangle", volume: 0.03 });
    playTone({ frequency: 659.25, duration: 0.1, type: "triangle", volume: 0.03, delay: 0.08 });
    playTone({ frequency: 783.99, duration: 0.1, type: "triangle", volume: 0.03, delay: 0.16 });
    playTone({ frequency: 1046.5, duration: 0.16, type: "triangle", volume: 0.03, delay: 0.26 });
    return;
  }

  if (score >= 5) {
    playTone({ frequency: 440, duration: 0.12, type: "triangle", volume: 0.025 });
    playTone({ frequency: 523.25, duration: 0.12, type: "triangle", volume: 0.025, delay: 0.12 });
    return;
  }

  playTone({ frequency: 330, duration: 0.12, type: "sine", volume: 0.02 });
  playTone({ frequency: 392, duration: 0.14, type: "sine", volume: 0.02, delay: 0.12 });
}

function updateSoundButton() {
  soundToggleButton.textContent = state.soundEnabled ? "Suara: On" : "Suara: Off";
  soundToggleButton.setAttribute("aria-pressed", String(state.soundEnabled));
  soundToggleButton.classList.toggle("muted", !state.soundEnabled);
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  updateSoundButton();

  if (state.soundEnabled) {
    playButtonSound();
    return;
  }

  if (audioContext && audioContext.state !== "closed") {
    audioContext.suspend();
  }
}

function showScreen(screenName) {
  Object.values(screens).forEach((screen) => {
    screen.classList.add("hidden");
    screen.classList.remove("active");
  });

  screens[screenName].classList.remove("hidden");
  screens[screenName].classList.add("active");
}

function startQuiz() {
  playButtonSound();
  state.currentQuestionIndex = 0;
  state.score = 0;
  state.hasAnswered = false;
  scoreText.textContent = state.score;
  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  const currentQuestion = questions[state.currentQuestionIndex];
  const questionNumber = state.currentQuestionIndex + 1;
  const progressPercent = (questionNumber / questions.length) * 100;

  state.hasAnswered = false;
  progressText.textContent = `Soal ${questionNumber} dari ${questions.length}`;
  scoreText.textContent = state.score;
  progressFill.style.width = `${progressPercent}%`;
  questionText.textContent = currentQuestion.question;
  optionsContainer.innerHTML = "";
  feedbackBox.className = "feedback-box hidden";
  feedbackBox.textContent = "";
  nextButton.classList.add("hidden");

  if (currentQuestion.image) {
    questionTag.classList.remove("hidden");
    questionTag.textContent = "Soal Gambar";
    questionImageWrapper.classList.remove("hidden");
    questionImageWrapper.innerHTML = `<img class="question-image" src="${currentQuestion.image}" alt="${currentQuestion.imageAlt}">`;
  } else {
    questionTag.classList.add("hidden");
    questionImageWrapper.classList.add("hidden");
    questionImageWrapper.innerHTML = "";
  }

  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.textContent = option;
    button.addEventListener("click", () => handleAnswer(button, option));
    optionsContainer.appendChild(button);
  });
}

// Setelah satu jawaban dipilih, tombol lain dikunci agar alur latihan tetap rapi.
function handleAnswer(selectedButton, selectedOption) {
  if (state.hasAnswered) {
    return;
  }

  state.hasAnswered = true;
  const currentQuestion = questions[state.currentQuestionIndex];
  const optionButtons = document.querySelectorAll(".option-button");
  const isCorrect = selectedOption === currentQuestion.answer;

  optionButtons.forEach((button) => {
    button.disabled = true;

    if (button.textContent === currentQuestion.answer) {
      button.classList.add("correct");
    }
  });

  if (isCorrect) {
    playCorrectSound();
    state.score += 1;
    scoreText.textContent = state.score;
    selectedButton.classList.add("correct");
    feedbackBox.className = "feedback-box success";
    feedbackBox.textContent = `Hebat! Jawabanmu benar. ${currentQuestion.explanation}`;
  } else {
    playWrongSound();
    selectedButton.classList.add("wrong");
    feedbackBox.className = "feedback-box error";
    feedbackBox.textContent = `Belum tepat. ${currentQuestion.explanation}`;
  }

  nextButton.classList.remove("hidden");
}

function goToNextQuestion() {
  playButtonSound();
  if (state.currentQuestionIndex < questions.length - 1) {
    state.currentQuestionIndex += 1;
    renderQuestion();
    return;
  }

  showResult();
}

function getMotivationMessage(score) {
  if (score >= 9) {
    return "Luar biasa! Kamu sudah sangat paham pecahan pembilang 1. Pertahankan semangat belajarmu!";
  }

  if (score >= 7) {
    return "Bagus sekali! Kamu sudah mengerti banyak soal. Coba ulangi lagi supaya makin mantap.";
  }

  if (score >= 5) {
    return "Kerjamu sudah baik. Yuk, baca materi sekali lagi lalu coba latihan ulang agar lebih yakin.";
  }

  return "Tetap semangat! Belajar itu langkah demi langkah. Coba ulangi materi dan latihan, pasti kamu bisa.";
}

function showResult() {
  playResultSound(state.score);
  finalScore.textContent = state.score;
  resultMessage.textContent = getMotivationMessage(state.score);
  showScreen("result");
}

function restartGame() {
  playButtonSound();
  state.currentQuestionIndex = 0;
  state.score = 0;
  state.hasAnswered = false;
  showScreen("material");
}

document.getElementById("to-example-button").addEventListener("click", () => {
  playButtonSound();
  showScreen("example");
});
document.getElementById("start-quiz-button").addEventListener("click", startQuiz);
document.getElementById("next-button").addEventListener("click", goToNextQuestion);
document.getElementById("retry-button").addEventListener("click", restartGame);
soundToggleButton.addEventListener("click", toggleSound);

updateSoundButton();
