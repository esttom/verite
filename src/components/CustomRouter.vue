<script setup lang="ts">
const router = useRouter()
const { isAuth, setContext } = useUserContext()
const { isLogined, getSession } = useSupabaseAuth()

router.beforeEach(async (to) => {
  if (!isAuth()) {
    if (isLogined() || to.meta.requiresAuth) {
      const session = await getSession()
      if (session) {
        setContext(session.user.id)
      }
      else {
        return '/'
      }
    }
  }
})
</script>

<template>
  <RouterView />
</template>
