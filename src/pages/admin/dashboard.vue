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
    label: 'Copy',
    width: '80',
    action: copyToClipboard,
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

// from vitepress
function copyToClipboard(row: any) {
  const url = `${window.location.origin}/questionnaire/${row.id}`
  try {
    return navigator.clipboard.writeText(url)
  }
  catch {
    const element = document.createElement('textarea')
    const previouslyFocusedElement = document.activeElement

    element.value = url

    // Prevent keyboard from showing on mobile
    element.setAttribute('readonly', '')

    element.style.contain = 'strict'
    element.style.position = 'absolute'
    element.style.left = '-9999px'
    element.style.fontSize = '12pt' // Prevent zooming on iOS

    const selection = document.getSelection()
    const originalRange = selection ? selection.rangeCount > 0 && selection.getRangeAt(0) : null

    document.body.appendChild(element)
    element.select()

    // Explicit selection workaround for iOS
    element.selectionStart = 0
    element.selectionEnd = url.length

    document.execCommand('copy')
    document.body.removeChild(element)

    if (originalRange) {
      selection!.removeAllRanges() // originalRange can't be truthy when selection is falsy
      selection!.addRange(originalRange)
    }

    // Get the focus back on the previously focused element, if any
    if (previouslyFocusedElement) {
      (previouslyFocusedElement as HTMLElement).focus()
    }
  }
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
