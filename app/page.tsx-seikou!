"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // ログイン状態を取得
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // 認証状態の変更をリアルタイム監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Checking Auth...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">ログイン成功！</h1>
        <p>User Email: {user.email}</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">ログイン テスト</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-3 w-64">
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          required
          className="p-2 border rounded"
        />
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          required
          className="p-2 border rounded"
        />
        {authError && <p className="text-red-500 text-sm">{authError}</p>}
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          ログイン
        </button>
      </form>
    </div>
  );
}