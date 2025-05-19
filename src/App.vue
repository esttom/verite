<script setup lang="ts">
provideSupabase()
provideUserContext()
</script>

<template>
  <main v-cloak justify="center" class="h-full w-full flex bg-white px-2 pb-4 pt-2 font-sans dark:bg-gray-900 dark:text-gray-300">
    <CustomRouter />
  </main>
</template>

<style>
[v-cloak] {
  display: none;
}
</style>
