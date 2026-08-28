"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ROMAJI_STAGES, RomajiLevel } from "@/lib/typing-data";
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

  // ゲーム状態管理
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [inputRomaji, setInputRomaji] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [unlockedBuildings, setUnlockedBuildings] = useState<string[]>([]);

  // ポイント管理
  const [romajiPoints, setRomajiPoints] = useState(0);

  const supabase = createClient();
  const currentStage: RomajiLevel = ROMAJI_STAGES[currentStageIndex];
  const targetWord = currentStage?.words?.[wordIndex];

  // 1. Supabaseから進捗とアンロックされた建物をロード
  const loadUserProgress = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_romaji_progress")
        .select("unlocked_buildings")
        .eq("user_id", userId);

      if (error) {
        console.error("❌ ローマ字進捗取得エラー:", error.message);
        return;
      }

      if (data && data.length > 0) {
        const buildings = data.flatMap((row) => row.unlocked_buildings || []);
        // 重複を除去してセット
        setUnlockedBuildings(Array.from(new Set(buildings)));
      }
    } catch (e) {
      console.error("進捗のロードエラー:", e);
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

  // キー入力イベント
  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (!targetWord) return;

    const key = e.key.toLowerCase();
    const expectedKey = targetWord.romaji[inputRomaji.length];

    if (key === expectedKey) {
      setShowKeyboard(false);
      const nextInput = inputRomaji + key;
      setInputRomaji(nextInput);

      // 単語1つを入力完了
      if (nextInput === targetWord.romaji) {
        if (wordIndex + 1 < currentStage.words.length) {
          setWordIndex(wordIndex + 1);
          setInputRomaji("");
        } else {
          // 🎉 ステージクリア処理
          playCelebrationSound();

          // ポイント加算
          const newPoints = romajiPoints + 50;
          setRomajiPoints(newPoints);
          localStorage.setItem("romaji_practice_points", newPoints.toString());

          // 街の建物追加
          const newBuildingIcon = currentStage.rewardBuilding.icon;
          const updatedBuildings = Array.from(new Set([...unlockedBuildings, newBuildingIcon]));
          setUnlockedBuildings(updatedBuildings);

          // Supabaseへ進捗更新
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

          alert(`ステージクリア！街に「${currentStage.rewardBuilding.name}」が建設されました！`);

          // 次のステージへ移行（あれば）
          if (currentStageIndex + 1 < ROMAJI_STAGES.length) {
            setCurrentStageIndex(currentStageIndex + 1);
            setWordIndex(0);
            setInputRomaji("");
          }
        }
      }
    } else {
      // ミス発生時のみキーボード表示
      setShowKeyboard(true);
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
    <div
      className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 relative outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
            ローマ字・街づくりモード 🏘️
          </h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        <div className="flex gap-4 items-center">
          <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-1 shadow-sm">
            <span>⭐</span>
            <span>{romajiPoints} pt</span>
          </div>

          <Link
            href="/"
            className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            🏠 ホームへ戻る
          </Link>
        </div>
      </header>

      <main className="w-full max-w-4xl space-y-6">
        {/* 1. 街づくりエリア */}
        <div className="p-6 bg-white rounded-3xl shadow-sm border text-center">
          <h2 className="text-lg font-bold text-gray-700 mb-3">発展させたあなたの街 🏙️</h2>
          <div className="flex justify-center gap-4 text-5xl h-20 items-center bg-emerald-50 rounded-2xl border border-emerald-100 p-2">
            {unlockedBuildings.length === 0 ? (
              <span className="text-sm text-emerald-600 font-medium">
                ステージをクリアして新しい建物を建てよう！
              </span>
            ) : (
              unlockedBuildings.map((icon, i) => <span key={i} className="animate-pop">{icon}</span>)
            )}
          </div>
        </div>

        {/* 2. タイピング問題表示 */}
        <div className="text-center space-y-4 py-12 bg-white rounded-3xl shadow-md border">
          <p className="text-sm font-bold text-emerald-600 tracking-wider">
            STAGE {currentStage.stage}-{currentStage.step}: {currentStage.title}
          </p>
          <p className="text-5xl font-black text-gray-800">{targetWord?.kana}</p>
          <p className="text-3xl font-mono text-gray-400 tracking-widest">
            <span className="text-emerald-500 font-bold">{inputRomaji}</span>
            {targetWord?.romaji.slice(inputRomaji.length)}
          </p>
        </div>

        {/* 3. ミス発生時のみ表示されるアシストUI */}
        {showKeyboard && targetWord && (
          <div className="p-5 bg-red-50 border-2 border-red-300 rounded-2xl text-center animate-bounce shadow-md">
            <p className="text-red-600 font-black mb-1">おっと！キーを確認してみよう</p>
            <p className="text-gray-600 text-sm mb-3">次に打つローマ字はこちら:</p>
            <div className="inline-block px-6 py-3 bg-red-500 text-white font-black text-3xl rounded-xl shadow-lg">
              {targetWord.romaji[inputRomaji.length]?.toUpperCase()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
