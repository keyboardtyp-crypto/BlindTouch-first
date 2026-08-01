"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { STAGES, Level } from "@/lib/typing-data";
import { LevelSelector } from "@/components/LevelSelector";
import { TypingGame } from "@/components/TypingGame";
import type { User } from "@supabase/supabase-js";

// 💡 日本時間（JST: UTC+9時間）の ISO 文字列を生成するヘルパー関数
const getJSTDateString = () => {
  const now = new Date();
  const jstOffset = 9 * 60 * 60 * 1000; // 9時間をミリ秒換算
  const jstDate = new Date(now.getTime() + jstOffset);
  return jstDate.toISOString();
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [highestLevelId, setHighestLevelId] = useState("1-1");
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [gameState, setGameState] = useState<"selecting" | "playing" | "result">("selecting");
  
  const [lastResult, setLastResult] = useState<{
    accuracy: number;
    isSuccess: boolean;
    nextLevelId?: string | null;
  } | null>(null);

  const supabase = createClient();

  // 💡 クライアント側で直接 DB から進捗を取得する安全な関数
  const loadUserProgress = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_progress")
        .select("highest_level_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("❌ 進捗取得エラー:", error.message);
        return;
      }

      if (data && data.highest_level_id) {
        console.log("🎉 復元された最高到達レベル:", data.highest_level_id);
        setHighestLevelId(data.highest_level_id);
      } else {
        setHighestLevelId("1-1");
      }
    } catch (e) {
      console.error("進捗のロード中に例外が発生しました:", e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // 1. 初回のセッション＆進捗確認
    supabase.auth.getUser().then(async ({ data: { user: currentUser } }) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserProgress(currentUser.id);
      }
      setLoading(false);
      clearTimeout(timer);
    }).catch(() => {
      setLoading(false);
      clearTimeout(timer);
    });

    // 2. 認証状態の変化を監視（ログイン・ログアウト時に即座に反映）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await loadUserProgress(currentUser.id);
        } else {
          setHighestLevelId("1-1"); // ログアウト時は初期化
        }
        setLoading(false);
        clearTimeout(timer);
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // 💡 ログイン・新規登録処理
  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
    } else if (data.user) {
      // ログイン成功時に確実に進捗をロード
      await loadUserProgress(data.user.id);
      setLoading(false);
    }
  };

  // 💡 ログアウト処理
  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setHighestLevelId("1-1");
  };

  const handleLevelSelect = (level: Level) => {
    const [lStage, lStep] = level.id.split("-").map(Number);
    const [hStage, hStep] = highestLevelId.split("-").map(Number);

    if (lStage < hStage || (lStage === hStage && lStep <= hStep)) {
      setSelectedLevel(level);
      setGameState("playing");
    }
  };

  // 💡 ゲーム終了時のデータ保存処理（日本時間付き）
  const handleGameFinish = async (accuracy: number, isSuccess: boolean) => {
    const currentLevel = selectedLevel;

    if (!currentLevel || !user) {
      console.error("❌ selectedLevel か user が null のため保存できません");
      return;
    }

    let nextLevelId: string | null = null;
    if (isSuccess) {
      const currentIndex = STAGES.findIndex(s => s.id === currentLevel.id);
      if (currentIndex !== -1 && currentIndex < STAGES.length - 1) {
        nextLevelId = STAGES[currentIndex + 1].id;
      }
    }

    setLastResult({ accuracy, isSuccess, nextLevelId });
    setGameState("result");

    const targetLevel = (isSuccess && nextLevelId) ? nextLevelId : currentLevel.id;
    const jstNow = getJSTDateString(); // 💡 日本時間のタイムスタンプ

    // 1️⃣ 最高到達レベルの更新（user_progress）
    const { error: progressError } = await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: user.id,
          highest_level_id: targetLevel,
          updated_at: jstNow,
        },
        { onConflict: "user_id" }
      );

    if (progressError) {
      console.error("❌ 進捗更新エラー:", progressError.message);
    }

    // 2️⃣ 📊 プレイ履歴の保存（typing_results）
    const { error: historyError } = await supabase
      .from("typing_results")
      .insert({
        user_id: user.id,
        level_id: currentLevel.id,
        accuracy: Math.round(accuracy),
        is_success: isSuccess,
        created_at: jstNow, // 日本時間で保存
      });

    if (historyError) {
      console.error("❌ 履歴保存エラー:", historyError.message);
    } else {
      console.log("🎉 日本時間での保存＆進捗更新に成功！");
      if (isSuccess && nextLevelId) {
        const [nStage, nStep] = nextLevelId.split("-").map(Number);
        const [hStage, hStep] = highestLevelId.split("-").map(Number);

        if (nStage > hStage || (nStage === hStage && nStep > hStep)) {
          setHighestLevelId(nextLevelId);
        }
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Blind Touch
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isSignUp ? "新しいアカウントを作成" : "アカウントにログイン"}
            </p>
          </div>
          
          <form className="space-y-4" onSubmit={handleAuthSubmit}>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email address</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Password</label>
              <input
                name="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="••••••••"
              />
            </div>

            {authError && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100 text-center">
                {authError}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-lg shadow-indigo-100"
              >
                {isSignUp ? "新規登録" : "ログイン"}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setAuthError(null); }}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isSignUp ? "すでにアカウントをお持ちですか？ ログイン" : "アカウントをお持ちでないですか？ 新規登録"}
            </button>
          </div>
        </div>
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
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center">
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
              {lastResult.isSuccess && lastResult.nextLevelId ? (
                <button
                  onClick={() => {
                    const nextLevel = STAGES.find(s => s.id === lastResult.nextLevelId);
                    if (nextLevel) {
                      setSelectedLevel(nextLevel);
                      setGameState("playing");
                    }
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-200"
                >
                  Next Level (次のステージへ) 🚀
                </button>
              ) : (
                <button
                  onClick={() => setGameState("playing")}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-200"
                >
                  Try Again
                </button>
              )}

              <button
                onClick={() => setGameState("selecting")}
                className="w-full bg-white hover:bg-gray-50 text-gray-600 font-bold py-4 rounded-2xl border border-gray-200 transition-all"
              >
                Back to Levels(レベル選択へ)
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
