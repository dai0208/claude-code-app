// ===== セーブ/ロード =====
const SAVE_KEY = "okunoshima_save";

function defaultState() {
  return {
    coins: 50,
    silverCarrots: 0,
    lastCoinTime: Date.now(),
    yard: Array.from({ length: SLOT_COUNT }, (_, i) => ({ slotId: i, itemId: null, rabbit: null })),
    inventory: { carrot: 3 },
    caughtRabbits: [],
    mementos: [],
    visitLog: {},
  };
}

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Save failed:", e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      // 旧セーブ（carrots）→ coins へ移行
      if (saved.carrots !== undefined && saved.coins === undefined) {
        saved.coins = saved.carrots;
        delete saved.carrots;
      }
      // マージ（新フィールド対応）
      return Object.assign(defaultState(), saved);
    }
  } catch (e) {
    console.warn("Load failed:", e);
  }
  return defaultState();
}

// ===== グローバル状態 =====
let state = loadState();
let loopTimer = null;
let nextLoopIn = LOOP_INTERVAL / 1000;
let loopCountdown = null;
let selectedSlotId = null;

// ===== ユーティリティ =====
function getItem(id) { return ITEMS.find(i => i.id === id) || null; }
function getRabbit(id) { return RABBITS.find(r => r.id === id) || null; }

function randomPick(arr) {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function showToast(msg, duration = 2000) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), duration);
}

