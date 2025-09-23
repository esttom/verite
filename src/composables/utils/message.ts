import type { NotificationHandle } from 'element-plus'
import { InfoFilled, QuestionFilled } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'

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

  function once(message: string, duration: number) {
    setTimeout(() => {
      ElNotification({
        icon: InfoFilled,
        message,
        duration,
        customClass: 'whitespace-pre-wrap text-blue-600',
      })
    }, 0)
  }

  onUnmounted(() => {
    for (const key in fixMessagesHandler) {
      fixMessagesHandler[key]()
    }
  })

  return {
    show,
    close,
    once,
  }
}
