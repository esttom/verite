<template>
  <el-card class="progress-card" style="background-color: rgba(0,0,0,.08)">
    <el-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="6"
      class="mb-2"
      color="rgba(12,12,233,.32)"
    >
      <span>6%: そこそこの頻度でやる</span>
    </el-progress>
    <el-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="18"
      class="mb-2"
      color="rgba(12,12,233,.32)"
    >
      <span>18%: 過去にやっていた</span>
    </el-progress>
    <el-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="34"
      class="mb-2"
      color="rgba(12,12,233,.32)"
    >
      <span>34%: 見ててやってみたいと思う</span>
    </el-progress>
    <el-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="43"
      class="mb-1 mt-1"
      color="rgba(12,12,233,.32)"
    >
      <span>43%: 見てて良いゲームだと思う</span>
    </el-progress>
  </el-card>
</template>

<style scoped>
.progress-card ::v-deep(.el-progress-bar__outer) {
  background-color: rgba(45, 62, 102, 0.52);
}
</style>
