<script setup lang="ts">
import type { ChoiceQuestionDraft } from '~/composables'
import { choiceQuestionFromStrings, validateChoiceQuestion } from '~/composables'

const props = defineProps<{
  id: string | undefined
  title: string
  questions: string[]
  submit: (data: { id: string | undefined, title: string, questions: string[] }) => Promise<void>
}>()

const qDialogVisible = defineModel<boolean>({ default: false })

const { loading, withLoadingFn } = useLoading()

const hasError = ref(false)
const errorMessage = ref('')
const question = ref<ChoiceQuestionDraft>(choiceQuestionFromStrings('', ['', '', '', '']))

function onOpen() {
  question.value = choiceQuestionFromStrings(props.title, props.questions)
  errorMessage.value = ''
}

function ok() {
  const errors = validateChoiceQuestion(question.value)
  if (errors.length > 0) {
    errorMessage.value = errors[0]
    setError()
    return
  }
  withLoadingFn(async () => {
    await props.submit({
      id: props.id,
      title: question.value.prompt.trim(),
      questions: question.value.choices.map(choice => choice.text.trim()),
    })
    qDialogVisible.value = false
  })
}

function setError() {
  hasError.value = true
  setTimeout(() => (hasError.value = false), 300)
}
</script>

<template>
  <el-dialog v-model="qDialogVisible" title="投票問題" width="90%" max-w="600px" :class="{ shake: hasError }" @open="onOpen">
    <div v-loading="loading">
      <ChoiceQuestionEditor v-model:question="question" :removable="false" />
      <p v-if="errorMessage" class="mt-2 text-sm text-red-600">
        {{ errorMessage }}
      </p>
    </div>
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
