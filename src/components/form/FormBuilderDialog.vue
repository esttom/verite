<script setup lang="ts">
import type { ChoiceQuestionDraft } from '~/composables'
import { choiceQuestionFromStrings, createChoiceQuestionDraft } from '~/composables'

interface StoredForm {
  title: string
  type: 'radio' | 'checkbox' | 'textarea'
  options: string[]
  required: boolean
}

interface BuilderForm {
  question: ChoiceQuestionDraft
  type: StoredForm['type']
  required: boolean
}

const props = defineProps<{
  title: string
  formTitle?: string
  form?: StoredForm[]
}>()

const emits = defineEmits<{
  save: [{ title: string, data: StoredForm[] }]
}>()

const visible = defineModel<boolean>()
const questionnaireTitle = ref('')
const builderForms = ref<BuilderForm[]>([])

function addForm() {
  builderForms.value.push({
    question: createChoiceQuestionDraft(0),
    type: 'textarea',
    required: false,
  })
}

function save() {
  emits('save', { title: questionnaireTitle.value, data: dump() })
  visible.value = false
}

function dump(): StoredForm[] {
  return builderForms.value.map(form => ({
    title: form.question.prompt,
    type: form.type,
    options: ['radio', 'checkbox'].includes(form.type)
      ? form.question.choices.map(choice => choice.text)
      : [],
    required: form.required,
  }))
}

function load(forms: StoredForm[]) {
  return forms.map(form => ({
    question: choiceQuestionFromStrings(form.title, form.options),
    type: form.type,
    required: form.required,
  }))
}

watch(visible, (open) => {
  if (open) {
    questionnaireTitle.value = props.formTitle ?? ''
    builderForms.value = load(props.form ?? [])
  }
  else {
    questionnaireTitle.value = ''
    builderForms.value = []
  }
})
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-9000 flex items-center justify-center bg-gray-500 bg-opacity-60 p-2 sm:p-4">
    <div class="relative max-h-full max-w-2xl w-full overflow-hidden rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-5">
      <div class="mb-4 flex items-center justify-between border-b pb-4 dark:border-gray-600">
        <h3 class="text-lg text-gray-900 font-semibold dark:text-white">
          {{ props.title }}
        </h3>
        <button type="button" class="rounded-lg p-2 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="閉じる" @click.prevent="visible = false">
          ✕
        </button>
      </div>

      <div class="max-h-[75vh] overflow-y-auto pr-1">
        <input v-model="questionnaireTitle" type="text" class="mb-3 block w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-base text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="タイトル">

        <div class="space-y-3">
          <ChoiceQuestionEditor
            v-for="(builderForm, index) in builderForms"
            :key="builderForm.question.id"
            v-model:question="builderForms[index].question"
            :choices-enabled="builderForm.type !== 'textarea'"
            :min-choices="0"
            @remove="builderForms.splice(index, 1)"
          >
            <template #settings>
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <select v-model="builderForm.type" class="border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <option value="textarea">
                    記述式
                  </option>
                  <option value="radio">
                    ラジオボタン
                  </option>
                  <option value="checkbox">
                    チェックボックス
                  </option>
                </select>
                <label class="inline-flex cursor-pointer items-center gap-2 text-sm">
                  <input v-model="builderForm.required" type="checkbox" class="h-4 w-4">
                  必須
                </label>
              </div>
            </template>
          </ChoiceQuestionEditor>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between border-t pt-4 dark:border-gray-600">
        <el-button @click.prevent="addForm">
          質問を追加
        </el-button>
        <el-button color="#626aef" @click.prevent="save">
          保存
        </el-button>
      </div>
    </div>
  </div>
</template>
