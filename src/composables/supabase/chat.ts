import { supabaseResponse } from './common'

interface ChatInsertParam {
  user_id: string
  title: string
  description: string
}

export function useSupabaseChat() {
  const client = useSupabase()

  const select = async () => {
    const { data, error } = await client.from('chat').select()
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
    select,
    insert,
    remove,
  }
}
