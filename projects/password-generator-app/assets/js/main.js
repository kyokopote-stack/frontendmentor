/* ===================================================
   変数・DOM取得
=================================================== */
const range = document.getElementById("lengthRange");
const upper = document.getElementById("includeUpper");
const lower = document.getElementById("includeLower");
const number = document.getElementById("includeNumbers");
const symbol = document.getElementById("includeSymbols");

const passwordEl = document.querySelector(".password");
const rangeNumber = document.querySelector(".length-area__label-number");
const checkboxes = document.querySelectorAll(
  '.option-area input[type="checkbox"]'
);
const bars = document.querySelectorAll(".bar");
const generateBtn = document.querySelector(".input-area button");

const copyBtn = document.querySelector(".copy-btn");
const copiedEl = document.querySelector(".copied-text");

let isGenerated = false;

/* ===================================================
   パスワード素材
=================================================== */
const UPPERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERS = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*(){}[]=<>/,.";

/* ===================================================
   パスワード生成
=================================================== */
function generatePassword() {
  let chars = "";

  if (upper.checked) chars += UPPERS;
  if (lower.checked) chars += LOWERS;
  if (number.checked) chars += NUMBERS;
  if (symbol.checked) chars += SYMBOLS;

  if (!chars) return null;

  let result = "";
  for (let i = 0; i < range.value; i++) {
    const rand = Math.floor(Math.random() * chars.length);
    result += chars[rand];
  }
  return result;
}

/* ===================================================
   強度判定
=================================================== */
function calcStrength() {
  let level = 0;

  if (upper.checked) level++;
  if (lower.checked) level++;
  if (number.checked) level++;
  if (symbol.checked) level++;

  const length = Number(range.value);

  if (length >= 15) level += 3;
  else if (length >= 11) level += 2;
  else if (length >= 6) level += 1;

  return level; // 0〜7
}

function convertLevel(rawLevel) {
  if (rawLevel <= 1) return 1;
  if (rawLevel <= 3) return 2;
  if (rawLevel <= 5) return 3;
  return 4;
}

function updateStrength(level) {
  bars.forEach((bar, i) => {
    bar.classList.toggle("active", i < level);
  });
}

function updateStrengthLabel(level) {
  const label = document.querySelector(".strength-area__value");

  const map = {
    1: "TOO WEAK!",
    2: "WEAK",
    3: "MEDIUM",
    4: "STRONG",
  };

  label.textContent = map[level];
}

/* ===================================================
   Range UI 更新
=================================================== */
function updateRangeUI() {
  rangeNumber.textContent = range.value;

  const percent = (range.value / range.max) * 100;
  range.style.background = `
    linear-gradient(
      to right,
      #a4ffaf ${percent}%,
      #18171f ${percent}%
    )
  `;
}

/* ===================================================
   イベントリスナー
=================================================== */

// Range
range.addEventListener("input", () => {
  updateRangeUI();

  const raw = calcStrength();
  const level = convertLevel(raw);
  updateStrength(level);
  updateStrengthLabel(level);
});

// Checkbox
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const raw = calcStrength();
    const level = convertLevel(raw);
    updateStrength(level);
    updateStrengthLabel(level);
  });
});

// Generate
generateBtn.addEventListener("click", () => {
  const pwd = generatePassword();

  if (!pwd) {
    passwordEl.textContent = "Please select at least one option.";
    passwordEl.classList.add("password--error");
    passwordEl.classList.remove("password--active");
    isGenerated = false;
    return;
  }

  passwordEl.textContent = pwd;
  passwordEl.classList.add("password--active");
  passwordEl.classList.remove("password--error");
  isGenerated = true;

  const raw = calcStrength();
  const level = convertLevel(raw);
  updateStrength(level);
  updateStrengthLabel(level);
});

// Copy
copyBtn.addEventListener("click", () => {
  if (!isGenerated) return;

  navigator.clipboard
    .writeText(passwordEl.textContent)
    .then(() => {
      copiedEl.classList.add("show");
      setTimeout(() => copiedEl.classList.remove("show"), 1500);
    })
    .catch((err) => console.error("コピー失敗:", err));
});

/* 初期呼び出し */
updateRangeUI();
