<script setup lang="ts">
const containerRef = ref()

function show(src: string) {
  const reaction = document.createElement('img')
  reaction.classList.add('reaction')
  reaction.src = src

  reaction.style.top = `${Math.random() * 100 - 100}px`
  reaction.style.left = `${Math.random() * 100}px`
  reaction.style.animationDuration = `${3 + Math.random() * 2}s`
  reaction.style.transform = `rotate(${Math.random() * 20 - 10}deg)`

  reaction.onload = () => {
    containerRef.value?.appendChild(reaction)
    setTimeout(() => {
      reaction.remove()
    }, 4000)
  }
}

defineExpose({
  show,
})
</script>

<template>
  <div ref="containerRef" class="stamp-container right-0 lg:right-[calc((100vw-768px)/2-200px)]" />
</template>

<style>
.stamp-container {
  position: fixed;
  bottom: 240px;
  width: 240px;
  pointer-events: none;
}

.reaction {
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.4);
  animation: floatUp 4s linear forwards;
}

@keyframes floatUp {
  0% {
    transform: translateY(0) scale(0.6) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    transform: translateY(-400px) rotate(15deg);
    opacity: 0;
  }
}
</style>
