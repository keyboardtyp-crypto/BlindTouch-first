"use server";

import { createClient } from "@/lib/supabase/server";

// 💡 ユーザーの最高到達レベルを取得
export async function getUserProgress(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return "1-1";

    const { data } = await supabase
      .from("user_progress")
      .select("highest_level_id")
      .eq("user_id", user.id)
      .maybeSingle();

    return data?.highest_level_id ?? "1-1";
  } catch (err) {
    return "1-1";
  }
}

// 💡 タイピング結果と進捗（highest_level_id）を保存
export async function saveTypingResult(
  levelId: string,
  accuracy: number,
  isSuccess: boolean,
  nextLevelId: string | null
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "未ログイン" };

    if (isSuccess && nextLevelId) {
      const { data: currentProgress } = await supabase
        .from("user_progress")
        .select("highest_level_id")
        .eq("user_id", user.id)
        .maybeSingle();

      const current = currentProgress?.highest_level_id ?? "1-1";
      const [cStage, cStep] = current.split("-").map(Number);
      const [nStage, nStep] = nextLevelId.split("-").map(Number);

      // 新しいステージがこれまでの最高記録より高い場合のみ更新
      if (nStage > cStage || (nStage === cStage && nStep > cStep)) {
        await supabase
          .from("user_progress")
          .upsert({
            user_id: user.id,
            highest_level_id: nextLevelId,
            updated_at: new Date().toISOString(),
          });
      }
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: "保存失敗" };
  }
}