<script setup lang="ts">
import type { ChatItem, ChatStateType } from '~/composables'
import { ChatState, useAnonId } from '~/composables'

const chatId = useRoute('/chat/[id]').params.id

const { isAuth } = useUserContext()
const { selectById, update } = useSupabaseChat()
const { select: chatDetailSelect, insert: chatDetailInsert, update: chatDetailUpdate } = useSupabaseChatDetail()
const { subscribe, unsubscribe, send, chatState } = useSupabaseRealtime()
const { loading, withLoadingFn } = useLoading()
const { insert: questionnaireInsert } = useSupabaseQuestionnaireDetail()
const { show, close, once } = useMessage()
const { add, eventDispatcher } = provideQuiz()

const authenticated = isAuth()

const questionnaireDialog = ref(false)
const enableScroll = ref(true)
const questionText = ref('')
const chatStampRef = ref()
const chatListRef = ref()
const questionFilter = ref(false)
const anonId = useAnonId()
const questionnaireId = ref('')
const chatList = ref<ChatItem[]>([])
const chatStampList = ref<string[]>([])
const reverseOrderedStampList = computed(() =>
  [...chatStampList.value].reverse(),
)

withLoadingFn(async () => {
  const chatInfo = await selectById(chatId)
  questionnaireId.value = chatInfo.questionnaire_id
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
      chatStampList.value.push(payload.stamp)
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
        questionnaireDialog.value = true
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
        question: payload.question,
        anon_id: payload.anon_id,
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
        if ((item.reply ?? []).length !== (payload.reply ?? []).length) {
          if (anonId.value === item.anon_id && anonId.value !== payload.reply[payload.reply.length - 1].anon_id) {
            once('投稿したメッセージに返信があります。', 10000)
          }
        }
      }
    }
    else if (event === 'quiz') {
      add(payload.quiz_id, payload.id, payload.answer)
      eventDispatcher(payload.quiz_id)
    }
  })
}

async function chatSubmit(data: string | ChatItem, question?: boolean) {
  if (typeof data === 'string') {
    chatInsert(data, !!question)
  }
  else {
    chatUpdate(data)
  }
}

async function chatInsert(content: string, question: boolean) {
  const data = await chatDetailInsert({
    chat_id: chatId,
    content,
    reply: null,
    quiz_id: null,
    question,
    anon_id: anonId.value,
  })
  if (data) {
    send('chat-insert', { ...data })
  }
}

async function chatUpdate(item: ChatItem) {
  const data = await chatDetailUpdate({ id: item.id, fixed: item.fixed, favorite: item.favorite, reply: item.reply, question: item.question })
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
      <QuestionnaireDialog v-model="questionnaireDialog" :questionnaire-id="questionnaireId" :submit="questionnaireSubmit" />
    </template>
    <template v-else>
      <ChatList ref="chatListRef" v-model="chatList" :chat-id="chatId" :anon-id="anonId" :authenticated="authenticated" :question-filter="questionFilter" :submit="chatSubmit" :update="chatUpdate" />

      <ChatStamp ref="chatStampRef" />

      <div class="my-1.5 max-w-[768px] w-full flex items-center">
        <div class="scrollbar-none flex-1 overflow-x-auto rounded-md bg-gray-1 px-2 dark:bg-gray-6">
          <div class="flex gap-1.5">
            <img
              v-for="(stamp, index) in reverseOrderedStampList"
              :key="index"
              :src="stamp"
              class="h-8 w-8 shrink-0"
              alt=""
            >
          </div>
        </div>

        <div class="mx-2 flex flex-shrink-0 items-center">
          <ChatQuestionFilterButton v-model="questionFilter" />
          <ChatScrollSwitch v-model="enableScroll" />
        </div>
      </div>

      <ChatText v-model="questionText" :anon-id="anonId" :submit="chatSubmit">
        <template #bottom-left>
          <ChatStampPopup :stamp-insert="stampInsertFn" />
        </template>
      </ChatText>
    </template>

    <template v-if="authenticated">
      <QuizNavigation :chat-id="chatId" />

      <ChatStateController :chat-id="chatId" :state="chatState" @update="onStateUpdate" />
    </template>
  </div>
</template>

<style scoped>
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>
