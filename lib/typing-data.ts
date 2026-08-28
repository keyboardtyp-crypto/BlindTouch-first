export type Level = {
  id: string;
  stage: number;
  step: number;
  title: string;
  keys: string;
  homeKey: string | null;
  threshold: number;
  showHighlight: boolean;
// -------------------------------------------------------------
  // 【追加】ブラインドモード判定用のフラグ
  // -------------------------------------------------------------
  isBlind?: boolean;

};

export const STAGES: Level[] = [
  // Stage 1
  { id: "1-1", stage: 1, step: 1, title: "右手人差し指練習", keys: "yuhjnm", homeKey: "j", threshold: 90, showHighlight: true },
  { id: "1-2", stage: 1, step: 2, title: "左手人差し指練習", keys: "trgfbv", homeKey: "f", threshold: 90, showHighlight: true },
  { id: "1-3", stage: 1, step: 3, title: "右手中指練習", keys: "ik,", homeKey: "k", threshold: 90, showHighlight: true },
  { id: "1-4", stage: 1, step: 4, title: "左手中指練習", keys: "edc", homeKey: "d", threshold: 90, showHighlight: true },
  { id: "1-5", stage: 1, step: 5, title: "右手薬指練習", keys: "ol.", homeKey: "l", threshold: 90, showHighlight: true },
  { id: "1-6", stage: 1, step: 6, title: "左手薬指練習", keys: "wsx", homeKey: "s", threshold: 90, showHighlight: true },
  { id: "1-7", stage: 1, step: 7, title: "右手小指練習", keys: "p@;:/\ ", homeKey: ";", threshold: 90, showHighlight: true },
  { id: "1-8", stage: 1, step: 8, title: "左手小指練習", keys: "qaz", homeKey: "a", threshold: 90, showHighlight: true },

  // Stage 2
  { id: "2-1", stage: 2, step: 1, title: "人差し指混合", keys: "yuhjnmtrgfbv", homeKey: null, threshold: 85, showHighlight: true },
  { id: "2-2", stage: 2, step: 2, title: "中指混合", keys: "ik,edc", homeKey: null, threshold: 85, showHighlight: true },
  { id: "2-3", stage: 2, step: 3, title: "薬指混合", keys: "ol.wsx", homeKey: null, threshold: 85, showHighlight: true },
  { id: "2-4", stage: 2, step: 4, title: "小指混合", keys: "p@;:/\ qaz", homeKey: null, threshold: 85, showHighlight: true },

  // Stage 3
  { id: "3-1", stage: 3, step: 1, title: "全キー混合", keys: "yuhjnmtrgfbvik,edcol.wsxp@;:/\ qaz", homeKey: null, threshold: 80, showHighlight: true },

  // Stage 4
  { id: "4-1", stage: 4, step: 1, title: "全キー混合 (ハイライトなし)", keys: "yuhjnmtrgfbvik,edcol.wsxp@;:/\ qaz", homeKey: null, threshold: 80, showHighlight: false },
];



