<script setup lang="ts">
const popup = ref(false)

const stamps = [
  '/stamp/yokuganbarimashita-hiyoko.png',
  '/stamp/subarashi.png',
  '/stamp/tanosimi-hiyoko.png',
  '/stamp/yokuaru.png',
  '/stamp/nice-hiyoko.png',
  '/stamp/chimeisho.png',
  '/stamp/kiokuni.png',
  '/stamp/onegaishimasu-hiyoko.png',
  '/stamp/otukare-hiyoko.png',
  '/stamp/arigatou.gif',
  '/stamp/repost-iine-hiyokoo.gif',
  '/stamp/shimaenaga-cheer.png',
  '/stamp/harinezumi-heart.png',
  '/stamp/hirameki-kuma.png',
  '/stamp/inukoro.png',
  '/stamp/yarukizero-usagi.png',
]
</script>

<template>
  <div class="absolute bottom-40 right-10 max-w-[60px] min-h-[180px] border border-gray-200 rounded-lg bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <div class="flex flex-col items-center">
      <div class="relative cursor-pointer pa-2" @click="popup = !popup">
        <svg class="h-[24px] w-[24px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z" clip-rule="evenodd" />
          <path fill-rule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z" clip-rule="evenodd" />
        </svg>

        <div v-if="popup" role="tooltip" class="shadow-xs absolute left--48 top--42 z-10 inline-block border border-gray-200 rounded-lg bg-white text-sm text-gray-500 transition-opacity duration-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
          <div class="h-40 w-60 overflow-y-auto p-3 space-y-2">
            <div class="grid grid-cols-3">
              <img v-for="stamp in stamps" :key="stamp" :src="stamp" class="w-15">
            </div>
          </div>
        </div>
      </div>

      <img src="/stamp/arigatou.gif">
    </div>
  </div>
</template>
