<script setup lang="ts">
defineProps<{ title: string }>()
const visible = defineModel<boolean>({ required: true })
const mobile = useMediaQuery('(max-width: 640px)')
</script>

<template>
  <el-dialog v-model="visible" :title="title" :fullscreen="mobile" width="90%" class="problem-detail-dialog" style="max-width: 720px">
    <div class="max-h-[72vh] overflow-y-auto px-1 sm:px-2">
      <slot />
    </div>
  </el-dialog>
</template>
