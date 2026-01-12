<script setup lang="ts">
interface Form {
  title: string
  type: 'radio' | 'textarea'
  options: string[]
  required: boolean
}

const props = defineProps<{
  title: string
  formTitle?: string
  form?: Form[]
}>()

const emits = defineEmits<{
  save: [{ title: string, data: Form[] }]
}>()

const visible = defineModel<boolean>()

const questionnaireTitle = ref(props.formTitle ?? '')
const builderForms = ref<Form[]>(copy(props.form ?? []))

function addOption(form: Form) {
  form.options.push('')
}

function addForm() {
  builderForms.value.push({
    title: '',
    type: 'textarea',
    options: [],
    required: false,
  })
}

function save() {
  emits('save', { title: questionnaireTitle.value, data: dump() })
  visible.value = false
}

function dump() {
  return builderForms.value.map(f => ({
    title: f.title,
    type: f.type,
    options: f.type === 'radio' ? f.options : [],
    required: f.required,
  }))
}

function copy(form: Form[]) {
  return JSON.parse(JSON.stringify(form)) as Form[]
}

watch(() => visible.value, (v) => {
  if (v) {
    questionnaireTitle.value = props.formTitle ?? ''
    builderForms.value = copy(props.form ?? [])
  }
  else {
    questionnaireTitle.value = ''
    builderForms.value = []
  }
})
</script>

<template>
  <div v-if="visible" class="h-modal fixed left-0 right-0 top-0 z-9000 w-full flex items-center justify-center bg-gray-500 bg-opacity-60 md:inset-0 md:h-full">
    <div class="relative h-full max-w-2xl w-full p-4 md:h-auto">
      <div class="relative rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-5">
        <div class="mb-4 flex items-center justify-between border-b rounded-t pb-4 sm:mb-5 dark:border-gray-600">
          <h3 class="text-lg text-gray-900 font-semibold dark:text-white">
            {{ props.title }}
          </h3>
          <button type="button" class="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal" @click.prevent="visible = false">
            <svg aria-hidden="true" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>

        <div class="relative flex gap-1 rounded-lg bg-white shadow dark:bg-gray-800">
          <div class="h-75vh flex-1 overflow-y-auto">
            <div>
              <input v-model="questionnaireTitle" type="text" class="mb-3 block w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 focus:border-primary-600 dark:bg-gray-700 dark:text-white focus:ring-primary-600 dark:focus:border-primary-500 dark:focus:ring-primary-500 dark:placeholder-gray-400" placeholder="タイトル">
            </div>

            <div v-for="(f, idx) in builderForms" :key="idx" class="grid mb-4 gap-4 border border-rounded pa-3 dark:border-gray-600">
              <div class="grid grid-cols-[1fr_120px] gap-4">
                <div>
                  <input v-model="f.title" type="text" class="block w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 focus:border-primary-600 dark:bg-gray-700 dark:text-white focus:ring-primary-600 dark:focus:border-primary-500 dark:focus:ring-primary-500 dark:placeholder-gray-400" placeholder="質問">
                </div>

                <div>
                  <select v-model="f.type" class="block w-full appearance-none border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 focus:border-primary-500 dark:bg-gray-700 dark:text-white focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 dark:placeholder-gray-400">
                    <option value="textarea">
                      記述式
                    </option>
                    <option value="radio">
                      ラジオボタン
                    </option>
                  </select>
                </div>
              </div>

              <div v-if="f.type === 'radio'" class="space-y-2">
                <div v-for="(_, i) in f.options" :key="i" class="flex gap-2">
                  <input v-model="f.options[i]" class="flex-1 border px-2 py-1 dark:border-gray-600" :placeholder="`オプション ${i + 1}`">
                  <button @click.prevent="f.options.splice(i, 1)">
                    ✕
                  </button>
                </div>
                <button @click.prevent="addOption(f)">
                  ＋選択肢を追加
                </button>
              </div>

              <div class="flex items-center justify-end border-t-1 pt-2.5 dark:border-gray-600">
                <div class="mr-4 border-r-1 pr-4 dark:border-gray-600">
                  <button @click.prevent="builderForms.splice(idx, 1)">
                    <svg class="h-[20px] w-[20px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                    </svg>
                  </button>
                </div>

                <div>
                  <label class="inline-flex cursor-pointer items-center">
                    <input v-model="f.required" type="checkbox" class="peer sr-only">
                    <div class="peer peer-focus:ring-brand-soft peer-checked:after:border-buffer dark:peer-focus:ring-brand-soft relative h-5 w-9 rounded-full after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white peer-focus:outline-none peer-focus:ring-4 after:transition-all after:content-[''] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full" :class="{ 'bg-#626aef': f.required, 'bg-neutral-quaternary': !f.required }" />
                    <span class="text-heading ms-3 select-none text-sm font-medium">必須</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="w-14 flex flex-col items-center self-start gap-4">
            <div class="rounded-base v-space-y-px grid gap-3 border border-rounded pa-2 shadow-sm dark:border-gray-600" role="group">
              <button title="質問を追加" @click.prevent="addForm">
                <svg class="h-[24px] w-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
              <button @click.prevent="save">
                <svg class="h-[24px] w-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="1.2" d="M11 16h2m6.707-9.293-2.414-2.414A1 1 0 0 0 16.586 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7.414a1 1 0 0 0-.293-.707ZM16 20v-6a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v6h8ZM9 4h6v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
