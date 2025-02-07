import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    ignores: ['supabase/config.toml', 'src/composables/supabase/database.types.ts'],
  },
)
