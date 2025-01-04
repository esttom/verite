import { ElMessage } from 'element-plus'

interface QuestionnaireInsertParam {
  user_id: string
  title: string
  description: string
}

export function useSupabaseQuestionnaire() {
  const client = useSupabase()

  const select = async () => {
    const { data, error } = await client.from('questionnaire').select()
    if (error) {
      ElMessage({
        type: 'error',
        message: 'get questionnaire failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  const insert = async (param: QuestionnaireInsertParam) => {
    const { data, error } = await client.from('questionnaire').insert(param).select()
    if (error) {
      ElMessage({
        type: 'error',
        message: 'insert questionnaire failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  const remove = async (id: string) => {
    const { data, error } = await client.from('questionnaire').delete().eq('id', id)
    if (error) {
      ElMessage({
        type: 'error',
        message: 'delete questionnaire failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  return {
    select,
    insert,
    remove,
  }
}
