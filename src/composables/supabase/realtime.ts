import type { RealtimeChannel } from '@supabase/supabase-js'
import type { InjectionKey } from 'vue'
import { useDocumentVisibility } from '@vueuse/core'

type ChatRealtimeEvent = 'status' | 'stamp' | 'chat-insert' | 'chat-update' | 'quiz'

export const REALTIME_SYMBOL = Symbol('realtime_provide_key') as InjectionKey<(event: ChatRealtimeEvent, payload: Record<string, any>) => void>

export function useSupabaseRealtime() {
  const client = useSupabase()
  const subscribed = ref(false)
  const documentVisibility = useDocumentVisibility()

  let chatChannel: RealtimeChannel | null

  const subscribe = (chatId: string, handler: (event: ChatRealtimeEvent, record: Record<string, any>) => void) => {
    if (!chatChannel) {
      chatChannel = client.channel(`chat-${chatId}`, { config: { broadcast: { self: true } } })
    }
    chatChannel
      .on('broadcast', { event: 'status' }, payload => handler('status', payload))
      .on('broadcast', { event: 'stamp' }, payload => handler('stamp', payload))
      .on('broadcast', { event: 'chat-insert' }, payload => handler('chat-insert', payload))
      .on('broadcast', { event: 'chat-update' }, payload => handler('chat-update', payload))
      .on('broadcast', { event: 'quiz' }, payload => handler('quiz', payload))
      .subscribe(status => subscribed.value = status === 'SUBSCRIBED')
  }

  const unsubscribe = () => {
    chatChannel?.unsubscribe()
  }

  watch(documentVisibility, (v) => {
    if (v === 'visible' && !subscribed.value) {
      window.location.reload()
    }
  })

  onUnmounted(() => {
    unsubscribe()
  })

  const send = (event: ChatRealtimeEvent, payload: Record<string, any>) => {
    chatChannel!.send({
      type: 'broadcast',
      event,
      ...payload,
    })
  }

  provide(REALTIME_SYMBOL, send)

  return {
    subscribe,
    unsubscribe,
    send,
  }
}

export function useSupabaseRealtimeSender() {
  return inject(REALTIME_SYMBOL)!
}
