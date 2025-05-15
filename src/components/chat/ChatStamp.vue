<script setup lang="ts">
const containerRef = ref()

function show(src: string) {
  const reaction = document.createElement('img')
  reaction.classList.add('reaction')
  reaction.src = src

  reaction.style.left = `${Math.random() * 100 - 25}px`

  reaction.onload = () => {
    containerRef.value?.appendChild(reaction)
  }

  reaction.addEventListener('animationend', () => {
    reaction.remove()
  })
}

defineExpose({
  show,
})
</script>

<template>
  <div ref="containerRef" class="stamp-container" />
</template>

<style>
.stamp-container {
  position: fixed;
  bottom: 240px;
  right: 0px;
  width: 200px;
  pointer-events: none;
}

.reaction {
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.4);
  animation: scaleUp 3s ease-in-out forwards;
}

@keyframes scaleUp {
  0% {
    opacity: 1;
    transform: scale(0.6);
  }
  30% {
    opacity: 1;
    transform: scale(1.1);
  }
  80% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0;
    transform: scale(0.7);
  }
}
</style>
