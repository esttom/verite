import { describe, expect, it } from 'vitest'
import { createChoiceQuestionDraft, validateChoiceQuestion } from '../src/composables/problem/editor'

describe('problem editor validation', () => {
  it('accepts one correct choice in a complete question', () => {
    const question = createChoiceQuestionDraft()
    question.prompt = '2 + 2 は？'
    question.choices[0].text = '3'
    question.choices[1].text = '4'
    question.correctChoiceId = question.choices[1].id

    expect(validateChoiceQuestion(question, true)).toEqual([])
  })

  it('rejects empty, duplicate, and unanswered choices', () => {
    const question = createChoiceQuestionDraft()
    question.prompt = '同じ選択肢'
    question.choices[0].text = 'A'
    question.choices[1].text = 'A'

    expect(validateChoiceQuestion(question, true)).toEqual([
      '同じ選択肢は設定できません。',
      '正解を1つ選択してください。',
    ])
  })
})
