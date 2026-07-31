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

    if (!user) {
        console.log("❌ 未ログインのため保存をキャンセルしました");    
        return { success: false, error: "未ログイン" };
  }

  /*
    if (isSuccess && nextLevelId) {
     // 1. 現在の進捗を取得
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
  */

// クリア成功時のみ進捗を更新
    if (isSuccess && nextLevelId) {
      // 1. 現在の進捗を取得
      const { data: currentProgress } = await supabase
        .from("user_progress")
        .select("highest_level_id")
        .eq("user_id", user.id)
        .maybeSingle();

      const current = currentProgress?.highest_level_id;

      // 2. 既存データが無い（初回）、または新しいレベルの方が高い場合に更新
      let shouldUpdate = false;

      if (!current) {
        // データがまだ1件もない場合は無条件で保存！
        shouldUpdate = true;
      } else {
        const [cStage, cStep] = current.split("-").map(Number);
        const [nStage, nStep] = nextLevelId.split("-").map(Number);
        if (nStage > cStage || (nStage === cStage && nStep > cStep)) {
          shouldUpdate = true;
        }
      }

      if (shouldUpdate) {
        const { error: upsertError } = await supabase
          .from("user_progress")
          .upsert(
            {
              user_id: user.id,
              highest_level_id: nextLevelId,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

        if (upsertError) {
          console.error("❌ DB保存エラー:", upsertError.message);
          return { success: false, error: upsertError.message };
        }

        console.log("🎉 進捗を正常に保存しました！ 新到達レベル:", nextLevelId);
      }
    }

    return { success: true };
  } catch (err) {
    console.error("❌ 保存処理で例外が発生しました:", err);
    return { success: false, error: "保存失敗" };
  }
}
