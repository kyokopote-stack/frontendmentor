// =====================================
// 要素取得
// =====================================
const billInput = document.getElementById("bill");
const peopleInput = document.getElementById("people");
const tipButtons = document.querySelectorAll(".tip-btn");
const customTipInput = document.querySelector(".input--custom");
const tipAmountEl = document.getElementById("tip-amount");
const totalEl = document.getElementById("total");
const resetBtn = document.getElementById("reset");
let selectedTip = null;

// =====================================
// 計算関数
// =====================================
function calculateTip() {
  const bill = Number(billInput.value);
  const people = Number(peopleInput.value);
  const tipPercent = selectedTip;

  if (!bill || !people || !tipPercent) return;

  const tipAmount = (bill * (tipPercent / 100)) / people;
  const total = bill / people + tipAmount;

  tipAmountEl.textContent = `$${tipAmount.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
  resetBtn.classList.add("active");
}
// =====================================
// ボタンクリックでチップ率を記憶
// =====================================
tipButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tipButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    customTipInput.value = "";
    selectedTip = Number(btn.dataset.tip);
    calculateTip();
  });
});

// =====================================
// Custom欄で入力されたチップ率も保存
// =====================================
customTipInput.addEventListener("input", () => {
  selectedTip = Number(customTipInput.value);
  tipButtons.forEach((btn) => btn.classList.remove("active"));
  calculateTip();
});

// =====================================
// 人数が入力されたときに計算
// =====================================
const errorMsg = document.querySelector(".error-msg");

peopleInput.addEventListener("input", () => {
  const peopleValue = Number(peopleInput.value);

  if (!peopleValue || peopleValue === 0) {
    peopleInput.classList.add("error");
    errorMsg.classList.add("error");
  } else {
    peopleInput.classList.remove("error");
    errorMsg.classList.remove("error");
    calculateTip();
  }
});
// =====================================
// reset
// =====================================

resetBtn.addEventListener("click", () => {
  // 入力欄を初期化
  billInput.value = "";
  peopleInput.value = "";
  customTipInput.value = "";

  // 結果表示をリセット
  tipAmountEl.textContent = "$0.00";
  totalEl.textContent = "$0.00";

  // チップボタンの選択を解除
  tipButtons.forEach((btn) => btn.classList.remove("active"));
  resetBtn.classList.remove("active");
  // エラー表示も消す
  peopleInput.classList.remove("error");
  errorMsg.classList.remove("error");

  // チップ率を初期化
  selectedTip = 0;
});
