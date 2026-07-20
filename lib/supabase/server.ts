import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // 💡 cookiesToSet に : any[] を追加して型エラーを解消
        setAll(cookiesToSet: any[]) {
          try {
            // 💡 引数の分割代入部分に : any を追加して暗黙のanyを解消
            cookiesToSet.forEach(({ name, value, options }: any) =>
              
              /*
              cookieStore.set(name, value, { 
                ...options, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
              })
              */
              cookieStore.set(name, value, options)
            )
          } catch {
            // サーバーアクション内での変更を許容するための catch ブロック
          }
        },
      },
    }
  )
}
