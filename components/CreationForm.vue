<template>
  <transition appear>
    <main>
      <div class="form" v-if="open">
        <div
          id="phase-1"
          class="phase"
          ref="phase1"
          :style="{
            background:
              'url(' +
              backgrounds[Math.floor(Math.random() * 9)] +
              ') center center'
          }"
        >
          <div class="closeIcon" @click="closeWindow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              viewBox="0 0 172 172"
              style=" fill:#000000;"
            >
              <g
                fill="none"
                fill-rule="nonzero"
                stroke="none"
                stroke-width="1"
                stroke-linecap="butt"
                stroke-linejoin="miter"
                stroke-miterlimit="10"
                stroke-dasharray=""
                stroke-dashoffset="0"
                font-family="none"
                font-weight="none"
                font-size="none"
                text-anchor="none"
                style="mix-blend-mode: normal"
              >
                <path d="M0,172v-172h172v172z" fill="none"></path>
                <g fill="#ffffff">
                  <path
                    d="M150.5,21.5h-129v129h129zM121.83333,111.72833l-10.105,10.105l-25.72833,-25.72833l-25.72833,25.72833l-10.105,-10.105l25.72833,-25.72833l-25.72833,-25.72833l10.105,-10.105l25.72833,25.72833l25.72833,-25.72833l10.105,10.105l-25.72833,25.72833z"
                  ></path>
                </g>
              </g>
            </svg>
          </div>
          <div class="filter"></div>
          <div class="form-row">
            <h1 class="h1-form">What will you call this event?</h1>
            <input
              type="text"
              maxlength="150"
              v-model="event.name"
              name="Name"
              class="input-form"
            />
          </div>

          <div class="second-form-row">
            <h1 class="h1-form">When does your event start?</h1>
            <input
              type="datetime-local"
              v-model="event.startHour"
              name="start-hour"
              :min="now"
              class="input-form"
            />

            <h1 class="h1-form">When does your event end?</h1>
            <input
              type="datetime-local"
              v-model="event.endHour"
              name="end-hour"
              class="input-form"
            />
          </div>
          <button type="submitName" class="submit-button" @click="submitName">
            Let's go!
          </button>
          <h3 class="warning-message">{{ warningMessage }}</h3>
        </div>
      </div>
    </main>
  </transition>
