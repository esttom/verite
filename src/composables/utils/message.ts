import { QuestionFilled } from '@element-plus/icons-vue'
import { ElNotification, type NotificationHandle } from 'element-plus'

export function useMessage() {
  const fixMessagesHandler: Record<string, NotificationHandle['close']> = {}

  function show(id: string, message: string) {
    setTimeout(() => {
      const { close } = ElNotification({
        icon: QuestionFilled,
        message,
        duration: 0,
        customClass: 'whitespace-pre-wrap text-blue-600',
      })
      fixMessagesHandler[id] = close
    }, 0)
  }

  function close(id: string) {
    fixMessagesHandler[id]?.()
  }

  onUnmounted(() => {
    for (const key in fixMessagesHandler) {
      fixMessagesHandler[key]()
    }
  })

  return {
    show,
    close,
  }
}
