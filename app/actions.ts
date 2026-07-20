"use server";

import { createClient } from "@/lib/supabase/server";

// 💡 ログイン処理
export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// 💡 新規登録処理
export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// 💡 ログアウト処理
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}

// 💡 タイピング結果の保存
export async function saveTypingResult(
  levelId: string,
  accuracy: number,
  isSuccess: boolean,
  nextLevelId: string | null
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // スコア履歴の追加
  const { error: scoreError } = await supabase.from("scores").insert({
    user_id: user.id,
    level_id: levelId,
    accuracy,
    is_success: isSuccess,
  });

  if (scoreError) {
    console.error("Score save error:", scoreError);
  }

  // クリア成功時に進捗を更新
  if (isSuccess && nextLevelId) {
    await supabase.from("profiles").upsert({
      id: user.id,
      highest_level_id: nextLevelId,
      updated_at: new Date().toISOString(),
    });
  }

  return { success: true };
}

/*
// 💡 ユーザーの最高進捗を取得
export async function getUserProgress() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("highest_level_id")
    .eq("id", user.id)
    .single();

  return data?.highest_level_id ?? "1-1";
}

*/
// 💡 ユーザーの最高進捗を取得（エラーが起きても止まらない安全版）
export async function getUserProgress() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return "1-1";

    const { data, error } = await supabase
      .from("profiles")
      .select("highest_level_id")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !data) {
      return "1-1";
    }

    return data.highest_level_id ?? "1-1";
  } catch (err) {
    console.error("getUserProgress error:", err);
    return "1-1";
  }
}