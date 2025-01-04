<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { Key, Message } from '@element-plus/icons-vue'

defineOptions({
  name: 'IndexPage',
})

const router = useRouter()
const { signIn } = useSupabaseAuth()
const { setContext } = useUserContext()
const { loading, withLoadingFn } = useLoading()

const loginFormRef = ref()

const loginForm = reactive({
  email: '',
  password: '',
})

const loginFormRules = reactive<FormRules<typeof loginForm>>({
  email: [{
    trigger: 'change',
    validator: (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('Please input the email'))
      }
      else {
        callback()
      }
    },
  },
  ],
  password: [{
    trigger: 'change',
    validator: (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('Please input the password'))
      }
      else {
        callback()
      }
    },
  }],
})

async function submit(formEl: FormInstance | undefined) {
  if (!formEl) {
    return
  }
  formEl.validate((valid) => {
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
  <el-card v-loading="loading" justify="center" items="center" w-full flex max-w="480px">
    <div class="mb-2 mt-3 flex justify-center">
      <img src="/logo.png" alt="logo" cursor="pointer" width="48px" text="center">
    </div>
    <h2 class="mb-2 text-center text-2xl font-bold">
      Sign in
    </h2>
    <p class="mb-8 text-center text-sm text-gray-500">
      Sign in to access to your dashboard.
    </p>
    <el-form ref="loginFormRef" :model="loginForm" label-position="left" w="380px" status-icon :rules="loginFormRules" @submit.prevent>
      <el-form-item prop="email">
        <el-input v-model="loginForm.email" placeholder="email">
          <template #prepend>
            <el-icon>
              <Message />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" show-password placeholder="password">
          <template #prepend>
            <el-icon>
              <Key />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-col class="text-center" mb-3 mt-3>
          <el-button color="#626aef" @click="submit(loginFormRef)">
            Sign in
          </el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </el-card>
</template>
