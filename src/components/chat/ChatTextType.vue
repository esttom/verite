<script setup lang="ts">
const question = defineModel<boolean>({ required: true })

const dropdown = ref(false)

const target = useTemplateRef<HTMLElement>('target')

onClickOutside(target, () => dropdown.value = false)
</script>

<template>
  <button class="relative inline-flex shrink-0 items-center border border-r-0 border-gray-300 rounded-s-lg bg-gray-100 px-3 py-2.5 text-center font-medium dark:border-gray-600 focus:border-blue-500 dark:bg-gray-800 hover:bg-gray-200 md:text-sm focus:outline-none focus:ring-4 focus:ring-gray-100 dark:hover:bg-gray-600 dark:focus:ring-gray-700" type="button" @click="dropdown = !dropdown">
    {{ question ? '質問' : '全般' }} <svg class="ms-2.5 h-2.5 w-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
    </svg>
    <div v-if="dropdown" ref="target" class="absolute left--5 top--10 z-10 w-20 rounded-lg bg-white shadow-sm divide-y divide-gray-100 dark:bg-gray-700">
      <div class="flex flex-col py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
        <a class="w-full px-4 py-0 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" :class="{ 'text-blue-500': !question }" @click="question = !question">
          全般
        </a>
        <a class="w-full px-4 py-0 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" :class="{ 'text-blue-500': question }" @click="question = !question">
          質問
        </a>
      </div>
    </div>
  </button>
</template>
