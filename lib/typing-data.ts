export type Level = {
  id: string;
  stage: number;
  step: number;
  title: string;
  keys: string;
  homeKey: string | null;
  threshold: number;
  showHighlight: boolean;
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