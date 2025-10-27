<script setup lang="ts">
import { CircleCheckFilled } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'

const props = defineProps<{ submit: (form: Record<string, any>) => Promise<void> }>()

const forms = reactive([
  {
    id: 'satisfy',
    type: 'radio',
    title: '今回の研鑽会について、総合的にどのくらい満足していますか。（一つ選択）。',
    required: true,
    value: '',
    options: [
      { label: '満足', value: '5' },
      { label: 'やや満足', value: '4' },
      { label: 'どちらともいえない', value: '3' },
      { label: 'やや不満', value: '2' },
      { label: '不満', value: '1' },
    ],
    error: false,
    errorMessage: '',
  },
  {
    id: 'reason',
    type: 'textarea',
    title: '上記の理由をお聞かせ下さい。',
    required: true,
    value: '',
    error: false,
    errorMessage: '',
  },
  {
    id: 'notice',
    type: 'textarea',
    title: '今回の研鑽会や発表者に対する気づきがあれば教えてください。',
    value: '',
    error: false,
    errorMessage: '',
  },
  {
    id: 'idea',
    type: 'textarea',
    title: '技術研鑽会で取り扱ってほしい内容があれば教えてください。',
    value: '',
    error: false,
    errorMessage: '',
  },
  {
    id: 'opinion',
    type: 'textarea',
    title: 'その他、ご意見などがあればお聞かせください。',
    value: '',
    error: false,
    errorMessage: '',
  },
])

const visible = defineModel<boolean>({ required: true })

const hasError = ref(false)
const confirmRef = ref()

function preSubmit() {
  if (formInvalidCheck()) {
    return
  }
  confirmRef.value?.show()
}

async function confirmCallback(ok: boolean) {
  if (!ok) {
    return
  }
  await props.submit(forms.reduce((prev, curr) => Object.assign(prev, { [curr.title]: curr.value }), {}))
  visible.value = false
  ElNotification({
    icon: CircleCheckFilled,
    message: 'ご回答ありがとうございました！',
    duration: 5000,
    customClass: 'text-green-600',
  })
  formClear()
}

function formInvalidCheck() {
  let error = false
  for (let i = 0, max = forms.length; i < max; i++) {
    if (forms[i].required && !forms[i].value) {
      forms[i].error = true
      forms[i].errorMessage = 'この項目は必須入力です。'
      error = true
    }
    else {
      forms[i].error = false
      forms[i].errorMessage = ''
    }
  }
  hasError.value = error
  if (hasError.value) {
    setTimeout(() => (hasError.value = false), 300)
  }
  return hasError.value
}

function formClear() {
  forms.forEach((form) => {
    form.value = ''
    form.error = false
    form.errorMessage = ''
  })
}
</script>

<template>
  <div v-if="visible" tabindex="-1" aria-hidden="true" class="f-full fixed left-0 right-0 top-0 z-50 w-full flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-500 bg-opacity-60 p-4 md:inset-0">
    <div class="relative h-90vh max-w-2xl w-full overflow-y-auto" :class="{ shake: hasError }">
      <div class="relative rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-5">
        <div class="mb-2 flex items-center justify-between border-b rounded-t pb-4 sm:mb-5 dark:border-gray-600">
          <h3 class="text-lg text-gray-900 font-semibold dark:text-white">
            アンケート
          </h3>
          <button type="button" class="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" @click="visible = false">
            <svg aria-hidden="true" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <form action="#" @submit.prevent="preSubmit">
          <div class="grid mb-3 gap-3 pr-3 sm:grid-cols-2">
            <template v-for="form in forms" :key="form.id">
              <div class="sm:col-span-2">
                <div v-if="form.type === 'radio'">
                  <label class="mb-2 block text-sm text-gray-900 font-medium dark:text-white" :class="{ required: form.required }">{{ form.title }}</label>
                  <div v-for="(option, idx) in form.options" :key="idx" class="mb-3 flex items-center">
                    <input :id="`${form.id}-${idx}`" v-model="form.value" type="radio" :value="option.value" :name="form.id" class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:ring-offset-gray-800 dark:focus:ring-blue-600">
                    <label :for="`${form.id}-${idx}`" class="ms-2 text-sm text-gray-900 font-medium dark:text-gray-300">{{ option.label }}</label>
                  </div>
                </div>
                <div v-else-if="form.type === 'textarea'">
                  <label :for="form.id" class="mb-2 block text-sm text-gray-900 font-medium dark:text-white" :class="{ required: form.required }">{{ form.title }}</label>
                  <textarea :id="form.id" v-model="form.value" rows="2" class="block w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-base text-gray-900 dark:border-gray-600 focus:border-primary-500 dark:bg-gray-700 md:text-sm dark:text-white focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 dark:placeholder-gray-400" :class="{ '[box-shadow:inset_0_0_0_1px_red]': form.error }" placeholder="長文回答" />
                </div>
                <div class="h-13px text-xs text-red">
                  <label>{{ form.errorMessage }}</label>
                </div>
              </div>
            </template>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm text-white font-medium dark:bg-primary-600 hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              <svg class="mr-1 h-[22px] w-[22px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2a1 1 0 0 1 .932.638l7 18a1 1 0 0 1-1.326 1.281L13 19.517V13a1 1 0 1 0-2 0v6.517l-5.606 2.402a1 1 0 0 1-1.326-1.281l7-18A1 1 0 0 1 12 2Z" clip-rule="evenodd" />
              </svg>
              送信
            </button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmModal ref="confirmRef" title="回答を送信します。よろしいですか？" :callback="confirmCallback" />
  </div>
</template>

<style scoped>
.required::after {
  content: ' *';
  color: red;
  font-size: 16px;
}
</style>
