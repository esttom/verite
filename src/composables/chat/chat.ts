export interface ChatItem {
  id: string
  quiz_id: string | null
  content: string
  fixed: boolean
  favorite: number
  reply: any[] | null
  replyInput: string
  showReply: boolean
  favorited: boolean
  question: boolean
  anon_id: string | null
}

export function useAnonId() {
  return useStorage('chat-anon-id', createAnonId(), sessionStorage)
}

function createAnonId() {
  return window.isSecureContext ? crypto.randomUUID() : String(Math.random()).replace(/0./, '')
}
