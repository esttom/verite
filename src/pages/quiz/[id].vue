<script setup lang="ts">
const baseId = useRoute('/quiz/[id]').params.id
const qDialogVisible = ref(false)
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
  {
    prop: 'action',
    label: 'Delete',
    width: '90',
    action: deleteQuiz,
  },
]

const router = useRouter()
const { insert: questionnaireDetailInsert } = useSupabaseQuestionnaireDetail()
const { select, remove } = useSupabaseQuiz()
const { loading, withLoadingFn } = useLoading()

withLoadingFn(async () => {
  await selectData()
})

function home() {
  router.push('/admin/dashboard')
}

async function selectData() {
  const data = await select(baseId)
  contents.value = data
}

async function sendQuiz(row: any) {
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
  // eslint-disable-next-line no-alert
  alert('add quiz!')
}

function closeQuiz() {
}

function deleteQuiz(row: any) {
  // eslint-disable-next-line no-alert
  if (!window.confirm('Are you sure you want to delete?')) {
    return
  }

  withLoadingFn(async () => {
    await remove(row.id)
    await selectData()
  })
}

function onCreate() {
  withLoadingFn(async () => {
    await selectData()
  })
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
          <el-button color="#626aef" @click="qDialogVisible = true">
            Create
          </el-button>
          <QuizDialog v-model="qDialogVisible" :base-id="baseId" @create="onCreate" />
        </div>
      </div>

      <CustomTable v-model="contents" :loading="loading" :headers="headers" />
    </el-card>
  </div>
</template>
