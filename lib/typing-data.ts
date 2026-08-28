// =============================================================
// 型定義
// =============================================================

export type Level = {
  id: string;
  stage: number;
  step: number;
  title: string;
  keys: string;
  homeKey: string | null;
  threshold: number;
  showHighlight: boolean;
  isBlind?: boolean;
};

export interface RomajiWord {
  kana: string;
  romaji: string[]; // 自動生成された複数打鍵パターンを格納
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







// =============================================================
// 1. ローマ字変換辞書 & 自動生成ロジック
// =============================================================

export const ROMAJI_MAP: Record<string, string[]> = {
  // あ行
  あ: ["a"], い: ["i"], う: ["u"], え: ["e"], お: ["o"],
  // か行・が行
  か: ["ka"], き: ["ki"], く: ["ku"], け: ["ke"], こ: ["ko"],
  が: ["ga"], ぎ: ["gi"], ぐ: ["gu"], げ: ["ge"], ご: ["go"],
  // さ行・ざ行
  さ: ["sa"], し: ["si", "shi"], す: ["su"], せ: ["se"], そ: ["so"],
  ざ: ["za"], じ: ["zi", "ji"], ず: ["zu"], ぜ: ["ze"], ぞ: ["zo"],
  // た行・だ行
  た: ["ta"], ち: ["ti", "chi"], つ: ["tu", "tsu"], て: ["te"], と: ["to"],
  だ: ["da"], ぢ: ["di"], づ: ["du"], で: ["de"], ど: ["do"],
  // な行
  な: ["na"], に: ["ni"], ぬ: ["nu"], ね: ["ne"], の: ["no"],
  // は行・ば行・ぱ行
  は: ["ha"], ひ: ["hi"], ふ: ["hu", "fu"], へ: ["he"], ほ: ["ho"],
  ば: ["ba"], び: ["bi"], ぶ: ["bu"], べ: ["be"], ぼ: ["bo"],
  ぱ: ["pa"], ぴ: ["pi"], ぷ: ["pu"], ぺ: ["pe"], ぽ: ["po"],
  // ま行・や行・ら行・わ行
  ま: ["ma"], み: ["mi"], む: ["mu"], め: ["me"], も: ["mo"],
  や: ["ya"], ゆ: ["yu"], よ: ["yo"],
  ら: ["ra"], り: ["ri"], る: ["ru"], れ: ["re"], ろ: ["ro"],
  わ: ["wa"], を: ["wo"], ん: ["nn", "xn"],

  // 促音・小文字単体（「っ」「ぁ」など）
  っ: ["ltu", "xtu", "ltsu"],
  ぁ: ["la", "xa"], ぃ: ["li", "xi"], ぅ: ["lu", "xu"], ぇ: ["le", "xe"], ぉ: ["lo", "xo"],
  ゃ: ["lya", "xya"], ゅ: ["lyu", "xyu"], ょ: ["lyo", "xyo"],

  // 拗音（しゃ行・ちゃ行・じゃ行等）
  きゃ: ["kya"], きゅ: ["kyu"], きょ: ["kyo"],
  ぎゃ: ["gya"], ぎゅ: ["gyu"], ぎょ: ["gyo"],
  しゃ: ["sya", "sha"], しゅ: ["syu", "shu"], しょ: ["syo", "sho"],
  じゃ: ["zya", "ja", "jya"], じゅ: ["zyu", "ju", "jyu"], じょ: ["zyo", "jo", "jyo"],
  ちゃ: ["tya", "cha"], ちゅ: ["tyu", "chu"], ちょ: ["tyo", "cho"],
  ぢゃ: ["dya"], ぢゅ: ["dyu"], ぢょ: ["dyo"],
  にゃ: ["nya"], にゅ: ["nyu"], にょ: ["nyo"],
  ひゃ: ["hya"], ひゅ: ["hyu"], ひょ: ["hyo"],
  びゃ: ["bya"], びゅ: ["byu"], びょ: ["byo"],
  ぴゃ: ["pya"], ぴゅ: ["pyu"], ぴょ: ["pyo"],
  みゃ: ["mya"], みゅ: ["myu"], みょ: ["myo"],
  りゃ: ["rya"], りゅ: ["ryu"], りょ: ["ryo"],
  ふぁ: ["fa"], ふぃ: ["fi"], ふぇ: ["fe"], ふぉ: ["fo"],
  てぃ: ["thi"], とぅ: ["twu"], でぃ: ["dhi"], どぅ: ["dwu"],

// 記号（読点・句点・感嘆符など）を追加
  "、": [","],
  "。": ["."],
  "！": ["!"],
  "？": ["?"],
  "ー": ["-"],
  " ": [" "],





};

/**
 * カタカナをひらがなに変換するヘルパー関数
 */
function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30a1-\u30f6]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) - 0x60);
  });
}

