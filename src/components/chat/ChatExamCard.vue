<script setup lang="ts">
import type { ExamResult, PublicExam } from '~/composables'

const props = defineProps<{ examId: string }>()
const { selectPublic, grade } = useSupabaseExam()
const { loading, withLoadingFn } = useLoading()

const exam = ref<PublicExam | null>(null)
const loadError = ref(false)
const detailVisible = ref(false)
const page = ref(0)
const answers = ref<Record<string, string>>({})
const result = ref<ExamResult | null>(null)
const submitError = ref('')

withLoadingFn(async () => {
  try {
    exam.value = await selectPublic(props.examId)
    loadError.value = !exam.value
  }
  catch {
    loadError.value = true
  }
})

const currentQuestion = computed(() => exam.value?.items[page.value])
const allAnswered = computed(() => exam.value?.items.every(item => !!answers.value[item.id]) ?? false)

function next() {
  if (exam.value && page.value < exam.value.items.length - 1) {
    page.value++
  }
}

function previous() {
  if (page.value > 0) {
    page.value--
  }
}

function submit() {
  if (!allAnswered.value) {
    submitError.value = 'すべての問題に回答してください。'
    return
  }
  withLoadingFn(async () => {
    try {
      result.value = grade(exam.value!, answers.value)
      submitError.value = ''
    }
    catch {
      submitError.value = '採点できませんでした。時間をおいて再度お試しください。'
    }
  })
}

function retry() {
  answers.value = {}
  result.value = null
  page.value = 0
  submitError.value = ''
}

function choiceText(questionId: string, choiceId: string) {
  const question = exam.value?.items.find(item => item.id === questionId)
  return question?.choices.find(choice => choice.id === choiceId)?.text ?? ''
}
</script>

<template>
  <div v-loading="loading">
    <ProblemSummaryCard
      v-if="exam"
      :title="exam.title"
      :description="result ? `${result.score} / ${result.total} 点` : exam.description"
      :status="result ? '回答済み' : '未回答'"
      :action-label="result ? '結果を見る' : '回答する'"
      @open="detailVisible = true"
    />
    <ProblemSummaryCard
      v-else-if="loadError"
      title="問題を読み込めません"
      description="管理者によるデータベース設定が必要です。"
      status="利用不可"
      action-label="閉じる"
    />

    <ProblemDetailDialog v-if="exam" v-model="detailVisible" :title="exam.title">
      <template v-if="result">
        <div class="mb-5 text-center">
          <div class="text-3xl text-blue-600 font-bold">
            {{ result.score }} / {{ result.total }} 点
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="(item, index) in result.results" :key="item.questionId" class="border rounded-lg p-3 dark:border-gray-600">
            <div class="font-medium">
              {{ index + 1 }}. {{ exam.items[index]?.prompt }}
            </div>
            <div class="mt-1 text-sm" :class="item.correct ? 'text-green-600' : 'text-red-600'">
              {{ item.correct ? '正解' : '不正解' }}：{{ choiceText(item.questionId, item.selectedChoiceId) }}
            </div>
            <div v-if="!item.correct" class="mt-1 text-sm text-gray-500">
              正解：{{ choiceText(item.questionId, item.correctChoiceId) }}
            </div>
            <div v-if="exam.items[index]?.explanation" class="mt-3 rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-700">
              <div class="mb-1 font-semibold">
                解説
              </div>
              <div class="whitespace-pre-wrap">
                {{ exam.items[index].explanation }}
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <el-button @click="retry">
            もう一度回答
          </el-button>
        </div>
      </template>

      <template v-else-if="currentQuestion">
        <div class="mb-3 text-sm text-gray-500">
          {{ page + 1 }} / {{ exam.items.length }}
        </div>
        <h4 class="mb-4 whitespace-pre-wrap text-lg font-semibold">
          {{ currentQuestion.prompt }}
        </h4>
        <div class="space-y-2">
          <label v-for="choice in currentQuestion.choices" :key="choice.id" class="flex cursor-pointer items-center gap-3 border rounded-lg p-3 dark:border-gray-600">
            <input v-model="answers[currentQuestion.id]" type="radio" :name="currentQuestion.id" :value="choice.id" class="h-5 w-5">
            <span>{{ choice.text }}</span>
          </label>
        </div>
        <p v-if="submitError" class="mt-3 text-sm text-red-600">
          {{ submitError }}
        </p>
        <div class="mt-5 flex items-center justify-between">
          <el-button :disabled="page === 0" @click="previous">
            前へ
          </el-button>
          <el-button v-if="page < exam.items.length - 1" color="#626aef" @click="next">
            次へ
          </el-button>
          <el-button v-else color="#626aef" :disabled="!allAnswered" @click="submit">
            回答を送信
          </el-button>
        </div>
      </template>
    </ProblemDetailDialog>
  </div>
</template>
