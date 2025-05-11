export const ChatState = {
  ACTIVE: 'ACTIVE',
  WAITING: 'WAITING',
  COMPLETED: 'COMPLETED',
} as const

export const QuizState = {
  ACTIVE: 'ACTIVE',
  WAITING: 'WAITING',
  COMPLETED: 'COMPLETED',
}

export type ChatStateType = (typeof ChatState)[keyof typeof ChatState]
export type QuizStateType = (typeof QuizState)[keyof typeof QuizState]
