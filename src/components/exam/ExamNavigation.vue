<script setup lang="ts">
import type { ExamDraft } from '~/composables'
import { ElMessageBox } from 'element-plus'

const props = defineProps<{ chatId: string }>()
const { select, save, remove } = useSupabaseExam()
const { select: selectDetails, insert: insertDetail } = useSupabaseChatDetail()
const sender = useSupabaseRealtimeSender()
const { loading, withLoadingFn } = useLoading()

const exams = ref<any[]>([])
const publishedIds = ref(new Set<string>())
const builderVisible = ref(false)
const editing = ref<ExamDraft | undefined>()
const unavailable = ref(false)

async function load() {
  try {
    const [examRows, details] = await Promise.all([select(props.chatId), selectDetails(props.chatId)])
    exams.value = examRows ?? []
    publishedIds.value = new Set((details ?? []).map(item => item.exam_id).filter(Boolean) as string[])
    unavailable.value = false
  }
  catch {
    unavailable.value = true
  }
}

function createExam() {
  editing.value = undefined
  builderVisible.value = true
}

function editExam(row: any) {
  editing.value = {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    questions: Array.isArray(row.items) ? row.items.map((item: any, index: number) => ({ ...item, explanation: item.explanation ?? '', correctChoiceId: row.answers[index] ?? null })) : [],
  }
  builderVisible.value = true
}

async function saveExam(draft: ExamDraft) {
  await save(props.chatId, draft)
  await load()
}

async function removeExam(row: any) {
  try {
    await ElMessageBox.confirm(
      `「${row.title}」を削除しますか？公開中の問題カードも削除されます。`,
      '問題を削除',
      { confirmButtonText: '削除', cancelButtonText: 'キャンセル', type: 'warning' },
    )
  }
  catch {
    return
  }
  await withLoadingFn(async () => {
    await remove(row.id)
    await load()
  })
}

function publish(row: any) {
  if (publishedIds.value.has(row.id)) {
    return
  }
  withLoadingFn(async () => {
    const data = await insertDetail({
      chat_id: props.chatId,
      content: '',
      reply: null,
      quiz_id: null,
      exam_id: row.id,
      question: false,
      anon_id: '',
    })
    if (data) {
      sender('chat-insert', { ...data })
      publishedIds.value.add(row.id)
    }
  })
}

onMounted(load)
</script>

<template>
  <section v-loading="loading" class="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
    <div class="mb-3 flex items-center justify-between">
      <div>
        <h3 class="font-semibold">
          テスト
        </h3>
        <p class="text-xs text-gray-500">
          複数の問題・正解・回答後の解説を設定します。
        </p>
      </div>
      <el-button color="#626aef" @click="createExam">
        テストを追加
      </el-button>
    </div>

    <el-alert v-if="unavailable" type="warning" :closable="false" title="テスト用DB設定が未適用です。supabase/migrations のSQLを適用してください。" />

    <div v-else-if="exams.length === 0" class="border rounded-lg border-dashed p-4 text-center text-sm text-gray-500 dark:border-gray-600">
      テストはまだありません。
    </div>
    <div v-else class="space-y-2">
      <div v-for="row in exams" :key="row.id" class="border rounded-lg p-3 dark:border-gray-600">
        <div class="font-medium">
          {{ row.title }}
        </div>
        <div class="mb-2 text-xs text-gray-500">
          {{ Array.isArray(row.items) ? row.items.length : 0 }}問
        </div>
        <div class="flex justify-end gap-2">
          <el-button @click="editExam(row)">
            変更
          </el-button>
          <el-button type="danger" plain @click="removeExam(row)">
            削除
          </el-button>
          <el-button color="#626aef" :disabled="publishedIds.has(row.id)" @click="publish(row)">
            {{ publishedIds.has(row.id) ? '公開済み' : '公開' }}
          </el-button>
        </div>
      </div>
    </div>

    <ExamBuilderDialog v-model="builderVisible" :initial="editing" :submit="saveExam" />
  </section>
</template>
