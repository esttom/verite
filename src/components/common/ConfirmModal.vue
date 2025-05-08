<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  okLabel?: string
  ngLabel?: string
  callback: (ok: boolean) => void | Promise<void>
}>(), {
  okLabel: 'はい',
  ngLabel: 'いいえ',
})

const visible = ref(false)

function onClick(ok: boolean) {
  visible.value = false
  props.callback(ok)
}

function show() {
  visible.value = true
}

defineExpose({
  show,
})
</script>

<template>
  <div v-if="visible" tabindex="-1" class="fixed left-0 right-0 top-0 z-100 h-[calc(100%-1rem)] max-h-full w-full flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-500 bg-opacity-60 md:inset-0">
    <div class="relative max-h-full max-w-md w-full p-4">
      <div class="relative rounded-lg bg-white shadow-sm dark:bg-gray-700">
        <button type="button" class="absolute end-2.5 top-3 ms-auto h-8 w-8 inline-flex items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
          <svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="p-4 text-center md:p-5">
          <svg class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <h3 class="mb-5 text-lg text-gray-500 font-normal dark:text-gray-300">
            {{ props.title }}
          </h3>
          <button data-modal-hide="popup-modal" type="button" class="inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm text-white font-medium dark:bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="onClick(true)">
            {{ props.okLabel }}
          </button>
          <button data-modal-hide="popup-modal" type="button" class="ms-3 border border-gray-200 rounded-lg bg-white px-5 py-2.5 text-sm text-gray-900 font-medium focus:z-10 dark:border-gray-600 dark:bg-gray-800 hover:bg-gray-100 dark:text-gray-400 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700" @click="onClick(false)">
            {{ props.ngLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