//--------------------------------------------------------------
// -------------------------------------------------------------
// 【更新】通常 ⇄ ブラインドが交互に進むフルステージ構成
// -------------------------------------------------------------
export const BLIND_STAGES: Level[] = [
  // ==========================================
  // Stage 1: 各指ごとの練習 (通常 ⇄ ブラインド)
  // ==========================================

{ id: "b-1-1", stage: 1, step: 1, title: "右手人差し指練習", keys: "yuhjnm", homeKey: "j", threshold: 90, showHighlight: true, isBlind: false },
  { id: "b-1-2", stage: 1, step: 2, title: "右手人差し指練習 (ブラインド)", keys: "yuhjnm", homeKey: "j", threshold: 90, showHighlight: false, isBlind: true },
  { id: "b-1-3", stage: 1, step: 3, title: "左手人差し指練習", keys: "trgfbv", homeKey: "f", threshold: 90, showHighlight: true, isBlind: false },
  { id: "b-1-4", stage: 1, step: 4, title: "左手人差し指練習 (ブラインド)", keys: "trgfbv", homeKey: "f", threshold: 90, showHighlight: false, isBlind: true },
  { id: "b-1-5", stage: 1, step: 5, title: "右手中指練習", keys: "ik,", homeKey: "k", threshold: 90, showHighlight: true, isBlind: false },
  { id: "b-1-6", stage: 1, step: 6, title: "右手中指練習 (ブラインド)", keys: "ik,", homeKey: "k", threshold: 90, showHighlight: false, isBlind: true },
  { id: "b-1-7", stage: 1, step: 7, title: "左手中指練習", keys: "edc", homeKey: "d", threshold: 90, showHighlight: true, isBlind: false },
  { id: "b-1-8", stage: 1, step: 8, title: "左手中指練習 (ブラインド)", keys: "edc", homeKey: "d", threshold: 90, showHighlight: false, isBlind: true },
  { id: "b-1-9", stage: 1, step: 9, title: "右手薬指練習", keys: "ol.", homeKey: "l", threshold: 90, showHighlight: true, isBlind: false },
  { id: "b-1-10", stage: 1, step: 10, title: "右手薬指練習 (ブラインド)", keys: "ol.", homeKey: "l", threshold: 90, showHighlight: false, isBlind: true },
  { id: "b-1-11", stage: 1, step: 11, title: "左手薬指練習", keys: "wsx", homeKey: "s", threshold: 90, showHighlight: true, isBlind: false },
  { id: "b-1-12", stage: 1, step: 12, title: "左手薬指練習 (ブラインド)", keys: "wsx", homeKey: "s", threshold: 90, showHighlight: false, isBlind: true },
  { id: "b-1-13", stage: 1, step: 13, title: "右手小指練習", keys: "p@;:/\ ", homeKey: ";", threshold: 90, showHighlight: true, isBlind: false },
  { id: "b-1-14", stage: 1, step: 14, title: "右手小指練習 (ブラインド)", keys: "p@;:/\ ", homeKey: ";", threshold: 90, showHighlight: false, isBlind: true },
  { id: "b-1-15", stage: 1, step: 15, title: "左手小指練習", keys: "qaz", homeKey: "a", threshold: 90, showHighlight: true, isBlind: false },
  { id: "b-1-16", stage: 1, step: 16, title: "左手小指練習 (ブラインド)", keys: "qaz", homeKey: "a", threshold: 90, showHighlight: false, isBlind: true },

  // ==========================================
  // Stage 2: 混合練習 (通常 ⇄ ブラインド)
  // ==========================================
  { id: "b-2-1", stage: 2, step: 1, title: "人差し指混合", keys: "yuhjnmtrgfbv", homeKey: null, threshold: 85, showHighlight: true, isBlind: false },
  { id: "b-2-2", stage: 2, step: 2, title: "人差し指混合 (ブラインド)", keys: "yuhjnmtrgfbv", homeKey: null, threshold: 85, showHighlight: false, isBlind: true },
  
  //{ id: "b-2-3", stage: 2, step: 3, title: "中指混合", keys: "ik,edc", homeKey: null, threshold: 85, showHighlight: true, isBlind: false },
  // 9. 人差し指＋中指混合 (Step 20 に相当)
//  { id: "f-10-1", stage: 10, step: 1, title: "人差し指＋中指混合", keys: "juhmnyfrgvbtki,dec", homeKey: null, threshold: 90, showHighlight: false, isBlind: true },
{ id: "b-2-3", stage: 2, step: 3, title: "中指混合＋人差し指混合", keys: "juhmnyfrgvbtki,dec", homeKey: null, threshold: 85, showHighlight: true, isBlind: false },
  //
  
 // { id: "b-2-4", stage: 2, step: 4, title: "中指混合 (ブラインド)", keys: "ik,edc", homeKey: null, threshold: 85, showHighlight: false, isBlind: true },
  
 { id: "b-2-4", stage: 2, step: 4, title: "中指混合＋人差し指混合 (ブラインド)", keys: "juhmnyfrgvbtki,dec", homeKey: null, threshold: 85, showHighlight: false, isBlind: true },
  
 { id: "b-2-5", stage: 2, step: 5, title: "薬指混合", keys: "ol.wsx", homeKey: null, threshold: 85, showHighlight: true, isBlind: false },
  { id: "b-2-6", stage: 2, step: 6, title: "薬指混合 (ブラインド)", keys: "ol.wsx", homeKey: null, threshold: 85, showHighlight: false, isBlind: true },
  { id: "b-2-7", stage: 2, step: 7, title: "小指混合", keys: "p@;:/\ qaz", homeKey: null, threshold: 85, showHighlight: true, isBlind: false },
  { id: "b-2-8", stage: 2, step: 8, title: "小指混合 (ブラインド)", keys: "p@;:/\ qaz", homeKey: null, threshold: 85, showHighlight: false, isBlind: true },
{ id: "b-2-9", stage: 2, step: 3, title: "薬指混合＋中指＋人差し指混合", keys: "juhmnyfrgvbtki,declo.swx", homeKey: null, threshold: 85, showHighlight: true, isBlind: false },
 { id: "b-2-10", stage: 2, step: 4, title: "薬指混合＋中指＋人差し指混合 (ブラインド)", keys: "juhmnyfrgvbtki,declo.swx", homeKey: null, threshold: 85, showHighlight: false, isBlind: true },
 
  // ==========================================
  // Stage 3: 全キー総合練習 (通常 ⇄ ブラインド)
  // ==========================================
  { id: "b-3-1", stage: 3, step: 1, title: "全キー混合", keys: "yuhjnmtrgfbvik,edcol.wsxp@;:/\ qaz", homeKey: null, threshold: 80, showHighlight: true, isBlind: false },
  { id: "b-3-2", stage: 3, step: 2, title: "全キー混合 (ブラインド)", keys: "yuhjnmtrgfbvik,edcol.wsxp@;:/\ qaz", homeKey: null, threshold: 80, showHighlight: false, isBlind: true },
  ];

