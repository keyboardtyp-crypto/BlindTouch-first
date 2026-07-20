"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
//port { login, signup, logout, saveTypingResult, getUserProgress } from "./actions";
import { login, signup, logout, saveTypingResult, getUserProgress } from "@/app/actions";
import { STAGES, Level } from "@/lib/typing-data";
import { LevelSelector } from "@/components/LevelSelector";
import { TypingGame } from "@/components/TypingGame";
import type { User } from "@supabase/supabase-js";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [highestLevelId, setHighestLevelId] = useState("1-1");
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [gameState, setGameState] = useState<"selecting" | "playing" | "result">("selecting");
  const [lastResult, setLastResult] = useState<{ accuracy: number; isSuccess: boolean } | null>(null);

  const supabase = createClient();
/*
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (currentUser) {
          setUser(currentUser);
          const progress = await getUserProgress();
          if (progress) setHighestLevelId(progress);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };
    init();

    // 認証状態の変化をリアルタイム検知
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const progress = await getUserProgress();
          if (progress) setHighestLevelId(progress);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);
*/

useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (currentUser && isMounted) {
          setUser(currentUser);
          
          // 💡 await せずにバックグラウンドで読み込むことで Loading フリーズを回避
          getUserProgress()
            .then((progress) => {
              if (progress && isMounted) setHighestLevelId(progress);
            })
            .catch((err) => console.error("Progress load error:", err));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        // 💡 認証チェックが終わったら瞬時にローディングを解除
        if (isMounted) setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          setUser(session.user);
          getUserProgress()
            .then((progress) => {
              if (progress && isMounted) setHighestLevelId(progress);
            })
            .catch((err) => console.error("Progress load error:", err));
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);


  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const res = isSignUp ? await signup(formData) : await login(formData);
    if (res?.error) {
      setAuthError(res.error);
      setLoading(false);
    }
  };

  const handleLevelSelect = (level: Level) => {
    const [lStage, lStep] = level.id.split("-").map(Number);
    const [hStage, hStep] = highestLevelId.split("-").map(Number);

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
      
      const res = await saveTypingResult(selectedLevel.id, accuracy, isSuccess, nextLevelId);
      if (res.success && isSuccess && nextLevelId) {
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
          onClick={async () => { await logout(); window.location.reload(); }}
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
