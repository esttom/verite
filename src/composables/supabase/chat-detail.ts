import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabaseResponse } from './common'

interface ChatDetailInsertParam {
  chat_id: string
  content: string
  reply: string[] | null
  quiz_id: string | null
}

interface ChatDetailUpdateParam {
  id: string
  favorite: number
  fixed: boolean
}

export function useSupabaseChatDetail() {
  type ChatRecord = NonNullable<Awaited<ReturnType<typeof select>>>[number]

  const client = useSupabase()
  let realtimeChannel: RealtimeChannel | null = null

  const select = async (chatId: string) => {
    const { data, error } = await client.from('chat_detail').select().eq('chat_id', chatId).order('created_at', { ascending: true })
    return supabaseResponse(data, error)
  }

  const subscribe = (chatId: string, insertHandler: (record: ChatRecord) => void, updateHandler: (record: ChatRecord) => void) => {
    realtimeChannel = client.channel('chat_detail')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_detail', filter: `chat_id=eq.${chatId}` }, (payload) => {
        if (payload.errors) {
          throw new Error(payload.errors.join(','))
        }
        if (payload.eventType === 'INSERT') {
          insertHandler(payload.new as ChatRecord)
        }
        else if (payload.eventType === 'UPDATE') {
          updateHandler(payload.new as ChatRecord)
        }
      })
      .subscribe()
  }

  const unsubscribe = () => {
    realtimeChannel?.unsubscribe()
  }

  const insert = async (param: ChatDetailInsertParam) => {
    const { data, error } = await client.from('chat_detail').insert(param)
    return supabaseResponse(data, error)
  }

  const update = async (param: ChatDetailUpdateParam) => {
    const { data, error } = await client.from('chat_detail').update({ favorite: param.favorite, fixed: param.fixed }).eq('id', param.id)
    return supabaseResponse(data, error)
  }

  const remove = async (chatId: string) => {
    const { data, error } = await client.from('chat_detail').delete().eq('chat_id', chatId)
    return supabaseResponse(data, error)
  }

  onUnmounted(() => {
    unsubscribe()
  })

  return {
    select,
    update,
    insert,
    remove,
    subscribe,
    unsubscribe,
  }
}
