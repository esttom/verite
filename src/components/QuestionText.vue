<script setup lang="ts">
const props = defineProps<{ placeholder: string, sendFn: (text: string) => void | Promise<void>, min?: boolean }>()

const questionText = defineModel<string>({ default: '' })

async function send() {
  if (questionText.value.trimEnd() === '' || questionText.value.replaceAll('\n', '').trimEnd() === '') {
    return
  }
  await props.sendFn(questionText.value.trimEnd())
  questionText.value = ''
}
</script>

<template>
  <div class="text-container" w="full" max-w="768px" justify="center" items="center" flex flex-col bg-white pa-2 b="1px solid #e5e5e5 rounded-xl">
    <el-input
      v-model="questionText"
      :autosize="{ minRows: 1, maxRows: 8 }"
      input-style="padding: 5px; box-shadow: none; background-color: white;"
      type="textarea"
      resize="none"
      :placeholder="props.placeholder"
      @keydown.ctrl.enter.prevent="send"
    />
    <div v-if="!props.min" mt-1 w-full flex justify="end" items="center">
      <div bg="#8a8bf9" p="1" border="rounded">
        <div i-carbon-send-filled text="md white" cursor="pointer" @click="send" />
      </div>
    </div>
  </div>
  <div v-if="!props.min" max-w="768px" w-full flex justify="end" class="text-gray-500">
    <em text-xs op75>Ctrl + Enter</em>
  </div>
</template>

<style scoped>
.text-container:has(.el-textarea__inner:focus) {
  border-color: rgba(0, 0, 0, 0.36);
}
</style>
