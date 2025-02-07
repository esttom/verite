import type { InjectionKey } from 'vue'
import type { Database } from './database.types'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_KEY = Symbol('supabase client key') as InjectionKey<ReturnType<typeof createClient<Database>>>

export function provideSupabase() {
  const client = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URI,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
  )
  provide(SUPABASE_KEY, client)
}

export function useSupabase() {
  const $s = inject(SUPABASE_KEY)
  if (!$s) {
    throw new Error('fail setup supabase')
  }
  return $s
}