function showBanner(rabbit, isNew, bonus) {
  const el = document.createElement("div");
  el.className = "new-rabbit-banner";
  el.innerHTML = `
    <div class="banner-title">${isNew ? "🎉 新しいウサギを発見！" : "📷 撮影成功！"}</div>
    <div class="banner-name">${rabbit.name}</div>
    <div class="banner-sub">${isNew ? `図鑑に登録されました　🪙 +${bonus}` : `🪙 +${bonus}`}</div>
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

// ===== SVGウサギ描画 =====
function drawRabbit(rabbit) {
  const bc = rabbit.color;
  const ec = rabbit.earColor;
  const eye = rabbit.eyeColor;
  const nose = rabbit.noseColor;
  const ol = "rgba(70,35,0,0.28)";
  const sw = "1.8";

  return `<svg viewBox="0 0 60 76" xmlns="http://www.w3.org/2000/svg">
  <!-- 耳（外） -->
  <ellipse cx="16" cy="15" rx="8.5" ry="19" fill="${bc}" stroke="${ol}" stroke-width="${sw}"/>
  <ellipse cx="44" cy="15" rx="8.5" ry="19" fill="${bc}" stroke="${ol}" stroke-width="${sw}"/>
  <!-- 耳（内） -->
  <ellipse cx="16" cy="16" rx="4.8" ry="13.5" fill="${ec}"/>
  <ellipse cx="44" cy="16" rx="4.8" ry="13.5" fill="${ec}"/>
  <!-- しっぽ（体の後ろ） -->
  <circle cx="49" cy="60" r="5.5" fill="rgba(255,255,255,0.95)" stroke="${ol}" stroke-width="0.9"/>
  <!-- 体（小さめ・ちびキャラ） -->
  <ellipse cx="30" cy="62" rx="17" ry="13" fill="${bc}" stroke="${ol}" stroke-width="${sw}"/>
  <!-- 顔（大きく丸い） -->
  <circle cx="30" cy="38" r="20" fill="${bc}" stroke="${ol}" stroke-width="${sw}"/>
  <!-- ほっぺ（チーク） -->
  <circle cx="17" cy="44" r="6.5" fill="#ffaac0" opacity="0.42"/>
  <circle cx="43" cy="44" r="6.5" fill="#ffaac0" opacity="0.42"/>
  <!-- 目（白・大きめ楕円） -->
  <ellipse cx="21" cy="36" rx="6" ry="6.5" fill="#fff" stroke="${ol}" stroke-width="1"/>
  <ellipse cx="39" cy="36" rx="6" ry="6.5" fill="#fff" stroke="${ol}" stroke-width="1"/>
  <!-- 目（瞳） -->
  <ellipse cx="21" cy="37" rx="4" ry="4.2" fill="${eye}"/>
  <ellipse cx="39" cy="37" rx="4" ry="4.2" fill="${eye}"/>
  <!-- ハイライト（大） -->
  <circle cx="18.5" cy="34" r="2" fill="rgba(255,255,255,0.92)"/>
  <circle cx="36.5" cy="34" r="2" fill="rgba(255,255,255,0.92)"/>
  <!-- ハイライト（小） -->
  <circle cx="24" cy="38.5" r="1" fill="rgba(255,255,255,0.7)"/>
  <circle cx="42" cy="38.5" r="1" fill="rgba(255,255,255,0.7)"/>
  <!-- ヒゲ（ドット） -->
  <circle cx="15" cy="44" r="0.9" fill="${ol}"/>
  <circle cx="11" cy="43" r="0.9" fill="${ol}"/>
  <circle cx="45" cy="44" r="0.9" fill="${ol}"/>
  <circle cx="49" cy="43" r="0.9" fill="${ol}"/>
  <!-- 鼻 -->
  <ellipse cx="30" cy="44" rx="2.4" ry="1.9" fill="${nose}" stroke="${ol}" stroke-width="0.6"/>
  <!-- 口 -->
  <path d="M27.5 46 Q30 49 32.5 46" stroke="${nose}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <!-- 前足 -->
  <ellipse cx="20" cy="69" rx="6" ry="4" fill="${bc}" stroke="${ol}" stroke-width="1.5"/>
  <ellipse cx="40" cy="69" rx="6" ry="4" fill="${bc}" stroke="${ol}" stroke-width="1.5"/>
  <!-- 足の指（ドット） -->
  <circle cx="16.5" cy="72" r="1" fill="${ol}"/>
  <circle cx="20" cy="73" r="1" fill="${ol}"/>
  <circle cx="23.5" cy="72" r="1" fill="${ol}"/>
  <circle cx="36.5" cy="72" r="1" fill="${ol}"/>
  <circle cx="40" cy="73" r="1" fill="${ol}"/>
  <circle cx="43.5" cy="72" r="1" fill="${ol}"/>
</svg>`;
}

// ===== 庭の描画 =====
function renderYard() {
  const container = document.getElementById("yard-slots");
  if (!container) return;

  container.innerHTML = "";

  state.yard.forEach(slot => {
    const div = document.createElement("div");
    div.className = "slot";
    div.dataset.slotId = slot.slotId;

    if (slot.rabbit) {
      div.classList.add("has-rabbit");
      const rabbit = getRabbit(slot.rabbit);
      if (rabbit) {
        const wrapper = document.createElement("div");
        wrapper.className = `slot-rabbit ${rabbit.rarity === "rare" ? "rare-glow" : ""} ${rabbit.rarity === "special" ? "special-glow" : ""}`;
        wrapper.innerHTML = drawRabbit(rabbit) + `<span class="rabbit-name-tag">${rabbit.name}</span>`;
        wrapper.addEventListener("click", (e) => {
          e.stopPropagation();
          photographRabbit(slot.slotId, rabbit.id);
        });
        div.appendChild(wrapper);
      }
      // アイテムも薄く表示
      if (slot.itemId) {
        const item = getItem(slot.itemId);
        if (item) {
          div.classList.add("has-item");
          const icon = document.createElement("div");
          icon.className = "slot-item-icon";
          icon.style.cssText = "position:absolute;bottom:4px;right:6px;font-size:12px;opacity:0.5;";
          icon.textContent = item.icon;
          div.appendChild(icon);
        }
      }
    } else if (slot.itemId) {
      div.classList.add("has-item");
      const item = getItem(slot.itemId);
      if (item) {
        const iconEl = document.createElement("div");
        iconEl.className = "slot-item-icon";
        iconEl.textContent = item.icon;
        const nameEl = document.createElement("div");
        nameEl.className = "slot-item-name";
        nameEl.textContent = item.name;
        div.appendChild(iconEl);
        div.appendChild(nameEl);
      }
      div.addEventListener("click", () => openItemModal(slot.slotId));
    } else {
      const lbl = document.createElement("div");
      lbl.className = "slot-empty-label";
      lbl.textContent = "+";
      div.appendChild(lbl);
      div.addEventListener("click", () => openItemModal(slot.slotId));
    }

    container.appendChild(div);
  });
}

// ===== 図鑑の描画 =====
function renderAlbum() {
  const panel = document.getElementById("album-panel");
  if (!panel) return;

  const caught = state.caughtRabbits.length;
  const total = RABBITS.length;

  panel.innerHTML = `
    <h2>🐰 図鑑</h2>
    <div class="album-progress">発見: ${caught} / ${total} 種</div>
    <div class="album-grid"></div>
  `;

  const grid = panel.querySelector(".album-grid");

  RABBITS.forEach(rabbit => {
    const isCaught = state.caughtRabbits.includes(rabbit.id);
    const visits = state.visitLog[rabbit.id] || 0;

    const card = document.createElement("div");
    card.className = `album-card ${isCaught ? "caught " + rabbit.rarity : "not-caught"}`;

    card.innerHTML = `
      ${drawRabbit(rabbit)}
      <div class="card-name">${isCaught ? rabbit.name : "???"}</div>
      <div class="card-count">${isCaught ? `${visits}回` : ""}</div>
      <span class="card-rarity rarity-${rabbit.rarity}">${
        rabbit.rarity === "common" ? "コモン" :
        rabbit.rarity === "rare"   ? "レア" : "スペシャル"
      }</span>
    `;

    grid.appendChild(card);
  });
}

// ===== 記念品の描画 =====
function renderMementos() {
  const panel = document.getElementById("memento-panel");
  if (!panel) return;

  panel.innerHTML = `<h2>🎁 記念品</h2>`;

  if (state.mementos.length === 0) {
    panel.innerHTML += `<div class="memento-empty">まだ記念品がありません。<br>ウサギと仲良くなると<br>もらえるかも？</div>`;
    return;
  }

  const list = document.createElement("div");
  list.className = "memento-list";

  state.mementos.forEach(m => {
    const rabbit = getRabbit(m.rabbitId);
    if (!rabbit) return;
    const item = document.createElement("div");
    item.className = "memento-item";
    item.innerHTML = `
      ${drawRabbit(rabbit)}
      <div class="memento-info">
        <div class="memento-rabbit-name">${rabbit.name}</div>
        <div class="memento-name">「${m.item}」</div>
      </div>
      <div class="memento-icon">🎁</div>
    `;
    list.appendChild(item);
  });

  panel.appendChild(list);
}

// ===== お店の描画 =====
function renderShop() {
  const panel = document.getElementById("shop-panel");
  if (!panel) return;

  panel.innerHTML = `
    <h2>🏪 お店</h2>
    <div class="shop-balance">🪙 コイン: ${state.coins} / ${COIN_MAX}</div>
    <p class="shop-coin-desc">🐰 うさぎが1時間に1枚ずつコインを持ってきてくれます（上限${COIN_MAX}枚）</p>
    <div class="shop-section-title">🍽️ 食べ物</div>
    <div class="shop-grid" id="food-grid"></div>
    <div class="shop-section-title">🪁 おもちゃ</div>
    <div class="shop-grid" id="toy-grid"></div>
  `;

  const foods = ITEMS.filter(i => i.type === "food");
  const toys  = ITEMS.filter(i => i.type === "toy");

  [{ items: foods, gridId: "food-grid" }, { items: toys, gridId: "toy-grid" }].forEach(({ items, gridId }) => {
    const grid = document.getElementById(gridId);
    items.forEach(item => {
      const own = state.inventory[item.id] || 0;
      const canAfford = state.coins >= item.cost;

      const card = document.createElement("div");
      card.className = `shop-card ${canAfford ? "" : "cant-afford"}`;
      card.innerHTML = `
        <div class="shop-icon">${item.icon}</div>
        <div class="shop-name">${item.name}</div>
        <div class="shop-type">${item.type === "food" ? "食べ物" : "おもちゃ"} / 容量${item.capacity}</div>
        <div class="shop-cost">🥕 ${item.cost}</div>
        <div class="shop-own">所持: ${own}個</div>
        <button class="btn-buy" ${canAfford ? "" : "disabled"}>購入</button>
      `;

      card.querySelector(".btn-buy").addEventListener("click", (e) => {
        e.stopPropagation();
        buyItem(item.id);
      });

      grid.appendChild(card);
    });
  });
}

// ===== 購入処理 =====
function buyItem(itemId) {
  const item = getItem(itemId);
  if (!item) return;
  if (state.coins < item.cost) {
    showToast("にんじんが足りません！");
    return;
  }
  state.coins -= item.cost;
  state.inventory[itemId] = (state.inventory[itemId] || 0) + 1;
  saveState();
  renderShop();
  updateHeader();
  showToast(`${item.name} を購入しました！ 🥕`);
}

// ===== アイテム配置モーダル =====
function openItemModal(slotId) {
  selectedSlotId = slotId;
  const modal = document.getElementById("item-modal");
  const opts = document.getElementById("modal-options");
  const slot = state.yard[slotId];

  opts.innerHTML = "";

  // 所持アイテムをリストアップ
  const owned = Object.entries(state.inventory).filter(([, qty]) => qty > 0);
  if (owned.length === 0) {
    opts.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#a08060;font-size:12px;padding:20px 0;">アイテムがありません。<br>お店で購入してください。</div>`;
  } else {
    owned.forEach(([id, qty]) => {
      const item = getItem(id);
      if (!item) return;
      const div = document.createElement("div");
      div.className = "modal-option";
      div.innerHTML = `<span class="opt-icon">${item.icon}</span><div class="opt-name">${item.name}</div><div class="opt-own">×${qty}</div>`;
      div.addEventListener("click", () => placeItem(slotId, id));
      opts.appendChild(div);
    });
  }

  modal.classList.add("open");

  // 既にアイテムがあれば取り除くボタン表示
  const removeBtn = document.getElementById("modal-remove");
  if (slot.itemId && !slot.rabbit) {
    removeBtn.style.display = "block";
    removeBtn.onclick = () => removeItem(slotId);
  } else {
    removeBtn.style.display = "none";
  }
}

