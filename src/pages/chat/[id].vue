<script setup lang="ts">
import { type ChatItem, RealtimeState } from '~/composables'

const chatId = useRoute('/chat/[id]').params.id

const { isAuth } = useUserContext()
const { selectById } = useSupabaseChat()
const { select, subscribe, update } = useSupabaseChatDetail()
const { loading, withLoadingFn } = useLoading()
const { insert: stampInsert, subscribe: stampSubscribe } = useSupabaseStamp()
const { show, close } = useMessage()

const authenticated = isAuth()

const chatClosed = ref(false)
const questionnaireDialog = ref(false)
const enableScroll = ref(true)
const questionText = ref('')
const chatStampRef = ref()
const chatListRef = ref()
const chatList = ref<ChatItem[]>([])

withLoadingFn(async () => {
  const chatInfo = await selectById(chatId)

  if (chatInfo.status === RealtimeState.COMPLETED) {
    chatClosed.value = true
    return
  }

  chatSubscribeStart()
  stampSubscribeStart()

  const data = await select(chatId) ?? []
  chatList.value = data.map((d) => {
    return {
      ...d,
      replyInput: '',
      showReply: false,
      favorited: false,
    }
  })
  chatList.value.filter(item => item.fixed).forEach(item => show(item.id, item.content))
})

function chatSubscribeStart() {
  subscribe(chatId, (record) => {
    chatList.value.push({
      ...record,
      replyInput: '',
      showReply: false,
      favorited: false,
    })
    if (enableScroll.value) {
      chatListRef.value?.scroll()
    }
  }, (record) => {
    const index = chatList.value.findIndex(item => item.id === record.id)
    if (index >= 0) {
      const item = chatList.value[index]
      chatList.value[index] = {
        ...item,
        ...record,
        favorited: record.favorite === item.favorite ? item.favorited : !item.favorited,
      }

      if (!item.fixed && record.fixed) {
        show(item.id, item.content)
      }
      if (item.fixed && !record.fixed) {
        close(item.id)
      }
    }
  })
}

function stampSubscribeStart() {
  stampSubscribe(chatId, (record) => {
    chatStampRef.value?.show(record.content)
  })
}

async function onChatUpdate(item: ChatItem) {
  await update({ id: item.id, fixed: item.fixed, favorite: item.favorite })
}

async function stampInsertFn(stamp: string) {
  await stampInsert({ chat_id: chatId, content: stamp })
}
</script>

<template>
  <div v-loading.fullscreen.lock="loading" h-full w-full items="center" flex flex-col>
    <CommonHeader />

    <template v-if="chatClosed">
      <label class="mb-6 mt-12 text-center">ご参加いただきありがとうございました。<br>宜しければアンケートにご協力ください。</label>
      <button type="button" class="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm text-white font-medium dark:bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="questionnaireDialog = !questionnaireDialog">
        アンケート回答
      </button>
      <QuestionnaireDialog v-model="questionnaireDialog" />
    </template>
    <template v-else>
      <ChatList ref="chatListRef" v-model="chatList" :chat-id="chatId" :authenticated="authenticated" @update="onChatUpdate" />

      <ChatStamp ref="chatStampRef" />

      <ChatText v-model="questionText" :chat-id="chatId" placeholder="Write a message...">
        <template #bottom-left>
          <ChatStampPopup :stamp-insert="stampInsertFn" />

          <label class="ml-4 inline-flex cursor-pointer items-center">
            <input v-model="enableScroll" type="checkbox" class="peer sr-only">
            <div class="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:border after:border-gray-300 dark:border-gray-600 after:rounded-full after:bg-white dark:bg-gray-400 peer-checked:bg-blue-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:peer-checked:bg-blue-600 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full" />
            <span class="ml-2 text-sm dark:text-gray-300">scroll</span>
          </label>
        </template>
      </ChatText>
    </template>
  </div>
</template>
