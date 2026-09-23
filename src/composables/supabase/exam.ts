import type { ExamDraft, ExamResult, PublicExam } from '../problem'
import type { Json } from './database.types'

export function useSupabaseExam() {
  const client = useSupabase()
  const { context } = useUserContext()

  const select = async (chatId: string) => {
    const { data, error } = await client
      .from('exam')
      .select('id, title, description, items, answers, created_at')
      .eq('chat_id', chatId)
      .eq('user_id', context.userId)
      .order('created_at', { ascending: true })
    if (error) {
      throw error
    }
    return data
  }

  const save = async (chatId: string, draft: ExamDraft) => {
    const items = draft.questions.map(question => ({
      id: question.id,
      prompt: question.prompt.trim(),
      explanation: question.explanation.trim(),
      choices: question.choices.map(choice => ({ id: choice.id, text: choice.text.trim() })),
    }))
    const values = {
      chat_id: chatId,
      user_id: context.userId,
      title: draft.title.trim(),
      description: draft.description.trim(),
      items: items as Json,
      questions: draft.questions.map(question => question.prompt.trim()),
      answers: draft.questions.map(question => question.correctChoiceId!),
    }

    const response = draft.id
      ? await client.from('exam').update(values).eq('id', draft.id).eq('user_id', context.userId).select('id').single()
      : await client.from('exam').insert(values).select('id').single()
    if (response.error) {
      throw response.error
    }
    return response.data.id
  }

  const remove = async (examId: string) => {
    const { error } = await client
      .from('exam')
      .delete()
      .eq('id', examId)
      .eq('user_id', context.userId)
    if (error) {
      throw error
    }
  }

  const selectPublic = async (examId: string) => {
    const { data, error } = await client
      .from('exam')
      .select('id, title, description, items, answers')
      .eq('id', examId)
      .single()
    if (error) {
      throw error
    }

    const items = data.items as unknown as PublicExam['items']
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      items: items.map((item, index) => ({
        ...item,
        explanation: item.explanation ?? '',
        correctChoiceId: data.answers[index] ?? null,
      })),
    } satisfies PublicExam
  }

  const grade = (exam: PublicExam, submittedAnswers: Record<string, string>): ExamResult => {
    const results = exam.items.map(question => ({
      questionId: question.id,
      selectedChoiceId: submittedAnswers[question.id],
      correctChoiceId: question.correctChoiceId!,
      correct: submittedAnswers[question.id] === question.correctChoiceId,
    }))
    return {
      score: results.filter(result => result.correct).length,
      total: results.length,
      results,
    }
  }

  return { select, save, remove, selectPublic, grade }
}
