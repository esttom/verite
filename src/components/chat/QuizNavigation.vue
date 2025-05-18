<script setup lang="ts">
import type { QuizStateType } from '~/composables'
import { QuizState } from '~/composables'

type QuizList = Awaited<ReturnType<typeof select>>

const props = defineProps<{ chatId: string }>()

const statusColor = {
  [QuizState.ACTIVE]: 'bg-green-100 dark:bg-green-900 dark:text-green-300',
  [QuizState.COMPLETED]: 'bg-purple-100 dark:bg-purple-900 dark:text-purple-300',
  [QuizState.WAITING]: 'bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
}

const visible = ref(false)
const contents = ref<QuizList>([])

const dialogId = ref<string | undefined>(undefined)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogQuestions = ref(['', '', '', ''])

const page = ref(0)
const pageMax = ref(0)
const { loading, withLoadingFn } = useLoading()
const { insert: chatDetailInsert } = useSupabaseChatDetail()
const { insert, updateQuestion, select, updateState } = useSupabaseQuiz()
const sender = useSupabaseRealtimeSender()

watch(visible, async () => {
  if (visible.value) {
    await selectData()
  }
})

function openQuizDialog(title: string, questions: string[], id?: string) {
  dialogId.value = id
  dialogTitle.value = title
  dialogQuestions.value = JSON.parse(JSON.stringify(questions))
  dialogVisible.value = true
}

function changeQuiz(row: any) {
  if (!statusCheck(row.status)) {
    return
  }
  openQuizDialog(row.title, row.questions, row.id)
}

async function sendQuiz(row: QuizList[number]) {
  if (!statusCheck(row.status)) {
    return
  }

  // eslint-disable-next-line no-alert
  if (!window.confirm('クイズを送信して良いですか?')) {
    return
  }

  const data = await chatDetailInsert({
    chat_id: props.chatId,
    content: '',
    reply: null,
    quiz_id: row.id,
  })
  if (data) {
    sender('chat-insert', { ...data })
  }

  await updateState({
    id: row.id,
    status: ChatState.ACTIVE,
  })
  contents.value[page.value - 1].status = ChatState.ACTIVE
}

async function closeQuiz(row: QuizList[number]) {
  if (row.status !== QuizState.ACTIVE) {
    // eslint-disable-next-line no-alert
    alert('このクイズは終了できません。')
    return false
  }

  // eslint-disable-next-line no-alert
  if (!window.confirm('クイズを終了して良いですか?')) {
    return
  }

  await updateState({
    id: row.id,
    status: ChatState.COMPLETED,
  })
  contents.value[page.value - 1].status = ChatState.COMPLETED
}

