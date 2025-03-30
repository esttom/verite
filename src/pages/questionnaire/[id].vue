<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
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
  quiz_id: string | null
}

const baseId = useRoute('/questionnaire/[id]').params.id
const router = useRouter()
const { isDark, toggle } = useDark()
const { isAuth } = useUserContext()
const { select, listen, updateFavorite, updateFixed } = useSupabaseQuestionnaireDetail()
const { loading, withLoadingFn } = useLoading()
const { loading: favoriteLoading, withLoadingFn: favoriteWithLoadingFn } = useLoading()

const authenticated = isAuth()
const fixMessagesHandler: Record<string, NotificationHandle['close']> = {}

const scrollbarRef = ref()
const enableScroll = ref(true)
const questionText = ref('')
const stampScrollbarRef = ref()
const stampPopupVisible = ref(false)
const newStampSrc = ref<string | undefined>(undefined)
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

listen(baseId, (record) => {
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
    if (enableScroll.value && !record.stamp) {
      setTimeout(() => {
        scrollbarRef.value?.scrollTo({
          top: scrollbarRef.value?.wrapRef.scrollHeight,
          behavior: 'smooth',
        })
      }, 200)
    }
  }

  if (record.stamp) {
    newStampSrc.value = record.content
    stampPopupVisible.value = true
    setTimeout(() => {
      stampScrollbarRef.value?.scrollTo({
        left: stampScrollbarRef.value?.wrapRef.scrollWidth,
        behavior: 'smooth',
      })
    }, 200)
    setTimeout(() => stampPopupVisible.value = false, 3000)
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
      customClass: 'whitespace-pre-wrap text-blue-600',
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
    <div class="max-w-8xl mx-auto mb-3 w-full flex items-center justify-between border-b-1 px-3 pb-2 dark:border-gray-700 lg:px-4">
      <div />
      <div @click="home">
        <img src="/logo.png" alt="logo" cursor="pointer" width="42px" text="center">
      </div>
      <svg v-if="isDark" class="h-[20px] w-[20px] cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" @click="toggle()">
        <path fill-rule="evenodd" d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z" clip-rule="evenodd" />
      </svg>
      <svg v-else class="h-[20px] w-[20px] cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" @click="toggle()">
        <path fill-rule="evenodd" d="M11.675 2.015a.998.998 0 0 0-.403.011C6.09 2.4 2 6.722 2 12c0 5.523 4.477 10 10 10 4.356 0 8.058-2.784 9.43-6.667a1 1 0 0 0-1.02-1.33c-.08.006-.105.005-.127.005h-.001l-.028-.002A5.227 5.227 0 0 0 20 14a8 8 0 0 1-8-8c0-.952.121-1.752.404-2.558a.996.996 0 0 0 .096-.428V3a1 1 0 0 0-.825-.985Z" clip-rule="evenodd" />
      </svg>
    </div>

    <el-scrollbar ref="scrollbarRef" class="w-full" wrap-class="w-full" view-class="w-full flex flex-grow justify-center">
      <div v-if="list.length === 0 && !loading">
        <el-empty />
      </div>
      <Transition>
        <div v-if="list.length > 0" w-full max-w="768px">
          <template v-for="item in list" :key="item.id">
            <div v-if="item.quiz_id">
              <QuizCard :base-id="baseId" :quiz-id="item.quiz_id" />
            </div>
            <div v-else mb-3 w-full flex flex-col>
              <div items-top w-full flex>
                <div class="relative mt-1 h-8 w-8 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
                  <svg class="absolute h-10 w-10 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
                </div>
                <div class="ml-2 w-full">
                  <div class="w-full flex items-center border-gray-200 rounded-e-xl rounded-es-xl bg-gray-100 px-3 py-2.5 dark:bg-gray-700">
                    <div class="flex-grow whitespace-pre-wrap break-all">
                      {{ item.content }}
                    </div>

                    <div class="ml-1">
                      <svg v-if="authenticated" :class="{ 'text-orange': item.fixed, 'dark:text-gray-300': !item.fixed }" class="mr-2 h-[22px] w-[22px] cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" @click="onClickFixMessage(item.id, item.fixed)">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8" />
                      </svg>
                    </div>

                    <div>
                      <svg class="mr-2 h-[22px] w-[22px] cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" @click="toggleShowReply(item.id)">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7.556 8.5h8m-8 3.5H12m7.111-7H4.89a.896.896 0 0 0-.629.256.868.868 0 0 0-.26.619v9.25c0 .232.094.455.26.619A.896.896 0 0 0 4.89 16H9l3 4 3-4h4.111a.896.896 0 0 0 .629-.256.868.868 0 0 0 .26-.619v-9.25a.868.868 0 0 0-.26-.619.896.896 0 0 0-.63-.256Z" />
                      </svg>
                    </div>

                    <div v-loading="item.loading" class="flex" items="center" @click="onFavoriteUpdate(item.id, item.favorite, item.clicked)">
                      <svg :class="{ 'text-pink': item.clicked }" class="h-[22px] w-[22px] cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                      </svg>
                      <div class="ml-0.5" align="left" w-16px text-sm>
                        {{ item.favorite }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div flex>
                <div w-34px />
                <div w-full pl-1>
                  <div v-if="item.replies.length > 0" items="center" cursor="pointer" flex pl-1 pt-1 @click="toggleShowReply(item.id)">
                    <div class="text-sm text-blue-500 dark:text-blue-600">
                      {{ `${item.replies.length} reply ` }}
                    </div>
                    <div class="i-carbon-chevron-down text-blue-500 dark:text-blue-600" ml-0.5 mt-1 text-xs />
                  </div>
                  <div v-if="item.showReply" mt-3 border-l-3 border-slate-300 p-l-6>
                    <TransitionGroup name="list" tag="div">
                      <div v-for="(reply, idx) in item.replies" :key="idx" mb-2>
                        <div w-full flex items-center>
                          <div class="relative h-8 w-8 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
                            <svg class="absolute h-10 w-10 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
                          </div>
                          <div class="ml-2 w-full">
                            <div class="w-full flex items-center border-gray-200 rounded-e-xl rounded-es-xl bg-gray-100 px-3 py-2.5 dark:bg-gray-700">
                              <div class="flex-grow whitespace-pre-wrap break-all">
                                {{ reply }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TransitionGroup>
                    <div mt-2>
                      <QuestionText v-model="item.replyText" placeholder="reply..." :reply="item.id" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </Transition>
    </el-scrollbar>

    <QuestionText v-model="questionText" placeholder="Write a message...">
      <template #bottom-left>
        <label class="inline-flex cursor-pointer items-center">
          <input v-model="enableScroll" type="checkbox" class="peer sr-only">
          <div class="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:border after:border-gray-300 dark:border-gray-600 after:rounded-full after:bg-white dark:bg-gray-400 peer-checked:bg-blue-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:peer-checked:bg-blue-600 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full" />
          <span class="ml-2 text-sm dark:text-gray-300">scroll</span>
        </label>
      </template>
    </QuestionText>
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
.list-enter-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
</style>
