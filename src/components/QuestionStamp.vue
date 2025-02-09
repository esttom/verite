<script setup lang="ts">
defineProps<{ src: string }>()

const visible = ref(false)
</script>

<template>
  <el-popover :visible="visible" placement="top">
    <template #reference>
      <img :src="src" ml-1 w-48px @mouseover="visible = true" @mouseleave="visible = false">
    </template>
    <div flex justify-center>
      <img :src="src" w-84px>
    </div>
  </el-popover>
</template>
