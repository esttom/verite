import { supabaseResponse } from './common'

interface QuestionnaireInsertParam {
  chat_id: string
  answer: Record<string, any>
}

export function useSupabaseQuestionnaire() {
  const client = useSupabase()

  const select = async () => {
    const { data, error } = await client.from('questionnaire').select()
    return supabaseResponse(data, error)
  }

  const insert = async (param: QuestionnaireInsertParam) => {
    const { data, error } = await client.from('questionnaire').insert(param).select()
    return supabaseResponse(data, error)
  }

  return {
    select,
    insert,
  }
}
