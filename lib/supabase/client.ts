
//旧ライブラリを廃止し、SSR対応のブラウザクライアントに修正
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}


/*
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 作成したインスタンスをキャッシュするための変数
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

export const createClient = () => {
  // すでに作られていれば、新しく作らずに既存のものを使い回す
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // 初回のみ新しく作成して変数に保存する
  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};
*/

