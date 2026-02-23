// ===== ウサギデータ =====
const RABBITS = [
  // ── コモン（身近なペット品種）──
  { id: "netherland_dwarf",  name: "ネザーランドドワーフ",    color: "#f8f5f0", earColor: "#ffd0d0", eyeColor: "#cc2222", noseColor: "#ffaaaa", rarity: "common",  favoriteItems: ["carrot",  "cushion"],      memento: "小さな爪",         power: 3 },
  { id: "holland_lop",       name: "ホーランドロップ",         color: "#c8905c", earColor: "#dda870", eyeColor: "#4a2800", noseColor: "#e09070", rarity: "common",  favoriteItems: ["cabbage", "cushion"],      memento: "垂れた柔らかい毛", power: 3 },
  { id: "dutch",             name: "ダッチ",                   color: "#303030", earColor: "#505050", eyeColor: "#111111", noseColor: "#ffb6c1", rarity: "common",  favoriteItems: ["carrot",  "cardboard"],    memento: "白黒の毛束",       power: 3 },
  { id: "mini_rex",          name: "ミニレッキス",             color: "#5a3020", earColor: "#7a4030", eyeColor: "#3a1a08", noseColor: "#d87050", rarity: "common",  favoriteItems: ["cabbage", "tunnel"],       memento: "ビロードの毛",     power: 3 },
  { id: "japanese_white",    name: "ジャパニーズホワイト",     color: "#ffffff", earColor: "#ffe4e4", eyeColor: "#ee2020", noseColor: "#ffaaaa", rarity: "common",  favoriteItems: ["grass",   "ball"],         memento: "白い毛束",         power: 3 },
  { id: "californian",       name: "カリフォルニアン",         color: "#f8f8f8", earColor: "#444444", eyeColor: "#bb1111", noseColor: "#cc6666", rarity: "common",  favoriteItems: ["carrot",  "grass"],        memento: "黒い耳の毛",       power: 3 },
  { id: "mini_lop",          name: "ミニロップ",               color: "#e8c8a0", earColor: "#f0d8b0", eyeColor: "#5a3800", noseColor: "#d4a080", rarity: "common",  favoriteItems: ["ball",    "cushion"],      memento: "まるい毛玉",       power: 3 },
  { id: "britannia_petite",  name: "ブリタニアプチ",           color: "#f4f0e8", earColor: "#e8e0d0", eyeColor: "#8b6914", noseColor: "#c8a080", rarity: "common",  favoriteItems: ["grass",   "tunnel"],       memento: "素早い足跡",       power: 3 },
  // ── レア（珍しい品種・ショー品種）──
  { id: "lionhead",          name: "ライオンヘッド",           color: "#e8c050", earColor: "#f0d070", eyeColor: "#5a3000", noseColor: "#e09060", rarity: "rare",    favoriteItems: ["snack",       "flower_patch"], memento: "たてがみの毛",     power: 5 },
  { id: "angora",            name: "アンゴラ",                 color: "#f8f0e0", earColor: "#f0e8d0", eyeColor: "#8b6914", noseColor: "#d4b0a0", rarity: "rare",    favoriteItems: ["cushion",     "flower_patch"], memento: "絹のような毛糸",   power: 5 },
  { id: "flemish_giant",     name: "フレミッシュジャイアント", color: "#909090", earColor: "#b0b0b0", eyeColor: "#333333", noseColor: "#cc9999", rarity: "rare",    favoriteItems: ["snack",       "rock"],         memento: "大きな足跡",       power: 5 },
  { id: "english_spot",      name: "イングリッシュスポット",   color: "#f8f8f8", earColor: "#555555", eyeColor: "#333333", noseColor: "#ff88aa", rarity: "rare",    favoriteItems: ["ball",        "cardboard"],    memento: "斑点模様の毛",     power: 5 },
  { id: "belgian_hare",      name: "ベルジアンハーレ",         color: "#9b4523", earColor: "#b05030", eyeColor: "#333333", noseColor: "#d47060", rarity: "rare",    favoriteItems: ["grass",       "tunnel"],       memento: "赤茶の毛",         power: 5 },
  { id: "lilac",             name: "ライラック",               color: "#c8a8c8", earColor: "#d8b8d8", eyeColor: "#6a3a8a", noseColor: "#c090c0", rarity: "rare",    favoriteItems: ["flower_patch","cushion"],      memento: "薄紫の毛",         power: 5 },
  // ── スペシャル（日本在来種・希少種）──
  { id: "nihon_usagi",       name: "ニホンノウサギ",           color: "#c8a460", earColor: "#dcc070", eyeColor: "#4a3010", noseColor: "#c89060", rarity: "special", favoriteItems: ["grass",       "flower_patch"], memento: "野の花",           power: 8 },
  { id: "ezo_snowshoe",      name: "エゾユキウサギ",           color: "#f0f8ff", earColor: "#ddeeff", eyeColor: "#5577aa", noseColor: "#99bbdd", rarity: "special", favoriteItems: ["rock",        "grass"],         memento: "雪色の毛",         power: 8 },
  { id: "amami",             name: "アマミノクロウサギ",       color: "#2a1a0a", earColor: "#3a2a18", eyeColor: "#8b4513", noseColor: "#b06040", rarity: "special", favoriteItems: ["snack",       "rock"],          memento: "漆黒の毛",         power: 8 },
  { id: "naki_usagi",        name: "エゾナキウサギ",           color: "#9a8870", earColor: "#b0a080", eyeColor: "#5a4830", noseColor: "#c09070", rarity: "special", favoriteItems: ["snack",       "flower_patch"],  memento: "草の束",           power: 8 },
];

