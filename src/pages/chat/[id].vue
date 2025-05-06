<script setup lang="ts">
import type { ChatItem } from '~/composables'

const chatId = useRoute('/chat/[id]').params.id

const { isAuth } = useUserContext()
const { select, listen, update } = useSupabaseChatDetail()
const { loading, withLoadingFn } = useLoading()
const { insert: stampInsert, listen: stampListen } = useSupabaseStamp()
const { show, close } = useMessage()

const authenticated = isAuth()

const enableScroll = ref(true)
const questionText = ref('')
const chatStampRef = ref()
const chatListRef = ref()
const chatList = ref<ChatItem[]>([])

withLoadingFn(async () => {
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

listen(chatId, (record) => {
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

stampListen(chatId, (record) => {
  chatStampRef.value?.show(record.content)
})

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
  </div>
</template>
