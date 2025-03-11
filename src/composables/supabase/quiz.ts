import { ElMessage } from 'element-plus'

interface QuizInsertParam {
  quiz_id: string
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
  close?: boolean
  sent?: boolean
}

export function useSupabaseQuiz() {
  const client = useSupabase()

  const select = async (quizId: string) => {
    const { data, error } = await client.from('quiz').select().eq('quiz_id', quizId).order('created_at', { ascending: true })
    if (error) {
      ElMessage({
        type: 'error',
        message: 'get quiz failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  const selectById = async (id: string) => {
    const { data, error } = await client.from('quiz').select().eq('id', id).single()
    if (error) {
      ElMessage({
        type: 'error',
        message: 'get quiz failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  const insert = async (param: QuizInsertParam) => {
    const { data, error } = await client.from('quiz').insert(param).select()
    if (error) {
      ElMessage({
        type: 'error',
        message: 'insert quiz failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  const updateQuestion = async (param: QuizUpdateQuestionParam) => {
    const { id, title, questions } = param
    const { data, error } = await client.from('quiz').update({ title, questions }).eq('id', id)
    if (error) {
      ElMessage({
        type: 'error',
        message: 'update quiz failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  const updateState = async (param: QuizUpdateStateParam) => {
    const { id, close, sent } = param
    const { data, error } = await client.from('quiz').update({ close, sent }).eq('id', id)
    if (error) {
      ElMessage({
        type: 'error',
        message: 'update quiz failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  const remove = async (quizId: string) => {
    const { data, error } = await client.from('quiz').delete().eq('quiz_id', quizId)
    if (error) {
      ElMessage({
        type: 'error',
        message: 'delete quiz failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  return {
    select,
    selectById,
    insert,
    updateQuestion,
    updateState,
    remove,
  }
}
