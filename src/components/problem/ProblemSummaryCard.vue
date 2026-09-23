<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  status?: string
  actionLabel?: string
}>(), {
  description: '',
  status: '未回答',
  actionLabel: '回答する',
})

defineEmits<{ open: [] }>()
</script>

<template>
  <article class="mb-3 w-full border border-blue-200 rounded-xl bg-white p-3 shadow-sm dark:border-blue-800 dark:bg-gray-800">
    <div class="flex items-start gap-3">
      <div class="mt-0.5 h-9 w-9 flex shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
        <span aria-hidden="true">?</span>
      </div>
      <div class="min-w-0 flex-1">
        <div class="mb-1 flex items-center gap-2">
          <span class="text-xs text-blue-700 font-medium dark:text-blue-300">問題</span>
          <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">{{ status }}</span>
        </div>
        <h3 class="truncate text-base text-gray-900 font-semibold dark:text-white">
          {{ title }}
        </h3>
        <p v-if="description" class="line-clamp-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
      <button type="button" class="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700" @click="$emit('open')">
        {{ actionLabel }}
      </button>
    </div>
  </article>
</template>