function closeItemModal() {
  document.getElementById("item-modal").classList.remove("open");
  selectedSlotId = null;
}

function placeItem(slotId, itemId) {
  const slot = state.yard[slotId];
  if (slot.rabbit) {
    showToast("ウサギがいる間は変更できません！");
    closeItemModal();
    return;
  }
  if (slot.itemId) {
    // 既存アイテムを返却
    state.inventory[slot.itemId] = (state.inventory[slot.itemId] || 0) + 1;
  }
  state.inventory[itemId] = Math.max(0, (state.inventory[itemId] || 0) - 1);
  slot.itemId = itemId;
  closeItemModal();
  saveState();
  renderYard();
  showToast(`${getItem(itemId).name} を置きました！`);
}

function removeItem(slotId) {
  const slot = state.yard[slotId];
  if (!slot.itemId) return;
  if (slot.rabbit) {
    showToast("ウサギがいる間は取り除けません！");
    closeItemModal();
    return;
  }
  state.inventory[slot.itemId] = (state.inventory[slot.itemId] || 0) + 1;
  slot.itemId = null;
  closeItemModal();
  saveState();
  renderYard();
  showToast("アイテムを取り除きました。");
}

// ===== ウサギ候補選定 =====
function getRabbitCandidates(itemId) {
  const item = getItem(itemId);
  if (!item) return [];

  return RABBITS.filter(r => {
    // アイテムのレア度フィルタ
    if (!item.attractRarity.includes(r.rarity)) return false;
    return true;
  });
}

