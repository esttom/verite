import { supabaseResponse } from './common'

interface ChatInsertParam {
  user_id: string
  title: string
  description: string
  questionnaire_id: string | null
}

interface ChatUpdateParam {
  id: string
  status: string
}

export function useSupabaseChat() {
  const client = useSupabase()

  const selectByUserId = async (userId: string) => {
    const { data, error } = await client.from('chat').select().eq('user_id', userId)
    return supabaseResponse(data, error)
  }

  const selectById = async (id: string) => {
    const { data, error } = await client.from('chat').select().eq('id', id).single()
    return supabaseResponse(data!, error)
  }

  const update = async (param: ChatUpdateParam) => {
    const { data, error } = await client.from('chat').update({ status: param.status }).eq('id', param.id)
    return supabaseResponse(data, error)
  }

  const insert = async (param: ChatInsertParam) => {
    const { data, error } = await client.from('chat').insert(param).select()
    return supabaseResponse(data, error)
  }

  const remove = async (id: string) => {
    const { data, error } = await client.from('chat').delete().eq('id', id)
    return supabaseResponse(data, error)
  }

  return {
    selectById,
    selectByUserId,
    insert,
    update,
    remove,
  }
}
