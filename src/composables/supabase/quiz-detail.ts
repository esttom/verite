import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabaseResponse } from './common'

interface QuizDetailInsertParam {
  quiz_id: string
  answer: number
}

export function useSupabaseQuizDetail() {
  type QuizDetailRecord = NonNullable<Awaited<ReturnType<typeof select>>>[number]

  const client = useSupabase()
  let realtimeChannel: RealtimeChannel | null = null

  const select = async (quizId: string) => {
    const { data, error } = await client.from('quiz_detail').select().eq('quiz_id', quizId).order('created_at', { ascending: true })
    return supabaseResponse(data!, error)
  }

  const insert = async (param: QuizDetailInsertParam) => {
    const { data, error } = await client.from('quiz_detail').insert(param).select()
    return supabaseResponse(data, error)
  }

  const subscribe = (quizId: string, handler: (record: QuizDetailRecord) => void) => {
    realtimeChannel = client.channel(`quiz_detail_${quizId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quiz_detail', filter: `quiz_id=eq.${quizId}` }, (payload) => {
        if (payload.errors) {
          throw new Error(payload.errors.join(','))
        }
        handler(payload.new as QuizDetailRecord)
      })
      .subscribe()
  }

  const unsubscribe = () => {
    realtimeChannel?.unsubscribe()
  }

  onUnmounted(() => {
    unsubscribe()
  })

  return {
    select,
    insert,
    subscribe,
  }
}
