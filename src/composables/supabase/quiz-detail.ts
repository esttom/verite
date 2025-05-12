import { supabaseResponse } from './common'

interface QuizDetailInsertParam {
  quiz_id: string
  answer: number
}

export function useSupabaseQuizDetail() {
  const client = useSupabase()

  const select = async (quizId: string) => {
    const { data, error } = await client.from('quiz_detail').select().eq('quiz_id', quizId).order('created_at', { ascending: true })
    return supabaseResponse(data!, error)
  }

  const insert = async (param: QuizDetailInsertParam) => {
    const { data, error } = await client.from('quiz_detail').insert(param).select().single()
    return supabaseResponse(data!, error)
  }

  return {
    select,
    insert,
  }
}
