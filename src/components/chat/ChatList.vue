<script setup lang="ts">
import type { ChatItem } from '~/composables'

const props = defineProps<{ chatId: string, anonId: string, authenticated: boolean, questionFilter: boolean, submit: (data: string | ChatItem) => Promise<void>, update: (data: ChatItem) => Promise<void> }>()

const list = defineModel<ChatItem[]>({ required: true })

const filteredList = computed(() => props.questionFilter ? list.value.filter(c => c.question) : list.value)

const scrollbarRef = ref()

async function onClickFavorite(item: ChatItem) {
  const nextFavorite = item.favorite + (item.favorited ? -1 : 1)
  await props.update({ ...item, favorite: nextFavorite })
  const index = list.value.findIndex(i => i.id === item.id)
  if (index >= 0) {
    list.value[index].favorited = !list.value[index].favorited
  }
}

async function onClickQuestion(item: ChatItem) {
  await props.update({ ...item, question: !item.question })
}

async function onClickFixed(item: ChatItem) {
  props.update({ ...item, fixed: !item.fixed })
}

async function onClickReply(item: ChatItem) {
  const index = list.value.findIndex(l => l.id === item.id)
  if (index >= 0) {
    list.value[index] = {
      ...list.value[index],
      showReply: !list.value[index].showReply,
    }
  }
}

function scroll() {
  setTimeout(() => {
    scrollbarRef.value?.scrollTo({
      top: scrollbarRef.value?.wrapRef.scrollHeight,
      behavior: 'smooth',
    })
  }, 200)
}

defineExpose({
  scroll,
})
</script>

<template>
  <el-scrollbar ref="scrollbarRef" class="w-full" wrap-class="w-full" view-class="w-full flex flex-grow justify-center">
    <div v-if="list.length === 0">
      <el-empty />
    </div>
    <Transition>
      <div v-if="filteredList.length > 0" class="max-w-768px w-full">
        <template v-for="item in filteredList" :key="item.id">
          <div v-if="item.quiz_id">
            <ChatQuizCard :chat-id="props.chatId" :quiz-id="item.quiz_id" />
          </div>
          <div v-else mb-3 w-full flex flex-col>
            <div items-top w-full flex>
              <div class="relative mt-1 h-8 w-8 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
                <svg class="absolute h-10 w-10 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
              </div>
              <div class="ml-2 w-full">
                <div class="w-full flex items-center border-gray-200 rounded-e-xl rounded-es-xl bg-gray-100 px-3 py-2.5 dark:bg-gray-600">
                  <div class="flex-grow whitespace-pre-wrap break-all">
                    {{ item.content }}
                  </div>

                  <span v-if="item.question" class="me-2 ml-1 inline-flex items-center rounded-sm bg-purple-100 px-2 py-0.5 text-sm text-purple-800 font-medium dark:bg-purple-900 dark:text-purple-300">
                    <div class="inline-flex items-center">Q</div>
                    <button v-if="props.anonId === item.anon_id" type="button" class="rounded-xs ms-2 inline-flex items-center bg-transparent p-1 text-sm text-purple-400 hover:bg-purple-200 hover:text-purple-900 dark:hover:bg-purple-800 dark:hover:text-purple-300" data-dismiss-target="#badge-dismiss-purple" aria-label="Remove" @click="onClickQuestion(item)">
                      <svg class="h-2 w-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                      </svg>
                      <span class="sr-only">Remove badge</span>
                    </button>
                  </span>

                  <div class="ml-1">
                    <svg v-if="authenticated" :class="{ 'text-orange': item.fixed, 'dark:text-gray-300': !item.fixed }" class="mr-2 h-[22px] w-[22px] cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" @click="onClickFixed(item)">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8" />
                    </svg>
                  </div>

                  <div>
                    <svg class="mr-2 h-[22px] w-[22px] cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" @click="onClickReply(item)">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7.556 8.5h8m-8 3.5H12m7.111-7H4.89a.896.896 0 0 0-.629.256.868.868 0 0 0-.26.619v9.25c0 .232.094.455.26.619A.896.896 0 0 0 4.89 16H9l3 4 3-4h4.111a.896.896 0 0 0 .629-.256.868.868 0 0 0 .26-.619v-9.25a.868.868 0 0 0-.26-.619.896.896 0 0 0-.63-.256Z" />
                    </svg>
                  </div>

                  <div class="flex" items="center" @click="onClickFavorite(item)">
                    <svg :class="{ 'text-pink': item.favorited }" class="h-[22px] w-[22px] cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
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
                <div v-if="item.reply && item.reply.length > 0" items="center" cursor="pointer" flex pl-1 pt-1 @click="onClickReply(item)">
                  <div class="text-sm text-blue-500 dark:text-blue-600">
                    {{ `${item.reply.length} reply ` }}
                  </div>
                  <div class="i-carbon-chevron-down text-blue-500 dark:text-blue-600" ml-0.5 mt-1 text-xs />
                </div>
                <div v-if="item.showReply" mt-3 border-l-3 border-slate-300 p-l-6>
                  <TransitionGroup name="list" tag="div">
                    <div v-for="(reply, idx) in item.reply" :key="idx" mb-2>
                      <div w-full flex items-center>
                        <div class="relative h-8 w-8 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
                          <svg class="absolute h-10 w-10 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
                        </div>
                        <div class="ml-2 w-full">
                          <div class="w-full flex items-center border-gray-200 rounded-e-xl rounded-es-xl bg-gray-100 px-3 py-2.5 dark:bg-gray-700">
                            <div class="flex-grow whitespace-pre-wrap break-all">
                              {{ reply.content }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TransitionGroup>
                  <div mt-2>
                    <ChatText v-model="item.replyInput" :anon-id="props.anonId" :item="item" :submit="props.submit" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </Transition>
  </el-scrollbar>
</template>

<style scoped>
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
