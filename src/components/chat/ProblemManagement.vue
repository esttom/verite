<script setup lang="ts">
import type { ChatStateType } from '~/composables'

const props = defineProps<{ chatId: string, state: ChatStateType }>()
const emit = defineEmits<{ update: [state: ChatStateType] }>()
const visible = ref(false)
const mobile = useMediaQuery('(max-width: 640px)')
</script>

<template>
  <el-button size="small" plain @click="visible = true">
    管理
  </el-button>
  <el-drawer v-model="visible" title="問題管理" direction="rtl" :size="mobile ? '100%' : '440px'">
    <div class="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
      <span class="text-sm">開催状態</span>
      <ChatStateController :chat-id="props.chatId" :state="props.state" embedded @update="emit('update', $event)" />
    </div>
    <QuizNavigation :chat-id="props.chatId" embedded />
    <ExamNavigation :chat-id="props.chatId" />
  </el-drawer>
</template>
