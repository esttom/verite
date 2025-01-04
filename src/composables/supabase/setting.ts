import type { InjectionKey } from 'vue'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_KEY = Symbol('supabase client key') as InjectionKey<SupabaseClient<any, 'public', any>>

export function provideSupabase() {
  const client = createClient(
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
