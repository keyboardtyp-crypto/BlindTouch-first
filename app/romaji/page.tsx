import React, { useState } from "react";
import { ROMAJI_STAGES } from "@/lib/typing-data";

export default function RomajiTypingGame() {
  const [currentStage, setCurrentStage] = useState(ROMAJI_STAGES[0]);
  const [wordIndex, setWordIndex] = useState(0);
  const [inputRomaji, setInputRomaji] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false); // ミスフラグ
  const [unlockedBuildings, setUnlockedBuildings] = useState<string[]>([]);

  const targetWord = currentStage.words[wordIndex];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key.toLowerCase();
    const expectedKey = targetWord.romaji[inputRomaji.length];

    if (key === expectedKey) {
      // 正解入力時: キーボードを隠す
      setShowKeyboard(false);
      const nextInput = inputRomaji + key;
      setInputRomaji(nextInput);

      if (nextInput === targetWord.romaji) {
        // 単語クリア処理
        if (wordIndex + 1 < currentStage.words.length) {
          setWordIndex(wordIndex + 1);
          setInputRomaji("");
        } else {
          // ステージクリア：街に新しい建物を追加
          setUnlockedBuildings((prev) => [...prev, currentStage.rewardBuilding.icon]);
          alert(`ステージクリア！街に「${currentStage.rewardBuilding.name}」が建設されました！`);
        }
      }
    } else {
      // 不正解入力時: 誤入力が発生したためキーボードを表示
      setShowKeyboard(true);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* 1. 街づくり（または絵の完成度）表示エリア */}
      <div className="p-4 bg-blue-50 dark:bg-slate-800 rounded-xl border text-center">
        <h2 className="text-xl font-bold mb-2">あなたの作った街</h2>
        <div className="flex justify-center gap-4 text-4xl h-16 items-center">
          {unlockedBuildings.length === 0 ? (
            <span className="text-sm text-gray-400">まだ建物がありません。タイピングをクリアして街を発展させよう！</span>
          ) : (
            unlockedBuildings.map((building, i) => <span key={i}>{building}</span>)
          )}
        </div>
      </div>

      {/* 2. ローマ字お題表示 */}
      <div className="text-center space-y-2 py-8 bg-white dark:bg-slate-900 rounded-xl shadow-md">
        <p className="text-4xl font-bold">{targetWord.kana}</p>
        <p className="text-2xl font-mono text-gray-500 tracking-widest">
          <span className="text-green-500">{inputRomaji}</span>
          {targetWord.romaji.slice(inputRomaji.length)}
        </p>
      </div>

      {/* 3. ミス時のみ動的に現れるキーボードUI */}
      {showKeyboard && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-center animate-bounce">
          <p className="text-red-600 font-bold mb-2">間違えました！押すキーを確認してください</p>
          <div className="inline-block p-3 bg-red-500 text-white font-bold text-xl rounded shadow">
            次に押すキー: {targetWord.romaji[inputRomaji.length]?.toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
}
