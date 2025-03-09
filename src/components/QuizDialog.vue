<script setup lang="ts">
import { Close, Plus } from '@element-plus/icons-vue'

const props = defineProps<{ baseId: string, id: string | undefined, title: string, questions: string[] }>()
const emits = defineEmits(['create'])

const qDialogVisible = defineModel<boolean>({ default: false })

const { insert, updateQuestion } = useSupabaseQuiz()
const { loading, withLoadingFn } = useLoading()

const qDialogForm = reactive({
  title: '',
  questions: ['', '', '', ''],
})

function addQuestion() {
  if (qDialogForm.questions.length < 8) {
    qDialogForm.questions.push('')
  }
}

function removeQuestion(idx: number) {
  if (qDialogForm.questions.length > 2) {
    qDialogForm.questions.splice(idx, 1)
  }
}

function onOpen() {
  qDialogForm.title = props.title
  qDialogForm.questions = props.questions
}

function ok() {
  withLoadingFn(async () => {
    if (props.id) {
      await updateQuestion({
        id: props.id,
        ...qDialogForm,
      })
    }
    else {
      await insert({
        base_id: props.baseId,
        ...qDialogForm,
      })
    }
    emits('create')
    qDialogVisible.value = false
  })
}
</script>

<template>
  <el-dialog v-model="qDialogVisible" title="Quiz" width="90%" max-w="600px" min-w="400px" @open="onOpen">
    <el-form v-loading="loading" :model="qDialogForm" label-width="auto">
      <el-form-item label="Title">
        <el-input v-model="qDialogForm.title" autocomplete="off" />
      </el-form-item>
      <el-form-item v-for="(_, idx) in qDialogForm.questions" :key="idx" :label="`option ${idx + 1}`">
        <el-input v-model="qDialogForm.questions[idx]">
          <template #append>
            <el-button :icon="Close" @click="removeQuestion(idx)" />
          </template>
        </el-input>
      </el-form-item>
      <el-button :icon="Plus" @click="addQuestion" />
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
