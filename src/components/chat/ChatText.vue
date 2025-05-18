<script setup lang="ts">
import type { ChatItem } from '~/composables'

const props = defineProps<{ item?: ChatItem, submit: (data: string | ChatItem) => Promise<void> }>()

const questionText = defineModel<string>({ default: '' })

const { loading: messageLoading, withLoadingFn: messageLoadingFn } = useLoading()

async function sendMessage() {
  if (questionText.value.trimEnd() === '' || questionText.value.replaceAll('\n', '').trimEnd() === '') {
    return
  }
  messageLoadingFn(async () => {
    if (props.item) {
      const reply = props.item.reply ?? []
      await props.submit({ ...props.item, reply: [...reply, questionText.value] })
    }
    else {
      await props.submit(questionText.value)
    }
    questionText.value = ''
  })
}
</script>

<template>
  <div w="full" max-w="768px">
    <div v-loading="messageLoading" class="w-full border border-gray-200 rounded-lg bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
      <div class="flex items-center justify-between px-3 py-2">
        <div class="flex">
          <slot name="bottom-left" />
        </div>
        <textarea v-model="questionText" rows="1" class="mx-3 block w-full resize-none border border-gray-300 rounded-lg bg-white p-2.5 text-base dark:border-gray-600 focus:border-blue-500 dark:bg-gray-800 md:text-sm dark:text-white focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400" placeholder="Write a comment... (Ctrl + Enter)" @keydown.ctrl.enter.prevent="sendMessage()" />
        <div class="flex ps-0 space-x-1 sm:ps-2 rtl:space-x-reverse">
          <button type="submit" class="inline-flex cursor-pointer items-center justify-center rounded-sm bg-blue-500 p-2 text-white dark:bg-blue-600 hover:bg-blue-800" @click="sendMessage()">
            <svg class="h-4 w-4 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
            </svg>
            <span class="sr-only">Send message</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea {
  field-sizing: content;
}
</style>