// ===== アイテムデータ =====
const ITEMS = [
  // 食べ物
  { id: "carrot",          name: "にんじん",       type: "food", cost: 5,  capacity: 2, icon: "🥕", attractRarity: ["common"] },
  { id: "cabbage",         name: "キャベツ",       type: "food", cost: 8,  capacity: 2, icon: "🥬", attractRarity: ["common"] },
  { id: "grass",           name: "おいしい草",     type: "food", cost: 10, capacity: 3, icon: "🌿", attractRarity: ["common", "rare"] },
  { id: "snack",           name: "おやつセット",   type: "food", cost: 20, capacity: 2, icon: "🍬", attractRarity: ["rare", "special"] },
  { id: "premium_carrot",  name: "にんじんごはん", type: "food", cost: 30, capacity: 3, icon: "🥕✨", attractRarity: ["common", "rare", "special"] },

  // おもちゃ
  { id: "cardboard",    name: "ダンボール箱", type: "toy", cost: 15, capacity: 1, icon: "📦", attractRarity: ["common"] },
  { id: "tunnel",       name: "トンネル",     type: "toy", cost: 25, capacity: 2, icon: "🕳️", attractRarity: ["common", "rare"] },
  { id: "ball",         name: "ボール",       type: "toy", cost: 20, capacity: 1, icon: "⚽", attractRarity: ["common", "rare"] },
  { id: "cushion",      name: "クッション",   type: "toy", cost: 30, capacity: 1, icon: "🛋️", attractRarity: ["common", "rare", "special"] },
  { id: "flower_patch", name: "花畑",         type: "toy", cost: 40, capacity: 3, icon: "🌸", attractRarity: ["rare", "special"] },
  { id: "rock",         name: "大きな岩",     type: "toy", cost: 35, capacity: 2, icon: "🪨", attractRarity: ["common", "rare", "special"] },
];

// ===== 確率設定 =====
const SPAWN_CHANCE = {
  common:  0.55,
  rare:    0.35,
  special: 0.10,
};

// ===== ゲームループ間隔（ms）=====
const LOOP_INTERVAL = 30000; // 30秒

// ===== スロット数 =====
const SLOT_COUNT = 8;
