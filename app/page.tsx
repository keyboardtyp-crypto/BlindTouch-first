"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { login, logout } from "./actions";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // ログイン状態を取得
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // 認証状態の変更を監視
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
    const res = await login(formData);

    if (res?.error) {
      setAuthError(res.error);
      setLoading(false);
    } else {
      // 成功したら画面をリロードして状態更新
      window.location.reload();
    }
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
          onClick={async () => {
            await logout();
            window.location.reload();
          }}
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
          placeholder="Email"
          required
          className="p-2 border rounded"
        />
        <input
          name="password"
          type="password"
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
