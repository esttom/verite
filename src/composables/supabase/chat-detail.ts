import { supabaseResponse } from './common'

interface ChatDetailInsertParam {
  chat_id: string
  content: string
  reply: Record<string, any>[] | null
  quiz_id: string | null
  question: boolean
  anon_id: string
}

interface ChatDetailUpdateParam {
  id: string
  favorite: number
  fixed: boolean
  reply: Record<string, any>[] | null
}

export function useSupabaseChatDetail() {
  const client = useSupabase()

  const select = async (chatId: string) => {
    const { data, error } = await client.from('chat_detail').select().eq('chat_id', chatId).order('created_at', { ascending: true })
    return supabaseResponse(data, error)
  }

  const insert = async (param: ChatDetailInsertParam) => {
    const { data, error } = await client.from('chat_detail').insert(param).select().single()
    return supabaseResponse(data, error)
  }

  const update = async (param: ChatDetailUpdateParam) => {
    const { data, error } = await client.from('chat_detail').update({ favorite: param.favorite, fixed: param.fixed, reply: param.reply }).eq('id', param.id).select().single()
    return supabaseResponse(data, error)
  }

  return {
    select,
    update,
    insert,
  }
}
