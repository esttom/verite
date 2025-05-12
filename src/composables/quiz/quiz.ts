const QUIZ_DATA_SYMBOL = Symbol('quiz_provide_key') as InjectionKey<{
  add: (quizId: string, id: string, answer: number) => void
  collectAnswer: (quizId: string) => number[]
  registerListener: (quizId: string, fn: () => void) => void
}>

export function provideQuiz() {
  const quizData: Record<string, Record<string, number>> = {}
  const listener: Record<string, () => void> = {}

  const add = (quizId: string, id: string, answer: number) => {
    Object.assign(quizData, { [quizId]: Object.assign(quizData[quizId] ?? {}, { [id]: answer }) })
  }

  const collectAnswer = (quizId: string) => {
    if (!quizData[quizId]) {
      return []
    }
    return Object.values(quizData[quizId])
  }

  const registerListener = (quizId: string, fn: () => void) => {
    listener[quizId] = fn
  }

  const eventDispatcher = (quizId: string) => {
    listener[quizId]()
  }

  provide(QUIZ_DATA_SYMBOL, {
    add,
    collectAnswer,
    registerListener,
  })

  return {
    add,
    eventDispatcher,
  }
}

export function useQuiz() {
  const { add, collectAnswer, registerListener } = inject(QUIZ_DATA_SYMBOL)!

  return {
    add,
    collectAnswer,
    registerListener,
  }
}
