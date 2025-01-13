import { ElMessage } from 'element-plus'

export function useSupabaseAuth() {
  const client = useSupabase()

  const signIn = async (email: string, password: string) => {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      ElMessage({
        type: 'error',
        message: 'invalid sign in',
      })
      throw new Error(error.message)
    }
    return data
  }

  const signOut = async () => {
    const error = await client.auth.signOut()
    return error
  }

  const getSession = async () => {
    const { data, error } = await client.auth.getSession()
    if (error) {
      ElMessage({
        type: 'error',
        message: 'session error',
      })
      throw new Error(error.message)
    }
    return data.session
  }

  return {
    signIn,
    signOut,
    getSession,
  }
}
