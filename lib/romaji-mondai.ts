import { generateRomajiPatterns, RomajiStage } from "./typing-data";

// 単語データ定義用の型
export interface RawRomajiWord {
  kana: string;
}

export interface RawRomajiStage {
  id: string;
  stage: number;
  step: number;
  title: string;
  rewardBuilding: {
    name: string;
    icon: string;
  };
  words: RawRomajiWord[];
}

// =============================================================
// 問題データ一覧（追加・変更はこちらを編集）
// =============================================================

const RAW_ROMAJI_STAGES: RawRomajiStage[] = [
  {
    id: "r-1-1",
    stage: 1,
    step: 1,
    title: "あいうえお",
    rewardBuilding: { name: "あいうえお", icon: "🎉" },
    words: [{ kana: "あ" }, { kana: "い" }, { kana: "う" }, { kana: "え" }, { kana: "お" }],
  },
  {
    id: "r-1-2",
    stage: 1,
    step: 2,
    title: "かきくけこ",
    rewardBuilding: { name: "かきくけこ", icon: "🎉" },
    words: [{ kana: "か" }, { kana: "き" }, { kana: "く" }, { kana: "け" }, { kana: "こ" }],
  },
  {
    id: "r-1-3",
    stage: 1,
    step: 3,
    title: "さしすせそ",
    rewardBuilding: { name: "さしすせそ", icon: "🎉" },
    words: [{ kana: "さ" }, { kana: "し" }, { kana: "す" }, { kana: "せ" }, { kana: "そ" }],
  },
  {
    id: "r-1-4",
    stage: 1,
    step: 4,
    title: "たちつてと",
    rewardBuilding: { name: "たちつてと", icon: "🎉" },
    words: [{ kana: "た" }, { kana: "ち" }, { kana: "つ" }, { kana: "て" }, { kana: "と" }],
  },
  {
    id: "r-1-5",
    stage: 1,
    step: 5,
    title: "なにぬねの",
    rewardBuilding: { name: "なにぬねの", icon: "🎉" },
    words: [{ kana: "な" }, { kana: "に" }, { kana: "ぬ" }, { kana: "ね" }, { kana: "の" }],
  },
  {
    id: "r-1-6",
    stage: 1,
    step: 6,
    title: "はひふへほ",
    rewardBuilding: { name: "はひふへほ", icon: "🎉" },
    words: [{ kana: "は" }, { kana: "ひ" }, { kana: "ふ" }, { kana: "へ" }, { kana: "ほ" }],
  },
  {
    id: "r-1-7",
    stage: 1,
    step: 7,
    title: "まみむめも",
    rewardBuilding: { name: "まみむめも", icon: "🎉" },
    words: [{ kana: "ま" }, { kana: "み" }, { kana: "む" }, { kana: "め" }, { kana: "も" }],
  },
  {
    id: "r-1-8",
    stage: 1,
    step: 8,
    title: "やゆよ",
    rewardBuilding: { name: "やゆよ", icon: "🎉" },
    words: [{ kana: "や" }, { kana: "ゆ" }, { kana: "よ" }],
  },
  {
    id: "r-1-9",
    stage: 1,
    step: 9,
    title: "らりるれろ",
    rewardBuilding: { name: "らりるれろ", icon: "🎉" },
    words: [{ kana: "ら" }, { kana: "り" }, { kana: "る" }, { kana: "れ" }, { kana: "ろ" }],
  },
  {
    id: "r-1-10",
    stage: 1,
    step: 10,
    title: "わをん",
    rewardBuilding: { name: "わをん", icon: "🎉" },
    words: [{ kana: "わ" }, { kana: "を" }, { kana: "ん" }],
  },
  {
    id: "r-2-1",
    stage: 2,
    step: 1,
    title: "はじめてのまち",
    rewardBuilding: { name: "おうち", icon: "🏠" },
    words: [{ kana: "いえ" }, { kana: "かさ" }, { kana: "そら" }],
  },
  {
    id: "r-2-2",
    stage: 2,
    step: 2,
    title: "しぜんをふやそう",
    rewardBuilding: { name: "き", icon: "🌳" },
    words: [{ kana: "はな" }, { kana: "もり" }, { kana: "かわ" }],
  },
  {
    id: "r-2-3",
    stage: 2,
    step: 3,
    title: "たべものやさん",
    rewardBuilding: { name: "お店", icon: "🏪" },
    words: [{ kana: "パン" }, { kana: "すし" }, { kana: "みせ" }],
  },
  {
    id: "r-2-4",
    stage: 2,
    step: 4,
    title: "のりものがはしるまち",
    rewardBuilding: { name: "バス", icon: "🚌" },
    words: [{ kana: "くるま" }, { kana: "でんしゃ" }, { kana: "ひこうき" }],
  },
  {
    id: "r-2-5",
    stage: 2,
    step: 5,
    title: "たかいビルをたてよう",
    rewardBuilding: { name: "ビル", icon: "🏢" },
    words: [{ kana: "えきまえ" }, { kana: "こうえん" }, { kana: "こうじょう" }],
  },
  {
    id: "r-3-1",
    stage: 3,
    step: 1,
    title: "にぎやかな大都会",
    rewardBuilding: { name: "タワー", icon: "🗼" },
    words: [
      { kana: "たいようがのぼる" },
      { kana: "きょうもいいてんき" },
      { kana: "みんなであそぼう" },
    ],
  },
  {
    id: "r-3-2",
    stage: 3,
    step: 2,
    title: "夢の未来都市",
    rewardBuilding: { name: "道路", icon: "🛣" },
    words: [
      { kana: "タイピングがとくい" },
      { kana: "すばらしいまちができた" },
      { kana: "みらいへむかってしゅっぱつ" },
    ],
  },
  {
    id: "r-3-3",
    stage: 3,
    step: 3,
    title: "宇宙に行くぞ！",
    rewardBuilding: { name: "ロケット", icon: "🚀" },
    words: [
      { kana: "わたしは、タイピングがとくいです。" },
      { kana: "ぼくは、うちゅうかいはつがしたい。" },
      { kana: "みんなもたぶん、うちゅうにきょうみをもっているとおもいます。" },
    ],
  },
];

// ローマ字パターンの自動生成を行ってエクスポート
export const ROMAJI_STAGES: RomajiStage[] = RAW_ROMAJI_STAGES.map((s) => ({
  ...s,
  words: s.words.map((w) => ({
    kana: w.kana,
    romaji: generateRomajiPatterns(w.kana),
  })),
}));