/**
 * かな・カナ文字列からあり得るすべてのローマ字入力パターンの配列を生成する関数
 */
export function generateRomajiPatterns(rawKana: string): string[] {
  // カタカナが入ってきた場合はすべて「ひらがな」に統一
  const kana = katakanaToHiragana(rawKana);

  let patterns: string[] = [""];

  let i = 0;
  while (i < kana.length) {
    const currentChar = kana[i];
    const nextChar = kana[i + 1];

    // 1. 促音「っ」 + 次の音（子音重ね入力パターン対応）
    if (currentChar === "っ" && nextChar) {
      const twoChars = kana.slice(i + 1, i + 3);
      let nextCandidates = ROMAJI_MAP[twoChars];
      let step = 2;

      if (!nextCandidates) {
        nextCandidates = ROMAJI_MAP[nextChar] || [nextChar];
        step = 1;
      }

      const sokuonCandidates: string[] = [];
      
      // 子音重複パターン (例: か -> ka の先頭 k を重ねて kka)
      for (const cand of nextCandidates) {
        const firstConsonant = cand[0];
        if (firstConsonant && !["a", "i", "u", "e", "o", "n"].includes(firstConsonant)) {
          sokuonCandidates.push(firstConsonant + cand);
        }
      }

      // 「ltu」「xtu」など直接入力して次に進むパターン
      const defaultSokuon = ROMAJI_MAP["っ"] || ["ltu"];
      for (const sok of defaultSokuon) {
        for (const cand of nextCandidates) {
          sokuonCandidates.push(sok + cand);
        }
      }

      const nextPatterns: string[] = [];
      for (const current of patterns) {
        for (const cand of sokuonCandidates) {
          nextPatterns.push(current + cand);
        }
      }
      patterns = nextPatterns;
      i += 1 + step;
      continue;
    }

    // 2. 拗音（2文字のチェック：しゃ、ちゃ、てぃ等）
    const twoChars = kana.slice(i, i + 2);
    let candidates = ROMAJI_MAP[twoChars];
    let step = 2;

    // 3. 1文字チェック
    if (!candidates) {
      candidates = ROMAJI_MAP[currentChar] || [currentChar];
      step = 1;
    }

    const nextPatterns: string[] = [];
    for (const current of patterns) {
      for (const cand of candidates) {
        nextPatterns.push(current + cand);
      }
    }
    patterns = nextPatterns;
    i += step;
  }

  // 重複を除去して返す
  return Array.from(new Set(patterns));
}

/**
 * かな文字列からあり得るすべてのローマ字入力パターンの配列を生成する関数
 * （促音「っ」の次の子音重ね、撥音「ん」の単体打鍵・重ね打鍵に対応）
 */
