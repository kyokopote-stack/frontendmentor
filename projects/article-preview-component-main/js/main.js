// 要素を取得
const toggleBtn = document.querySelector(".toggle_btn");
const shareBox = document.querySelector(".share_box");

// ボタンがクリックされたときに .active を付け外し
toggleBtn.addEventListener("click", () => {
  shareBox.classList.toggle("active");
});
