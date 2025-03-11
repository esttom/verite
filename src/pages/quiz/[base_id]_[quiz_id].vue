<script setup lang="ts">
const baseId = useRoute('/quiz/[base_id]_[quiz_id]').params.base_id
const quizId = useRoute('/quiz/[base_id]_[quiz_id]').params.quiz_id
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
    width: '90',
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
const { insert: questionnaireDetailInsert } = useSupabaseQuestionnaireDetail()
const { select, updateState } = useSupabaseQuiz()
const { loading, withLoadingFn } = useLoading()

selectData()

function home() {
  router.push('/admin/dashboard')
}

async function selectData() {
  await withLoadingFn(async () => {
    const data = await select(quizId)
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
  if (!sentCheck(row.sent)) {
    return
  }
  openQuizDialog(row.title, row.questions, row.id)
}

async function sendQuiz(row: any) {
  if (!sentCheck(row.sent)) {
    return
  }

  // eslint-disable-next-line no-alert
  if (!window.confirm('Are you sure you want to send quiz?')) {
    return
  }

  await questionnaireDetailInsert({
    base_id: baseId,
    content: '',
    reply: null,
    stamp: false,
    quiz_id: row.id,
  })
  await updateState({
    id: row.id,
    sent: true,
  })
  await selectData()
  // eslint-disable-next-line no-alert
  alert('add quiz!')
}

async function closeQuiz(row: any) {
  if (row.close) {
    // eslint-disable-next-line no-alert
    alert('already close')
    return
  }

  await updateState({
    id: row.id,
    close: true,
  })
  await selectData()
  // eslint-disable-next-line no-alert
  alert('response are closed!')
}

function onCreate() {
  selectData()
}

function sentCheck(sent: boolean) {
  if (sent) {
    // eslint-disable-next-line no-alert
    alert('already sent')
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
            create quiz
          </p>
        </div>
        <div>
          <el-button color="#626aef" @click="openQuizDialog('', ['', '', '', ''])">
            Create
          </el-button>
          <QuizDialog :id="qDialogId" v-model="qDialogVisible" :quiz-id="quizId" :title="qDialogTitle" :questions="qDialogQuestions" @create="onCreate" />
        </div>
      </div>

      <CustomTable v-model="contents" :loading="loading" :headers="headers" />
    </el-card>
  </div>
</template>