/*
export function generateRomajiPatterns(kana: string): string[] {
  let patterns: string[] = [""];

  let i = 0;
  while (i < kana.length) {
    const currentChar = kana[i];
    const nextChar = kana[i + 1];

    // 1. 促音「っ」 + 次の音（子音重ね入力パターン対応）
    if (currentChar === "っ" && nextChar) {
      const twoChars = kana.slice(i + 1, i + 3);
      let nextCandidates = ROMAJI_MAP[twoChars];
      let step = 2;

      if (!nextCandidates) {
        nextCandidates = ROMAJI_MAP[nextChar] || [nextChar];
        step = 1;
      }

      // 次の文字の先頭子音を重ねるパターン + 「ltu/xtu」直接入力パターン
      const sokuonCandidates: string[] = [];
      
      // 子音重複パターン (例: か -> ka の先頭 k を重ねて kka)
      for (const cand of nextCandidates) {
        const firstConsonant = cand[0];
        if (firstConsonant && !["a", "i", "u", "e", "o", "n"].includes(firstConsonant)) {
          sokuonCandidates.push(firstConsonant + cand);
        }
      }

      // 「ltu」「xtu」など直接入力して次に進むパターン
      const defaultSokuon = ROMAJI_MAP["っ"] || ["ltu"];
      for (const sok of defaultSokuon) {
        for (const cand of nextCandidates) {
          sokuonCandidates.push(sok + cand);
        }
      }

      const nextPatterns: string[] = [];
      for (const current of patterns) {
        for (const cand of sokuonCandidates) {
          nextPatterns.push(current + cand);
        }
      }
      patterns = nextPatterns;
      i += 1 + step;
      continue;
    }

    // 2. 拗音（2文字のチェック：しゃ、ちゃ、てぃ等）
    const twoChars = kana.slice(i, i + 2);
    let candidates = ROMAJI_MAP[twoChars];
    let step = 2;

    // 3. 1文字チェック
    if (!candidates) {
      candidates = ROMAJI_MAP[currentChar] || [currentChar];
      step = 1;
    }

    const nextPatterns: string[] = [];
    for (const current of patterns) {
      for (const cand of candidates) {
        nextPatterns.push(current + cand);
      }
    }
    patterns = nextPatterns;
    i += step;
  }

  // 重複を除去して返す
  return Array.from(new Set(patterns));
}
*/




// 簡単入力用のヘルパー関数
function makeStage(
  id: string,
  stage: number,
  step: number,
  title: string,
  rewardBuilding: { name: string; icon: string },
  words: { kana: string }[]
): RomajiStage {
  return {
    id,
    stage,
    step,
    title,
    rewardBuilding,
    words: words.map((w) => ({
      kana: w.kana,
      romaji: generateRomajiPatterns(w.kana),
    })),
  };
}

// =============================================================
// 2. 基本ステージ定義 (STAGES)
// =============================================================

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

// =============================================================
// 3. ブラインドモード用ステージ定義 (BLIND_STAGES)
// =============================================================

export const BLIND_STAGES: Level[] = [
  // Stage 1
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

  // Stage 2
  { id: "b-2-1", stage: 2, step: 1, title: "人差し指混合", keys: "yuhjnmtrgfbv", homeKey: null, threshold: 85, showHighlight: true, isBlind: false },
  { id: "b-2-2", stage: 2, step: 2, title: "人差し指混合 (ブラインド)", keys: "yuhjnmtrgfbv", homeKey: null, threshold: 85, showHighlight: false, isBlind: true },
  { id: "b-2-3", stage: 2, step: 3, title: "中指混合＋人差し指混合", keys: "juhmnyfrgvbtki,dec", homeKey: null, threshold: 85, showHighlight: true, isBlind: false },
  { id: "b-2-4", stage: 2, step: 4, title: "中指混合＋人差し指混合 (ブラインド)", keys: "juhmnyfrgvbtki,dec", homeKey: null, threshold: 85, showHighlight: false, isBlind: true },
  { id: "b-2-5", stage: 2, step: 5, title: "薬指混合", keys: "ol.wsx", homeKey: null, threshold: 85, showHighlight: true, isBlind: false },
  { id: "b-2-6", stage: 2, step: 6, title: "薬指混合 (ブラインド)", keys: "ol.wsx", homeKey: null, threshold: 85, showHighlight: false, isBlind: true },
  { id: "b-2-7", stage: 2, step: 7, title: "小指混合", keys: "p@;:/\ qaz", homeKey: null, threshold: 85, showHighlight: true, isBlind: false },
  { id: "b-2-8", stage: 2, step: 8, title: "小指混合 (ブラインド)", keys: "p@;:/\ qaz", homeKey: null, threshold: 85, showHighlight: false, isBlind: true },
  { id: "b-2-9", stage: 2, step: 9, title: "薬指混合＋中指＋人差し指混合", keys: "juhmnyfrgvbtki,declo.swx", homeKey: null, threshold: 85, showHighlight: true, isBlind: false },
  { id: "b-2-10", stage: 2, step: 10, title: "薬指混合＋中指＋人差し指混合 (ブラインド)", keys: "juhmnyfrgvbtki,declo.swx", homeKey: null, threshold: 85, showHighlight: false, isBlind: true },

  // Stage 3
  { id: "b-3-1", stage: 3, step: 1, title: "全キー混合", keys: "yuhjnmtrgfbvik,edcol.wsxp@;:/\ qaz", homeKey: null, threshold: 80, showHighlight: true, isBlind: false },
  { id: "b-3-2", stage: 3, step: 2, title: "全キー混合 (ブラインド)", keys: "yuhjnmtrgfbvik,edcol.wsxp@;:/\ qaz", homeKey: null, threshold: 80, showHighlight: false, isBlind: true },
];

