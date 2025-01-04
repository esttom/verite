<script setup lang="ts">
interface Header {
  prop: string
  label: string
  width?: string
  action?: (content: Content) => void
}

type Content = Record<string, any>

const props = defineProps<{
  headers: Header[]
  loading: boolean
}>()

const contents = defineModel<Content[]>()
</script>

<template>
  <div w="full" mt-4 text-sm>
    <el-table v-loading="props.loading" :data="contents" stripe style="width: 100%">
      <template v-for="h in props.headers" :key="h.prop">
        <el-table-column v-if="h.action" :width="h.width">
          <template #default="scope">
            <el-button size="small" @click.prevent="h.action(scope.row)">
              {{ h.label }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column v-else :prop="h.prop" :label="h.label" :width="h.width" />
      </template>
    </el-table>
  </div>
</template>
