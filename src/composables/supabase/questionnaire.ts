import { supabaseResponse } from './common'

interface QuestionnaireInsertParam {
  chat_id: string
  answer: Record<string, any>
}

export function useSupabaseQuestionnaire() {
  const client = useSupabase()

  const select = async (chatId: string) => {
    const { data, error } = await client.from('questionnaire').select().eq('chat_id', chatId)
    return supabaseResponse(data, error)
  }

  const insert = async (param: QuestionnaireInsertParam) => {
    const { data, error } = await client.from('questionnaire').insert(param)
    return supabaseResponse(data, error)
  }

  return {
    select,
    insert,
  }
}
