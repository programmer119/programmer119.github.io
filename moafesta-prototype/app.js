const state = {
  hearts: 12480,
  selectedSupport: 1000,
  creator: "루미파크",
};

const screens = [...document.querySelectorAll(".screen")];
const navButtons = [...document.querySelectorAll("[data-screen]")];
const tabs = [...document.querySelectorAll(".tab")];
const bottomButtons = [...document.querySelectorAll(".bottom-nav button")];
const supportModal = document.querySelector("#supportModal");
const supportCreator = document.querySelector("#supportCreator");
const sendSupport = document.querySelector("#sendSupport");
const toastLog = document.querySelector("#toastLog");
const heartBalance = document.querySelector("#heartBalance");
const walletBalance = document.querySelector("#walletBalance");

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function updateBalances() {
  heartBalance.textContent = formatNumber(state.hearts);
  walletBalance.textContent = formatNumber(state.hearts);
}

function showToast(message) {
  toastLog.textContent = message;
  toastLog.animate(
    [
      { transform: "translateY(0)", opacity: 1 },
      { transform: "translateY(-4px)", opacity: 0.88 },
      { transform: "translateY(0)", opacity: 1 },
    ],
    { duration: 420, easing: "ease-out" },
  );
}

function setScreen(screenId) {
  screens.forEach((screen) => screen.classList.toggle("active", screen.id === screenId));
  tabs.forEach((button) => button.classList.toggle("active", button.dataset.screen === screenId));
  bottomButtons.forEach((button) => button.classList.toggle("active", button.dataset.screen === screenId));

  const names = {
    home: "홈 피드",
    creators: "크리에이터 프로필",
    vote: "월간 인기투표",
    shop: "굿즈와 이벤트",
    wallet: "하트 지갑",
    settlement: "정산 센터",
  };
  showToast(`${names[screenId]} 화면으로 이동했습니다.`);
}

function openSupport(creatorName) {
  state.creator = creatorName;
  supportCreator.textContent = creatorName;
  document.querySelectorAll("[data-support]").forEach((button) => {
    button.classList.toggle("selected", Number(button.dataset.support) === state.selectedSupport);
  });
  supportModal.showModal();
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => setScreen(button.dataset.screen));
});

document.querySelectorAll("[data-open-support]").forEach((button) => {
  button.addEventListener("click", () => openSupport(button.dataset.openSupport));
});

document.querySelectorAll("[data-charge]").forEach((button) => {
  button.addEventListener("click", () => {
    const amount = Number(button.dataset.charge);
    const price = Number(button.dataset.price);
    state.hearts += amount;
    updateBalances();
    showToast(`${formatNumber(price)}원 결제 승인: 하트 ${formatNumber(amount)}개가 충전되었습니다.`);
  });
});

document.querySelectorAll("[data-support]").forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedSupport = Number(button.dataset.support);
    document.querySelectorAll("[data-support]").forEach((target) => target.classList.remove("selected"));
    button.classList.add("selected");
  });
});

sendSupport.addEventListener("click", () => {
  if (state.hearts < state.selectedSupport) {
    showToast("하트 잔액이 부족합니다. 충전 화면에서 먼저 충전해 주세요.");
    supportModal.close();
    setScreen("wallet");
    return;
  }

  state.hearts -= state.selectedSupport;
  updateBalances();
  supportModal.close();
  showToast(`${state.creator}에게 하트 ${formatNumber(state.selectedSupport)}개 후원이 완료되었습니다.`);
});

document.querySelectorAll(".ranking-list button").forEach((button) => {
  button.addEventListener("click", () => showToast("투표권 1장이 사용되었습니다. 인기투표 순위가 갱신됩니다."));
});

document.querySelectorAll(".goods-grid button").forEach((button) => {
  button.addEventListener("click", () => showToast(`${button.textContent} 요청이 접수되었습니다.`));
});

updateBalances();
window.__moaPrototypeReady = true;
