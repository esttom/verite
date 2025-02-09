export function useLoading() {
  const loading = ref(false)

  async function withLoadingFn(fn: () => void | Promise<void>) {
    if (loading.value) {
      return
    }
    loading.value = true
    try {
      await fn()
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    withLoadingFn,
  }
}
