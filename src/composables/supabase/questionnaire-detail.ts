import { ElMessage } from 'element-plus'

interface QuestionnaireDetailInsertParam {
  base_id: string
  content: string
  reply: string | null
  stamp: boolean
}

interface QuestionnaireDetailUpdateFavoriteParam {
  id: string
  favorite: number
}

interface QuestionnaireDetailUpdateFixedParam {
  id: string
  fixed: boolean
}

export function useSupabaseQuestionnaireDetail() {
  const client = useSupabase()

  const select = async (baseId: string) => {
    const { data, error } = await client.from('questionnaire_detail').select().eq('base_id', baseId).order('created_at', { ascending: true })
    if (error) {
      ElMessage({
        type: 'error',
        message: 'get message failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  const listen = (insertHandler: (record: any) => void, updateHandler: (record: any) => void) => {
    client.channel('questionnaire_detail')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'questionnaire_detail' }, (payload) => {
        if (payload.errors) {
          ElMessage({
            type: 'error',
            message: 'get message failed',
          })
          throw new Error(payload.errors.join(','))
        }
        if (payload.eventType === 'INSERT') {
          insertHandler(payload.new)
        }
        else if (payload.eventType === 'UPDATE') {
          updateHandler(payload.new)
        }
      })
      .subscribe()
  }

  const insert = async (param: QuestionnaireDetailInsertParam) => {
    const { data, error } = await client.from('questionnaire_detail').insert(param)
    if (error) {
      ElMessage({
        type: 'error',
        message: 'insert message failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  const updateFavorite = async (param: QuestionnaireDetailUpdateFavoriteParam) => {
    const { data, error } = await client.from('questionnaire_detail').update({ favorite: param.favorite }).eq('id', param.id)
    if (error) {
      ElMessage({
        type: 'error',
        message: 'update favorite failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  const updateFixed = async (param: QuestionnaireDetailUpdateFixedParam) => {
    const { data, error } = await client.from('questionnaire_detail').update({ fixed: param.fixed }).eq('id', param.id)
    if (error) {
      ElMessage({
        type: 'error',
        message: 'update fixed failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  const remove = async (baseId: string) => {
    const { data, error } = await client.from('questionnaire_detail').delete().eq('base_id', baseId)
    if (error) {
      ElMessage({
        type: 'error',
        message: 'delete message failed',
      })
      throw new Error(error.message)
    }
    return data
  }

  return {
    select,
    updateFavorite,
    updateFixed,
    listen,
    insert,
    remove,
  }
}
