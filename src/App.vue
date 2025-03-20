<script setup lang="ts">
provideSupabase()
provideUserContext()
</script>

<template>
  <main v-cloak justify="center" p="x-4 y-3" h-full w-full flex font-sans class="bg-white dark:bg-gray-900">
    <CustomRouter />
  </main>
</template>

<style>
[v-cloak] {
  display: none;
}
</style>
