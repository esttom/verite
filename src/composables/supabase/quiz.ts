import type { QuizStateType } from '../utils'
import { supabaseResponse } from './common'

interface QuizInsertParam {
  chat_id: string
  title: string
  questions: string[]
}

interface QuizUpdateQuestionParam {
  id: string
  title: string
  questions: string[]
}

interface QuizUpdateStateParam {
  id: string
  status: QuizStateType
}

export function useSupabaseQuiz() {
  const client = useSupabase()
  const { context } = useUserContext()
  const userId = context.userId === '' ? '00000000-0000-4000-8000-000000000000' : context.userId

  const select = async (chatId: string) => {
    const { data, error } = await client.from('quiz').select().eq('chat_id', chatId).eq('user_id', userId).order('created_at', { ascending: true })
    return supabaseResponse(data!, error)
  }

  const selectById = async (id: string) => {
    const { data, error } = await client.from('quiz').select().eq('id', id).single()
    return supabaseResponse(data!, error)
  }

  const insert = async (param: QuizInsertParam) => {
    const { data, error } = await client.from('quiz').insert({ user_id: userId, ...param }).select()
    return supabaseResponse(data, error)
  }

  const updateQuestion = async (param: QuizUpdateQuestionParam) => {
    const { id, title, questions } = param
    const { data, error } = await client.from('quiz').update({ title, questions }).eq('id', id)
    return supabaseResponse(data, error)
  }

  const updateState = async (param: QuizUpdateStateParam) => {
    const { data, error } = await client.from('quiz').update({ status: param.status }).eq('id', param.id)
    return supabaseResponse(data, error)
  }

  return {
    select,
    selectById,
    insert,
    updateQuestion,
    updateState,
  }
}
