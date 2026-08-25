"use client";

import { BLIND_STAGES, Level } from "@/lib/typing-data";

interface BlindLevelSelectorProps {
  highestBlindLevelId: string;
  onSelectLevel: (level: Level) => void;
}

export function BlindLevelSelector({
  highestBlindLevelId,
  onSelectLevel,
}: BlindLevelSelectorProps) {
  // BLIND_STAGES 内での到達度インデックス（順番）を取得
  const highestIndex = BLIND_STAGES.findIndex((s) => s.id === highestBlindLevelId);
  const maxUnlockedIndex = highestIndex !== -1 ? highestIndex : 0;

  // ステージごとにグループ化
  const stagesGrouped = BLIND_STAGES.reduce<Record<number, Level[]>>((acc, level) => {
    if (!acc[level.stage]) acc[level.stage] = [];
    acc[level.stage].push(level);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-4xl flex flex-col gap-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          ブラインドタッチ練習 (交互モード)
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          通常練習とブラインド練習が交互に進みます。全クリアを目指しましょう！
        </p>
      </div>

      {Object.entries(stagesGrouped).map(([stageNum, levels]) => (
        <div key={stageNum} className="flex flex-col gap-4">
          <div className="flex justify-between items-baseline border-b pb-2">
            <h3 className="text-lg font-extrabold text-indigo-600">
              Stage {stageNum}
            </h3>
            <span className="text-xs text-gray-400 font-medium">
              Threshold: {levels[0].threshold}% accuracy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {levels.map((level) => {
              // 💡 配列内での順番（インデックス）で解放判定を行う
              const levelIndex = BLIND_STAGES.findIndex((s) => s.id === level.id);
              const isUnlocked = levelIndex <= maxUnlockedIndex;

              return (
                <button
                  key={level.id}
                  disabled={!isUnlocked}
                  onClick={() => onSelectLevel(level)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-32 relative overflow-hidden ${
                    isUnlocked
                      ? level.isBlind
                        ? "bg-purple-50/50 border-purple-200 hover:border-purple-500 hover:shadow-md cursor-pointer"
                        : "bg-white border-gray-200 hover:border-indigo-500 hover:shadow-md cursor-pointer"
                      : "bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Step {level.step}
                      </span>
                      {level.isBlind && (
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                          🙈 Blind
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1">
                      {level.title}
                    </h4>
                  </div>

                  <div className="text-[10px] font-bold tracking-wider">
                    {isUnlocked ? (
                      <span className="text-green-600">AVAILABLE</span>
                    ) : (
                      <span className="text-gray-400">LOCKED 🔒</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
