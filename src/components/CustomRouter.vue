<script setup lang="ts">
const router = useRouter()
const { setContext } = useUserContext()
const { getSession } = useSupabaseAuth()

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const session = await getSession()
    if (!session) {
      next('/')
      return
    }
    setContext(session.user.id)
  }
  next()
})
</script>

<template>
  <RouterView />
</template>
