<script setup lang="ts">
const { push } = useRouter()
const { signOut } = useSupabaseAuth()

function logout() {
  signOut()
  push('/')
}
</script>

<template>
  <div w="full" max-w="1024px" min-w="480px" flex="column">
    <div w="full" justify="between" items="center" mb-4 flex>
      <div />
      <img src="/logo.png" alt="logo" cursor="pointer" width="48px" text="center">
      <div i-carbon-logout cursor="pointer" text-xl @click="logout" />
    </div>
    <RouterView />
  </div>
</template>
