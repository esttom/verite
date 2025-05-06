<script setup lang="ts">
const emits = defineEmits(['create'])

const qDialogVisible = defineModel<boolean>({ default: false })

const { context } = useUserContext()
const { insert } = useSupabaseChat()
const { loading, withLoadingFn } = useLoading()

const qDialogForm = reactive({
  title: '',
  description: '',
})

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
</script>

<template>
  <el-dialog v-model="qDialogVisible" title="Questionnaire" width="90%" max-w="600px" min-w="400px" @open="onOpen">
    <el-form v-loading="loading" :model="qDialogForm" label-width="auto">
      <el-form-item label="Title">
        <el-input v-model="qDialogForm.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="qDialogForm.description" autocomplete="off" />
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