// 各指強化モード用のステージ定義（全8本の指）
export const FINGER_STAGES: Level[] = [
  
  
  // ==========================================
  // 1. 右手人差し指 (j -> u -> h -> m -> n -> y)
  // ==========================================
  { id: "f-1-1", stage: 1, step: 1, title: "右手人差し指: Step 1 (j)", keys: "j", homeKey: "j", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-1-2", stage: 1, step: 2, title: "右手人差し指: Step 2 (j, u)", keys: "ju", homeKey: "j", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-1-3", stage: 1, step: 3, title: "右手人差し指: Step 3 (j, u, h)", keys: "juh", homeKey: "j", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-1-4", stage: 1, step: 4, title: "右手人差し指: Step 4 (j, u, h, m)", keys: "juhm", homeKey: "j", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-1-5", stage: 1, step: 5, title: "右手人差し指: Step 5 (j, u, h, m, n)", keys: "juhmn", homeKey: "j", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-1-6", stage: 1, step: 6, title: "右手人差し指: Step 6 (j, u, h, m, n, y)", keys: "juhmny", homeKey: "j", threshold: 90, showHighlight: false, isBlind: true },

  // ==========================================
  // 2. 左手人差し指 (f -> r -> g -> v -> b -> t)
  // ==========================================
  { id: "f-2-1", stage: 2, step: 1, title: "左手人差し指: Step 1 (f)", keys: "f", homeKey: "f", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-2-2", stage: 2, step: 2, title: "左手人差し指: Step 2 (f, r)", keys: "fr", homeKey: "f", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-2-3", stage: 2, step: 3, title: "左手人差し指: Step 3 (f, r, g)", keys: "frg", homeKey: "f", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-2-4", stage: 2, step: 4, title: "左手人差し指: Step 4 (f, r, g, v)", keys: "frgv", homeKey: "f", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-2-5", stage: 2, step: 5, title: "左手人差し指: Step 5 (f, r, g, v, b)", keys: "frgvb", homeKey: "f", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-2-6", stage: 2, step: 6, title: "左手人差し指: Step 6 (f, r, g, v, b, t)", keys: "frgvbt", homeKey: "f", threshold: 90, showHighlight: false, isBlind: true },

// ==========================================
  // 9. 人差し指左右混合
  // ==========================================
  { id: "f-9-1", stage: 9, step: 1, title: "人差し指左右混合", keys: "juhmnyfrgvbt", homeKey: null, threshold: 90, showHighlight: false, isBlind: true },

// ==========================================
  // 3. 右手中指 (k -> i -> ,)
  // ==========================================
  { id: "f-3-1", stage: 3, step: 1, title: "右手中指: Step 1 (k)", keys: "k", homeKey: "k", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-3-2", stage: 3, step: 2, title: "右手中指: Step 2 (k, i)", keys: "ki", homeKey: "k", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-3-3", stage: 3, step: 3, title: "右手中指: Step 3 (k, i, ,)", keys: "ki,", homeKey: "k", threshold: 90, showHighlight: false, isBlind: true },

  // ==========================================
  // 4. 左手中指 (d -> e -> c)
  // ==========================================
  { id: "f-4-1", stage: 4, step: 1, title: "左手中指: Step 1 (d)", keys: "d", homeKey: "d", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-4-2", stage: 4, step: 2, title: "左手中指: Step 2 (d, e)", keys: "de", homeKey: "d", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-4-3", stage: 4, step: 3, title: "左手中指: Step 3 (d, e, c)", keys: "dec", homeKey: "d", threshold: 90, showHighlight: false, isBlind: true },

  // 9. 人差し指＋中指混合 (Step 20 に相当)
  { id: "f-10-1", stage: 10, step: 1, title: "人差し指＋中指混合", keys: "juhmnyfrgvbtki,dec", homeKey: null, threshold: 90, showHighlight: false, isBlind: true },

  // ==========================================
  // 5. 右手薬指 (l -> o -> .)
  // ==========================================
  { id: "f-5-1", stage: 5, step: 1, title: "右手薬指: Step 1 (l)", keys: "l", homeKey: "l", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-5-2", stage: 5, step: 2, title: "右手薬指: Step 2 (l, o)", keys: "lo", homeKey: "l", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-5-3", stage: 5, step: 3, title: "右手薬指: Step 3 (l, o, .)", keys: "lo.", homeKey: "l", threshold: 90, showHighlight: false, isBlind: true },

  // ==========================================
  // 6. 左手薬指 (s -> w -> x)
  // ==========================================
  { id: "f-6-1", stage: 6, step: 1, title: "左手薬指: Step 1 (s)", keys: "s", homeKey: "s", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-6-2", stage: 6, step: 2, title: "左手薬指: Step 2 (s, w)", keys: "sw", homeKey: "s", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-6-3", stage: 6, step: 3, title: "左手薬指: Step 3 (s, w, x)", keys: "swx", homeKey: "s", threshold: 90, showHighlight: false, isBlind: true },

  // 11. 人差し指＋中指＋薬指混合 (Step 27 に相当)
  { id: "f-11-1", stage: 11, step: 1, title: "人差し指＋中指＋薬指混合", keys: "juhmnyfrgvbtki,declo.swx", homeKey: null, threshold: 90, showHighlight: false, isBlind: true },

  // ==========================================
  // 7. 右手小指 (; -> p -> /)
  // ==========================================
  { id: "f-7-1", stage: 7, step: 1, title: "右手小指: Step 1 (;)", keys: ";", homeKey: ";", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-7-2", stage: 7, step: 2, title: "右手小指: Step 2 (;, p)", keys: ";p", homeKey: ";", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-7-3", stage: 7, step: 3, title: "右手小指: Step 3 (;, p, /)", keys: ";p/", homeKey: ";", threshold: 90, showHighlight: false, isBlind: true },

  // ==========================================
  // 8. 左手小指 (a -> q -> z)
  // ==========================================
  { id: "f-8-1", stage: 8, step: 1, title: "左手小指: Step 1 (a)", keys: "a", homeKey: "a", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-8-2", stage: 8, step: 2, title: "左手小指: Step 2 (a, q)", keys: "aq", homeKey: "a", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-8-3", stage: 8, step: 3, title: "左手小指: Step 3 (a, q, z)", keys: "aqz", homeKey: "a", threshold: 90, showHighlight: false, isBlind: true },

  // 12. 全指混合 (Step 34 に相当)
  { id: "f-12-1", stage: 12, step: 1, title: "全指混合 (全キー)", keys: "juhmnyfrgvbtki,declo.swx;p/aqz", homeKey: null, threshold: 90, showHighlight: false, isBlind: true },
  
];


// -------------------------------------------------------------
// 【新規追加】ローマ字タイピング・ゲーム（街づくり）用定義
// -------------------------------------------------------------
/*
export type RomajiWord = {
  kana: string;    // 例: "ねこ"
  romaji: string;  // 例: "neko"
};

export type RomajiLevel = Level & {
  words: RomajiWord[];
  rewardBuilding: {
    id: string;
    name: string;
    icon: string; // 絵文字や画像パス
  };
};
*/
/*
export const ROMAJI_STAGES: RomajiLevel[] = [
  {
    id: "r-1-1",
    stage: 1,
    step: 1,
    title: "あいうえお・基本単語",
    keys: "aiueo",
    homeKey: null,
    threshold: 85,
    showHighlight: false, // 基本は非表示（ミス時のみ表示）
    words: [
      { kana: "いぬ", romaji: "inu" },
      { kana: "ねこ", romaji: "neko" },
      { kana: "あめ", romaji: "ame" },
      { kana: "いえ", romaji: "ie" },
    ],
    rewardBuilding: { id: "house_1", name: "小さな家", icon: "🏠" },
  },
  {
    id: "r-1-2",
    stage: 1,
    step: 2,
    title: "かきくけこ・街の自然",
    keys: "kakikukeko",
    homeKey: null,
    threshold: 85,
    showHighlight: false,
    words: [
      { kana: "き", romaji: "ki" },
      { kana: "かさ", romaji: "kasa" },
      { kana: "池", romaji: "ike" },
      { kana: "くも", romaji: "kumo" },
    ],
    rewardBuilding: { id: "park_1", name: "緑豊かな公園", icon: "🌳" },
  },
  {
    id: "r-1-3",
    stage: 1,
    step: 3,
    title: "さしすせそ・街の施設",
    keys: "sashisuseso",
    homeKey: null,
    threshold: 85,
    showHighlight: false,
    words: [
      { kana: "すし", romaji: "sushi" },
      { kana: "さかな", romaji: "sakana" },
      { kana: "みせ", romaji: "mise" },
    ],
    rewardBuilding: { id: "shop_1", name: "パン屋さん", icon: "🍞" },
  },
];

*/

export interface RomajiWord {
  kana: string;
  romaji: string;
}

export interface RomajiStage {
  id: string;
  stage: number;
  step: number;
  title: string;
  rewardBuilding: {
    name: string;
    icon: string;
  };
  words: RomajiWord[];
}

export const ROMAJI_STAGES: RomajiStage[] = [
  // レベル1: 基本の文字 (1文字)
  {
    id: "r-1-1",
    stage: 1,
    step: 1,
    title: "あいうえお",
    rewardBuilding: { name: "あいうえお", icon: "🎉" },
    words: [
      { kana: "あ", romaji: "a" },
      { kana: "い", romaji: "i" },
      { kana: "う", romaji: "u" },
      { kana: "え", romaji: "e" },
      { kana: "お", romaji: "o" },
    ],
  },
  {
    id: "r-1-2",
    stage: 1,
    step: 2,
    title: "かきくけこ",
    rewardBuilding: { name: "かきくけこ", icon: "🎉" },
    words: [
      { kana: "か", romaji: "ka" },
      { kana: "き", romaji: "ki" },
      { kana: "く", romaji: "ku" },
      { kana: "け", romaji: "ke" },
      { kana: "こ", romaji: "ko" },
    ],
  },
  {
    id: "r-1-3",
    stage: 1,
    step: 3,
    title: "さしすせそ",
    rewardBuilding: { name: "さしすせそ", icon: "🎉" },
    words: [
      { kana: "さ", romaji: "sa" },
      { kana: "し", romaji: "shi" },
      { kana: "す", romaji: "su" },
      { kana: "せ", romaji: "se" },
      { kana: "そ", romaji: "so" },
    ],
  },
  {
    id: "r-1-4",
    stage: 1,
    step: 4,
    title: "たちつてと",
    rewardBuilding: { name: "たちつてと", icon: "🎉" },
    words: [
      { kana: "た", romaji: "ta" },
      { kana: "ち", romaji: "chi" },
      { kana: "つ", romaji: "tsu" },
      { kana: "て", romaji: "te" },
      { kana: "と", romaji: "to" },
    ],
  },
  {
    id: "r-1-5",
    stage: 1,
    step: 5,
    title: "なにぬねの",
    rewardBuilding: { name: "なにぬねの", icon: "🎉" },
    words: [
      { kana: "な", romaji: "na" },
      { kana: "に", romaji: "ni" },
      { kana: "ぬ", romaji: "nu" },
      { kana: "ね", romaji: "ne" },
      { kana: "の", romaji: "no" },
    ],
  },
  {
    id: "r-1-6",
    stage: 1,
    step: 6,
    title: "はひふへほ",
    rewardBuilding: { name: "はひふへほ", icon: "🎉" },
    words: [
      { kana: "は", romaji: "ha" },
      { kana: "ひ", romaji: "hi" },
      { kana: "ふ", romaji: "fu" },
      { kana: "へ", romaji: "he" },
      { kana: "ほ", romaji: "ho" },
    ],
  },
  {
    id: "r-1-7",
    stage: 1,
    step: 7,
    title: "まみむめも",
    rewardBuilding: { name: "まみむめも", icon: "🎉" },
    words: [
      { kana: "ま", romaji: "ma" },
      { kana: "み", romaji: "mi" },
      { kana: "む", romaji: "mu" },
      { kana: "め", romaji: "me" },
      { kana: "も", romaji: "mo" },
    ],
  },
  {
    id: "r-1-8",
    stage: 1,
    step: 8,
    title: "やゆよ",
    rewardBuilding: { name: "やゆよ", icon: "🎉" },
    words: [
      { kana: "や", romaji: "ya" },
      { kana: "ゆ", romaji: "yu" },
      { kana: "よ", romaji: "yo" },
    ],
  },
  {
    id: "r-1-9",
    stage: 1,
    step: 9,
    title: "らりるれろ",
    rewardBuilding: { name: "らりるれろ", icon: "🎉" },
    words: [
      { kana: "ら", romaji: "ra" },
      { kana: "り", romaji: "ri" },
      { kana: "る", romaji: "ru" },
      { kana: "れ", romaji: "re" },
      { kana: "ろ", romaji: "ro" },
    ],
  },
  {
    id: "r-1-10",
    stage: 1,
    step: 10,
    title: "わをん",
    rewardBuilding: { name: "わをん", icon: "🎉" },
    words: [
      { kana: "わ", romaji: "wa" },
      { kana: "を", romaji: "wo" },
      { kana: "ん", romaji: "n" },
    ],
  },


  // レベル1: 基本の単語 (短め・2~3文字)
  {
    id: "r-2-1",
    stage: 2,
    step: 1,
    title: "はじめてのまち",
    rewardBuilding: { name: "おうち", icon: "🏠" },
    words: [
      { kana: "いえ", romaji: "ie" },
      { kana: "かさ", romaji: "kasa" },
      { kana: "そら", romaji: "sora" },
    ],
  },
  {
    id: "r-2-2",
    stage: 2,
    step: 2,
    title: "しぜんをふやそう",
    rewardBuilding: { name: "き", icon: "🌳" },
    words: [
      { kana: "はな", romaji: "hana" },
      { kana: "もり", romaji: "mori" },
      { kana: "かわ", romaji: "kawa" },
    ],
  },
  {
    id: "r-2-3",
    stage: 2,
    step: 3,
    title: "たべものやさん",
    rewardBuilding: { name: "お店", icon: "🏪" },
    words: [
      { kana: "パン", romaji: "pan" },
      { kana: "すし", romaji: "sushi" },
      { kana: "みせ", romaji: "mise" },
    ],
  },

  // レベル2: やや長めの単語・短文 (4~6文字)
  {
    id: "r-2-1",
    stage: 2,
    step: 1,
    title: "のりものがはしるまち",
    rewardBuilding: { name: "バス", icon: "🚌" },
    words: [
      { kana: "くるま", romaji: "kuruma" },
      { kana: "でんしゃ", romaji: "densya" },
      { kana: "ひこうき", romaji: "hikouki" },
    ],
  },
  {
    id: "r-2-2",
    stage: 2,
    step: 2,
    title: "たかいビルをたてよう",
    rewardBuilding: { name: "ビル", icon: "🏢" },
    words: [
      { kana: "えきまえ", romaji: "ekimae" },
      { kana: "こうえん", romaji: "kouen" },
      { kana: "こうじょう", romaji: "koujou" },
    ],
  },

  // レベル3: 長い文章・ことば (8文字以上)
  {
    id: "r-3-1",
    stage: 3,
    step: 1,
    title: "にぎやかな大都会",
    rewardBuilding: { name: "タワー", icon: "🗼" },
    words: [
      { kana: "たいようがのぼる", romaji: "taiyouganoboru" },
      { kana: "きょうもいいてんき", romaji: "kyoumoiitenki" },
      { kana: "みんなであそぼう", romaji: "minnadeasobou" },
    ],
  },
  {
    id: "r-3-2",
    stage: 3,
    step: 2,
    title: "夢の未来都市",
    rewardBuilding: { name: "道路", icon: "🛣" },
    words: [
      { kana: "タイピングがとくい", romaji: "taipinguatokui" },
      { kana: "すばらしいまちができた", romaji: "subarasiimacigadekita" },
      { kana: "みらいへむかってしゅっぱつ", romaji: "miraihemukattesyuppatu" },
    ],
  },
  {
    id: "r-3-3",
    stage: 3,
    step: 3,
    title: "宇宙に行くぞ！",
    rewardBuilding: { name: "ロケット", icon: "🚀" },
    words: [
      { kana: "わたしは、タイピングがとくいです。", romaji: "watashiha, taipinguatokuidesu." },
      { kana: "ぼくは、うちゅうかいはつがしたい。", romaji: "bokoha, uchuukaihatsugashitai." },
      { kana: "みんなもたぶん、うちゅうにきょうみをもっているとおもいます。", romaji: "minnamoto, uchuuni kyoumiwo motte iru to omoimasu." },
    ],
  },
//<絵文字で絵を入力する🚩>

];



export const KEYBOARD_LAYOUT = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "@"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", ":"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "\\"],
  [" "]
];

export const FINGER_MAPPING: Record<string, string> = {
  // Left Pinky
  "q": "lp", "a": "lp", "z": "lp",
  // Left Ring
  "w": "lr", "s": "lr", "x": "lr",
  // Left Middle
  "e": "lm", "d": "lm", "c": "lm",
  // Left Index
  "r": "li", "t": "li", "f": "li", "g": "li", "v": "li", "b": "li",
  // Right Index
  "y": "ri", "u": "ri", "h": "ri", "j": "ri", "n": "ri", "m": "ri",
  // Right Middle
  "i": "rm", "k": "rm", ",": "rm",
  // Right Ring
  "o": "rl", "l": "rl", ".": "rl",
  // Right Pinky
  "p": "rp", "@": "rp", ";": "rp", ":": "rp", "/": "rp", "\\": "rp",
  // Space
  " ": "thumb"
};
/*
export const FINGER_COLORS: Record<string, string> = {
  "lp": "bg-pink-200",
  "lr": "bg-orange-200",
  "lm": "bg-yellow-200",
  "li": "bg-green-200",
  "ri": "bg-blue-200",
  "rm": "bg-indigo-200",
  "rl": "bg-purple-200",
  "rp": "bg-red-200",
  "thumb": "bg-gray-200"
};
*/
// lib/typing-data.ts 内の FINGER_COLORS を以下に差し替えます

export const FINGER_COLORS: { [key: string]: string } = {
  leftPinky: "bg-pink-100 dark:bg-pink-950 text-pink-700",     // 小指 (q, a, z)
  leftRing: "bg-orange-100 dark:bg-orange-950 text-orange-700",  // 薬指 (w, s, x)
  leftMiddle: "bg-yellow-100 dark:bg-yellow-950 text-yellow-700",// 中指 (e, d, c)
  leftIndex: "bg-green-100 dark:bg-green-950 text-green-700",   // 人差し指 (t, r, g, f, b, v)
  rightIndex: "bg-blue-100 dark:bg-blue-950 text-blue-700",     // 人差し指 (y, u, h, j, n, m)
  rightMiddle: "bg-indigo-100 dark:bg-indigo-950 text-indigo-700", // 中指 (i, k, ,)
  rightRing: "bg-purple-100 dark:bg-purple-950 text-purple-700", // 薬指 (o, l, .)
  rightPinky: "bg-teal-100 dark:bg-teal-950 text-teal-700",     // 小指 (p, @, ;, :, /, \)
  thumb: "bg-gray-100 dark:bg-gray-800 text-gray-600",          // 親指 (Space)
};