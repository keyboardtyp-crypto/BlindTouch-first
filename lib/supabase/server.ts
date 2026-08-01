import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// クッキー情報の型を定義（暗黙の any を防ぐ）
type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};


export async function createClient() {
  const cookieStore = await cookies()
    //const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {


      /*
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // 💡 cookiesToSet に : any[] を追加して型エラーを解消
        setAll(cookiesToSet: any[]) {

console.log('--- setAll CALLED ---', cookiesToSet.length) // 👈 これを追加 test

          try {
            // 💡 引数の分割代入部分に : any を追加して暗黙のanyを解消
            cookiesToSet.forEach(({ name, value, options }: any) => {
 console.log('Setting Cookie:', name) // 👈 これを追加 test             
              
              cookieStore.set(name, value, { 
                ...options, 
                path: options?.path ?? "/", //20260731付け加え
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                //path: '/'　//20260731けす
              })
              
             // cookieStore.set(name, value, options)
           } )
          } catch (error){
            // サーバーアクション内での変更を許容するための catch ブロック
            console.log('setAll Error:', error) // 👈 エラーが出ているかログ出力
          }
        },
      },
      */
cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component から呼び出された場合は無視
          }
        },
      },


    }
  )
}
