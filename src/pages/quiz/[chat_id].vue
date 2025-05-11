<script setup lang="ts">
import { QuizState, type QuizStateType } from '~/composables'

const chatId = useRoute('/quiz/[chat_id]').params.chat_id
const qDialogId = ref<string | undefined>(undefined)
const qDialogVisible = ref(false)
const qDialogTitle = ref('')
const qDialogQuestions = ref(['', '', '', ''])
const contents = ref<Record<string, any>[]>([])

const headers = [
  {
    prop: 'title',
    label: 'Title',
  },
  {
    prop: 'questions',
    label: 'Options',
    width: '320',
  },
  {
    prop: 'action',
    label: 'Change',
    width: '100',
    action: changeQuiz,
  },
  {
    prop: 'action',
    label: 'Send',
    width: '80',
    action: sendQuiz,
  },
  {
    prop: 'action',
    label: 'Close',
    width: '90',
    action: closeQuiz,
  },
]

const router = useRouter()
const { insert: chatDetailInsert } = useSupabaseChatDetail()
const { select, updateState } = useSupabaseQuiz()
const { loading, withLoadingFn } = useLoading()

selectData()

function home() {
  router.push('/admin/dashboard')
}

async function selectData() {
  await withLoadingFn(async () => {
    const data = await select(chatId)
    contents.value = data
  })
}

function openQuizDialog(title: string, questions: string[], id?: string) {
  qDialogId.value = id
  qDialogTitle.value = title
  qDialogQuestions.value = JSON.parse(JSON.stringify(questions))
  qDialogVisible.value = true
}

function changeQuiz(row: any) {
  if (!statusCheck(row.status)) {
    return
  }
  openQuizDialog(row.title, row.questions, row.id)
}

async function sendQuiz(row: any) {
  if (!statusCheck(row.status)) {
    return
  }

  // eslint-disable-next-line no-alert
  if (!window.confirm('クイズを送信して良いですか?')) {
    return
  }

  await chatDetailInsert({
    chat_id: chatId,
    content: '',
    reply: null,
    quiz_id: row.id,
  })
  await updateState({
    id: row.id,
    status: ChatState.ACTIVE,
  })
  await selectData()
  // eslint-disable-next-line no-alert
  alert('クイズを送信しました。')
}

async function closeQuiz(row: any) {
  if (row.status !== QuizState.ACTIVE) {
    // eslint-disable-next-line no-alert
    alert('このクイズは終了できません。')
    return false
  }

  await updateState({
    id: row.id,
    status: ChatState.COMPLETED,
  })
  await selectData()
  // eslint-disable-next-line no-alert
  alert('このクイズは終了しました。')
}

function onCreate() {
  selectData()
}

function statusCheck(status: QuizStateType) {
  if (status === QuizState.ACTIVE) {
    // eslint-disable-next-line no-alert
    alert('すでに送信されています。')
    return false
  }
  else if (status === QuizState.COMPLETED) {
    // eslint-disable-next-line no-alert
    alert('すでに終了しています。')
    return false
  }
  return true
}
</script>

<template>
  <div w="full" max-w="1024px" min-w="480px" flex="column">
    <div justify="center" mb-3 flex @click="home">
      <img src="/logo.png" alt="logo" cursor="pointer" width="48px" text="center">
    </div>
    <el-card w-full>
      <div w="full" flex justify="between" items="end">
        <div flex="column">
          <div class="text-xl">
            Quiz
          </div>
          <p class="text-center text-sm text-gray-500" op-80>
            クイズを作成します。
          </p>
        </div>
        <div>
          <el-button color="#626aef" @click="openQuizDialog('', ['', '', '', ''])">
            Create
          </el-button>
          <QuizDialog :id="qDialogId" v-model="qDialogVisible" :chat-id="chatId" :title="qDialogTitle" :questions="qDialogQuestions" @create="onCreate" />
        </div>
      </div>

      <CustomTable v-model="contents" :loading="loading" :headers="headers" />
    </el-card>
  </div>
</template>
