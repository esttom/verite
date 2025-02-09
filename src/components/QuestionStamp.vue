<script setup lang="ts">
defineProps<{ src: string }>()
</script>

<template>
  <el-popover placement="top" trigger="click">
    <template #reference>
      <img :src="src" ml-1 w-48px>
    </template>
    <div flex justify-center>
      <img :src="src" w-84px>
    </div>
  </el-popover>
</template>
