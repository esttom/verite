<script setup lang="ts">
import { ChatDotRound, QuestionFilled } from '@element-plus/icons-vue'
import { ElNotification, type NotificationHandle } from 'element-plus'

interface QuestionnaireDetailRecord {
  id: string
  content: string
  favorite: number
  clicked: boolean
  loading: boolean
  fixed: boolean
  showReply: boolean
  replyText: string
  replies: string[]
  stamp: boolean
}

const baseId = useRoute('/questionnaire/[id]').params.id
const router = useRouter()
const { isAuth } = useUserContext()
const { select, listen, updateFavorite, updateFixed } = useSupabaseQuestionnaireDetail()
const { loading, withLoadingFn } = useLoading()
const { loading: favoriteLoading, withLoadingFn: favoriteWithLoadingFn } = useLoading()

const authenticated = isAuth()
const fixMessagesHandler: Record<string, NotificationHandle['close']> = {}

const scrollbarRef = ref()
const enableScroll = ref(true)
const questionText = ref('')

const list = ref<QuestionnaireDetailRecord[]>([])

withLoadingFn(async () => {
  const data = await select(baseId)
  list.value = data.filter(d => !d.reply).map((d) => {
    return {
      ...d,
      clicked: false,
      loading: false,
      showReply: false,
      replyText: '',
      replies: [],
    }
  })
  data.filter(d => d.reply).forEach((d) => {
    const index = list.value.findIndex(item => item.id === d.reply)
    if (index >= 0) {
      const item = list.value[index]
      item.replies.push(d.content)
      list.value.splice(index, 1, item)
    }
  })
  list.value.filter(l => l.fixed).forEach(l => setFixedMessage(l))
})

listen((record) => {
  record.clicked = false
  record.loading = false
  record.showReply = false
  record.replyText = ''

  if (record.reply) {
    const index = list.value.findIndex(item => item.id === record.reply)
    if (index >= 0) {
      const item = list.value[index]
      item.replies.push(record.content)
      list.value.splice(index, 1, item)
    }
  }
  else {
    record.replies = []
    list.value.push(record)
    if (enableScroll.value) {
      setTimeout(() => {
        scrollbarRef.value.scrollTo({
          top: scrollbarRef.value.wrapRef.scrollHeight,
          behavior: 'smooth',
        })
      })
    }
  }
}, (record) => {
  const index = list.value.findIndex(item => item.id === record.id)
  if (index >= 0) {
    const item = list.value[index]
    if (record.fixed) {
      setFixedMessage(record)
    }
    if (item.fixed && !record.fixed) {
      fixMessagesHandler[item.id]?.()
    }

    item.favorite = record.favorite
    item.loading = false
    item.fixed = record.fixed
    item.replyText = ''
    list.value.splice(index, 1, item)
  }
})

async function onFavoriteUpdate(id: string, favorite: number, clicked: boolean) {
  if (favoriteLoading.value) {
    return
  }
  list.value = list.value.map((item) => {
    if (item.id === id) {
      item.loading = true
    }
    return item
  })
  favoriteWithLoadingFn(async () => {
    await updateFavorite({ id, favorite: favorite + (clicked ? -1 : 1) })
    const index = list.value.findIndex(item => item.id === id)
    if (index >= 0) {
      const item = list.value[index]
      item.clicked = !item.clicked
      list.value.splice(index, 1, item)
    }
  })
}

function toggleShowReply(id: string) {
  const index = list.value.findIndex(item => item.id === id)
  if (index >= 0) {
    const item = list.value[index]
    item.showReply = !item.showReply
    list.value.splice(index, 1, item)
  }
}

function onClickFixMessage(id: string, fixed: boolean) {
  updateFixed({ id, fixed: !fixed })
}

function home() {
  router.push('/admin/dashboard')
}

function setFixedMessage(record: QuestionnaireDetailRecord) {
  setTimeout(() => {
    const { close } = ElNotification({
      icon: QuestionFilled,
      message: record.content,
      duration: 0,
      customClass: 'whitespace-pre-wrap text-blue-400',
    })
    fixMessagesHandler[record.id] = close
  }, 0)
}

