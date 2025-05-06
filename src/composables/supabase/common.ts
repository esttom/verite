import type { PostgrestError } from '@supabase/supabase-js'

export function supabaseResponse<D>(data: D, error: PostgrestError | null) {
  if (error) {
    // eslint-disable-next-line no-alert
    alert(error.message)
    throw new Error(error.message)
  }
  return data
}
