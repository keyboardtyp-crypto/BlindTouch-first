'use server'

import { createClient } from '../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function saveTypingResult(levelId: string, accuracy: number, isSuccess: boolean, nextLevelId: string | null) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  // ⭕ 正しいテーブル名 'typing_results' に修正
  const { error: resultError } = await supabase.from('typing_results').insert([
    {
      user_id: user.id,
      level_id: levelId,
      accuracy,
      is_success: isSuccess,
    },
  ])

  if (resultError) {
    console.error('Error saving result:', resultError)
    return { error: resultError.message }
  }

  // If successful and there is a next level, update progress
  if (isSuccess && nextLevelId) {
    const { data: currentProgress } = await supabase
      .from('user_progress')
      .select('highest_level_id')
      .eq('user_id', user.id)
      .single()

    const shouldUpdate = !currentProgress || isNewerLevel(nextLevelId, currentProgress.highest_level_id)

    if (shouldUpdate) {
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          highest_level_id: nextLevelId,
          updated_at: new Date().toISOString(),
        })

      if (progressError) {
        console.error('Error updating progress:', progressError)
      }
    }
  }

  return { success: true }
}

export async function getUserProgress() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // ⭕ 正しいテーブル名 'user_progress' に修正
  const { data, error } = await supabase
    .from('user_progress')
    .select('highest_level_id')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching progress:', error)
    return null
  }

  return data?.highest_level_id || '1-1'
}

function isNewerLevel(nextLevelId: string, currentLevelId: string): boolean {
  const [nextStage, nextStep] = nextLevelId.split('-').map(Number)
  const [currStage, currStep] = currentLevelId.split('-').map(Number)

  if (nextStage > currStage) return true
  if (nextStage === currStage && nextStep > currStep) return true
  return false
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
