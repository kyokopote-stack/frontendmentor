const buttons = document.querySelectorAll(".selector button");
const cards = document.querySelectorAll(".cards_item");

let jsonData = []; // JSONを保持する変数

// JSONを読み込む
fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    jsonData = data; // 保管しておく
    updateUI("weekly"); // 初期表示
  });

// データをUIに反映する関数（フェード付き）
function updateUI(timeframe) {
  jsonData.forEach((item, index) => {
    const card = cards[index];
    const titleEl = card.querySelector(".js-title");
    const currentEl = card.querySelector(".js-current");
    const previousEl = card.querySelector(".js-previous");

    // フェードアウト
    currentEl.classList.remove("show");
    previousEl.classList.remove("show");

    // 値の更新を少し遅らせる（transition時間と合わせる）
    setTimeout(() => {
      const current = item.timeframes[timeframe].current;
      const previous = item.timeframes[timeframe].previous;

      let label = "Last Week";
      if (timeframe === "daily") label = "Yesterday";
      if (timeframe === "monthly") label = "Last Month";

      titleEl.textContent = item.title;
      currentEl.textContent = `${current}hrs`;
      previousEl.textContent = `${label} - ${previous}hrs`;

      // フェードイン
      currentEl.classList.add("show");
      previousEl.classList.add("show");
    }, 200); // ← 0.2秒（CSSのtransition時間に合わせて調整）
  });
}

// ボタンのクリックイベント
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // activeクラスの付け替え
    buttons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    // データ切り替え
    const timeframe = btn.dataset.time;
    updateUI(timeframe);
  });
});
