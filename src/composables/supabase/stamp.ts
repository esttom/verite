import { supabaseResponse } from './common'

interface StampInsertParam {
  chat_id: string
  content: string
}

export function useSupabaseStamp() {
  type StampRecord = NonNullable<Awaited<ReturnType<typeof select>>>[number]

  const client = useSupabase()

  const select = async (chatId: string) => {
    const { data, error } = await client.from('stamp').select().eq('chat_id', chatId).order('created_at', { ascending: true })
    return supabaseResponse(data, error)
  }

  const listen = (chatId: string, handler: (record: StampRecord) => void) => {
    client.channel('stamp')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'stamp', filter: `chat_id=eq.${chatId}` }, (payload) => {
        if (payload.errors) {
          throw new Error(payload.errors.join(','))
        }
        handler(payload.new as StampRecord)
      })
      .subscribe()
  }

  const insert = async (param: StampInsertParam) => {
    const { data, error } = await client.from('stamp').insert(param)
    return supabaseResponse(data, error)
  }

  const remove = async (chatId: string) => {
    const { data, error } = await client.from('stamp').delete().eq('chat_id', chatId)
    return supabaseResponse(data, error)
  }

  return {
    select,
    listen,
    insert,
    remove,
  }
}
