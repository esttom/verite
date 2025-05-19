<script setup lang="ts">
import type { ChatStateType } from '~/composables'

const props = defineProps<{ chatId: string, state: ChatStateType }>()

const emits = defineEmits<{
  update: [status: ChatStateType]
}>()

const outerIndicatorColor = computed(() => stateColor(props.state, 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300', 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'))
const innerIndicatorColor = computed(() => stateColor(props.state, 'bg-green-500', 'bg-purple-500', 'bg-blue-500'))

function stateColor(_state: ChatStateType, activeClass: string, completedClass: string, waitingClass: string) {
  return _state === ChatState.ACTIVE ? activeClass : _state === ChatState.COMPLETED ? completedClass : waitingClass
}

function changeState() {
  if (props.state === ChatState.COMPLETED) {
    return
  }
  // eslint-disable-next-line no-alert
  if (props.state === ChatState.WAITING && window.confirm('開始します。よろしいですか？')) {
    emits('update', ChatState.ACTIVE)
  }

  // eslint-disable-next-line no-alert
  if (props.state === ChatState.ACTIVE && window.confirm('終了します。よろしいですか？')) {
    emits('update', ChatState.COMPLETED)
  }
}
</script>

<template>
  <span class="absolute right-2 top-16 inline-flex cursor-pointer items-center rounded-full px-2.5 py-0.5 text-xs font-medium" :class="outerIndicatorColor" @click="changeState">
    <span class="me-1 h-2 w-2 rounded-full" :class="innerIndicatorColor" />
    {{ props.state }}
  </span>
</template>
