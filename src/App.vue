<script setup lang="ts">
provideSupabase()
provideUserContext()
</script>

<template>
  <main v-cloak justify="center" h-full w-full flex font-sans class="bg-white pb-4 pt-2 dark:bg-gray-900 dark:text-gray-300">
    <CustomRouter />
  </main>
</template>

<style>
[v-cloak] {
  display: none;
}
</style>
