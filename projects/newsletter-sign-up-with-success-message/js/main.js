const form = document.querySelector(".card_form");
const cardMain = document.querySelector(".card_main");
const success = document.querySelector(".success");
const userEmail = document.getElementById("user-email");
const emailInput = document.getElementById("email");
const label = form.querySelector('label[for="email"]');
const dismissBtn = document.querySelector(".dismiss-btn");
const formBtn = form.querySelector(".form-btn");

// メール形式チェック用の正規表現
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// メールの入力欄でリアルタイムチェック
emailInput.addEventListener("input", () => {
  const emailValue = emailInput.value.trim();

  if (emailPattern.test(emailValue)) {
    formBtn.classList.add("active");
    emailInput.classList.remove("error");
    label.classList.remove("error");
  } else {
    formBtn.classList.remove("active");
  }
});

// ✅ フォーム送信時の処理
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const emailValue = emailInput.value.trim();

  // バリデーションチェック
  if (!emailPattern.test(emailValue)) {
    emailInput.classList.add("error");
    label.classList.add("error");
    return;
  }

  // 成功時はエラー解除
  emailInput.classList.remove("error");
  label.classList.remove("error");

  // メールをサクセスメッセージに反映
  userEmail.textContent = emailValue;

  // 表示切り替え
  cardMain.hidden = true;
  success.hidden = false;
});

// ✅ Dismissボタンの挙動
dismissBtn.addEventListener("click", () => {
  dismissBtn.classList.add("active");
  setTimeout(() => {
    success.hidden = true;
    cardMain.hidden = false;
    form.reset();
    emailInput.classList.remove("error");
    label.classList.remove("error");
    dismissBtn.classList.remove("active");
    formBtn.classList.remove("active");
  }, 400);
});
