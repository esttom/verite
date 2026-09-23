<script setup lang="ts">
import type { ChoiceQuestionDraft } from '~/composables'
import { Close, Plus } from '@element-plus/icons-vue'
import { cloneChoiceQuestion, createDraftId } from '~/composables'

const props = withDefaults(defineProps<{
  question: ChoiceQuestionDraft
  choicesEnabled?: boolean
  requireCorrect?: boolean
  minChoices?: number
  maxChoices?: number
  removable?: boolean
  showExplanation?: boolean
}>(), {
  choicesEnabled: true,
  requireCorrect: false,
  minChoices: 2,
  maxChoices: 8,
  removable: true,
  showExplanation: false,
})

const emit = defineEmits<{
  'update:question': [question: ChoiceQuestionDraft]
  'remove': []
}>()

function updatePrompt(prompt: string) {
  emit('update:question', { ...cloneChoiceQuestion(props.question), prompt })
}

function updateExplanation(explanation: string) {
  emit('update:question', { ...cloneChoiceQuestion(props.question), explanation })
}

function updateChoice(choiceId: string, text: string) {
  const next = cloneChoiceQuestion(props.question)
  const choice = next.choices.find(item => item.id === choiceId)
  if (choice) {
    choice.text = text
    emit('update:question', next)
  }
}

function selectCorrect(choiceId: string) {
  emit('update:question', { ...cloneChoiceQuestion(props.question), correctChoiceId: choiceId })
}

function addChoice() {
  if (props.question.choices.length >= props.maxChoices) {
    return
  }
  const next = cloneChoiceQuestion(props.question)
  next.choices.push({ id: createDraftId('choice'), text: '' })
  emit('update:question', next)
}

function removeChoice(choiceId: string) {
  if (props.question.choices.length <= props.minChoices) {
    return
  }
  const next = cloneChoiceQuestion(props.question)
  next.choices = next.choices.filter(choice => choice.id !== choiceId)
  if (next.correctChoiceId === choiceId) {
    next.correctChoiceId = null
  }
  emit('update:question', next)
}
</script>

<template>
  <section class="border border-gray-200 rounded-lg p-3 dark:border-gray-600">
    <div class="flex items-start gap-2">
      <el-input
        :model-value="question.prompt"
        type="textarea"
        :rows="2"
        resize="none"
        input-style="font-size: 16px"
        placeholder="設問"
        @update:model-value="updatePrompt"
      />
      <el-button v-if="removable" :icon="Close" aria-label="設問を削除" @click="$emit('remove')" />
    </div>

    <div v-if="choicesEnabled" class="mt-3 space-y-2">
      <div v-for="(choice, index) in question.choices" :key="choice.id" class="flex items-center gap-2">
        <input
          v-if="requireCorrect"
          :checked="question.correctChoiceId === choice.id"
          :name="`correct-${question.id}`"
          type="radio"
          :aria-label="`選択肢${index + 1}を正解にする`"
          class="h-5 w-5 shrink-0"
          @change="selectCorrect(choice.id)"
        >
        <el-input
          :model-value="choice.text"
          input-style="font-size: 16px"
          :placeholder="`選択肢 ${index + 1}`"
          @update:model-value="updateChoice(choice.id, $event)"
        />
        <el-button
          :icon="Close"
          :disabled="question.choices.length <= minChoices"
          :aria-label="`選択肢${index + 1}を削除`"
          @click="removeChoice(choice.id)"
        />
      </div>
      <el-button :icon="Plus" :disabled="question.choices.length >= maxChoices" @click="addChoice">
        選択肢を追加
      </el-button>
    </div>

    <div v-if="showExplanation" class="mt-3 border-t border-gray-200 pt-3 dark:border-gray-600">
      <div class="mb-1 text-sm font-medium">
        回答の解説 <span class="text-xs text-gray-500 font-normal">（任意・回答後に表示）</span>
      </div>
      <el-input
        :model-value="question.explanation"
        type="textarea"
        :rows="2"
        input-style="font-size: 16px"
        placeholder="正解の理由や補足を入力"
        @update:model-value="updateExplanation"
      />
    </div>

    <div v-if="$slots.settings" class="mt-3 border-t border-gray-200 pt-3 dark:border-gray-600">
      <slot name="settings" />
    </div>
  </section>
</template>
