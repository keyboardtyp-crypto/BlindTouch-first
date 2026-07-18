"use client";

import { KEYBOARD_LAYOUT } from "../lib/typing-data";

interface KeyboardProps {
  targetKey: string | null;
  highlightTarget: boolean;
  homeKey: string | null;
}

export function Keyboard({ targetKey, highlightTarget, homeKey }: KeyboardProps) {
  const homeKeys = "asdfjkl;";

  // 🟢 外部データに一切頼らず、文字から直接カラー（背景色、文字色、枠線）を判定します
  const getFingerStyle = (keyChar: string) => {
    const k = keyChar.toLowerCase();
    
    // 左手小指 (ピンク)
    if ("qaz".includes(k)) return { bg: "#ffe4e6", text: "#be123c", border: "#fda4af" };
    // 左手薬指 (オレンジ)
    if ("wsx".includes(k)) return { bg: "#ffedd5", text: "#c2410c", border: "#fed7aa" };
    // 左手中指 (イエロー)
    if ("edc".includes(k)) return { bg: "#fef9c3", text: "#a16207", border: "#fef08a" };
    // 左手人差し指 (グリーン)
    if ("trgfbv".includes(k)) return { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0" };
    
    // 右手人差し指 (ブルー)
    if ("yuhjnm".includes(k)) return { bg: "#dbeafe", text: "#1d4ed8", border: "#bfdbfe" };
    // 右手中指 (インディゴ)
    if ("ik,".includes(k)) return { bg: "#e0f9ff", text: "#251b4d", border: "#c7d2fe" };
    // 右手薬指 (パープル)
    if ("ol.".includes(k)) return { bg: "#f3e8ff", text: "#6b21a8", border: "#e9d5ff" };
    // 右手小指 (ティール)
    if ("p@;:/\\[]".includes(k) || k === ";" || k === ":" || k === "/" || k === "@") {
      return { bg: "#ccfbf1", text: "#0f766e", border: "#99f6e4" };
    }
    
    // 親指・その他 (グレー)
    return { bg: "#f3f4f6", text: "#4b5563", border: "#d1d5db" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "16px", backgroundColor: "#e5e7eb", borderRadius: "12px", maxWidth: "fit-content", marginLeft: "auto", marginRight: "auto" }}>
      {KEYBOARD_LAYOUT.map((row: any[], rowIndex: number) => (
        <div key={rowIndex} style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
          {row.map((keyItem: any) => {
            // 文字列化を確実に実施
            const keyStr: string = typeof keyItem === "object" && keyItem !== null && "key" in keyItem 
              ? String(keyItem.key) 
              : String(keyItem);

            const lowerKey = keyStr.toLowerCase();
            
            // 🟢 文字から直接スタイルを計算
            const fingerStyle = getFingerStyle(keyStr);
            
            // 各種状態の判定
            const isTarget = highlightTarget && targetKey && lowerKey === targetKey.toLowerCase();
            const isHome = homeKey && lowerKey === homeKey.toLowerCase();
            const isSpecificHomeKey = homeKeys.includes(lowerKey);

            let bg = fingerStyle.bg;
            let text = fingerStyle.text;
            let border = fingerStyle.border;

            if (isTarget) {
              bg = "#3b82f6";     // 打つべきターゲットキーは鮮やかな青
              text = "#ffffff";
              border = "#2563eb";
            }

            const isSpace = keyStr === " " || lowerKey === "space";
            const width = isSpace ? "256px" : "40px";

            return (
              <div
                key={keyStr}
                style={{
                  width: width,
                  height: "40px",
                  backgroundColor: bg,
                  color: text,
                  borderColor: border,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  boxSizing: "border-box",
                  boxShadow: isTarget ? "0 10px 15px -3px rgba(59, 130, 246, 0.3)" : "none",
                  transform: isTarget ? "scale(1.1)" : "scale(1)",
                  zIndex: isTarget ? 10 : 1,
                  borderBottomWidth: isHome ? "4px" : "1px",
                  borderBottomColor: isHome ? "#4b5563" : border,
                  transition: "all 100ms ease",
                }}
              >
                {isSpace ? (
                  "Space"
                ) : (
                  <span 
                    style={{ 
                      color: isSpecificHomeKey ? "#dc2626" : "inherit",
                      fontWeight: isSpecificHomeKey ? 900 : "inherit",
                      fontSize: isSpecificHomeKey ? "16px" : "inherit"
                    }}
                  >
                    {keyStr}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}