async function selectData() {
  await withLoadingFn(async () => {
    const data = await select(props.chatId)
    contents.value = data
    if (contents.value.length > 0) {
      page.value = 1
      pageMax.value = contents.value.length
    }
  })
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

async function quizSubmit(data: { id: string | undefined, title: string, questions: string[] }) {
  if (data.id) {
    await updateQuestion({
      id: data.id,
      title: data.title,
      questions: data.questions,
    })
    contents.value[page.value - 1].title = data.title
    contents.value[page.value - 1].questions = data.questions
  }
  else {
    await insert({
      chat_id: props.chatId,
      title: data.title,
      questions: data.questions,
    })
    await selectData()
  }
}

function prev() {
  if (page.value > 1) {
    page.value--
  }
}

function next() {
  if (page.value < contents.value.length) {
    page.value++
  }
}
</script>

<template>
  <div class="fixed bottom-30 right-6">
    <div v-if="visible" v-loading="loading" class="mb-2 flex flex-col items-center justify-center">
      <div class="w-sm flex flex-col justify-center border border-gray-200 rounded-lg bg-white px-4 pb-3 pt-1 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-2 w-full flex items-center justify-between">
          <button type="button" class="h-8 w-6 inline-flex items-center justify-center rounded-s-lg bg-gray-100 px-1 dark:bg-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800" @click="prev">
            <svg class="h-2 w-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
            </svg>
            <span class="sr-only">Previous page</span>
          </button>
          <div v-if="page > 0" class="relative mx-2 w-full px-4 py-2">
            <div>
              <span class="me-2 rounded-sm px-2.5 py-0.5 text-xs text-blue-800 font-medium" :class="statusColor[contents[page - 1].status]">
                {{ contents[page - 1].status }}
              </span>
            </div>
            <h5 class="mt-1 text-lg text-gray-900 font-bold tracking-tight dark:text-white">
              {{ contents[page - 1].title }}
            </h5>
            <p class="mb-3 text-sm text-gray-700 font-normal dark:text-gray-400">
              {{ contents[page - 1].questions.join(',') }}
            </p>
            <div class="flex justify-center">
              <div class="shadow-xs inline-flex rounded-md" role="group">
                <button type="button" class="border border-gray-200 rounded-s-lg bg-white px-4 py-2 text-sm text-gray-900 font-medium focus:z-10 dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:text-white focus:text-blue-700 hover:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:hover:bg-gray-700 dark:focus:text-white dark:hover:text-white dark:focus:ring-blue-500" @click="changeQuiz(contents[page - 1])">
                  変更
                </button>
                <button type="button" class="border-b border-t border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 font-medium focus:z-10 dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:text-white focus:text-blue-700 hover:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:hover:bg-gray-700 dark:focus:text-white dark:hover:text-white dark:focus:ring-blue-500" @click="sendQuiz(contents[page - 1])">
                  送信
                </button>
                <button type="button" class="border border-gray-200 rounded-e-lg bg-white px-4 py-2 text-sm text-gray-900 font-medium focus:z-10 dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:text-white focus:text-blue-700 hover:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:hover:bg-gray-700 dark:focus:text-white dark:hover:text-white dark:focus:ring-blue-500" @click="closeQuiz(contents[page - 1])">
                  終了
                </button>
              </div>
            </div>
          </div>
          <div v-else>
            Not found
          </div>
          <button type="button" class="h-8 w-6 inline-flex items-center justify-center rounded-e-lg bg-gray-100 px-1 dark:bg-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800" @click="next">
            <svg class="h-2 w-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
            </svg>
            <span class="sr-only">Next page</span>
          </button>
        </div>

        <div class="flex items-center justify-between border-t pt-2.5 dark:border-gray-600">
          <button type="button" class="group inline-flex flex-col items-center justify-center" @click="openQuizDialog('', ['', '', '', ''])">
            <svg class="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M.188 5H5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707c-.358.362-.617.81-.753 1.3C.148 5.011.166 5 .188 5ZM14 8a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm2 7h-1v1a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1 0-2h1v-1a1 1 0 0 1 2 0v1h1a1 1 0 0 1 0 2Z" />
              <path d="M6 14a7.969 7.969 0 0 1 10-7.737V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H.188A.909.909 0 0 1 0 6.962V18a1.969 1.969 0 0 0 1.933 2h6.793A7.976 7.976 0 0 1 6 14Z" />
            </svg>
            <span class="text-xs group-hover:text-blue-600 dark:group-hover:text-blue-500">新規作成</span>
          </button>

          <div>
            {{ `${page} / ${pageMax}` }}
          </div>
        </div>
      </div>
    </div>

    <button type="button" class="ml-auto h-10 w-10 flex items-center justify-center rounded-lg bg-blue-700 text-white dark:bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="visible = !visible">
      <svg class="h-6 w-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
      </svg>
      <span class="sr-only">Open actions menu</span>
    </button>

    <QuizDialog :id="dialogId" v-model="dialogVisible" :chat-id="props.chatId" :title="dialogTitle" :questions="dialogQuestions" :submit="quizSubmit" />
  </div>
</template>
