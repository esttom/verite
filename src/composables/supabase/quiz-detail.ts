import { ElMessage } from 'element-plus'

interface QuizDetailInsertParam {
  base_id: string
  answer: number
}

export function useSupabaseQuizDetail() {
  const client = useSupabase()

  const select = async (baseId: string) => {
    const { data, error } = await client.from('quiz_detail').select().eq('base_id', baseId)
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

  const listen = (baseId: string, insertHandler: (record: any) => void) => {
    client.channel('quiz_detail')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quiz_detail', filter: `base_id=eq.${baseId}` }, (payload) => {
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

  // const remove = async (id: string) => {
  //   const { data, error } = await client.from('quiz').delete().eq('id', id)
  //   if (error) {
  //     ElMessage({
  //       type: 'error',
  //       message: 'delete quiz failed',
  //     })
  //     throw new Error(error.message)
  //   }
  //   return data
  // }

  return {
    select,
    insert,
    listen,
    // remove,
  }
}
