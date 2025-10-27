<script setup lang="ts">
import type { ChatItem } from '~/composables'
import ChatListItem from './ChatListItem.vue'

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
          <ChatListItem v-else :authenticated="authenticated" :anon-id="anonId" :item="item" :submit="submit" @favorite="onClickFavorite" @fixed="onClickFixed" @reply="onClickReply" @question="onClickQuestion" />
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
