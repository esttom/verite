<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: true,
  },
})

const { context } = useUserContext()
const router = useRouter()
const { loading, withLoadingFn } = useLoading()
const { selectByUserId, remove } = useSupabaseChat()
const { select: selectQuestionnaire } = useSupabaseQuestionnaireDetail()

const headers = [
  {
    prop: 'title',
    label: 'Title',
    width: '320',
  },
  {
    prop: 'description',
    label: 'Description',
  },
  {
    prop: 'action',
    label: 'Go',
    width: '70',
    action: moveToChat,
  },
  {
    prop: 'action',
    label: 'Copy',
    width: '80',
    action: copyUrl,
  },
  {
    prop: 'action',
    label: 'csv',
    width: '80',
    action: createQuestionnaireCsv,
  },
  {
    prop: 'action',
    label: 'Delete',
    width: '90',
    action: deleteData,
  },
]

const qDialogVisible = ref(false)

const contents = ref<Record<string, any>[]>([])

withLoadingFn(async () => {
  await selectData()
})

function moveToChat(row: any) {
  router.push(`/chat/${row.id}`)
}

async function deleteData(row: any) {
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

async function selectData() {
  const data = await selectByUserId(context.userId)
  contents.value = data ?? []
}

function copyUrl(row: any) {
  const url = `${window.location.origin}/chat/${row.id}`
  copyToClipboard(url)
}

async function createQuestionnaireCsv(row: any) {
  const data = await selectQuestionnaire(row.id)
  if (!data || data.length === 0) {
    // eslint-disable-next-line no-alert
    alert('データがありません')
    return
  }
  const keys = Object.keys(data[0].answer as object).map(d => `"${d.replace(/"/g, '""')}"`)
  const values = data.map(d => Object.values(d.answer as object).map(d => `"${d.replace(/"/g, '""')}"`).join(','))
  const csv = `${keys.join(',')}\n${values.join('\n')}`
  const blob = new Blob([csv], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${row.title ?? 'data'}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <el-card w-full>
    <div w="full" flex justify="between" items="end">
      <div flex="column">
        <div class="text-xl">
          Chat
        </div>
        <p class="text-center text-sm text-gray-500" op-80>
          チャット画面を作成します。
        </p>
      </div>
      <div>
        <el-button color="#626aef" @click="qDialogVisible = true">
          Create
        </el-button>
        <ChatCreateDialog v-model="qDialogVisible" @create="onCreate" />
      </div>
    </div>

    <CustomTable v-model="contents" :loading="loading" :headers="headers" />
  </el-card>
</template>
