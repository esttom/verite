import type { InjectionKey } from 'vue'

interface UserContext {
  auth: boolean
  userId: string
}

interface IUserContext {
  context: Readonly<UserContext>
  setContext: (userId: string) => void
  isAuth: () => boolean
}

const USER_CONTEXT_KEY = Symbol('supabase client key') as InjectionKey<IUserContext>

export function provideUserContext() {
  const context = shallowRef<UserContext>({
    auth: false,
    userId: '',
  })

  const setContext = (userId: string) => {
    context.value.auth = true
    context.value.userId = userId
  }

  const isAuth = () => {
    return !!context.value.auth
  }

  provide(USER_CONTEXT_KEY, {
    context: readonly(context.value),
    setContext,
    isAuth,
  })
}

export function useUserContext() {
  const $u = inject(USER_CONTEXT_KEY)
  if (!$u) {
    throw new Error('fail setup user context')
  }
  return $u
}
