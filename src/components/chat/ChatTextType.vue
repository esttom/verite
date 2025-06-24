<script setup lang="ts">
const question = defineModel<boolean>({ required: true })

const dropdown = ref(false)

const target = useTemplateRef<HTMLElement>('target')

onClickOutside(target, () => dropdown.value = false)
</script>

<template>
  <button class="relative inline-flex shrink-0 items-center border border-r-0 border-gray-300 rounded-s-lg bg-gray-100 px-2 py-2.5 text-center font-medium dark:border-gray-600 focus:border-blue-500 dark:bg-gray-800 hover:bg-gray-200 md:text-sm focus:outline-none focus:ring-4 focus:ring-gray-100 dark:hover:bg-gray-600 dark:focus:ring-gray-700" type="button" @click="dropdown = !dropdown">
    <div v-if="question" class="flex items-center">
      <svg class="mr-1 h-[18px] w-[18px] text-purple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.008-3.018a1.502 1.502 0 0 1 2.522 1.159v.024a1.44 1.44 0 0 1-1.493 1.418 1 1 0 0 0-1.037.999V14a1 1 0 1 0 2 0v-.539a3.44 3.44 0 0 0 2.529-3.256 3.502 3.502 0 0 0-7-.255 1 1 0 0 0 2 .076c.014-.398.187-.774.48-1.044Zm.982 7.026a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2h-.01Z" clip-rule="evenodd" />
      </svg>
      質問
    </div>
    <div v-else class="flex items-center">
      <svg class="mr-1 h-[18px] w-[18px] text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd" />
      </svg>
      全般
    </div>
    <svg class="ms-2.5 h-2.5 w-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
    </svg>
    <div v-if="dropdown" ref="target" class="absolute left-0 top--16 z-10 w-20 rounded-lg bg-white shadow-sm divide-y divide-gray-100 dark:bg-gray-800">
      <div class="flex flex-col py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
        <a class="w-full flex items-center px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" :class="{ 'text-blue-500': !question }" @click="question = !question">
          <svg class="mr-1 h-[16px] w-[16px] text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd" />
          </svg>
          全般
        </a>
        <a class="w-full flex items-center px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" :class="{ 'text-blue-500': question }" @click="question = !question">
          <svg class="mr-1 h-[16px] w-[16px] text-purple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.008-3.018a1.502 1.502 0 0 1 2.522 1.159v.024a1.44 1.44 0 0 1-1.493 1.418 1 1 0 0 0-1.037.999V14a1 1 0 1 0 2 0v-.539a3.44 3.44 0 0 0 2.529-3.256 3.502 3.502 0 0 0-7-.255 1 1 0 0 0 2 .076c.014-.398.187-.774.48-1.044Zm.982 7.026a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2h-.01Z" clip-rule="evenodd" />
          </svg>
          質問
        </a>
      </div>
    </div>
  </button>
</template>