// =============================================================
// 4. 各指強化モード用ステージ定義 (FINGER_STAGES)
// =============================================================

export const FINGER_STAGES: Level[] = [
  // 右手人差し指
  { id: "f-1-1", stage: 1, step: 1, title: "右手人差し指: Step 1 (j)", keys: "j", homeKey: "j", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-1-2", stage: 1, step: 2, title: "右手人差し指: Step 2 (j, u)", keys: "ju", homeKey: "j", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-1-3", stage: 1, step: 3, title: "右手人差し指: Step 3 (j, u, h)", keys: "juh", homeKey: "j", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-1-4", stage: 1, step: 4, title: "右手人差し指: Step 4 (j, u, h, m)", keys: "juhm", homeKey: "j", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-1-5", stage: 1, step: 5, title: "右手人差し指: Step 5 (j, u, h, m, n)", keys: "juhmn", homeKey: "j", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-1-6", stage: 1, step: 6, title: "右手人差し指: Step 6 (j, u, h, m, n, y)", keys: "juhmny", homeKey: "j", threshold: 90, showHighlight: false, isBlind: true },

  // 左手人差し指
  { id: "f-2-1", stage: 2, step: 1, title: "左手人差し指: Step 1 (f)", keys: "f", homeKey: "f", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-2-2", stage: 2, step: 2, title: "左手人差し指: Step 2 (f, r)", keys: "fr", homeKey: "f", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-2-3", stage: 2, step: 3, title: "左手人差し指: Step 3 (f, r, g)", keys: "frg", homeKey: "f", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-2-4", stage: 2, step: 4, title: "左手人差し指: Step 4 (f, r, g, v)", keys: "frgv", homeKey: "f", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-2-5", stage: 2, step: 5, title: "左手人差し指: Step 5 (f, r, g, v, b)", keys: "frgvb", homeKey: "f", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-2-6", stage: 2, step: 6, title: "左手人差し指: Step 6 (f, r, g, v, b, t)", keys: "frgvbt", homeKey: "f", threshold: 90, showHighlight: false, isBlind: true },

  // 人差し指左右混合
  { id: "f-9-1", stage: 9, step: 1, title: "人差し指左右混合", keys: "juhmnyfrgvbt", homeKey: null, threshold: 90, showHighlight: false, isBlind: true },

  // 右手中指
  { id: "f-3-1", stage: 3, step: 1, title: "右手中指: Step 1 (k)", keys: "k", homeKey: "k", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-3-2", stage: 3, step: 2, title: "右手中指: Step 2 (k, i)", keys: "ki", homeKey: "k", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-3-3", stage: 3, step: 3, title: "右手中指: Step 3 (k, i, ,)", keys: "ki,", homeKey: "k", threshold: 90, showHighlight: false, isBlind: true },

  // 左手中指
  { id: "f-4-1", stage: 4, step: 1, title: "左手中指: Step 1 (d)", keys: "d", homeKey: "d", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-4-2", stage: 4, step: 2, title: "左手中指: Step 2 (d, e)", keys: "de", homeKey: "d", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-4-3", stage: 4, step: 3, title: "左手中指: Step 3 (d, e, c)", keys: "dec", homeKey: "d", threshold: 90, showHighlight: false, isBlind: true },

  // 人差し指＋中指混合
  { id: "f-10-1", stage: 10, step: 1, title: "人差し指＋中指混合", keys: "juhmnyfrgvbtki,dec", homeKey: null, threshold: 90, showHighlight: false, isBlind: true },

  // 右手薬指
  { id: "f-5-1", stage: 5, step: 1, title: "右手薬指: Step 1 (l)", keys: "l", homeKey: "l", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-5-2", stage: 5, step: 2, title: "右手薬指: Step 2 (l, o)", keys: "lo", homeKey: "l", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-5-3", stage: 5, step: 3, title: "右手薬指: Step 3 (l, o, .)", keys: "lo.", homeKey: "l", threshold: 90, showHighlight: false, isBlind: true },

  // 左手薬指
  { id: "f-6-1", stage: 6, step: 1, title: "左手薬指: Step 1 (s)", keys: "s", homeKey: "s", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-6-2", stage: 6, step: 2, title: "左手薬指: Step 2 (s, w)", keys: "sw", homeKey: "s", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-6-3", stage: 6, step: 3, title: "左手薬指: Step 3 (s, w, x)", keys: "swx", homeKey: "s", threshold: 90, showHighlight: false, isBlind: true },

  // 人差し指＋中指＋薬指混合
  { id: "f-11-1", stage: 11, step: 1, title: "人差し指＋中指＋薬指混合", keys: "juhmnyfrgvbtki,declo.swx", homeKey: null, threshold: 90, showHighlight: false, isBlind: true },

  // 右手小指
  { id: "f-7-1", stage: 7, step: 1, title: "右手小指: Step 1 (;)", keys: ";", homeKey: ";", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-7-2", stage: 7, step: 2, title: "右手小指: Step 2 (;, p)", keys: ";p", homeKey: ";", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-7-3", stage: 7, step: 3, title: "右手小指: Step 3 (;, p, /)", keys: ";p/", homeKey: ";", threshold: 90, showHighlight: false, isBlind: true },

  // 左手小指
  { id: "f-8-1", stage: 8, step: 1, title: "左手小指: Step 1 (a)", keys: "a", homeKey: "a", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-8-2", stage: 8, step: 2, title: "左手小指: Step 2 (a, q)", keys: "aq", homeKey: "a", threshold: 90, showHighlight: false, isBlind: true },
  { id: "f-8-3", stage: 8, step: 3, title: "左手小指: Step 3 (a, q, z)", keys: "aqz", homeKey: "a", threshold: 90, showHighlight: false, isBlind: true },

  // 全指混合
  { id: "f-12-1", stage: 12, step: 1, title: "全指混合 (全キー)", keys: "juhmnyfrgvbtki,declo.swx;p/aqz", homeKey: null, threshold: 90, showHighlight: false, isBlind: true },
];

// =============================================================
// 5. ローマ字・街づくりモード用定義 (ROMAJI_STAGES)
// =============================================================

export const ROMAJI_STAGES: RomajiStage[] = [
  // レベル1: 基本の文字 (1文字)
  makeStage("r-1-1", 1, 1, "あいうえお", { name: "あいうえお", icon: "🎉" }, [
    { kana: "あ" }, { kana: "い" }, { kana: "う" }, { kana: "え" }, { kana: "お" },
  ]),
  makeStage("r-1-2", 1, 2, "かきくけこ", { name: "かきくけこ", icon: "🎉" }, [
    { kana: "か" }, { kana: "き" }, { kana: "く" }, { kana: "け" }, { kana: "こ" },
  ]),
  makeStage("r-1-3", 1, 3, "さしすせそ", { name: "さしすせそ", icon: "🎉" }, [
    { kana: "さ" }, { kana: "し" }, { kana: "す" }, { kana: "せ" }, { kana: "そ" },
  ]),
  makeStage("r-1-4", 1, 4, "たちつてと", { name: "たちつてと", icon: "🎉" }, [
    { kana: "た" }, { kana: "ち" }, { kana: "つ" }, { kana: "て" }, { kana: "と" },
  ]),
  makeStage("r-1-5", 1, 5, "なにぬねの", { name: "なにぬねの", icon: "🎉" }, [
    { kana: "な" }, { kana: "に" }, { kana: "ぬ" }, { kana: "ね" }, { kana: "の" },
  ]),
  makeStage("r-1-6", 1, 6, "はひふへほ", { name: "はひふへほ", icon: "🎉" }, [
    { kana: "は" }, { kana: "ひ" }, { kana: "ふ" }, { kana: "へ" }, { kana: "ほ" },
  ]),
  makeStage("r-1-7", 1, 7, "まみむめも", { name: "まみむめも", icon: "🎉" }, [
    { kana: "ま" }, { kana: "み" }, { kana: "む" }, { kana: "め" }, { kana: "も" },
  ]),
  makeStage("r-1-8", 1, 8, "やゆよ", { name: "やゆよ", icon: "🎉" }, [
    { kana: "や" }, { kana: "ゆ" }, { kana: "よ" },
  ]),
  makeStage("r-1-9", 1, 9, "らりるれろ", { name: "らりるれろ", icon: "🎉" }, [
    { kana: "ら" }, { kana: "り" }, { kana: "る" }, { kana: "れ" }, { kana: "ろ" },
  ]),
  makeStage("r-1-10", 1, 10, "わをん", { name: "わをん", icon: "🎉" }, [
    { kana: "わ" }, { kana: "を" }, { kana: "ん" },
  ]),

  // レベル2: 基本の単語 (短め・2~3文字) - 濁音・促音・撥音を含む
  makeStage("r-2-1", 2, 1, "はじめてのまち", { name: "おうち", icon: "🏠" }, [
    { kana: "いえ" }, { kana: "かさ" }, { kana: "そら" },
  ]),
  makeStage("r-2-2", 2, 2, "しぜんをふやそう", { name: "き", icon: "🌳" }, [
    { kana: "はな" }, { kana: "もり" }, { kana: "かわ" },
  ]),
  makeStage("r-2-3", 2, 3, "たべものやさん", { name: "お店", icon: "🏪" }, [
    { kana: "パン" }, { kana: "すし" }, { kana: "みせ" },
  ]),

  // レベル2: やや長めの単語・短文 (4~6文字) - 濁音・促音・拗音など
  makeStage("r-2-4", 2, 4, "のりものがはしるまち", { name: "バス", icon: "🚌" }, [
    { kana: "くるま" }, { kana: "でんしゃ" }, { kana: "ひこうき" },
  ]),
  makeStage("r-2-5", 2, 5, "たかいビルをたてよう", { name: "ビル", icon: "🏢" }, [
    { kana: "えきまえ" }, { kana: "こうえん" }, { kana: "こうじょう" },
  ]),

  // レベル3: 長い文章・ことば (8文字以上)
  makeStage("r-3-1", 3, 1, "にぎやかな大都会", { name: "タワー", icon: "🗼" }, [
    { kana: "たいようがのぼる" },
    { kana: "きょうもいいてんき" },
    { kana: "みんなであそぼう" },
  ]),
  makeStage("r-3-2", 3, 2, "夢の未来都市", { name: "道路", icon: "🛣" }, [
    { kana: "タイピングがとくい" },
    { kana: "すばらしいまちができた" },
    { kana: "みらいへむかってしゅっぱつ" },
  ]),
  makeStage("r-3-3", 3, 3, "宇宙に行くぞ！", { name: "ロケット", icon: "🚀" }, [
    { kana: "わたしは、タイピングがとくいです。" },
    { kana: "ぼくは、うちゅうかいはつがしたい。" },
    { kana: "みんなもたぶん、うちゅうにきょうみをもっているとおもいます。" },
  ]),
];

// =============================================================
// 6. キーボードレイアウト & 指配置マップ
// =============================================================

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
