<script setup lang="ts">
import { QuizState } from '~/composables'

const props = defineProps<{ chatId: string, quizId: string }>()

const close = ref(false)
const detailVisible = ref(false)
const title = ref('')
const total = ref(0)
const selectedAnswer = ref<number | null>(null)
const questions = ref<{ text: string, percentage: number }[]>([])

const { add, collectAnswer, registerListener } = useQuiz()
const { selectById } = useSupabaseQuiz()
const { insert, select } = useSupabaseQuizDetail()
const sender = useSupabaseRealtimeSender()
const { loading, withLoadingFn } = useLoading()

withLoadingFn(async () => {
  const data = await selectById(props.quizId)
  title.value = data.title
  questions.value = data.questions.map(q => ({ text: q, percentage: 0 }))
  close.value = data.status === QuizState.COMPLETED
  await getAnswer()
})

registerListener(props.quizId, () => {
  setDisplayData()
})

function sendAnswer() {
  if (selectedAnswer.value === null) {
    return
  }
  withLoadingFn(async () => {
    const { id, quiz_id } = await insert({
      quiz_id: props.quizId,
      answer: selectedAnswer.value!,
    })
    sender('quiz', { id, quiz_id, answer: selectedAnswer.value })
    close.value = true
  })
}

function retry() {
  close.value = false
  selectedAnswer.value = null
}

async function getAnswer() {
  const data = await select(props.quizId)
  for (const d of data) {
    add(d.quiz_id, d.id, d.answer)
  }
  setDisplayData()
}

function setDisplayData() {
  const answerCalcData = Array.from({ length: questions.value.length }).fill(0) as number[]
  const answers = collectAnswer(props.quizId)
  total.value = answers.length
  answers.forEach(a => answerCalcData[a]++)
  answerCalcData.forEach((t, idx) => questions.value[idx].percentage = total.value === 0 ? 0 : Math.floor(100 * t / total.value))
}
</script>

<template>
  <div v-loading="loading">
    <ProblemSummaryCard
      :title="title"
      :description="`${total} 票`"
      :status="close ? '回答済み' : '未回答'"
      :action-label="close ? '結果を見る' : '回答する'"
      @open="detailVisible = true"
    />

    <ProblemDetailDialog v-model="detailVisible" :title="title">
      <template v-if="close">
        <div class="mb-4 space-y-3">
          <div v-for="(question, idx) in questions" :key="idx" class="relative w-full overflow-hidden rounded-2xl bg-gray-400">
            <div class="absolute left-0 top-0 h-full bg-blue-600" :style="`width: ${question.percentage}%`" />
            <div class="relative px-3 py-[1px] text-sm text-gray-300">
              {{ question.text }} - {{ question.percentage }}%
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <el-button @click="retry">
            もう一度回答
          </el-button>
        </div>
      </template>
      <template v-else>
        <div class="space-y-2">
          <label
            v-for="(question, idx) in questions"
            :key="idx"
            class="flex cursor-pointer items-center gap-3 border rounded-lg p-3 dark:border-gray-600"
          >
            <input v-model="selectedAnswer" type="radio" name="quiz-answer" :value="idx" class="h-5 w-5">
            <span>{{ question.text }}</span>
          </label>
        </div>
        <div class="mt-5 flex justify-end">
          <el-button color="#626aef" :disabled="selectedAnswer === null" @click="sendAnswer">
            回答を送信
          </el-button>
        </div>
      </template>
    </ProblemDetailDialog>
  </div>
</template>

<style scoped>
.progress-card ::v-deep(.el-progress-bar__outer) {
  background-color: rgba(45, 62, 102, 0.42);
}
</style>
