<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface QuestionnaireDetailRecord {
  id: string
  content: string
  favorite: number
  clicked: boolean
  loading: boolean
  fixed: boolean
}

const baseId = useRoute('/questionnaire/[id]').params.id
const router = useRouter()
const { isAuth } = useUserContext()
const { select, listen, insert, updateFavorite, updateFixed } = useSupabaseQuestionnaireDetail()
const { loading, withLoadingFn } = useLoading()
const { loading: favoriteLoading, withLoadingFn: favoriteWithLoadingFn } = useLoading()

const enableFixMessage = isAuth()
const scrollbarRef = ref()
const enableScroll = ref(true)
const questionText = ref('')

const list = ref<QuestionnaireDetailRecord[]>([])

withLoadingFn(async () => {
  const data = await select(baseId)
  list.value = data.map((d) => {
    d.clicked = false
    d.loading = false
    return d
  })
  clearFixedMessage()
  list.value.filter(l => l.fixed).forEach(l => setFixedMessage(l))
})

listen((record) => {
  record.clicked = false
  record.loading = false
  list.value.push(record)
  if (enableScroll.value) {
    setTimeout(() => {
      scrollbarRef.value.scrollTo({
        top: scrollbarRef.value.wrapRef.scrollHeight,
        behavior: 'smooth',
      })
    })
  }
}, (record) => {
  const index = list.value.findIndex(item => item.id === record.id)
  if (index >= 0) {
    const item = list.value[index]
    item.favorite = record.favorite
    item.loading = false
    item.fixed = record.fixed
    list.value.splice(index, 1, item)
    if (record.fixed) {
      setFixedMessage(record)
    }
    else {
      clearFixedMessage()
    }
  }
})

async function onSubmit() {
  if (questionText.value.trimEnd() === '' || questionText.value.replaceAll('\n', '').trimEnd() === '') {
    return
  }
  await insert({
    base_id: baseId,
    content: questionText.value.trimEnd(),
  })
  questionText.value = ''
}

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

function onClickFixMessage(id: string, fixed: boolean) {
  updateFixed({ id, fixed: !fixed })
}

function home() {
  router.push('/admin/dashboard')
}

function setFixedMessage(record: QuestionnaireDetailRecord) {
  ElMessage({
    type: 'success',
    icon: QuestionFilled,
    message: record.content,
    showClose: true,
    duration: 0,
    customClass: 'whitespace-pre-wrap text-2xl pa-3 left-auto pos-right-32px transform-none',
  })
}

function clearFixedMessage() {
  ElMessage.closeAll()
}

onUnmounted(() => {
  clearFixedMessage()
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

    <el-scrollbar ref="scrollbarRef" class="w-full" wrap-class="w-full" view-class="w-full flex flex-grow justify-center pb-4">
      <div v-if="list.length === 0 && !loading">
        <img src="/undraw_faq_re_31cw.svg" alt="faq" mt-4 max-width="480px">
        <div text-ld mt-4 text-center op-80>
          No questions yet. <br>If you have any questions about what you are interested in, feel free to ask!
        </div>
      </div>
      <Transition>
        <div v-if="list.length > 0" w-full max-w="768px">
          <div v-for="item in list" :key="item.id" items="center" mb-3 w-full flex>
            <div flex p="1" mr="4" items="center" align="center" border="rounded" style="background: linear-gradient(45deg, #9392FD, #F395F5);">
              <div i-carbon-chat-bot color="white" text-2xl />
            </div>
            <div w-full flex py-3 pr-3 items="center" class="card" style="background: rgba(255, 255, 255, 0.8)" border="rounded">
              <div w="full" style="text-overflow: auto; white-space: pre-wrap">
                {{ item.content }}
              </div>
              <div v-if="enableFixMessage">
                <div class="i-carbon-attachment" :class="item.fixed ? 'text-orange' : 'text-gray'" ml-1 mr-1 cursor="pointer" @click="onClickFixMessage(item.id, item.fixed)" />
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
      </Transition>
    </el-scrollbar>

    <div w="full" max-w="768px" justify="center" items="center" flex pt-2>
      <el-input
        v-model="questionText"
        :autosize="{ minRows: 1, maxRows: 5 }"
        input-style="padding: 12px; border-radius: 8px"
        type="textarea"
        resize="none"
        outline="none active:none"
        placeholder="Write a message..."
        @keydown.ctrl.enter.prevent="onSubmit"
      />
      <div bg="#8a8bf9" p="1" border="rounded" ml--8 mt--8 class="relative bottom--4 right-2 text-lg">
        <div i-carbon-send-filled text="white" cursor="pointer" @click="onSubmit" />
      </div>
    </div>
    <div max-w="768px" w-full flex justify="end" class="text-gray-500">
      <em text-xs op75>Ctrl + Enter</em>
    </div>
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
  border-right-color: rgba(255, 255, 255, 0.8);
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