// ===== ウサギ登場処理 =====
function spawnRabbit(slot, rabbit) {
  slot.rabbit = rabbit.id;

  // 訪問回数カウント
  state.visitLog[rabbit.id] = (state.visitLog[rabbit.id] || 0) + 1;

  saveState();
  renderYard();

  // 一定時間後にウサギが去る（30〜120秒）
  const stayTime = (30 + Math.floor(Math.random() * 90)) * 1000;
  setTimeout(() => departRabbit(slot.slotId, rabbit), stayTime);
}

// ===== ウサギが去る =====
function departRabbit(slotId, rabbit) {
  const slot = state.yard[slotId];
  if (!slot || slot.rabbit !== rabbit.id) return;

  // にんじんドロップ
  state.coins += rabbit.power;
  clampCoins();

  // 確率で記念品
  const alreadyHasMemento = state.mementos.some(m => m.rabbitId === rabbit.id);
  if (!alreadyHasMemento && state.caughtRabbits.includes(rabbit.id) && Math.random() < 0.3) {
    state.mementos.push({ rabbitId: rabbit.id, item: rabbit.memento });
    showToast(`${rabbit.name} から「${rabbit.memento}」をもらった！ 🎁`, 3000);
  }

  slot.rabbit = null;
  saveState();
  renderYard();
  updateHeader();
}

