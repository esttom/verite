<script setup lang="ts">
const props = defineProps<{ placeholder: string, reply?: string }>()

const questionText = defineModel<string>({ default: '' })

const stamps = [
  '/stamp/yokuganbarimashita-hiyoko.png',
  '/stamp/subarashi.png',
  '/stamp/tanosimi-hiyoko.png',
  '/stamp/yokuaru.png',
  '/stamp/nice-hiyoko.png',
  '/stamp/chimeisho.png',
  '/stamp/kiokuni.png',
  '/stamp/onegaishimasu-hiyoko.png',
  '/stamp/otukare-hiyoko.png',
  '/stamp/arigatou.gif',
  '/stamp/repost-iine-hiyokoo.gif',
  '/stamp/shimaenaga-cheer.png',
  '/stamp/harinezumi-heart.png',
  '/stamp/hirameki-kuma.png',
  '/stamp/inukoro.png',
  '/stamp/yarukizero-usagi.png',
]

const baseId = useRoute('/questionnaire/[id]').params.id

const popVisible = ref(false)

const { insert } = useSupabaseQuestionnaireDetail()
const { loading: messageLoading, withLoadingFn: messageLoadingFn } = useLoading()
const { loading: stampLoading, withLoadingFn: stampLoadingFn } = useLoading()

async function sendMessage() {
  if (questionText.value.trimEnd() === '' || questionText.value.replaceAll('\n', '').trimEnd() === '') {
    return
  }
  messageLoadingFn(async () => {
    await insert({
      base_id: baseId,
      content: questionText.value,
      reply: props.reply ?? null,
      stamp: false,
      quiz_id: null,
    })
    questionText.value = ''
  })
}

async function sendStamp(stampUrl: string) {
  stampLoadingFn(async () => {
    await insert({
      base_id: baseId,
      content: stampUrl,
      reply: props.reply ?? null,
      stamp: true,
      quiz_id: null,
    })
    popVisible.value = false
  })
}
</script>

<template>
  <div w="full" max-w="768px">
    <div v-loading="messageLoading" class="mb-4 w-full border border-gray-200 rounded-lg bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
      <div class="rounded-t-lg bg-white px-4 py-3 dark:bg-gray-800">
        <textarea v-model="questionText" :rows="props.reply ? '1' : '3'" class="w-full resize-none border-0 bg-white px-0 text-sm outline-none dark:bg-gray-800 dark:text-white focus:ring-0 dark:placeholder-gray-400" placeholder="Write a comment..." @keydown.ctrl.enter.prevent="sendMessage()" />
        <div id="popover-default" role="tooltip" class="shadow-xs invisible absolute z-10 inline-block w-64 border border-gray-200 rounded-lg bg-white text-sm text-gray-500 opacity-0 transition-opacity duration-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
          <div class="border-b border-gray-200 rounded-t-lg bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
            <h3 class="text-gray-900 font-semibold dark:text-white">
              Popover title
            </h3>
          </div>
          <div class="px-3 py-2">
            <p>And here's some amazing content. It's very engaging. Right?</p>
          </div>
          <div data-popper-arrow />
        </div>
      </div>
      <div class="relative flex items-center justify-between border-t border-gray-200 px-3 py-2 dark:border-gray-600">
        <button type="submit" class="inline-flex cursor-pointer items-center justify-center rounded-sm p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900" @click="popVisible = !popVisible">
          <svg class="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
          </svg>
        </button>
        <div id="popover-default" data-popover role="tooltip" :class="`${popVisible ? '' : 'invisible opacity-0 '}shadow-xs absolute top--65 left--25 z-10 inline-block w-64 border border-gray-200 rounded-lg bg-white text-sm text-gray-500 transition-opacity duration-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400`">
          <div v-loading="stampLoading" grid grid-cols-4 gap-8px>
            <div v-for="stamp in stamps" :key="stamp" cursor="pointer" @click="sendStamp(stamp)">
              <img :src="stamp">
            </div>
          </div>
          <div data-popper-arrow />
        </div>
        <div class="flex ps-0 space-x-1 sm:ps-2 rtl:space-x-reverse">
          <button type="submit" class="inline-flex cursor-pointer items-center justify-center rounded-sm bg-#8a8bf9 p-2 text-gray-500 text-white hover:bg-gray-100 hover:text-gray-900" @click="sendMessage()">
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
.text-container:has(.el-textarea__inner:focus) {
  border-color: rgba(0, 0, 0, 0.36);
}
</style>
