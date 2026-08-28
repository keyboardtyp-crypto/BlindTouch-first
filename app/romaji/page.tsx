"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ROMAJI_STAGES, RomajiStage } from "@/lib/typing-data";
import { Keyboard } from "@/components/Keyboard";
import type { User } from "@supabase/supabase-js";

const playCelebrationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const notes = [523.25, 659.25, 783.99, 1046.50];
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

const getJSTDateString = () => {
  const now = new Date();
  const jstOffset = 9 * 60 * 60 * 1000;
  const jstDate = new Date(now.getTime() + jstOffset);
  return jstDate.toISOString();
};

export default function RomajiPracticePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [gameState, setGameState] = useState<"waiting" | "playing" | "completed">("waiting");
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [inputRomaji, setInputRomaji] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [unlockedBuildings, setUnlockedBuildings] = useState<string[]>([]);
  const [romajiPoints, setRomajiPoints] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  
  const currentStage: RomajiStage = ROMAJI_STAGES[currentStageIndex];
  const targetWord = currentStage?.words?.[wordIndex];

  useEffect(() => {
    if (!loading && containerRef.current) {
      containerRef.current.focus();
    }
  }, [loading, gameState]);

  const loadUserProgress = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_romaji_progress")
        .select("unlocked_buildings")
        .eq("user_id", userId);

      if (error) {
        console.error("❌ 進捗取得エラー:", error.message);
        return;
      }

      if (data && data.length > 0) {
        const buildings = data.flatMap((row) => row.unlocked_buildings || []);
        setUnlockedBuildings(Array.from(new Set(buildings)));
      }
    } catch (e) {
      console.error("進捗ロードエラー:", e);
    }
  };

  useEffect(() => {
    const savedPoints = localStorage.getItem("romaji_practice_points");
    if (savedPoints) setRomajiPoints(parseInt(savedPoints, 10));

    supabase.auth.getUser().then(async ({ data: { user: currentUser } }) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserProgress(currentUser.id);
      }
      setLoading(false);
    });
  }, []);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (gameState === "waiting") {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        setGameState("playing");
        setInputRomaji("");
        setShowKeyboard(false);
      }
      return;
    }

    if (gameState === "completed" || !targetWord) return;

    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
    }

    const key = e.key.toLowerCase();
    const expectedKey = targetWord.romaji[inputRomaji.length]?.toLowerCase();

    if (key === expectedKey) {
      setShowKeyboard(false);
      const nextInput = inputRomaji + key;
      setInputRomaji(nextInput);

      if (nextInput === targetWord.romaji) {
        if (wordIndex + 1 < currentStage.words.length) {
          setWordIndex(wordIndex + 1);
          setInputRomaji("");
        } else {
          // 🎉 ステージクリア処理
          playCelebrationSound();

          const newPoints = romajiPoints + 50;
          setRomajiPoints(newPoints);
          localStorage.setItem("romaji_practice_points", newPoints.toString());

          // 新しい建物を街に追加
          const newBuildingIcon = currentStage.rewardBuilding.icon;
          const updatedBuildings = [...unlockedBuildings, newBuildingIcon];
          setUnlockedBuildings(updatedBuildings);

          if (user) {
            const jstNow = getJSTDateString();
            await supabase.from("user_romaji_progress").upsert(
              {
                user_id: user.id,
                stage_id: currentStage.id,
                is_cleared: true,
                unlocked_buildings: updatedBuildings,
                updated_at: jstNow,
              },
              { onConflict: "user_id,stage_id" }
            );
          }

          if (currentStageIndex + 1 < ROMAJI_STAGES.length) {
            alert(`ステージクリア！街に「${currentStage.rewardBuilding.name} (${newBuildingIcon})」が追加されました！`);
            setCurrentStageIndex(currentStageIndex + 1);
            setWordIndex(0);
            setInputRomaji("");
            setGameState("waiting");
          } else {
            alert(`全ステージクリア！素晴らしい街が完成しました！🎉`);
            setGameState("completed");
          }
        }
      }
    } else {
      if (e.key.length === 1) {
        setShowKeyboard(true);
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

  const nextChar = targetWord?.romaji[inputRomaji.length]?.toLowerCase() || null;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gray-50 flex flex-col items-center py-6 px-4 relative outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <header className="w-full max-w-4xl flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
            ローマ字・街づくりモード 🏘️
          </h1>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>

        <div className="flex gap-3 items-center">
          <div className="bg-amber-100 border border-amber-300 text-amber-800 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 shadow-sm">
            <span>⭐</span>
            <span>{romajiPoints} pt</span>
          </div>

          <Link
            href="/"
            className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            🏠 ホームへ戻る
          </Link>
        </div>
      </header>

      <main className="w-full max-w-4xl space-y-4">
        {/* 1. 街づくり表示エリア (絵が横に並んで増えていく) */}
        <div className="p-3 bg-white rounded-2xl shadow-sm border text-center">
          <h2 className="text-xs font-bold text-gray-500 mb-1">発展させたあなたの街 🏙️</h2>
          <div className="flex justify-center flex-wrap gap-3 text-3xl min-h-[48px] items-center bg-emerald-50 rounded-xl border border-emerald-100 p-2">
            {unlockedBuildings.length === 0 ? (
              <span className="text-xs text-emerald-600 font-medium">
                ステージをクリアして絵（建物・乗り物）を増やしていこう！
              </span>
            ) : (
              unlockedBuildings.map((icon, i) => <span key={i} className="animate-pop">{icon}</span>)
            )}
          </div>
        </div>

        {/* 2. 問題表示エリア */}
        <div className="text-center space-y-2 py-6 bg-white rounded-2xl shadow-md border min-h-[160px] flex flex-col justify-center items-center px-4">
          {gameState === "completed" ? (
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-emerald-600">🎉 全ステージ達成！</h2>
              <p className="text-xs text-gray-600 font-bold">すべてのローマ字問題をクリアしました！</p>
              <button
                onClick={() => {
                  setCurrentStageIndex(0);
                  setWordIndex(0);
                  setInputRomaji("");
                  setUnlockedBuildings([]);
                  setGameState("waiting");
                }}
                className="mt-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-md transition-transform active:scale-95"
              >
                最初からもう一度遊ぶ 🔄
              </button>
            </div>
          ) : gameState === "waiting" ? (
            <div className="space-y-2 animate-pulse">
              <p className="text-xs font-bold text-emerald-600 tracking-wider">
                STAGE {currentStage?.stage}-{currentStage?.step}: {currentStage?.title}
              </p>
              <p className="text-2xl font-black text-gray-700">スペースキーを押してスタート！</p>
              <p className="text-xs text-gray-400">⌨️ キーボードの [ Space ] をおしてね</p>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold text-emerald-600 tracking-wider">
                STAGE {currentStage.stage}-{currentStage.step}: {currentStage.title}
              </p>
              <p className="text-4xl font-black text-gray-800">{targetWord?.kana}</p>
              <p className="text-2xl font-mono text-gray-400 tracking-widest break-all max-w-full px-4">
                <span className="text-emerald-500 font-bold">{inputRomaji}</span>
                {targetWord?.romaji.slice(inputRomaji.length)}
              </p>
            </>
          )}
        </div>

        {/* 3. ミス時のキーボードガイド */}
        {gameState === "playing" && showKeyboard && nextChar && (
          <div className="p-3 bg-white border-2 border-red-200 rounded-2xl shadow-lg text-center space-y-2 animate-in fade-in duration-200">
            <p className="text-red-500 font-black text-xs">
              間違えました！青く光っているキーを押してください 💡
            </p>
            <div className="scale-90 origin-top">
              <Keyboard
                targetKey={nextChar}
                highlightTarget={true}
                homeKey={null}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
