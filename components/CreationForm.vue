<template>
  <transition appear>
    <main>
      <div class="form" v-if="open">
        <div class="closeIcon" @click="closeWindow">
          <img src="https://img.icons8.com/color/66/000000/close-window.png" />
        </div>
        <div id="phase-1" class="phase">
          <h1 class="h1-form">What will you call this event?</h1>
          <input type="text" name="Name" class="input-form" />
        </div>
      </div>
    </main>
  </transition>
</template>
<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    closeWindow() {
      this.opened = this.open
      if (this.opened === false) {
        this.opened = true
        this.$emit('update-window-state', this.opened)
      } else {
        this.opened = false
        this.$emit('update-window-state', this.opened)
      }
    }
  }
}
</script>
<style>
.form {
  display: flex;
  background: #85ffff59;
  z-index: 99999;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: 0.2s linear;
}
.closeIcon {
  position: absolute;

  top: 15px;
  right: 14px;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}
.h1-form {
  font-size: 1.3em;
  margin-bottom: 1em;
  font-weight: 700;
  text-shadow: 1px 1px 5px white;
}
.input-form {
  padding: 1.5em;
  font-size: 1.2em;
  border-radius: 6px;
  border: none;
}
.phase {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
