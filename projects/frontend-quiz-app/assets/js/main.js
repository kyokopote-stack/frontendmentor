// ======= GLOBAL =======
let quizData = [];
let currentQuiz = null;
let currentQuestion = 0;
let score = 0;

// DOMキャッシュ
const subjectList = document.getElementById("subject-list");
const choicesEl = document.getElementById("choices");
const questionEl = document.getElementById("question-text");
const progressEl = document.getElementById("quiz-progress");
const progressBar = document.querySelector(".progress-fill");
const errorEl = document.getElementById("error-message");
const submitBtn = document.getElementById("submit-answer");
const restartBtn = document.getElementById("restart");

// ======= INIT =======
fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    quizData = data.quizzes;
    renderSubjects();
  });

function renderSubjects() {
  subjectList.innerHTML = quizData
    .map(
      (subject, idx) => `
      <li class="subject" data-index="${idx}" tabindex="0">
        <img src="${subject.icon}" alt="">
        <span>${subject.title}</span>
      </li>
    `
    )
    .join("");

  document.querySelectorAll(".subject").forEach((item) => {
    item.addEventListener("click", () => startQuiz(item.dataset.index));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        startQuiz(item.dataset.index);
      }
    });
  });
}

// ======= 画面切り替え =======
function showScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  // header の制御
  document
    .querySelector("header")
    .classList.toggle("is-start", id === "screen-start");
}

// ======= クイズ開始 =======
function startQuiz(index) {
  currentQuiz = quizData[index];
  currentQuestion = 0;
  score = 0;

  showScreen("screen-quiz");
  loadQuestion();
}

// ======= 問題を表示する =======
function loadQuestion() {
  const q = currentQuiz.questions[currentQuestion];

  submitBtn.classList.remove("active");
  questionEl.textContent = q.question;

  document.querySelector(".genre-icon").src = currentQuiz.icon;
  document.querySelector(".genre-ttl").textContent = currentQuiz.title;

  progressEl.textContent = `Question ${currentQuestion + 1} of ${
    currentQuiz.questions.length
  }`;
  progressBar.style.width = `${
    (currentQuestion / currentQuiz.questions.length) * 100
  }%`;

  // 選択肢描画
  choicesEl.innerHTML = q.options
    .map(
      (opt, i) => `
      <li class="choice" data-index="${i}" tabindex="0">
        <div class="choice-inner">
          <span class="choice-label">${String.fromCharCode(65 + i)}</span>
          <span class="choice-text">${opt}</span>
        </div>
        <div class="result-icon"></div>
      </li>
    `
    )
    .join("");

  attachChoiceEvents();
}

// ======= 選択肢のイベント登録 =======
function attachChoiceEvents() {
  const choices = document.querySelectorAll(".choice");

  function selectChoice(choice) {
    choices.forEach((c) => c.classList.remove("selected"));
    choice.classList.add("selected");
    submitBtn.classList.add("active");
  }

  choices.forEach((choice) => {
    choice.addEventListener("click", () => selectChoice(choice));
    choice.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectChoice(choice);
      }
    });
  });
}

// ======= 選択肢のイベント登録 =======
function attachChoiceEvents() {
  const choices = document.querySelectorAll(".choice");

  function selectChoice(choice) {
    choices.forEach((c) => c.classList.remove("selected"));
    choice.classList.add("selected");
    submitBtn.classList.add("active");
  }

  choices.forEach((choice) => {
    choice.addEventListener("click", () => selectChoice(choice));
    choice.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectChoice(choice);
      }
    });
  });
}

// ======= 回答チェック =======
submitBtn.addEventListener("click", checkAnswer);

function checkAnswer() {
  const selected = document.querySelector(".choice.selected");
  if (!selected) return showError();

  hideError();

  const q = currentQuiz.questions[currentQuestion];
  const chosen = q.options[selected.dataset.index];
  const correct = q.answer;

  // 正解表示
  document.querySelectorAll(".choice").forEach((choice, i) => {
    const txt = q.options[i];
    if (txt === correct) {
      choice.classList.add(chosen === correct ? "correct" : "show-correct");
    }
  });

  if (chosen !== correct) {
    selected.classList.add("incorrect");
  } else {
    score++;
  }

  currentQuestion++;

  setTimeout(() => {
    currentQuestion >= currentQuiz.questions.length
      ? showResult()
      : loadQuestion();
  }, 1200);
}

// ======= エラー表示 =======
function showError() {
  errorEl.textContent = "Please select an answer.";
  errorEl.classList.add("show");

  setTimeout(() => {
    hideError();
  }, 1000);
}

function hideError() {
  errorEl.textContent = "";
  errorEl.classList.remove("show");
}

// ======= 結果画面 =======
function showResult() {
  showScreen("screen-result");

  document.querySelector("#screen-result .genre-icon").src = currentQuiz.icon;
  document.querySelector("#screen-result .genre-ttl").textContent =
    currentQuiz.title;
  document.getElementById("score-result").textContent = score;
}

// ======= 再スタート =======
restartBtn.addEventListener("click", () => {
  showScreen("screen-start");
});

// ======= mode =======
const html = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");

function updateThemeIcons(theme) {
  document.querySelector(".icon-sun").src =
    theme === "dark"
      ? "assets/images/icon-sun-light.svg"
      : "assets/images/icon-sun-dark.svg";

  document.querySelector(".icon-moon").src =
    theme === "dark"
      ? "assets/images/icon-moon-light.svg"
      : "assets/images/icon-moon-dark.svg";
}

const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-theme", savedTheme);
updateThemeIcons(savedTheme);

themeBtn.addEventListener("click", () => {
  const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcons(next);
});