</template>
<script>
import axios from 'axios'
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    randomNum: {
      type: Number,
      default: 5
    },
    lat: {
      type: String,
      default: ''
    },
    lng: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      warningMessage: '',
      event: {
        name: null,
        startHour: null,
        endHour: null
      },
      now: null,
      backgrounds: [
        'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        'https://images.pexels.com/photos/53958/team-motivation-teamwork-together-53958.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        'https://images.pexels.com/photos/2318057/pexels-photo-2318057.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        'https://images.pexels.com/photos/1452783/pexels-photo-1452783.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        'https://images.pexels.com/photos/325521/pexels-photo-325521.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        'https://images.pexels.com/photos/3183172/pexels-photo-3183172.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        'https://images.pexels.com/photos/3934030/pexels-photo-3934030.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        'https://images.pexels.com/photos/923657/pexels-photo-923657.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        'https://images.pexels.com/photos/1436618/pexels-photo-1436618.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
      ]
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
    },

    async submitName() {
      //   console.log(this.event.name)

      const now = new Date()
      const year = now.getFullYear()
      const month = ('0' + (now.getMonth() + 1)).slice(-2)
      const day = ('0' + now.getDate()).slice(-2)
      const hour = ('0' + now.getHours()).slice(-2)
      const minute = ('0' + now.getMinutes()).slice(-2)

      const timestampNow = `${year}-${month}-${day}T${hour}:${minute}:00Z`

      const d1 = Date.parse(this.event.startHour)
      const d2 = Date.parse(this.event.endHour)

      if (this.event.name === null) {
        this.warningMessage = 'Sorry, your event needs a name!'
      } else if (this.event.startHour === null || this.event.endHour === null) {
        this.warningMessage =
          'Please set up a start and end hour for your event!'
      } else if (this.event.startHour < this.now) {
        this.warningMessage = "Sorry! You can't set up an event in the past!"
      } else if (d1 > d2) {
        this.warningMessage = 'Please check your start and end dates!'
      } else {
        this.warningMessage = ''
        await axios
          .post(`${process.env.API_URL}/api/event`, {
            user: '5e80111c6d65770000a2c1b2',
            timestamp: timestampNow,
            starthour: this.event.startHour,
            endHour: this.event.endHour,
            lat: this.lat,
            lng: this.lng,
            name: this.event.name
          })
          .then((res) => console.log(res))
      }
      this.closeWindow()
      this.$router.go()
    }
  },
  mounted() {
    const now = new Date()
    const year = now.getFullYear()
    const month = ('0' + (now.getMonth() + 1)).slice(-2)
    const day = ('0' + now.getDate()).slice(-2)
    const hour = ('0' + now.getHours()).slice(-2)
    const minute = ('0' + now.getMinutes()).slice(-2)

    const timestampNow = `${year}-${month}-${day}T${hour}:${minute}`
    this.event.startHour = timestampNow
    this.event.endHour = timestampNow
    this.now = timestampNow
  }
}
</script>
<style>
.filter-form {
  position: absolute;
  border: 10px solid green;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  z-index: 9999;
}
@media screen and (min-width: 701px) {
  .submit-button {
    z-index: 99999;
    padding: 0.5em 4em 0.5em 4em;
    border-radius: 2px;
    box-shadow: 1px 1px 2px black;
    font-size: 1em;
    cursor: pointer;
    background: #ffffff29;
    color: white;
    text-shadow: 1px 1px 2px black;
    transition: 0.15s linear;
  }
  .submit-button:hover {
    transform: scale(1.1);
  }
  .submit-button:active {
    transform: scale(1);
  }
  .form {
    height: 100vh;
    overflow-y: hidden;
    display: flex;
    background: rgba(36, 36, 36, 0.45);
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
  .form-row,
  .second-form-row {
    z-index: 999999;
  }
  .closeIcon {
    z-index: 999999;
    position: absolute;
    cursor: pointer;
    top: 15px;
    right: 14px;
    cursor: pointer;
  }

  .warning-message {
    color: red;
    z-index: 999999;
    color: red;
    font-weight: 600;
    z-index: 999999;
    text-shadow: 1px 1px 2px black;
    margin-top: 1em;
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
    text-shadow: 1px 1px 2px black;
    z-index: 999999;
    color: #fff;
  }
  .input-form {
    padding: 0.25em 1em 0.25em 1em;
    text-shadow: 1px 1px 2px black;
    font-size: 1.2em;
    border-radius: 6px;
    border: none;
    z-index: 999999;
    border: none;
    border-bottom: 2px solid white;
    background: none;
    font-color: #fff;
    color: #fff;
    margin-bottom: 1.5em;
    width: 100%;
  }
  .phase {
    padding-top: 2em;
    height: 75%;
    width: 35%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    box-shadow: 1px 1px 15px black;
    position: relative;
    z-index: 9999999;
  }
  .filter {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(37, 36, 36, 0.58);
    z-index: 99999;
  }
}

@media screen and (max-width: 700px) {
  .submit-button {
    z-index: 99999;
    padding: 0.5em 2em 0.5em 2em;
    border-radius: 2px;
    box-shadow: 1px 1px 2px black;
    font-size: 0.75em;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.16078);
    color: white;
    text-shadow: 1px 1px 2px black;
    transition: 0.15s linear;
  }
  .submit-button:hover {
    transform: scale(1.1);
  }
  .submit-button:active {
    transform: scale(1);
  }

  .form {
    height: 100vh;
    overflow-y: hidden;
    display: flex;
    background: rgba(36, 36, 36, 0.45);
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
  .form-row,
  .second-form-row {
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .closeIcon {
    z-index: 999999;
    position: absolute;
    cursor: pointer;
    top: 15px;
    right: 14px;
    cursor: pointer;
  }

  .warning-message {
    color: red;
    z-index: 999999;
    color: red;
    font-weight: 600;
    z-index: 999999;
    text-shadow: 1px 1px 2px black;
    margin-top: 1em;
    font-size: 0.75em;
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
    font-size: 0.75em;
    margin-bottom: 1em;
    font-weight: 700;
    text-shadow: 1px 1px 2px black;
    z-index: 999999;
    color: #fff;
  }
  .input-form {
    padding: 0.25em 0.75em 0.25em 0.75em;
    text-shadow: 1px 1px 2px black;
    font-size: 0.75em;
    border-radius: 3px;
    border: none;
    z-index: 999999;
    border: none;
    border-bottom: 1px solid white;
    background: none;
    font-color: #fff;
    color: #fff;
    margin-bottom: 1.5em;
    width: 100%;

    text-align: center;
  }
  .phase {
    min-width: 75vw;
    height: 75%;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    box-shadow: 1px 1px 15px black;
    position: relative;
  }
  .filter {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(37, 36, 36, 0.58);
    z-index: 99999;
  }
}
</style>
