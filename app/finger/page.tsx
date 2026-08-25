"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { FINGER_STAGES, Level } from "@/lib/typing-data";
import { BlindTypingGame } from "@/components/BlindTypingGame";
import type { User } from "@supabase/supabase-js";

// 🔊 ブラウザ標準Web Audio APIでクラッカー/ファンファーレ音を再生する関数
const playCelebrationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;

      const startTime = ctx.currentTime + idx * 0.12;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  } catch (e) {
    console.error("Audio play error:", e);
  }
};

export default function FingerPracticePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [highestLevelId, setHighestLevelId] = useState("f-1-1");
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [gameState, setGameState] = useState<"selecting" | "playing" | "result">("selecting");
  const [lastAccuracy, setLastAccuracy] = useState(0);

  // 🪙 ポイント管理
  const [points, setPoints] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // ローカルストレージから保存されたポイントを復元
    const savedPoints = localStorage.getItem("finger_practice_points");
    if (savedPoints) {
      setPoints(parseInt(savedPoints, 10));
    }

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

    // 💡 ポイント加算処理（クリア: 50pt / 練習プレイ: 3pt）
    const addedPoints = isSuccess ? 50 : 3;
    const newPoints = points + addedPoints;
    setPoints(newPoints);
    localStorage.setItem("finger_practice_points", newPoints.toString());

    // 💡 300ポイント達成時のクラッカー・サウンド演出
    if (newPoints >= 300 && points < 300) {
      setShowCelebration(true);
      playCelebrationSound();
    } else if (isSuccess) {
      playCelebrationSound();
    }

    // DBへの成績履歴保存
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 relative overflow-hidden">
      {/* 🎉 300ポイント達成のくす玉・クラッカーポップアップ */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-yellow-400 relative">
            <div className="text-6xl mb-4 animate-bounce">🎊 🎊 🎊</div>
            <h2 className="text-2xl font-black text-yellow-600 mb-2">300ポイントたまったよ！</h2>
            <p className="text-gray-600 font-bold mb-6">すごい！まいにちのれんしゅうの成果だね！</p>
            <button
              onClick={() => setShowCelebration(false)}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-black py-4 rounded-2xl shadow-lg transition-transform active:scale-95 text-lg"
            >
              やったー！ 🚀
            </button>
          </div>
        </div>
      )}

      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-emerald-600">👈 各指強化モード</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* 🪙 ポイント表示バッジ */}
          <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-1 shadow-sm">
            <span>⭐</span>
            <span>{points} pt</span>
          </div>

          <Link href="/" className="px-4 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded-xl">
            🏠 トップへ戻る
          </Link>
        </div>
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
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Result</h2>
            <p className="text-5xl font-black text-emerald-500 mb-4">{Math.round(lastAccuracy)}%</p>

            {/* 獲得ポイントの表示 */}
            <div className="bg-amber-50 text-amber-700 rounded-xl p-3 mb-6 text-sm font-bold border border-amber-200">
              +{lastAccuracy >= (selectedLevel?.threshold || 90) ? 50 : 3} ポイント ゲット！
            </div>

            <button
              onClick={() => setGameState("selecting")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md"
            >
              ステージ一覧へ戻る
            </button>
          </div>
        )}
      </main>
    </div>
  );
}