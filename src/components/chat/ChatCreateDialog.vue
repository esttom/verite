<script setup lang="ts">
const emits = defineEmits(['create'])

const qDialogVisible = defineModel<boolean>({ default: false })

const { context } = useUserContext()
const { insert } = useSupabaseChat()
const { selectByUserId, insert: insertQuestionnaire, update: updateQuestionnaire } = useSupabaseQuestionnaire()
const { loading, withLoadingFn } = useLoading()

const qDialogForm = reactive({
  title: '',
  description: '',
  questionnaire_id: '',
})

const formList = ref<Record<string, any>[]>([])

function onOpen() {
  qDialogForm.title = ''
  qDialogForm.description = ''
}

function ok() {
  withLoadingFn(async () => {
    await insert({
      user_id: context.userId,
      ...qDialogForm,
    })
    emits('create')
    qDialogVisible.value = false
  })
}

async function onQuestionnaireSave(data: { id: string, title: string, data: Record<string, any>[] }) {
  if (data.id) {
    await updateQuestionnaire(data.id, { title: data.title, data: data.data })
  }
  else {
    await insertQuestionnaire({ title: data.title, data: data.data })
  }
  await fetchLatestData()
}

function onSelected(data: { id: string, title: string }) {
  qDialogForm.questionnaire_id = data.id
}

async function fetchLatestData() {
  formList.value = await selectByUserId(context.userId) ?? []
}

watch(qDialogVisible, async () => {
  if (qDialogVisible.value) {
    await fetchLatestData()
  }
})
</script>

<template>
  <el-dialog v-model="qDialogVisible" title="Chat" width="90%" max-w="600px" min-w="400px" @open="onOpen">
    <el-form v-loading="loading" :model="qDialogForm" label-width="auto">
      <el-form-item label="Title">
        <el-input v-model="qDialogForm.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="qDialogForm.description" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Questionnaire">
        <FormInput :list="formList" @save="onQuestionnaireSave" @selected="onSelected" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="qDialogVisible = false">
          Cancel
        </el-button>
        <el-button color="#626aef" @click="ok">
          OK
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
