"use client";

import { STAGES, Level } from "../lib/typing-data";

interface LevelSelectorProps {
  highestLevelId: string;
  onSelectLevel: (level: Level) => void;
}

export function LevelSelector({ highestLevelId, onSelectLevel }: LevelSelectorProps) {
  const isUnlocked = (levelId: string) => {
    const [lStage, lStep] = levelId.split("-").map(Number);
    const [hStage, hStep] = highestLevelId.split("-").map(Number);

    if (lStage < hStage) return true;
    if (lStage === hStage && lStep <= hStep) return true;
    return false;
  };

  const stages = [1, 2, 3, 4];

  return (
    <div className="w-full max-w-4xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Practice Progression</h2>
      
      <div className="space-y-12">
        {stages.map((stageNum) => (
          <div key={stageNum} className="space-y-4">
            <h3 className="text-lg font-bold text-blue-600 border-b pb-2">
              Stage {stageNum}
              {stageNum === 1 && <span className="text-sm font-normal text-gray-500 ml-4">Threshold: 90% accuracy</span>}
              {stageNum === 2 && <span className="text-sm font-normal text-gray-500 ml-4">Threshold: 85% accuracy</span>}
              {stageNum === 3 && <span className="text-sm font-normal text-gray-500 ml-4">Threshold: 80% accuracy</span>}
              {stageNum === 4 && <span className="text-sm font-normal text-gray-500 ml-4">Threshold: 80% accuracy (No Highlights)</span>}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {STAGES.filter((l) => l.stage === stageNum).map((level) => {
                const unlocked = isUnlocked(level.id);
                return (
                  <button
                    key={level.id}
                    onClick={() => onSelectLevel(level)}
                    className={`
                      p-4 rounded-xl border-2 transition-all text-left flex flex-col gap-1
                      ${unlocked 
                        ? "border-blue-100 bg-white hover:border-blue-500 hover:shadow-md cursor-pointer" 
                        : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"}
                    `}
                  >
                    <span className="text-xs font-bold text-gray-400">Step {level.step}</span>
                    <span className="font-bold text-gray-700 leading-tight">{level.title}</span>
                    {unlocked ? (
                      <span className="text-[10px] font-bold text-blue-500 uppercase mt-2">Available</span>
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
