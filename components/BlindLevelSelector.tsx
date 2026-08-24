"use client";

import { STAGES, Level } from "../lib/typing-data";

// -------------------------------------------------------------
// 【変更箇所1】Propsの型定義（ブラインド用の最高レベルIDを受け取る）
// -------------------------------------------------------------
interface LevelSelectorProps {
  // 旧: highestLevelId: string;
  highestBlindLevelId: string; // 新: user_progress_blind 用の進捗IDを受け取る
  onSelectLevel: (level: Level) => void;
}

// 旧: export function LevelSelector({ highestLevelId, onSelectLevel }: LevelSelectorProps) {
export function BlindLevelSelector({ highestBlindLevelId, onSelectLevel }: LevelSelectorProps) {
  
  // 💡 解放判定ロジック
  const isUnlocked = (levelId: string) => {
    const [lStage, lStep] = levelId.split("-").map(Number);
    
    // 旧: const [hStage, hStep] = highestLevelId.split("-").map(Number);
    // 新: ブラインド練習用の進捗IDを使用
    const [hStage, hStep] = (highestBlindLevelId || "1-1").split("-").map(Number);

    if (lStage < hStage) return true;
    if (lStage === hStage && lStep <= hStep) return true;
    return false;
  };

  const stages = [1, 2, 3, 4];

  return (
    <div className="w-full max-w-4xl p-6">
      {/* -------------------------------------------------------------
          【変更箇所2】タイトルをブラインドモード仕様に変更
         ------------------------------------------------------------- */}
      {/* 旧: <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Practice Progression</h2> */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">ブラインドタッチ練習 (キーボード非表示)</h2>
        <p className="text-sm text-gray-500 mt-1">
          間違えた時だけキーボードが表示されます。全問正解を目指しましょう！
        </p>
      </div>
      
      <div className="space-y-12">
        {stages.map((stageNum) => (
          <div key={stageNum} className="space-y-4">
            <h3 className="text-lg font-bold text-indigo-600 border-b pb-2">
              Stage {stageNum} (Blind)
              {stageNum === 1 && <span className="text-sm font-normal text-gray-500 ml-4">Threshold: 90% accuracy</span>}
              {stageNum === 2 && <span className="text-sm font-normal text-gray-500 ml-4">Threshold: 85% accuracy</span>}
              {stageNum === 3 && <span className="text-sm font-normal text-gray-500 ml-4">Threshold: 80% accuracy</span>}
              {stageNum === 4 && <span className="text-sm font-normal text-gray-500 ml-4">Threshold: 80% accuracy</span>}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {STAGES.filter((l) => l.stage === stageNum).map((level) => {
                const unlocked = isUnlocked(level.id);
                return (
                  <button
                    key={level.id}
                    onClick={() => unlocked && onSelectLevel(level)} // ロック時はクリックをスキップ
                    className={`
                      p-4 rounded-xl border-2 transition-all text-left flex flex-col gap-1
                      ${unlocked 
                        // 旧: ? "border-blue-100 bg-white hover:border-blue-500 hover:shadow-md cursor-pointer" 
                        ? "border-indigo-100 bg-white hover:border-indigo-500 hover:shadow-md cursor-pointer" // 新: カラーアクセントを紫系に変更
                        : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"}
                    `}
                  >
                    <span className="text-xs font-bold text-gray-400">Step {level.step}</span>
                    <span className="font-bold text-gray-700 leading-tight">{level.title}</span>
                    {unlocked ? (
                      // 旧: <span className="text-[10px] font-bold text-blue-500 uppercase mt-2">Available</span>
                      <span className="text-[10px] font-bold text-indigo-500 uppercase mt-2">Available</span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400 uppercase mt-2">Locked</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
