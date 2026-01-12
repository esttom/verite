import { supabaseResponse } from './common'

interface QuestionnaireParam {
  title: string
  data: Record<string, any>[]
}

export function useSupabaseQuestionnaire() {
  const client = useSupabase()

  const selectById = async (id: string) => {
    const { data, error } = await client.from('questionnaire').select().eq('id', id).single()
    return supabaseResponse(data, error)
  }

  const selectByUserId = async (userId: string) => {
    const { data, error } = await client.from('questionnaire').select().eq('user_id', userId).order('created_at', { ascending: true })
    return supabaseResponse(data, error)
  }

  const insert = async (param: QuestionnaireParam) => {
    const { data, error } = await client.from('questionnaire').insert(param)
    return supabaseResponse(data, error)
  }

  const update = async (id: string, param: QuestionnaireParam) => {
    const { data, error } = await client.from('questionnaire').update(param).eq('id', id)
    return supabaseResponse(data, error)
  }

  return {
    selectById,
    selectByUserId,
    insert,
    update,
  }
}
