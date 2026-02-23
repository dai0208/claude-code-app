// ===== ウサギデータ =====
const RABBITS = [
  { id: "shiromochi", name: "しろもち",   color: "#f5f5f0", earColor: "#ffd6d6", eyeColor: "#333",    noseColor: "#ffb6c1", rarity: "common",  favoriteItems: ["carrot", "cushion"],       memento: "小さな葉っぱ", power: 3 },
  { id: "kuro",       name: "くろ",       color: "#2a2a2a", earColor: "#555",    eyeColor: "#ff6b6b", noseColor: "#ff9999", rarity: "common",  favoriteItems: ["cabbage", "cardboard"],    memento: "黒い毛",       power: 3 },
  { id: "chacha",     name: "ちゃちゃ",   color: "#c8956c", earColor: "#e8b494", eyeColor: "#333",    noseColor: "#ffb6c1", rarity: "common",  favoriteItems: ["carrot", "tunnel"],        memento: "土の塊",       power: 3 },
  { id: "mikan",      name: "みかん",     color: "#f4a460", earColor: "#f5c68c", eyeColor: "#333",    noseColor: "#ff8c69", rarity: "common",  favoriteItems: ["grass", "ball"],           memento: "オレンジの欠片", power: 3 },
  { id: "yuki",       name: "ゆき",       color: "#eef4ff", earColor: "#c8d8ff", eyeColor: "#6699cc", noseColor: "#b0c8ff", rarity: "common",  favoriteItems: ["carrot", "cushion"],       memento: "白い石",       power: 3 },
  { id: "mochi",      name: "もち",       color: "#f0ebe0", earColor: "#e8d8c0", eyeColor: "#7a6040", noseColor: "#d4a0a0", rarity: "common",  favoriteItems: ["cabbage", "rock"],         memento: "丸い石",       power: 3 },
  { id: "ten",        name: "てん",       color: "#d4b896", earColor: "#e8d0b0", eyeColor: "#333",    noseColor: "#ff9966", rarity: "rare",    favoriteItems: ["snack", "tunnel"],         memento: "星型の石",     power: 5 },
  { id: "azuki",      name: "あずき",     color: "#8b4513", earColor: "#a0522d", eyeColor: "#fff",    noseColor: "#ffb6c1", rarity: "common",  favoriteItems: ["carrot", "cardboard"],    memento: "小豆色の石",   power: 3 },
  { id: "mame",       name: "まめ",       color: "#90c060", earColor: "#b0d880", eyeColor: "#333",    noseColor: "#ff9999", rarity: "common",  favoriteItems: ["grass", "ball"],           memento: "豆の莢",       power: 3 },
  { id: "sakura",     name: "さくら",     color: "#ffc0cb", earColor: "#ffaabb", eyeColor: "#333",    noseColor: "#ff6688", rarity: "rare",    favoriteItems: ["flower_patch", "cushion"], memento: "桜の花びら",   power: 5 },
  { id: "hana",       name: "はな",       color: "#ffddee", earColor: "#ffbbcc", eyeColor: "#333",    noseColor: "#ff88aa", rarity: "rare",    favoriteItems: ["flower_patch", "snack"],   memento: "押し花",       power: 5 },
  { id: "kaze",       name: "かぜ",       color: "#a8d8ea", earColor: "#c0e8f8", eyeColor: "#336699", noseColor: "#88bbdd", rarity: "rare",    favoriteItems: ["ball", "tunnel"],          memento: "羽根",         power: 5 },
  { id: "umi",        name: "うみ",       color: "#4fc3f7", earColor: "#81d4fa", eyeColor: "#0d47a1", noseColor: "#29b6f6", rarity: "rare",    favoriteItems: ["rock", "grass"],           memento: "貝殻",         power: 5 },
  { id: "mori",       name: "もり",       color: "#66bb6a", earColor: "#81c784", eyeColor: "#1b5e20", noseColor: "#a5d6a7", rarity: "rare",    favoriteItems: ["tunnel", "cardboard"],    memento: "どんぐり",     power: 5 },
  { id: "sora",       name: "そら",       color: "#b3e5fc", earColor: "#81d4fa", eyeColor: "#0277bd", noseColor: "#4fc3f7", rarity: "rare",    favoriteItems: ["flower_patch", "cushion"], memento: "青い石",       power: 5 },
  { id: "hoshi",      name: "ほし",       color: "#fff9c4", earColor: "#fff59d", eyeColor: "#f57f17", noseColor: "#ffe082", rarity: "special", favoriteItems: ["snack", "cushion"],        memento: "流れ星",       power: 8 },
  { id: "tsuki",      name: "つき",       color: "#e8eaf6", earColor: "#c5cae9", eyeColor: "#303f9f", noseColor: "#9fa8da", rarity: "special", favoriteItems: ["flower_patch", "rock"],    memento: "月の形の石",   power: 8 },
  { id: "hikari",     name: "ひかり",     color: "#fffde7", earColor: "#fff9c4", eyeColor: "#ff6f00", noseColor: "#ffe57f", rarity: "special", favoriteItems: ["snack", "flower_patch"],   memento: "光る石",       power: 8 },
  { id: "natsu",      name: "なつ",       color: "#f9a825", earColor: "#fbc02d", eyeColor: "#e65100", noseColor: "#fb8c00", rarity: "special", favoriteItems: ["ball", "grass"],           memento: "夏の貝殻",     power: 8 },
  { id: "fuyu",       name: "ふゆ",       color: "#e3f2fd", earColor: "#bbdefb", eyeColor: "#1565c0", noseColor: "#90caf9", rarity: "special", favoriteItems: ["cushion", "rock"],         memento: "雪の結晶",     power: 8 },
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
