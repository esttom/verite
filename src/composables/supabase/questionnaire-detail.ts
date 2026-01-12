import { supabaseResponse } from './common'

interface QuestionnaireDetailInsertParam {
  chat_id: string
  answer: Record<string, any>
}

export function useSupabaseQuestionnaireDetail() {
  const client = useSupabase()

  const select = async (chatId: string) => {
    const { data, error } = await client.from('questionnaire_detail').select().eq('chat_id', chatId).order('created_at', { ascending: true })
    return supabaseResponse(data, error)
  }

  const insert = async (param: QuestionnaireDetailInsertParam) => {
    const { data, error } = await client.from('questionnaire_detail').insert(param)
    return supabaseResponse(data, error)
  }

  return {
    select,
    insert,
  }
}
