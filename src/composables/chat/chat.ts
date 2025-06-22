export interface ChatItem {
  id: string
  quiz_id: string | null
  content: string
  fixed: boolean
  favorite: number
  reply: string[] | null
  replyInput: string
  showReply: boolean
  favorited: boolean
  question: boolean
}
