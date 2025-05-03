<script setup lang="ts">
const props = defineProps<{ placeholder: string, reply?: string }>()

const questionText = defineModel<string>({ default: '' })

const baseId = useRoute('/questionnaire/[id]').params.id
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

const popup = ref(false)

const { insert } = useSupabaseQuestionnaireDetail()
const { loading: messageLoading, withLoadingFn: messageLoadingFn } = useLoading()
const target = useTemplateRef<HTMLElement>('target')
onClickOutside(target, () => popup.value = false)

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

async function onClickStamp(stamp: string) {
  await insert({
    base_id: baseId,
    content: stamp,
    reply: props.reply ?? null,
    stamp: true,
    quiz_id: null,
  })
  popup.value = !popup.value
}
</script>

<template>
  <div w="full" max-w="768px">
    <div v-loading="messageLoading" class="w-full border border-gray-200 rounded-lg bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
      <div class="rounded-t-lg bg-white px-4 py-3 dark:bg-gray-800">
        <textarea v-model="questionText" :rows="props.reply ? '1' : '3'" class="w-full resize-none border-0 bg-white px-0 text-sm outline-none dark:bg-gray-800 dark:text-white focus:ring-0 dark:placeholder-gray-400" placeholder="Write a comment..." @keydown.ctrl.enter.prevent="sendMessage()" />
      </div>
      <div class="relative flex items-center justify-between border-t border-gray-200 px-3 py-1 dark:border-gray-600">
        <div class="flex">
          <div v-if="!props.reply" ref="target">
            <div class="cursor-pointer" @click.stop="popup = !popup">
              <svg class="h-[24px] w-[24px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z" clip-rule="evenodd" />
                <path fill-rule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z" clip-rule="evenodd" />
              </svg>
            </div>

            <div class="relative">
              <div v-if="popup" role="tooltip" class="shadow-xs absolute left--5 top--66 z-10 inline-block border border-gray-200 rounded-lg bg-white text-sm text-gray-500 transition-opacity duration-300 dark:border-gray-600 dark:bg-gray-500 dark:text-gray-400">
                <div class="h-56 w-60 overflow-y-auto p-3 space-y-2">
                  <div class="grid grid-cols-3">
                    <img v-for="stamp in stamps" :key="stamp" :src="stamp" class="w-15 cursor-pointer" @click.stop="onClickStamp(stamp)">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="ml-6">
            <slot name="bottom-left" />
          </div>
        </div>
        <div class="flex ps-0 space-x-1 sm:ps-2 rtl:space-x-reverse">
          <button type="submit" class="inline-flex cursor-pointer items-center justify-center rounded-sm bg-blue-500 p-2 text-gray-500 text-white dark:bg-blue-600 hover:bg-blue-800" @click="sendMessage()">
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
