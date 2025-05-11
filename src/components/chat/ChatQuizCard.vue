<script setup lang="ts">
import { QuizState } from '~/composables'

const props = defineProps<{ chatId: string, quizId: string }>()

const close = ref(false)
const title = ref('')
const total = ref(0)
const questions = ref<{ text: string, percentage: number }[]>([])

let answers: Record<string, number> = {}
const { selectById } = useSupabaseQuiz()
const { insert, select, subscribe } = useSupabaseQuizDetail()
const { loading, withLoadingFn } = useLoading()

withLoadingFn(async () => {
  const data = await selectById(props.quizId)
  title.value = data.title
  questions.value = data.questions?.map(q => ({ text: q, percentage: 0 })) ?? []
  close.value = data.status === QuizState.COMPLETED
  if (!close.value) {
    listenAnswer()
  }
  await getAnswer()
})

function sendAnswer(answer: number) {
  withLoadingFn(async () => {
    await insert({
      quiz_id: props.quizId,
      answer,
    })
    close.value = true
  })
}

async function getAnswer() {
  const data = await select(props.quizId)
  answers = data.reduce((prev, curr) => Object.assign(prev, { [curr.id]: curr.answer }), {} as Record<string, number>)
  setDisplayData()
}

function listenAnswer() {
  subscribe(props.quizId, (record) => {
    answers[record.id] = record.answer
    setDisplayData()
  })
}

function setDisplayData() {
  const answerCalcData = Array.from({ length: questions.value.length }).fill(0) as number[]
  const answerValues = Object.values(answers)
  total.value = answerValues.length
  answerValues.forEach(a => answerCalcData[a]++)
  answerCalcData.forEach((t, idx) => questions.value[idx].percentage = Math.floor(100 * t / total.value))
}
</script>

<template>
  <div v-loading="loading" class="mb-3 max-w-420px border border-blue-500 rounded-lg bg-white p-4 shadow-sm dark:border-blue-600 dark:bg-gray-800" h-fit>
    <h5 class="items-top mb-3 flex text-base font-semibold">
      <div class="flex">
        <svg class="mr-1 h-[24px] w-[24px] text-blue-500 dark:text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.008-3.018a1.502 1.502 0 0 1 2.522 1.159v.024a1.44 1.44 0 0 1-1.493 1.418 1 1 0 0 0-1.037.999V14a1 1 0 1 0 2 0v-.539a3.44 3.44 0 0 0 2.529-3.256 3.502 3.502 0 0 0-7-.255 1 1 0 0 0 2 .076c.014-.398.187-.774.48-1.044Zm.982 7.026a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2h-.01Z" clip-rule="evenodd" />
        </svg>
        <div class="whitespace-pre-wrap break-all">
          {{ title }} - {{ total }} 票
        </div>
      </div>
    </h5>

    <template v-if="close">
      <div class="space-y-3">
        <div v-for="(question, idx) in questions" :key="idx" class="relative w-full overflow-hidden rounded-2xl bg-gray-400">
          <div class="absolute left-0 top-0 h-full bg-blue-600" :style="`width: ${question.percentage}%`" />
          <div class="relative z-10 px-3 py-[1px] text-sm text-gray-300">
            {{ question.text }} - {{ question.percentage }}%
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col">
        <div class="space-y-2">
          <button
            v-for="(question, idx) in questions"
            :key="idx"
            class="w-full transform border-1 border-blue-500 rounded-2xl px-3 py-[1px] text-sm shadow-sm dark:border-blue-600 hover:bg-blue-600 hover:text-white"
            @click="sendAnswer(idx)"
          >
            {{ question.text }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.progress-card ::v-deep(.el-progress-bar__outer) {
  background-color: rgba(45, 62, 102, 0.42);
}
</style>
