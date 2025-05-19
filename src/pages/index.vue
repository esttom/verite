<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})

const router = useRouter()
const { signIn } = useSupabaseAuth()
const { setContext } = useUserContext()
const { loading, withLoadingFn } = useLoading()

const loginForm = reactive({
  email: '',
  emailError: false,
  emailErrorMessage: '',
  password: '',
  passwordError: false,
  passwordErrorMessage: '',
})

function validate(fn: (valid: boolean) => void) {
  if (!loginForm.email) {
    loginForm.emailError = true
    loginForm.emailErrorMessage = 'メールアドレスを入力してください。'
  }
  else {
    loginForm.emailError = false
    loginForm.emailErrorMessage = ''
  }
  if (!loginForm.password) {
    loginForm.passwordError = true
    loginForm.passwordErrorMessage = 'パスワードを入力してください。'
  }
  else {
    loginForm.passwordError = false
    loginForm.passwordErrorMessage = ''
  }
  fn(!loginForm.emailError && !loginForm.passwordError)
}

async function submit() {
  validate((valid) => {
    if (valid) {
      withLoadingFn(async () => {
        const data = await signIn(loginForm.email, loginForm.password)
        setContext(data.user.id)
        router.push(`/admin/dashboard`)
      })
    }
  })
}
</script>

<template>
  <div class="h-full max-w-500px w-full flex items-center">
    <div class="mx-auto w-full flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <img class="mb-2 h-12 w-12" src="/logo.png" alt="logo">
      <div v-loading="loading" class="w-full rounded-lg bg-white shadow md:mt-0 sm:max-w-md dark:border dark:border-gray-700 dark:bg-gray-800 xl:p-0">
        <div class="p-4 space-y-4 sm:p-8 md:space-y-6">
          <div class="text-center text-xl text-gray-900 font-bold leading-tight tracking-tight md:text-2xl dark:text-white">
            Sign in
            <div class="mt-2 text-center text-xs text-gray-400">
              Sign in to access to your dashboard.
            </div>
          </div>
          <form class="space-y-3 md:space-y-5" @submit.prevent="submit">
            <div>
              <div class="flex">
                <span class="inline-flex items-center border border-e-0 border-gray-300 rounded-e-0 rounded-s-md bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                  <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                    <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                  </svg>
                </span>
                <input v-model="loginForm.email" type="text" :class="{ '[box-shadow:inset_0_0_0_1px_red]': loginForm.emailError }" class="block min-w-0 w-full flex-1 border border-gray-300 rounded-none rounded-e-lg bg-gray-50 p-2.5 text-base text-gray-900 dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 md:text-sm dark:text-white focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400" placeholder="email">
              </div>
              <div class="h-13px text-xs text-red">
                {{ loginForm.emailErrorMessage }}
              </div>
            </div>
            <div>
              <div class="flex">
                <span class="inline-flex items-center border border-e-0 border-gray-300 rounded-e-0 rounded-s-md bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                  <svg class="h-4 w-4 text-gray500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd" />
                  </svg>
                </span>
                <input v-model="loginForm.password" type="password" :class="{ '[box-shadow:inset_0_0_0_1px_red]': loginForm.passwordError }" class="block min-w-0 w-full flex-1 border border-gray-300 rounded-none rounded-e-lg bg-gray-50 p-2.5 text-base text-gray-900 dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 md:text-sm dark:text-white focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400" placeholder="password">
              </div>
              <div class="h-13px text-xs text-red">
                {{ loginForm.passwordErrorMessage }}
              </div>
            </div>
            <button type="submit" class="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm text-white font-medium dark:bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
