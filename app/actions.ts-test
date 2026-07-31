//テストの為
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";   //20260731テストの為付け加え
export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  //  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }
// Cookieの変更を即時反映しキャッシュを更新 20260731テストの為
  revalidatePath('/', 'layout');

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');  //20260731テストの為
}
