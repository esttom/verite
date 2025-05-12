<script setup lang="ts">
import { type ChatItem, ChatState, type ChatStateType } from '~/composables'

const chatId = useRoute('/chat/[id]').params.id

const { isAuth } = useUserContext()
const { selectById, update } = useSupabaseChat()
const { select: chatDetailSelect, insert: chatDetailInsert, update: chatDetailUpdate } = useSupabaseChatDetail()
const { subscribe, unsubscribe, send } = useSupabaseRealtime()
const { loading, withLoadingFn } = useLoading()
const { insert: questionnaireInsert } = useSupabaseQuestionnaire()
const { show, close } = useMessage()
const { add, eventDispatcher } = provideQuiz()

const authenticated = isAuth()

const chatState = ref<ChatStateType>(ChatState.WAITING)
const questionnaireDialog = ref(false)
const enableScroll = ref(true)
const questionText = ref('')
const chatStampRef = ref()
const chatListRef = ref()
const chatList = ref<ChatItem[]>([])

withLoadingFn(async () => {
  const chatInfo = await selectById(chatId)
  chatState.value = chatInfo.status as ChatStateType
  if (chatState.value !== ChatState.COMPLETED) {
    chatSubscribeStart()
  }
  if (chatState.value === ChatState.ACTIVE) {
    await chatInitialize()
  }
})

async function chatInitialize() {
  await chatListSelect()
}

async function chatListSelect() {
  const data = await chatDetailSelect(chatId) ?? []
  chatList.value = data.map((d) => {
    return {
      ...d,
      replyInput: '',
      showReply: false,
      favorited: false,
    }
  })
  chatList.value.filter(item => item.fixed).forEach(item => show(item.id, item.content))
}

function chatSubscribeStart() {
  subscribe(chatId, (event, payload) => {
    if (event === 'stamp') {
      chatStampRef.value?.show(payload.stamp)
    }
    else if (event === 'status') {
      chatState.value = payload.status as ChatStateType
      if (chatState.value === ChatState.ACTIVE) {
        withLoadingFn(async () => {
          await chatInitialize()
        })
      }
      else if (chatState.value === ChatState.COMPLETED) {
        unsubscribe()
      }
    }
    else if (event === 'chat-insert') {
      chatList.value.push({
        id: payload.id,
        quiz_id: payload.quiz_id,
        content: payload.content,
        fixed: payload.fixed,
        favorite: payload.favorite,
        reply: payload.reply,
        replyInput: '',
        showReply: false,
        favorited: false,
      })
      if (enableScroll.value) {
        chatListRef.value?.scroll()
      }
    }
    else if (event === 'chat-update') {
      const index = chatList.value.findIndex(item => item.id === payload.id)
      if (index >= 0) {
        const item = chatList.value[index]
        chatList.value[index] = {
          ...item,
          ...payload,
        }

        if (!item.fixed && payload.fixed) {
          show(item.id, item.content)
        }
        if (item.fixed && !payload.fixed) {
          close(item.id)
        }
      }
    }
    else if (event === 'quiz') {
      add(payload.quiz_id, payload.id, payload.answer)
      eventDispatcher(payload.quiz_id)
    }
  })
}

async function chatSubmit(data: string | ChatItem) {
  if (typeof data === 'string') {
    chatInsert(data)
  }
  else {
    chatUpdate(data)
  }
}

async function chatInsert(content: string) {
  const data = await chatDetailInsert({
    chat_id: chatId,
    content,
    reply: null,
    quiz_id: null,
  })
  if (data) {
    send('chat-insert', { ...data })
  }
}

async function chatUpdate(item: ChatItem) {
  const data = await chatDetailUpdate({ id: item.id, fixed: item.fixed, favorite: item.favorite, reply: item.reply })
  if (data) {
    send('chat-update', { ...data })
  }
}

async function stampInsertFn(stamp: string) {
  send('stamp', { stamp })
}

async function onStateUpdate(status: ChatStateType) {
  await update({ id: chatId, status })
  send('status', { status })
}

async function questionnaireSubmit(form: Record<string, any>) {
  await questionnaireInsert({ chat_id: chatId, answer: form })
}
</script>

<template>
  <div v-loading.fullscreen.lock="loading" h-full w-full items="center" flex flex-col>
    <CommonHeader />

    <template v-if="chatState === ChatState.WAITING">
      <label class="mb-6 mt-12 text-center">開催をお待ちください。</label>
    </template>
    <template v-else-if="chatState === ChatState.COMPLETED">
      <label class="mb-6 mt-12 text-center">ご参加いただきありがとうございました。<br>宜しければアンケートにご協力ください。</label>
      <button type="button" class="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm text-white font-medium dark:bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="questionnaireDialog = !questionnaireDialog">
        アンケート回答
      </button>
      <QuestionnaireDialog v-model="questionnaireDialog" :submit="questionnaireSubmit" />
    </template>
    <template v-else>
      <ChatList ref="chatListRef" v-model="chatList" :chat-id="chatId" :authenticated="authenticated" :submit="chatSubmit" :update="chatUpdate" />

      <ChatStamp ref="chatStampRef" />

      <ChatText v-model="questionText" :submit="chatSubmit">
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

    <ChatStateController v-if="authenticated" :chat-id="chatId" :state="chatState" @update="onStateUpdate" />
  </div>
</template>
