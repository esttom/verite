<script setup lang="ts">
const props = defineProps<{ baseId: string, quizId: string }>()

const close = ref(false)
const title = ref('')
const questions = ref<{ text: string, percentage: number }[]>([])

let answers: Record<number, number> = {}
const { selectById } = useSupabaseQuiz()
const { insert, select, listen } = useSupabaseQuizDetail()
const { loading, withLoadingFn } = useLoading()

withLoadingFn(async () => {
  const data = await selectById(props.quizId)
  title.value = data.title
  questions.value = data.questions?.map(q => ({ text: q, percentage: 0 })) ?? []
  close.value = data.close

  if (close.value) {
    await getQuizDetailAndStartListen()
  }
})

function sendAnswer(answer: number) {
  withLoadingFn(async () => {
    await insert({
      base_id: props.baseId,
      quiz_id: props.quizId,
      answer,
    })
    close.value = true

    await getQuizDetailAndStartListen()
  })
}

async function getQuizDetailAndStartListen() {
  const data = await select(props.quizId)
  await setAnswers(data)
  await setPercentage()

  await listen(props.quizId, (record) => {
    answers[record.answer] = answers[record.answer] === undefined ? 1 : answers[record.answer] + 1
    setPercentage()
  })
}

async function setAnswers(data: Awaited<ReturnType<typeof select>>) {
  answers = data.reduce((prev, curr) => {
    prev[curr.answer] = prev[curr.answer] === undefined ? 1 : prev[curr.answer] + 1
    return prev
  }, {} as Record<number, number>)
}

function setPercentage() {
  const total = Object.values(answers).reduce((prev, curr) => prev + curr, 0)
  Object.keys(answers).forEach(answer => questions.value[+answer].percentage = Math.floor(100 * answers[+answer] / total))
}
</script>

<template>
  <div v-loading="loading" class="mb-3 max-w-420px border border-blue-500 rounded-lg bg-white p-4 shadow-sm dark:border-blue-600 dark:bg-gray-800" h-fit>
    <h5 class="mb-3 flex items-center text-base font-semibold dark:text-white">
      <svg class="mr-1 h-[22px] w-[22px] text-blue-500 dark:text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.008-3.018a1.502 1.502 0 0 1 2.522 1.159v.024a1.44 1.44 0 0 1-1.493 1.418 1 1 0 0 0-1.037.999V14a1 1 0 1 0 2 0v-.539a3.44 3.44 0 0 0 2.529-3.256 3.502 3.502 0 0 0-7-.255 1 1 0 0 0 2 .076c.014-.398.187-.774.48-1.044Zm.982 7.026a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2h-.01Z" clip-rule="evenodd" />
      </svg>
      <div>
        {{ title }}
      </div>
    </h5>

    <template v-if="close">
      <div class="space-y-3">
        <div v-for="(question, idx) in questions" :key="idx" class="relative w-full overflow-hidden rounded-2xl bg-gray-400">
          <div class="absolute left-0 top-0 h-full bg-blue-500" :style="`width: ${question.percentage}%`" />
          <div class="relative z-10 px-3 py-[1px] text-sm text-white">
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
            class="w-full transform border-1 border-blue-500 rounded-2xl px-3 py-[1px] text-sm text-blue-500 shadow-sm dark:border-blue-600 hover:bg-blue-600 dark:text-white hover:text-white"
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
