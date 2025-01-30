<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: true,
  },
})

const router = useRouter()
const { loading, withLoadingFn } = useLoading()
const { select, remove } = useSupabaseQuestionnaire()
const { remove: removeDetail } = useSupabaseQuestionnaireDetail()

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
    action: moveToRoom,
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

async function moveToRoom(row: any) {
  router.push(`/questionnaire/${row.id}`)
}

async function deleteData(row: any) {
  // eslint-disable-next-line no-alert
  if (!window.confirm('Are you sure you want to delete?')) {
    return
  }

  withLoadingFn(async () => {
    await removeDetail(row.id)
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
  const data = await select()
  contents.value = data
}
</script>

<template>
  <el-card w-full>
    <div w="full" flex justify="between" items="end">
      <div flex="column">
        <div class="text-xl">
          Questionnaire
        </div>
        <p class="text-center text-sm text-gray-500" op-80>
          anonymous questionnaire
        </p>
      </div>
      <div>
        <el-button color="#626aef" @click="qDialogVisible = true">
          Create
        </el-button>
        <QuestionDialog v-model="qDialogVisible" @create="onCreate" />
      </div>
    </div>

    <CustomTable v-model="contents" :loading="loading" :headers="headers" />
  </el-card>
</template>
