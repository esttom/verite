export function useDark() {
  const isDark = ref(document.documentElement.classList.contains('dark'))

  const toggle = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return {
    isDark,
    toggle,
  }
}
