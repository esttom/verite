<script setup lang="ts">
const results = [
  {
    text: 'そこそこの頻度でやる',
    percentage: 6,
  },
  {
    text: '過去にやっていた',
    percentage: 18,
  },
  {
    text: '見ててやってみたいと思う',
    percentage: 34,
  },
  {
    text: '見てて良いゲームだと思う',
    percentage: 43,
  },
]
</script>

<template>
  <el-card class="progress-card" style="background-color: rgba(255,255,255,.08)">
    <div v-for="(result, idx) in results" :key="idx" justify="between" items="center" mb-2 w-full flex>
      <el-progress
        :text-inside="true"
        :stroke-width="20"
        :percentage="result.percentage"
        class="flex-grow"
        color="rgba(12,12,233,.32)"
      >
        <span>{{ result.text }}</span>
      </el-progress>
      <div w-42px text-right text-sm>
        {{ `${result.percentage}%` }}
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.progress-card ::v-deep(.el-progress-bar__outer) {
  background-color: rgba(45, 62, 102, 0.48);
}
</style>
