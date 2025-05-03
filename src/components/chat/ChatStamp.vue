<script setup lang="ts">
let timeout: ReturnType<typeof setTimeout>
const visible = ref(true)
const stampPopup = ref(false)
const stampPopupUrl = ref<string | undefined>(undefined)
const stampScrollbarRef = ref()

function scroll() {
  setTimeout(() => {
    stampScrollbarRef.value?.scrollTo({
      top: stampScrollbarRef.value?.wrapRef.scrollHeight,
      behavior: 'smooth',
    })
  }, 200)
}

function popup(stamp: string) {
  stampPopupUrl.value = stamp
  stampPopup.value = true
  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(() => stampPopup.value = false, 4000)
}

defineExpose({
  scroll,
  popup,
})
</script>

<template>
  <div v-show="visible" class="absolute bottom-50 right-8 w-[70px] border border-gray-200 rounded-lg bg-white shadow-sm lg:right-[calc((100vw-768px)/2-110px)] dark:border-gray-700 dark:bg-gray-500">
    <div class="flex flex-col items-center">
      <el-scrollbar ref="stampScrollbarRef" class="w-full" wrap-class="w-full" view-class="h-[360px] w-full flex flex-grow justify-center">
        <div id="stamp-container" />
      </el-scrollbar>
    </div>
  </div>

  <div class="absolute bottom-42 right-8 w-8 flex cursor-pointer items-center justify-center rounded bg-blue-500 pa-1 text-white lg:right-[calc((100vw-768px)/2-110px)] dark:bg-blue-600" @click="visible = !visible">
    <svg v-if="visible" class="h-6 w-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m8 10 4 4 4-4" />
    </svg>

    <svg v-else class="h-6 w-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m16 14-4-4-4 4" />
    </svg>
  </div>

  <div v-if="stampPopup && visible" role="tooltip" class="shadow-xs absolute bottom-50 right-26 inline-block border border-1 border-gray-200 rounded-lg bg-white text-sm text-gray-500 transition-opacity duration-300 lg:right-[calc((100vw-768px)/2-35px)] dark:border-gray-500 dark:bg-gray-500 dark:text-gray-400">
    <img :src="stampPopupUrl" class="w-22">
  </div>
</template>
