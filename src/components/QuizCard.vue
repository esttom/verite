<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'

const props = defineProps<{ quizId: string }>()

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
      base_id: props.quizId,
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
  <div v-loading="loading" class="mb-3 max-w-420px border-1 border-[#8a8bf9] rounded-xl bg-white pa-3" h-fit>
    <div class="mb-3 flex items-center border-b-1 text-#8a8bf9 font-bold">
      <QuestionFilled class="mr-1 w-[18px]" />
      <span class="text-sm">{{ title }}</span>
    </div>

    <template v-if="close">
      <div class="space-y-2">
        <div v-for="(question, idx) in questions" :key="idx" class="relative w-full overflow-hidden rounded-2xl bg-gray-400">
          <div class="absolute left-0 top-0 h-full bg-[#8a8bf9]" :style="`width: ${question.percentage}%`" />
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
            class="w-full transform border-1 border-[#8a8bf9] rounded-2xl py-[1px] text-sm text-[#8a8bf9] shadow-sm hover:bg-[#7a7be0] hover:text-white"
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
