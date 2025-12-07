<template>
  <!-- code by https://www.reddit.com/r/homeassistant/comments/1hg83vo/some_snowflakes_animation_for_you_csshtml_only -->
  <div class="snowflakes">
    <i v-for="i in 58" :key="i" />
  </div>
</template>

<style scoped>
.snowflakes {
  position: fixed;
  top: -10%;
  left: 0;
  width: 100%;
  height: 110%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

i,
i:after,
i:before {
  background: white;
}

i {
  display: inline-block;
  -webkit-animation: snowflakes 6s linear 4s infinite;
  -moz-animation: snowflakes 6s linear 4s infinite;
  position: relative;
}

i:after,
i:before {
  height: 100%;
  width: 100%;
  content: '.';
  position: absolute;
  top: 0px;
  left: 0px;
  -webkit-transform: rotate(120deg);
}

i:before {
  -webkit-transform: rotate(240deg);
}

@-webkit-keyframes snowflakes {
  0% {
    -webkit-transform: translate3d(0, 0, 0) rotate(0deg) scale(0.6);
  }

  100% {
    -webkit-transform: translate3d(15px, 1200px, 0px) rotate(360deg) scale(0.6);
  }
}

.snowflakes i:nth-child(3n) {
  width: 16px;
  height: 4px;
  -webkit-animation-duration: 8s;
  -webkit-animation-iteration-count: infinite;
  -webkit-transform-origin: right -45px;
}

.snowflakes i:nth-child(3n + 1) {
  width: 24px;
  height: 6px;
  -webkit-animation-duration: 15s;
  -webkit-animation-iteration-count: infinite;
  -webkit-transform-origin: right -30px;
}

.snowflakes i:nth-child(3n + 2) {
  width: 32px;
  height: 8px;
  -webkit-animation-duration: 20s;
  -webkit-animation-iteration-count: infinite;
  -webkit-transform-origin: right -15px;
}

/* different delays so they don't all start at the same time */
.snowflakes i:nth-child(7n) {
  opacity: 0.1;
  -webkit-animation-delay: 1s;
  -webkit-animation-timing-function: ease-in;
}

.snowflakes i:nth-child(7n + 1) {
  opacity: 0.2;
  -webkit-animation-delay: 1s;
  -webkit-animation-timing-function: ease-out;
}

.snowflakes i:nth-child(7n + 2) {
  opacity: 0.3;
  -webkit-animation-delay: 1.5s;
  -webkit-animation-timing-function: linear;
}

.snowflakes i:nth-child(7n + 3) {
  opacity: 0.4;
  -webkit-animation-delay: 2s;
  -webkit-animation-timing-function: ease-in;
}

.snowflakes i:nth-child(7n + 4) {
  opacity: 0.5;
  -webkit-animation-delay: 2.5s;
  -webkit-animation-timing-function: linear;
}

.snowflakes i:nth-child(7n + 5) {
  opacity: 0.6;
  -webkit-animation-delay: 3s;
  -webkit-animation-timing-function: ease-out;
}

.snowflakes i:nth-child(7n + 6) {
  opacity: 0.7;
  -webkit-animation-delay: 3.5s;
  -webkit-animation-timing-function: ease-in;
}
</style>
