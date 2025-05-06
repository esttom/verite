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
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  animation: floatUp 3s forwards;
}

@keyframes floatUp {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-200px);
    opacity: 0;
  }
}
</style>
