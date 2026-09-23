<script setup lang="ts">
import type { QuizStateType } from '~/composables'
import { QuizState } from '~/composables'

type QuizList = Awaited<ReturnType<typeof select>>

const props = withDefaults(defineProps<{ chatId: string, embedded?: boolean }>(), { embedded: false })

const contents = ref<QuizList>([])
const dialogId = ref<string | undefined>()
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogQuestions = ref(['', '', '', ''])
const { loading, withLoadingFn } = useLoading()
const { insert: chatDetailInsert } = useSupabaseChatDetail()
const { insert, updateQuestion, select, updateState } = useSupabaseQuiz()
const sender = useSupabaseRealtimeSender()

const statusLabel: Record<QuizStateType, string> = {
  [QuizState.WAITING]: '未公開',
  [QuizState.ACTIVE]: '公開中',
  [QuizState.COMPLETED]: '終了',
}

function openQuizDialog(title = '', questions = ['', '', '', ''], id?: string) {
  dialogId.value = id
  dialogTitle.value = title
  dialogQuestions.value = JSON.parse(JSON.stringify(questions))
  dialogVisible.value = true
}

function editQuiz(row: QuizList[number]) {
  if (row.status !== QuizState.WAITING) {
    return
  }
  openQuizDialog(row.title, row.questions, row.id)
}

async function publish(row: QuizList[number]) {
  if (row.status !== QuizState.WAITING) {
    return
  }
  // eslint-disable-next-line no-alert
  if (!window.confirm('この投票を公開しますか？')) {
    return
  }
  await withLoadingFn(async () => {
    const data = await chatDetailInsert({
      chat_id: props.chatId,
      content: '',
      reply: null,
      quiz_id: row.id,
      exam_id: null,
      question: false,
      anon_id: '',
    })
    if (data) {
      sender('chat-insert', { ...data })
    }
    await updateState({ id: row.id, status: QuizState.ACTIVE })
    row.status = QuizState.ACTIVE
  })
}

async function finish(row: QuizList[number]) {
  if (row.status !== QuizState.ACTIVE) {
    return
  }
  // eslint-disable-next-line no-alert
  if (!window.confirm('この投票を終了しますか？')) {
    return
  }
  await withLoadingFn(async () => {
    await updateState({ id: row.id, status: QuizState.COMPLETED })
    row.status = QuizState.COMPLETED
  })
}

async function load() {
  await withLoadingFn(async () => {
    contents.value = await select(props.chatId)
  })
}

async function quizSubmit(data: { id: string | undefined, title: string, questions: string[] }) {
  if (data.id) {
    await updateQuestion({ id: data.id, title: data.title, questions: data.questions })
    const row = contents.value.find(item => item.id === data.id)
    if (row) {
      row.title = data.title
      row.questions = data.questions
    }
  }
  else {
    await insert({ chat_id: props.chatId, title: data.title, questions: data.questions })
    await load()
  }
}

onMounted(load)
</script>

<template>
  <section v-loading="loading">
    <div class="mb-3 flex items-center justify-between gap-3">
      <div>
        <h3 class="font-semibold">
          投票
        </h3>
        <p class="text-xs text-gray-500">
          1つの質問を送り、回答の割合を表示します。
        </p>
      </div>
      <el-button color="#626aef" @click="openQuizDialog()">
        投票を追加
      </el-button>
    </div>

    <div v-if="contents.length === 0" class="border rounded-lg border-dashed p-4 text-center text-sm text-gray-500 dark:border-gray-600">
      投票はまだありません。
    </div>
    <div v-else class="space-y-2">
      <div v-for="row in contents" :key="row.id" class="border rounded-lg p-3 dark:border-gray-600">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <div class="truncate font-medium">
              {{ row.title }}
            </div>
            <div class="text-xs text-gray-500">
              {{ row.questions.length }}択
            </div>
          </div>
          <span class="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">
            {{ statusLabel[row.status] }}
          </span>
        </div>
        <div class="mt-2 flex flex-wrap justify-end gap-2">
          <el-button :disabled="row.status !== QuizState.WAITING" @click="editQuiz(row)">
            変更
          </el-button>
          <el-button v-if="row.status === QuizState.ACTIVE" @click="finish(row)">
            終了
          </el-button>
          <el-button color="#626aef" :disabled="row.status !== QuizState.WAITING" @click="publish(row)">
            {{ row.status === QuizState.WAITING ? '公開' : '公開済み' }}
          </el-button>
        </div>
      </div>
    </div>

    <QuizDialog :id="dialogId" v-model="dialogVisible" :chat-id="props.chatId" :title="dialogTitle" :questions="dialogQuestions" :submit="quizSubmit" />
  </section>
</template>
