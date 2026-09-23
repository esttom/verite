<script setup lang="ts">
import type { ExamDraft } from '~/composables'
import { Plus } from '@element-plus/icons-vue'
import { createChoiceQuestionDraft, validateChoiceQuestion } from '~/composables'

const props = defineProps<{
  initial?: ExamDraft
  submit: (draft: ExamDraft) => Promise<void>
}>()

const visible = defineModel<boolean>({ required: true })
const { loading, withLoadingFn } = useLoading()
const draft = ref<ExamDraft>(emptyDraft())
const errorMessage = ref('')

function emptyDraft(): ExamDraft {
  return { title: '', description: '', questions: [createChoiceQuestionDraft()] }
}

function reset() {
  draft.value = props.initial
    ? JSON.parse(JSON.stringify(props.initial)) as ExamDraft
    : emptyDraft()
  errorMessage.value = ''
}

function addQuestion() {
  draft.value.questions.push(createChoiceQuestionDraft())
}

function removeQuestion(index: number) {
  if (draft.value.questions.length > 1) {
    draft.value.questions.splice(index, 1)
  }
}

function validate() {
  if (!draft.value.title.trim()) {
    return 'タイトルを入力してください。'
  }
  for (let index = 0; index < draft.value.questions.length; index++) {
    const errors = validateChoiceQuestion(draft.value.questions[index], true)
    if (errors.length > 0) {
      return `問題 ${index + 1}: ${errors[0]}`
    }
  }
  return ''
}

function save() {
  errorMessage.value = validate()
  if (errorMessage.value) {
    return
  }
  withLoadingFn(async () => {
    await props.submit(draft.value)
    visible.value = false
  })
}

watch(visible, (open) => {
  if (open) {
    reset()
  }
})
</script>

<template>
  <el-dialog v-model="visible" title="テストを作成" width="94%" style="max-width: 720px" @open="reset">
    <div v-loading="loading" class="max-h-[72vh] overflow-y-auto px-1">
      <el-form label-position="top">
        <el-form-item label="タイトル">
          <el-input v-model="draft.title" input-style="font-size: 16px" />
        </el-form-item>
        <el-form-item label="説明">
          <el-input v-model="draft.description" type="textarea" :rows="2" input-style="font-size: 16px" />
        </el-form-item>
      </el-form>

      <div class="space-y-3">
        <div v-for="(question, index) in draft.questions" :key="question.id">
          <div class="mb-1 text-sm font-medium">
            問題 {{ index + 1 }}
          </div>
          <ChoiceQuestionEditor
            v-model:question="draft.questions[index]"
            require-correct
            show-explanation
            :removable="draft.questions.length > 1"
            @remove="removeQuestion(index)"
          />
        </div>
      </div>

      <el-button class="mt-3" :icon="Plus" @click="addQuestion">
        問題を追加
      </el-button>
      <p v-if="errorMessage" class="mt-3 text-sm text-red-600">
        {{ errorMessage }}
      </p>
    </div>

    <template #footer>
      <el-button @click="visible = false">
        キャンセル
      </el-button>
      <el-button color="#626aef" @click="save">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>
