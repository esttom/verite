<script setup lang="ts">
const props = defineProps<{ list: Record<string, any>[] }>()

const emits = defineEmits<{
  save: [{ id: string, title: string, data: Record<string, any>[] }]
  selected: [{ id: string, title: string }]
}>()

const builderDialogVisible = ref(false)
const input = ref('')
const target = useTemplateRef('target')
let selectedForm = {
  id: '',
  title: '',
  data: [],
}

const { focused } = useFocusWithin(target)

function onSave(data: { title: string, data: Record<string, any>[] }) {
  emits('save', { id: selectedForm.id, ...data })
}

function onUpdate(item: Record<string, any>) {
  selectedForm = {
    id: item.id,
    title: item.title,
    data: item.data,
  }
  builderDialogVisible.value = true
}

function onSelected(id: string, title: string) {
  emits('selected', { id, title })
  input.value = title
}

function dialogOpen() {
  selectedForm = {
    id: '',
    title: '',
    data: [],
  }
  builderDialogVisible.value = true
}
</script>

<template>
  <div class="relative w-full">
    <div class="pointer-events-none absolute start-0 inset-y-0 flex items-center ps-3">
      <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
      </svg>
    </div>
    <input ref="target" v-model="input" type="search" class="block w-full border border-gray-300 rounded p-1 ps-10 text-sm text-gray-900 dark:border-gray-600 focus:border-blue-500 dark:text-white focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500">

    <div v-if="focused" class="absolute left-0 top-10 z-10 w-60 rounded-lg bg-white shadow-sm dark:bg-gray-700">
      <ul class="h-48 overflow-y-auto py-2 text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
        <li v-for="(item, idx) in props.list" :key="idx" class="flex justify-between">
          <a class="flex-1 items-center px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" @mousedown.prevent="onSelected(item.id, item.title)">
            {{ item.title }}
          </a>
          <button class="px-2" @mousedown.prevent="onUpdate(item)">
            <svg class="h-6 w-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28" />
            </svg>
          </button>
        </li>
      </ul>
      <a class="flex cursor-pointer items-center border-t border-gray-200 rounded-b-lg bg-gray-50 p-3 text-sm text-blue-600 font-medium dark:border-gray-600 dark:bg-gray-700 hover:bg-gray-100 dark:text-blue-500 hover:underline dark:hover:bg-gray-600" @mousedown.prevent="dialogOpen">
        <svg class="me-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
          <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z" />
        </svg>
        アンケート追加
      </a>
    </div>
    <FormBuilderDialog v-model="builderDialogVisible" :form="selectedForm.data" :form-title="selectedForm.title" title="アンケート" @save="onSave" />
  </div>
</template>
