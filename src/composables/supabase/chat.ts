import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabaseResponse } from './common'

interface ChatInsertParam {
  user_id: string
  title: string
  description: string
}

interface ChatUpdateParam {
  id: string
  status: string
}

export function useSupabaseChat() {
  type ChatRecord = NonNullable<Awaited<ReturnType<typeof selectById>>>

  const client = useSupabase()
  let realtimeChannel: RealtimeChannel | null = null

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

  const subscribe = (chatId: string, handler: (record: ChatRecord) => void) => {
    realtimeChannel = client.channel('chat')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat', filter: `id=eq.${chatId}` }, (payload) => {
        if (payload.errors) {
          throw new Error(payload.errors.join(','))
        }
        handler(payload.new as ChatRecord)
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
    selectById,
    selectByUserId,
    insert,
    update,
    remove,
    subscribe,
    unsubscribe,
  }
}