onUnmounted(() => {
  for (const key in fixMessagesHandler) {
    fixMessagesHandler[key]()
  }
})
</script>

<template>
  <div v-loading.fullscreen.lock="loading" h-full w-full items="center" flex flex-col>
    <div mb-3 @click="home">
      <img src="/logo.png" alt="logo" cursor="pointer" width="48px" text="center">
    </div>

    <div v-if="list.length > 0" max-w="768px" justify="end" mb-1 w-full flex>
      <div flex items="center">
        <em mr-2 text-xs text-gray-500 op75>auto-scroll</em>
        <el-switch v-model="enableScroll" style="--el-switch-on-color: #8a8bf9" />
      </div>
    </div>

    <el-scrollbar ref="scrollbarRef" class="w-full" wrap-class="w-full" view-class="w-full flex flex-grow justify-center">
      <div v-if="list.length === 0 && !loading">
        <img src="/undraw_faq_re_31cw.svg" alt="faq" mt-4 max-width="480px">
        <div text-ld mt-4 text-center op-80>
          No questions yet. <br>If you have any questions about what you are interested in, feel free to ask!
        </div>
      </div>
      <Transition>
        <div v-if="list.length > 0" w-full max-w="768px">
          <div v-for="item in list" :key="item.id" items="center" mb-3 w-full flex>
            <div w-full flex flex-col>
              <div w-full flex items-center>
                <div p="1" mr="4" h-fit border="rounded" style="background: linear-gradient(45deg, #9392FD, #F395F5);">
                  <div i-carbon-chat-bot text-2xl color="white" />
                </div>

                <template v-if="item.stamp">
                  <img :src="item.content" w-72px>
                </template>
                <div v-else w-full flex flex-col>
                  <div items="center" class="card" w-full flex bg-slate-50 py-3 pr-3 border="rounded">
                    <div w="full" whitespace-pre-wrap>
                      {{ item.content }}
                    </div>
                    <div flex items-center>
                      <div v-if="authenticated">
                        <div class="i-carbon-attachment" :class="item.fixed ? 'text-orange' : 'text-slate-400'" ml-1 mr-1 cursor="pointer" @click="onClickFixMessage(item.id, item.fixed)" />
                      </div>
                      <div ml-1 mr-1 w-22px text-slate-400 cursor="pointer" @click="toggleShowReply(item.id)">
                        <ChatDotRound />
                      </div>
                      <div v-loading="item.loading" class="flex" items="center">
                        <div :class="item.clicked ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'" ml-1 mr-1 text-pink cursor="pointer" @click="onFavoriteUpdate(item.id, item.favorite, item.clicked)" />
                        <div align="left" w-16px text-sm>
                          {{ item.favorite }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div flex>
                <div w-52px />
                <div w-full pl-1>
                  <div v-if="item.replies.length > 0" items="center" cursor="pointer" flex pa-1 @click="toggleShowReply(item.id)">
                    <div text="sm color-#8a8bf9">
                      {{ `${item.replies.length} reply ` }}
                    </div>
                    <div class="i-carbon-chevron-down" ml-0.5 mt-1 text-xs text="color-#8a8bf9" />
                  </div>
                  <div v-if="item.showReply" mt-1 border-l-3 border-slate-300 p-l-6>
                    <div v-for="(reply, idx) in item.replies" :key="idx" mb-2>
                      <div flex items-center>
                        <div p="1" mr="4" h-fit border="rounded" style="background: linear-gradient(45deg, #9392FD, #F395F5);">
                          <div i-carbon-chat-bot text-sm color="white" />
                        </div>
                        <div items="center" class="card" w-full flex bg-slate-50 py-1.5 pr-2 border="rounded">
                          <div w="full" whitespace-pre-wrap>
                            {{ reply }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div mt-2>
                      <QuestionText v-model="item.replyText" placeholder="reply..." :reply="item.id" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </el-scrollbar>
    <QuestionText v-model="questionText" placeholder="Write a message..." />
  </div>
</template>

<style scoped>
.card {
  overflow-wrap: anywhere;
  word-break: normal;
  line-break: strict;
}
.card::before {
  content: '';
  position: relative;
  top: 0px;
  left: -19px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-right-color: #f8fafc;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
