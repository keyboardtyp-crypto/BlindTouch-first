"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { FINGER_STAGES, Level } from "@/lib/typing-data";
import { BlindTypingGame } from "@/components/BlindTypingGame";
import type { User } from "@supabase/supabase-js";

export default function FingerPracticePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [highestLevelId, setHighestLevelId] = useState("f-1-1");
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [gameState, setGameState] = useState<"selecting" | "playing" | "result">("selecting");
  const [lastAccuracy, setLastAccuracy] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: currentUser } }) => {
      setUser(currentUser);
      if (currentUser) {
        const { data } = await supabase
          .from("user_progress_finger")
          .select("highest_level_id")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        if (data?.highest_level_id) {
          setHighestLevelId(data.highest_level_id);
        }
      }
      setLoading(false);
    });
  }, []);

  const handleGameFinish = async (accuracy: number, isSuccess: boolean) => {
    if (!selectedLevel || !user) return;
    setLastAccuracy(accuracy);
    setGameState("result");

    // 成績履歴の保存
    await supabase.from("typing_results").insert({
      user_id: user.id,
      level_id: selectedLevel.id,
      accuracy: Math.round(accuracy),
      is_success: isSuccess,
      created_at: new Date().toISOString(),
    });

    // 進捗更新
    if (isSuccess) {
      const currentIdx = FINGER_STAGES.findIndex((s: Level) => s.id === selectedLevel.id);
      if (currentIdx !== -1 && currentIdx < FINGER_STAGES.length - 1) {
        const nextLevelId = FINGER_STAGES[currentIdx + 1].id;
        const highestIdx = FINGER_STAGES.findIndex((s: Level) => s.id === highestLevelId);

        if (currentIdx + 1 > highestIdx) {
          setHighestLevelId(nextLevelId);
          await supabase.from("user_progress_finger").upsert(
            { user_id: user.id, highest_level_id: nextLevelId, updated_at: new Date().toISOString() },
            { onConflict: "user_id" }
          );
        }
      }
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Loading...</div>;

  const highestIdx = FINGER_STAGES.findIndex((s: Level) => s.id === highestLevelId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-emerald-600">👈 各指強化モード</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <Link href="/" className="px-4 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded-xl">
          🏠 トップへ戻る
        </Link>
      </header>

      <main className="w-full max-w-4xl">
        {gameState === "selecting" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FINGER_STAGES.map((stage: Level, idx: number) => {
              const isUnlocked = idx <= (highestIdx === -1 ? 0 : highestIdx);
              return (
                <button
                  key={stage.id}
                  disabled={!isUnlocked}
                  onClick={() => {
                    setSelectedLevel(stage);
                    setGameState("playing");
                  }}
                  className={`p-5 rounded-2xl text-left border transition-all ${
                    isUnlocked
                      ? "bg-white border-emerald-200 shadow-sm hover:border-emerald-500"
                      : "bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <p className="text-xs font-bold text-emerald-600 mb-1">Step {idx + 1}</p>
                  <h3 className="font-bold text-gray-800">{stage.title}</h3>
                </button>
              );
            })}
          </div>
        )}

        {gameState === "playing" && selectedLevel && (
          <BlindTypingGame
            level={selectedLevel}
            onFinish={handleGameFinish}
            onCancel={() => setGameState("selecting")}
          />
        )}

        {gameState === "result" && (
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Result</h2>
            <p className="text-5xl font-black text-emerald-500 mb-6">{Math.round(lastAccuracy)}%</p>
            <button
              onClick={() => setGameState("selecting")}
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl"
            >
              ステージ一覧へ戻る
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
