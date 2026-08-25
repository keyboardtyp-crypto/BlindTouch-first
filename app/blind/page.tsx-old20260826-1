"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BLIND_STAGES, Level } from "@/lib/typing-data";
import { BlindLevelSelector } from "@/components/BlindLevelSelector";
import { TypingGame } from "@/components/TypingGame";
import { BlindTypingGame } from "@/components/BlindTypingGame";
import type { User } from "@supabase/supabase-js";

const getJSTDateString = () => {
  const now = new Date();
  const jstOffset = 9 * 60 * 60 * 1000;
  const jstDate = new Date(now.getTime() + jstOffset);
  return jstDate.toISOString();
};

export default function BlindPracticePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [highestLevelId, setHighestLevelId] = useState("b-1-1");
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [gameState, setGameState] = useState<"selecting" | "playing" | "result">("selecting");

  const [lastResult, setLastResult] = useState<{
    accuracy: number;
    isSuccess: boolean;
    nextLevelId?: string | null;
  } | null>(null);

  const supabase = createClient();

  const loadUserProgress = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_progress_blind")
        .select("highest_level_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("❌ 進捗取得エラー:", error.message);
        return;
      }

      if (data && data.highest_level_id) {
        // b- がついていない古いデータへの互換性処理
        const validId = data.highest_level_id.startsWith("b-")
          ? data.highest_level_id
          : `b-${data.highest_level_id}`;
        setHighestLevelId(validId);
      } else {
        setHighestLevelId("b-1-1");
      }
    } catch (e) {
      console.error("進捗のロードエラー:", e);
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: currentUser } }) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserProgress(currentUser.id);
      }
      setLoading(false);
    });
  }, []);

  const handleLevelSelect = (level: Level) => {
    const targetLevel = BLIND_STAGES.find((s) => s.id === level.id) || level;
    setSelectedLevel(targetLevel);
    setGameState("playing");
  };

  const handleGameFinish = async (accuracy: number, isSuccess: boolean) => {
    const currentLevel = selectedLevel;
    if (!currentLevel || !user) return;

    let nextLevelId: string | null = null;
    const currentIndex = BLIND_STAGES.findIndex((s) => s.id === currentLevel.id);

    if (isSuccess && currentIndex !== -1 && currentIndex < BLIND_STAGES.length - 1) {
      nextLevelId = BLIND_STAGES[currentIndex + 1].id;
    }

    setLastResult({ accuracy, isSuccess, nextLevelId });
    setGameState("result");

    const jstNow = getJSTDateString();

    // 💡 1. 練習履歴（typing_results）に保存
    const { error: resultError } = await supabase.from("typing_results").insert({
      user_id: user.id,
      level_id: currentLevel.id,
      accuracy: Math.round(accuracy),
      is_success: isSuccess,
      created_at: jstNow,
    });

    if (resultError) {
      console.error("❌ 履歴保存エラー:", resultError.message);
    }

    // 💡 2. 進捗（user_progress_blind）の更新
    if (isSuccess && nextLevelId) {
      const currentHighestIdx = BLIND_STAGES.findIndex((s) => s.id === highestLevelId);
      const nextIdx = BLIND_STAGES.findIndex((s) => s.id === nextLevelId);

      if (nextIdx > currentHighestIdx) {
        setHighestLevelId(nextLevelId);

        await supabase.from("user_progress_blind").upsert(
          {
            user_id: user.id,
            highest_level_id: nextLevelId,
            updated_at: jstNow,
          },
          { onConflict: "user_id" }
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-medium text-gray-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <header className="w-full max-w-4xl flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Blind Touch (交互モード)
          </h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        <div className="flex gap-3 items-center">
          <Link
            href="/"
            className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            🏠 通常モードへ戻る
          </Link>
        </div>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center">
        {gameState === "selecting" && (
          <BlindLevelSelector
            highestBlindLevelId={highestLevelId}
            onSelectLevel={handleLevelSelect}
          />
        )}

        {gameState === "playing" && selectedLevel && (
          selectedLevel.isBlind ? (
            <BlindTypingGame
              key={selectedLevel.id}
              level={selectedLevel}
              onFinish={handleGameFinish}
              onCancel={() => setGameState("selecting")}
            />
          ) : (
            <TypingGame
              key={selectedLevel.id}
              level={selectedLevel}
              onFinish={handleGameFinish}
              onCancel={() => setGameState("selecting")}
            />
          )
        )}

        {gameState === "result" && lastResult && selectedLevel && (
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Result</h2>
            <p className="text-gray-500 mb-8">{selectedLevel.title}</p>

            <div className={`text-6xl font-black mb-4 ${lastResult.isSuccess ? 'text-green-500' : 'text-red-500'}`}>
              {Math.round(lastResult.accuracy)}%
            </div>

            <div className="flex flex-col gap-3">
              {lastResult.isSuccess && lastResult.nextLevelId ? (
                <button
                  onClick={() => {
                    const nextLevel = BLIND_STAGES.find((s) => s.id === lastResult.nextLevelId);
                    if (nextLevel) {
                      setSelectedLevel(nextLevel);
                      setGameState("playing");
                    }
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
                >
                  Next Step 🚀
                </button>
              ) : (
                <button
                  onClick={() => setGameState("playing")}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
                >
                  Try Again
                </button>
              )}

              <button
                onClick={() => setGameState("selecting")}
                className="w-full bg-white hover:bg-gray-50 text-gray-600 font-bold py-3.5 rounded-2xl border border-gray-200"
              >
                Back to Levels
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}