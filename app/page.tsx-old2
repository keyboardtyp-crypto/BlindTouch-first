"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import { STAGES, Level } from "../lib/typing-data";
import { LevelSelector } from "../components/LevelSelector";
import { TypingGame } from "../components/TypingGame";
import type { User } from "@supabase/supabase-js";

// ローカル動作をシミュレートするためのダミーユーザー情報
const DUMMY_USER = {
  id: "local-user-123",
  email: "local-mode@example.com",
} as unknown as User;

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [highestLevelId, setHighestLevelId] = useState("1-1");
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [gameState, setGameState] = useState<"selecting" | "playing" | "result">("selecting");
  const [lastResult, setLastResult] = useState<{ accuracy: number; isSuccess: boolean } | null>(null);

  useEffect(() => {
    // 自動でダミーユーザーをログイン状態にする
    setUser(DUMMY_USER);

    // ローカルストレージから進行状況を読み込む
    const savedProgress = localStorage.getItem("local_typing_progress");
    if (savedProgress) {
      setHighestLevelId(savedProgress);
    } else {
      setHighestLevelId("1-1");
    }
    setLoading(false);
  }, []);

  const handleLevelSelect = (level: Level) => {
    const [lStage, lStep] = level.id.split("-").map(Number);
    const [hStage, hStep] = highestLevelId.split("-").map(Number);

    // クリア済みのレベル、または次に進むべきロック解除レベルのみ選択可能
    if (lStage < hStage || (lStage === hStage && lStep <= hStep)) {
      setSelectedLevel(level);
      setGameState("playing");
    }
  };

  const handleGameFinish = async (accuracy: number, isSuccess: boolean) => {
    setLastResult({ accuracy, isSuccess });
    setGameState("result");

    if (selectedLevel) {
      let nextLevelId: string | null = null;
      if (isSuccess) {
        const currentIndex = STAGES.findIndex(s => s.id === selectedLevel.id);
        if (currentIndex < STAGES.length - 1) {
          nextLevelId = STAGES[currentIndex + 1].id;
        }
      }
      
      // LocalStorageに進捗を直接記録
      if (isSuccess && nextLevelId) {
        const [nStage, nStep] = nextLevelId.split("-").map(Number);
        const [hStage, hStep] = highestLevelId.split("-").map(Number);
        if (nStage > hStage || (nStage === hStage && nStep > hStep)) {
          setHighestLevelId(nextLevelId);
          localStorage.setItem("local_typing_progress", nextLevelId);
        }
      }
    }
  };

  // 進行状況を1-1にリセットする処理
  const handleLocalReset = () => {
    setUser(null);
    localStorage.removeItem("local_typing_progress");
    setHighestLevelId("1-1");
    setTimeout(() => {
      setUser(DUMMY_USER);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-medium text-gray-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-medium text-gray-400">Resetting session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <header className="w-full max-w-4xl flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Blind Touch
          </h1>
          <p className="text-sm text-gray-500">{user.email} (Local Mode)</p>
        </div>
        <button
          onClick={handleLocalReset}
          className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
        >
          Reset Progress
        </button>
      </header>

      <main className="w-full flex flex-col items-center">
        {gameState === "selecting" && (
          <LevelSelector 
            highestLevelId={highestLevelId} 
            onSelectLevel={handleLevelSelect} 
          />
        )}

        {gameState === "playing" && selectedLevel && (
          <TypingGame 
            level={selectedLevel} 
            onFinish={handleGameFinish} 
            onCancel={() => setGameState("selecting")} 
          />
        )}

        {gameState === "result" && lastResult && selectedLevel && (
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Practice Result</h2>
            <p className="text-gray-500 mb-8">{selectedLevel.title}</p>
            
            <div className={`text-6xl font-black mb-4 ${lastResult.isSuccess ? 'text-green-500' : 'text-red-500'}`}>
              {Math.round(lastResult.accuracy)}%
            </div>
            
            <p className="text-lg font-bold mb-10 text-gray-700">
              {lastResult.isSuccess 
                ? "Level Cleared! 🎉" 
                : `Need ${selectedLevel.threshold}% to pass. Keep trying!`}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setGameState("playing")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-200"
              >
                Try Again
              </button>
              <button
                onClick={() => setGameState("selecting")}
                className="w-full bg-white hover:bg-gray-50 text-gray-600 font-bold py-4 rounded-2xl border border-gray-200 transition-all"
              >
                Back to Levels
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 text-center text-gray-400 text-sm">
        Focus on accuracy, speed will come naturally.
      </footer>
    </div>
  );
}