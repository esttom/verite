export interface ChoiceOptionDraft {
  id: string
  text: string
}

export interface ChoiceQuestionDraft {
  id: string
  prompt: string
  explanation: string
  choices: ChoiceOptionDraft[]
  correctChoiceId: string | null
}

export interface ExamDraft {
  id?: string
  title: string
  description: string
  questions: ChoiceQuestionDraft[]
}

export interface ExamResultItem {
  questionId: string
  selectedChoiceId: string
  correctChoiceId: string
  correct: boolean
}

export interface ExamResult {
  score: number
  total: number
  results: ExamResultItem[]
}

export interface PublicExam {
  id: string
  title: string
  description: string
  items: ChoiceQuestionDraft[]
}

let draftId = 0

export function createDraftId(prefix: string) {
  draftId += 1
  return `${prefix}-${Date.now()}-${draftId}`
}

export function createChoiceQuestionDraft(choiceCount = 2): ChoiceQuestionDraft {
  return {
    id: createDraftId('question'),
    prompt: '',
    explanation: '',
    choices: Array.from({ length: choiceCount }, () => ({
      id: createDraftId('choice'),
      text: '',
    })),
    correctChoiceId: null,
  }
}

export function choiceQuestionFromStrings(prompt: string, choices: string[]): ChoiceQuestionDraft {
  const draft = createChoiceQuestionDraft(0)
  draft.prompt = prompt
  draft.choices = choices.map(text => ({ id: createDraftId('choice'), text }))
  return draft
}

export function cloneChoiceQuestion(question: ChoiceQuestionDraft): ChoiceQuestionDraft {
  return {
    ...question,
    choices: question.choices.map(choice => ({ ...choice })),
  }
}

export function validateChoiceQuestion(question: ChoiceQuestionDraft, requireCorrect = false) {
  const errors: string[] = []
  const choiceTexts = question.choices.map(choice => choice.text.trim())
  if (!question.prompt.trim()) {
    errors.push('設問を入力してください。')
  }
  if (choiceTexts.length < 2 || choiceTexts.length > 8) {
    errors.push('選択肢は2〜8件にしてください。')
  }
  if (choiceTexts.some(text => !text)) {
    errors.push('空の選択肢があります。')
  }
  if (new Set(choiceTexts).size !== choiceTexts.length) {
    errors.push('同じ選択肢は設定できません。')
  }
  if (requireCorrect && !question.choices.some(choice => choice.id === question.correctChoiceId)) {
    errors.push('正解を1つ選択してください。')
  }
  return errors
}
