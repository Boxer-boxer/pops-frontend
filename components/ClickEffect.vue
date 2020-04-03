<template>
  <div>
    <svg
      width="55px"
      height="55px"
      viewbox="0 0 500 500"
      fill="none"
      :style="{ display: displayOrNot, left: posX, top: posY }"
    >
      <circle class="circle-outer" cx="50%" cy="50%" r="230" />
      <circle class="circle-middle" cx="50%" cy="50%" r="180" />
      <circle class="circle-inner" cx="50%" cy="50%" r="130" />
      <circle class="dot" cx="50%" cy="50%" r="20" />
    </svg>
  </div>
</template>
<script>
export default {
  props: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    effect: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    grow() {
      if (this.effect) {
        return '100px'
      } else {
        return '50px'
      }
    },
    displayOrNot() {
      if (this.effect) {
        return 'block'
      } else {
        return 'none'
      }
    },
    posX() {
      return this.x.toString() + 'px'
    },
    posY() {
      return this.y.toString() + 'px'
    }
  }
}
</script>
<style scoped>
:root {
  --tau: 6.283185307179586476925286766559;
  --outer-circle-divisions: 5;
  --middle-circle-divisions: 2;
  --inner-circle-divisions: 3;
}

svg {
  z-index: 9999;
  position: absolute;
  top: 50%;
  left: 50%;
  stroke-width: 3px;
  transform: translate(-50%, -50%);
  stroke: rgb(59, 143, 206);
  animation: logo-hue-rotation 10210ms linear forwards infinite;
}

*[class*='circle'] {
  transform-origin: 50% 50%;
}

.circle-outer {
  stroke-dasharray: calc(
    var(--tau) * 230 / (var(--outer-circle-divisions) * 2)
  );
  animation: circle-inner-rotation 8000ms ease-in-out alternate infinite;
}

.circle-middle {
  stroke-dasharray: calc(
    var(--tau) * 180 / (var(--middle-circle-divisions) * 2)
  );
  animation: circle-middle-rotation 9820ms ease-in-out alternate infinite;
}

.circle-inner {
  stroke-dasharray: calc(
    var(--tau) * 130 / (var(--inner-circle-divisions) * 2)
  );
  animation: circle-outer-rotation 11250ms ease-in-out alternate infinite;
}

.dot {
  animation: dot-blink 8930ms ease-out forwards infinite;
}

@keyframes logo-hue-rotation {
  from {
    filter: hue-rotate(0deg);
  }
  to {
    filter: hue-rotate(360deg);
  }
}

@keyframes circle-outer-rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes circle-middle-rotation {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@keyframes circle-inner-rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes dot-blink {
  0% {
    opacity: 0;
  }
  1% {
    opacity: 1;
  }
  3% {
    opacity: 0;
  }
  4% {
    opacity: 1;
  }
  5% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  99% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
