import { ElMessage } from 'element-plus'

interface QuizDetailInsertParam {
  base_id: string
  quiz_id: string
  answer: number
}

export function useSupabaseQuizDetail() {
  const client = useSupabase()

  const select = async (quizId: string) => {
    const { data, error } = await client.from('quiz_detail').select().eq('quiz_id', quizId).order('created_at', { ascending: true })
    if (error) {
      ElMessage({
        type: 'error',
        message: 'get quiz detail failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  const insert = async (param: QuizDetailInsertParam) => {
    const { data, error } = await client.from('quiz_detail').insert(param).select()
    if (error) {
      ElMessage({
        type: 'error',
        message: 'insert quiz detail failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  const listen = (quizId: string, insertHandler: (record: any) => void) => {
    client.channel('quiz_detail')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quiz_detail', filter: `quiz_id=eq.${quizId}` }, (payload) => {
        if (payload.errors) {
          ElMessage({
            type: 'error',
            message: 'get quiz detail message failed',
          })
          throw new Error(payload.errors.join(','))
        }
        insertHandler(payload.new)
      })
      .subscribe()
  }

  const remove = async (baseId: string) => {
    const { data, error } = await client.from('quiz_detail').delete().eq('base_id', baseId)
    if (error) {
      ElMessage({
        type: 'error',
        message: 'delete quiz detail failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  return {
    select,
    insert,
    listen,
    remove,
  }
}
