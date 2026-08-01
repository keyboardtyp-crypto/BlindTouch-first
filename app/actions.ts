"use server";

import { createClient } from "@/lib/supabase/server";

// 進捗取得
export async function getUserProgress(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return "1-1";

    const { data, error } = await supabase
      .from("user_progress")
      .select("highest_level_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("❌ [getUserProgress エラー]:", error.message);
      return "1-1";
    }

    return data?.highest_level_id ?? "1-1";
  } catch (err) {
    console.error("❌ [getUserProgress 例外]:", err);
    return "1-1";
  }
}

// 成績保存
export async function saveTypingResult(
  levelId: string,
  accuracy: number,
  isSuccess: boolean,
  nextLevelId: string | null
) {
  console.log("🚀 [1] saveTypingResult が呼び出されました！", { levelId, isSuccess, nextLevelId });

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("❌ [2] ユーザー認証失敗:", authError?.message || "未ログイン");
      return { success: false, error: "未ログイン状態です" };
    }

    console.log("👤 [3] ログインユーザーID:", user.id);

    // クリア成功時のみ更新対象とする
    const targetLevel = (isSuccess && nextLevelId) ? nextLevelId : levelId;

    console.log("💾 [4] Supabase に書き込みを試みます... 対象レベル:", targetLevel);

    const { data, error: dbError } = await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: user.id,
          highest_level_id: targetLevel,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select();

    if (dbError) {
      console.error("❌ [5] Supabase 書き込みエラー発生！:", dbError.message);
      console.error("エラーの詳細:", dbError);
      return { success: false, error: dbError.message };
    }

    console.log("🎉 [6] 書き込み成功！ 返却データ:", data);
    return { success: true };
  } catch (err: any) {
    console.error("❌ [7] 予期せぬ例外エラーが発生しました:", err);
    return { success: false, error: err?.message || "例外エラー" };
  }
}