<script setup lang="ts">
const props = defineProps<{ placeholder: string, reply?: string }>()

const questionText = defineModel<string>({ default: '' })

const stamps = [
  '/stamp/yokuganbarimashita-hiyoko.png',
  '/stamp/subarashi.png',
  '/stamp/tanosimi-hiyoko.png',
  '/stamp/yokuaru.png',
  '/stamp/nice-hiyoko.png',
  '/stamp/pen-light-piyo.png',
  '/stamp/arigatou.gif',
  '/stamp/fumifumi-hiyoko.gif',
  '/stamp/nanimoshitenai.gif',
  '/stamp/repost-iine-hiyokoo.gif',
  '/stamp/pckatakata.gif',
  '/stamp/shimaenaga-cheer.png',
  '/stamp/harinezumi-heart.png',
  '/stamp/hirameki-kuma.png',
  '/stamp/inukoro.png',
  '/stamp/yarukizero-usagi.png',
]

const baseId = useRoute('/questionnaire/[id]').params.id
const { insert } = useSupabaseQuestionnaireDetail()

async function send(stampUrl?: string) {
  if (!stampUrl) {
    if (questionText.value.trimEnd() === '' || questionText.value.replaceAll('\n', '').trimEnd() === '') {
      return
    }
  }
  await insert({
    base_id: baseId,
    content: stampUrl ?? questionText.value,
    reply: props.reply ?? null,
    stamp: !!stampUrl,
  })
  questionText.value = ''
}
</script>

<template>
  <div class="text-container" w="full" max-w="768px" justify="center" items="center" flex flex-col bg-white pa-2 b="1px solid #e5e5e5 rounded-xl">
    <el-input
      v-model="questionText"
      :autosize="{ minRows: 1, maxRows: 8 }"
      input-style="padding: 5px; box-shadow: none; background-color: white;"
      type="textarea"
      resize="none"
      :placeholder="props.placeholder"
      @keydown.ctrl.enter.prevent="send()"
    />
    <div v-if="!props.reply" mt-1 w-full flex justify="between" items="center">
      <el-popover
        width="230px"
        placement="top"
        trigger="click"
      >
        <template #reference>
          <div class="i-carbon-stamp" text-xl text-gray cursor="pointer" />
        </template>

        <div grid grid-cols-4 gap-8px>
          <div v-for="stamp in stamps" :key="stamp" cursor="pointer" @dblclick="send(stamp)">
            <img :src="stamp">
          </div>
        </div>
      </el-popover>

      <div bg="#8a8bf9" p="1" border="rounded">
        <div i-carbon-send-filled text="md white" cursor="pointer" @click="send()" />
      </div>
    </div>
  </div>
  <div v-if="!props.reply" max-w="768px" w-full flex justify="end" class="text-gray-500">
    <em text-xs op75>Ctrl + Enter</em>
  </div>
</template>

<style scoped>
.text-container:has(.el-textarea__inner:focus) {
  border-color: rgba(0, 0, 0, 0.36);
}
</style>
