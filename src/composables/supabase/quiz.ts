import { ElMessage } from 'element-plus'

interface QuizInsertParam {
  base_id: string
  title: string
  questions: string[]
}

export function useSupabaseQuiz() {
  const client = useSupabase()

  const select = async (baseId: string) => {
    const { data, error } = await client.from('quiz').select().eq('base_id', baseId)
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

  const remove = async (id: string) => {
    const { data, error } = await client.from('quiz').delete().eq('id', id)
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
    remove,
  }
}
