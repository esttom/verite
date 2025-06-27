<script setup lang="ts">
const questionFilter = defineModel<boolean>({ required: true })

const label = computed(() => questionFilter.value ? '質問' : '全般')
</script>

<template>
  <button type="button" class="me-2 border border-gray-300 rounded-lg bg-white px-4 py-0.5 text-sm text-gray-900 font-medium dark:border-gray-600 dark:bg-gray-800 hover:bg-gray-100 dark:text-white focus:outline-none focus:ring-4 focus:ring-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700" @click="questionFilter = !questionFilter">
    {{ label }}
  </button>
</template>