// ===== 撮影 =====
function photographRabbit(slotId, rabbitId) {
  const rabbit = getRabbit(rabbitId);
  if (!rabbit) return;

  // フラッシュエフェクト
  const flash = document.createElement("div");
  flash.className = "photo-flash";
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 400);

  // 星エフェクト
  const slot = document.querySelector(`.slot[data-slot-id="${slotId}"]`);
  if (slot) {
    const rect = slot.getBoundingClientRect();
    ["⭐","✨","🌟"].forEach((s, i) => {
      const star = document.createElement("div");
      star.className = "capture-star";
      star.textContent = s;
      star.style.left = `${rect.left + 20 + i * 12}px`;
      star.style.top  = `${rect.top + 20}px`;
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 600);
    });
  }

  const isNew = !state.caughtRabbits.includes(rabbitId);
  if (isNew) {
    state.caughtRabbits.push(rabbitId);
  }

  // コイン獲得（撮影ボーナス）
  const bonus = isNew ? rabbit.power * 3 : rabbit.power;
  state.coins += bonus;
  clampCoins();

  // ウサギをマスから消し、アイテムをインベントリに戻す
  const stateSlot = state.yard[slotId];
  if (stateSlot) {
    stateSlot.rabbit = null;
    if (stateSlot.itemId) {
      state.inventory[stateSlot.itemId] = (state.inventory[stateSlot.itemId] || 0) + 1;
      stateSlot.itemId = null;
    }
  }

  showBanner(rabbit, isNew, bonus);
  saveState();
  updateHeader();
  renderAlbum();
  renderYard();
}

// ===== ゲームループ =====
function gameLoop() {
  state.yard.forEach(slot => {
    if (!slot.itemId || slot.rabbit) return;

    const item = getItem(slot.itemId);
    if (!item) return;

    const candidates = getRabbitCandidates(slot.itemId);
    if (!candidates.length) return;

    // 容量チェック（スロット単位でシンプルに）
    // 好みのアイテムを持つウサギを優先
    const preferred = candidates.filter(r => r.favoriteItems.includes(slot.itemId));
    const pool = preferred.length > 0 ? preferred : candidates;

    // レア度別の当選確率
    const roll = Math.random();
    let spawnProb = 0.4;
    const rabbit = randomPick(pool);
    if (!rabbit) return;

    // レアほど確率が下がる
    if (rabbit.rarity === "rare")    spawnProb = 0.25;
    if (rabbit.rarity === "special") spawnProb = 0.10;

    if (roll < spawnProb) {
      spawnRabbit(slot, rabbit);
    }
  });

  saveState();
}

// ===== ヘッダー更新 =====
const COIN_MAX = 300;
const COIN_REGEN_MS = 3600000; // 1時間

// ===== コイン自動増加 =====
function updatePassiveCoins() {
  const now = Date.now();
  const hours = Math.floor((now - state.lastCoinTime) / COIN_REGEN_MS);
  if (hours > 0) {
    state.coins = Math.min(state.coins + hours, COIN_MAX);
    state.lastCoinTime += hours * COIN_REGEN_MS;
    saveState();
    updateHeader();
  }
}

function clampCoins() {
  state.coins = Math.min(state.coins, COIN_MAX);
}

function updateHeader() {
  const el = document.getElementById("coin-count");
  if (el) el.textContent = `${state.coins}/${COIN_MAX}`;
  const sel = document.getElementById("silver-count");
  if (sel) sel.textContent = state.silverCarrots;
}

// ===== カウントダウン表示 =====
function startCountdown() {
  nextLoopIn = LOOP_INTERVAL / 1000;
  const indicator = document.getElementById("loop-indicator");

  loopCountdown = setInterval(() => {
    nextLoopIn--;
    if (indicator) indicator.textContent = `次のループ: ${nextLoopIn}秒`;
    if (nextLoopIn <= 0) nextLoopIn = LOOP_INTERVAL / 1000;
  }, 1000);
}

// ===== タブ切り替え =====
function initTabs() {
  const btns = document.querySelectorAll(".tab-btn");
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      document.getElementById(`${tab}-panel`).classList.add("active");

      // タブを開いた時に再描画
      if (tab === "album")   renderAlbum();
      if (tab === "memento") renderMementos();
      if (tab === "shop")    renderShop();
    });
  });
}

// ===== ゲーム初期化 =====
function initGame() {
  state = loadState();

  // モーダル閉じるボタン
  document.getElementById("modal-close").addEventListener("click", closeItemModal);
  document.getElementById("item-modal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeItemModal();
  });

  initTabs();
  renderYard();
  renderAlbum();
  updatePassiveCoins();
  updateHeader();

  // ゲームループ開始
  loopTimer = setInterval(() => {
    gameLoop();
    renderYard();
    updateHeader();
  }, LOOP_INTERVAL);

  // コイン自動増加チェック（1分ごと）
  setInterval(updatePassiveCoins, 60000);

  startCountdown();
}

// ===== 起動 =====
window.addEventListener("DOMContentLoaded", initGame);
