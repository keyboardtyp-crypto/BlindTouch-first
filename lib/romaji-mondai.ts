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
    id: "r-1-11",
    stage: 1,
    step: 11,
    title: "がぎぐげご",
    rewardBuilding: { name: "がぎぐげご", icon: "🎉" },
    words: [{ kana: "が" }, { kana: "ぎ" }, { kana: "ぐ" }, { kana: "げ" }, { kana: "ご" }],
  },
    {
    id: "r-1-12",
    stage: 1,
    step: 12,
    title: "ざじずぜぞ",
    rewardBuilding: { name: "ざじずぜぞ", icon: "🎉" },
    words: [{ kana: "ざ" }, { kana: "じ" }, { kana: "ず" }, { kana: "ぜ" }, { kana: "ぞ" }],
  },
    {
    id: "r-1-13",
    stage: 1,
    step: 13,
    title: "だぢづでど",
    rewardBuilding: { name: "だぢづでど", icon: "🎉" },
    words: [{ kana: "だ" }, { kana: "ぢ" }, { kana: "づ" }, { kana: "で" }, { kana: "ど" }],
  },
    {
    id: "r-1-14",
    stage: 1,
    step: 14,
    title: "ばびぶべぼ",
    rewardBuilding: { name: "ばびぶべぼ", icon: "🎉" },
    words: [{ kana: "ば" }, { kana: "び" }, { kana: "ぶ" }, { kana: "べ" }, { kana: "ぼ" }],
  },
    {
    id: "r-1-15",
    stage: 1,
    step: 15,
    title: "ぱぴぷぺぽ",
    rewardBuilding: { name: "ぱぴぷぺぽ", icon: "🎉" },
    words: [{ kana: "ぱ" }, { kana: "ぴ" }, { kana: "ぷ" }, { kana: "ぺ" }, { kana: "ぽ" }],
  },
    {
    id: "r-1-16",
    stage: 1,
    step: 16,
    title: "きゃきゅきょ",
    rewardBuilding: { name: "きゃきゅきょ", icon: "🎉" },
    words: [{ kana: "きゃ" }, { kana: "きゅ" }, { kana: "きょ" }],
  },
    {
    id: "r-1-17",
    stage: 1,
    step: 17,
    title: "じゃじゅじょ",
    rewardBuilding: { name: "じゃじゅじょ", icon: "🎉" },
    words: [{ kana: "じゃ" }, { kana: "じゅ" }, { kana: "じょ" }],
  },
    {
    id: "r-1-18",
    stage: 1,
    step: 18,
    title: "ぢゃぢゅぢょ",
    rewardBuilding: { name: "ぢゃぢゅぢょ", icon: "🎉" },
    words: [{ kana: "ぢゃ" }, { kana: "ぢゅ" }, { kana: "ぢょ" }],
  },
  {
    id: "r-1-19",
    stage: 1,
    step: 19,
    title: "びゃびゅびょ",
    rewardBuilding: { name: "びゃびゅびょ", icon: "🎉" },
    words: [{ kana: "びゃ" }, { kana: "びゅ" }, { kana: "びょ" }],
  },
    {
    id: "r-1-20",
    stage: 1,
    step: 20,
    title: "ぴゃぴゅぴょ",
    rewardBuilding: { name: "ぴゃぴゅぴょ", icon: "🎉" },
    words: [{ kana: "ぴゃ" }, { kana: "ぴゅ" }, { kana: "ぴょ" }],
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
    id: "r-2-6",
    stage: 2,
    step: 6,
    title: "めいたんていコナン",
    rewardBuilding: { name: "コナン", icon: "👓" },
    words: [{ kana: "コナン" }, 
      { kana: "はいばらあい" }, { kana: "あかいしゅういち" }, { kana: "くどうしんいち" },
      { kana: "くどうゆうさく" }, { kana: "くどうゆきこ" }, { kana: "もうりこごろう" },
    ],
  },
  {
    id: "r-2-7",
    stage: 2,
    step: 7,
    title: "もうりけ",
    rewardBuilding: { name: "もうり", icon: "👓" },
    words: [{ kana: "もうりらん" }, 
      { kana: "もうりこごろう" },  { kana: "きえり" }
    ],
  },
  {
    id: "r-2-8",
    stage: 2,
    step: 8,
    title: "しょうねんたんていだん",
    rewardBuilding: { name: "しょうねんたんていだん", icon: "👦👧" },
    words: [{ kana: "はいばらあい" }, { kana: "よしだあゆみ" },  { kana: "つぶらやみつひこ" },
    { kana: "こじまげんた" },  { kana: "あがさはかせ" }],
  },
    {
    id: "r-2-9",
    stage: 2,
    step: 9,
    title: "こうこうせいたんていとライバル",
    rewardBuilding: { name: "こうこうせいたんていとライバル", icon: "🎩" },
    words: [{ kana: "はっとりへいじ" }, { kana: "とうやまわかな" },  { kana: "くろはかいと" },
    { kana: "せらますみ" },  { kana: "おきたそうし" }],
  },
    {
    id: "r-2-10",
    stage: 2,
    step: 10,
    title: "くろずみめのそしき",
    rewardBuilding: { name: "くろずみめのそしき", icon: "☬" },
    words: [{ kana: "ジン" }, { kana: "ウォッカ" },  { kana: "ベルモット" },
      { kana: "キャンティ" }, { kana: "コルン" },  { kana: "ラム" },
      { kana: "キール" }, { kana: "バーボン" },  { kana: "ライ" },
    ],
  },
      {
    id: "r-2-11",
    stage: 2,
    step: 11,
    title: "けいさつかんけい",
    rewardBuilding: { name: "けいさつかんけい", icon: "🚓" },
    words: [{ kana: "めぐろじゅうぞう" }, { kana: "たかぎわたる" },  { kana: "さとうみわこ" },
      { kana: "ちばかずのぶ" }, { kana: "しらとりにんざぶろう" },  { kana: "ふるやれい" },
      { kana: "あかいしゅういち" }, { kana: "かざみゆうや" },  { kana: "うえはらゆい" },
      { kana: "やまとかんすけ" }, { kana: "もろふしたかあき" },
    ],
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
  {
    id: "r-4-1",
    stage: 4,
    step: 1,
    title: "ちりもつもればやまとなる",
    rewardBuilding: { name: "やま", icon: "🏔" },
    words: [
      { kana: "ちりもつもればやまとなる とは、" },
      { kana: "わずかなものでも、むしできないほどたくさんあつまれば、おおきなものになる。" },
      { kana: "といういみです。" },
    ],
  },

//いそがばまわれ）：急いでいるときほど、安全で確実な方法を選ぶほうが結果的に早い。
  {
    id: "r-4-2",
    stage: 4,
    step: 2,
    title: "ときはかねなり",
    rewardBuilding: { name: "とけい", icon: "⌚" },
    words: [
      { kana: "ときはかねなり とは、" },
      { kana: "じかんもおかねとおなじようにきちょうであるため、むだにしてはいけない。" },
      { kana: "といういみです。" },
    ],
  },
   {
    id: "r-4-3",
    stage: 4,
    step: 3,
    title: "いそがばまわれ",
    rewardBuilding: { name: "道", icon: "🔂" },
    words: [
      { kana: "いそがばまわれ とは、" },
      { kana: "きびしいときに、あんぜんでかくじつなほうほうをえらぶほうがけっかてきにはやい。" },
      { kana: "といういみです。" },
    ],
  }, 
   {
    id: "r-4-4",
    stage: 4,
    step: 4,
    title: "はなよりだんご",
    rewardBuilding: { name: "だんご", icon: "🍡" },
    words: [
      { kana: "はなよりだんご とは、" },
      { kana: "ふうりゅうやみためよりも、じつえきやじつようせいをおもんじること。" },
      { kana: "といういみです。" },
    ],
  }, 
]


// ローマ字パターンの自動生成を行ってエクスポート
export const ROMAJI_STAGES: RomajiStage[] = RAW_ROMAJI_STAGES.map((s) => ({
  ...s,
  words: s.words.map((w) => ({
    kana: w.kana,
    romaji: generateRomajiPatterns(w.kana),
  })),
}));
