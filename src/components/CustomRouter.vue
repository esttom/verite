<script setup lang="ts">
const router = useRouter()
const { isAuth } = useUserContext()
const { setContext } = useUserContext()
const { getSession } = useSupabaseAuth()

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    if (!isAuth()) {
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
