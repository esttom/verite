<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'

const props = defineProps<{ quizId: string }>()

const closed = ref(false)
const title = ref('')
const questions = ref<{ text: string, percentage: number }[]>([])

const { selectById } = useSupabaseQuiz()

selectById(props.quizId)
  .then((d) => {
    title.value = d.title
    questions.value = d.questions?.map(q => ({ text: q, percentage: 0 })) ?? []
  })
</script>

<template>
  <el-card class="progress-card max-w-420px" h-fit>
    <template #header>
      <div class="text-bold flex items-center text-#8a8bf9">
        <QuestionFilled w="24px" mr-1 />
        <span>{{ title }}</span>
      </div>
    </template>
    <template v-if="closed">
      <div class="space-y-2">
        <div v-for="(question, idx) in questions" :key="idx" class="relative w-full overflow-hidden rounded-2xl bg-gray-400">
          <div class="absolute left-0 top-0 h-full bg-[#8a8bf9]" :style="`width: ${question.percentage}%`" />
          <div class="relative z-10 px-3 py-1 text-sm text-white">
            {{ question.text }} - {{ question.percentage }}%
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col">
        <div class="space-y-2">
          <button v-for="(question, idx) in questions" :key="idx" class="w-full transform rounded-2xl bg-[#8a8bf9] py-1 text-white shadow-md transition hover:scale-102 hover:bg-[#7a7be0]">
            {{ question.text }}
          </button>
        </div>
      </div>
    </template>
  </el-card>
</template>

<style scoped>
.progress-card ::v-deep(.el-progress-bar__outer) {
  background-color: rgba(45, 62, 102, 0.42);
}
</style>
