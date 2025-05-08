import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabaseResponse } from './common'

interface StampInsertParam {
  chat_id: string
  content: string
}

export function useSupabaseStamp() {
  type StampRecord = NonNullable<Awaited<ReturnType<typeof select>>>[number]

  const client = useSupabase()
  let realtimeChannel: RealtimeChannel | null = null

  const select = async (chatId: string) => {
    const { data, error } = await client.from('stamp').select().eq('chat_id', chatId).order('created_at', { ascending: true })
    return supabaseResponse(data, error)
  }

  const subscribe = (chatId: string, handler: (record: StampRecord) => void) => {
    realtimeChannel = client.channel('stamp')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'stamp', filter: `chat_id=eq.${chatId}` }, (payload) => {
        if (payload.errors) {
          throw new Error(payload.errors.join(','))
        }
        handler(payload.new as StampRecord)
      })
      .subscribe()
  }

  const unsubscribe = () => {
    realtimeChannel?.unsubscribe()
  }

  const insert = async (param: StampInsertParam) => {
    const { data, error } = await client.from('stamp').insert(param)
    return supabaseResponse(data, error)
  }

  const remove = async (chatId: string) => {
    const { data, error } = await client.from('stamp').delete().eq('chat_id', chatId)
    return supabaseResponse(data, error)
  }

  onUnmounted(() => {
    unsubscribe()
  })

  return {
    select,
    subscribe,
    insert,
    remove,
  }
}
