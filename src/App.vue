<script setup lang="ts">
provideSupabase()
provideUserContext()
</script>

<template>
  <main v-cloak justify="center" p="x-4 y-4" h-full w-full flex font-sans>
    <CustomRouter />
  </main>
</template>

<style>
[v-cloak] {
  display: none;
}
</style>
