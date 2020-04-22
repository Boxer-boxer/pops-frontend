<template>
  <transition appear>
    <div>
      <div class="container" @click="createEffect">
        <client-only>
          <l-map
            id="map"
            ref="map"
            style="min-height: 100vh;"
            :zoom="zoom"
            :center="center"
            :options="{ zoomControl: false }"
            @click="createNodeAndMarker"
          >
            <l-tile-layer :url="url"></l-tile-layer>
            <v-marker-cluster>
              <l-marker
                v-for="(geoloc, key) in events"
                :ref="`eventMarker${key}`"
                :key="geoloc.id"
                :id="geoloc.id"
                :lat-lng="geoloc.locs"
                @click="showJoinButton"
              >
                <l-popup ref="popup" class="popup">
                  <div id="message">
                    <h6>{{ geoloc.id }}</h6>
                    <h2 class="popup-name">{{ geoloc.name }}</h2>
                    <h4 class="popup-hours">
                      <h5 class="popup-hours">
                        Starts at: {{ geoloc.starts }}
                      </h5>
                      <h5 class="popup-hours">Ends at: {{ geoloc.ends }}</h5>
                    </h4>
                  </div>

                  <button
                    @click="showJoinButton(geoloc.id)"
                    class="popup-button"
                  >
                    Join this event!
                  </button>
                </l-popup>
              </l-marker>
            </v-marker-cluster>
            <l-marker :lat-lng="center" ref="userMarker"></l-marker>
          </l-map>
          <button class="recenter-button" @click="findMe">
            <img
              src="https://img.icons8.com/ios-glyphs/30/000000/location-off.png"
            />
          </button>
        </client-only>

        <ClickEffect :x="x" :y="y" :effect="effect" />
        <Navbar />
      </div>
      <CreationForm
        v-if="open"
        :open="open"
        @update-window-state="updateWindow"
        :lat="event.lat"
        :lng="event.lng"
      />
      <!-- <CreationForm :open="open" @update-window-state="updateWindow" />
      -->
    </div>
  </transition>
</template>

<script>
import axios from 'axios'
// import { mapMutations } from 'vuex'

import Navbar from '~/components/Navbar.vue'
import ClickEffect from '~/components/ClickEffect.vue'
import CreationForm from '~/components/CreationForm.vue'

let Vue2LeafletMarkerCluster = {}
if (process.client) {
  Vue2LeafletMarkerCluster = require('vue2-leaflet-markercluster')
}
export default {
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.Default.css'
        },
        {
          rel: 'stylesheet',
          href:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.css'
        }
      ]
    }
  },
  components: {
    'v-marker-cluster': Vue2LeafletMarkerCluster,

    Navbar,
    ClickEffect,
    CreationForm
  },
  computed: {
    isUserOn() {
      return this.$store.state.authentication.isAuthenticate
    },
    user() {
      return this.$store.state.authentication.user
    }
  },
  mounted() {
    console.log(this.isUserOn)
    console.log(this.user)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition)
    } else {
    }
  },
  async asyncData() {
    const now = new Date()
    const { data } = await axios.post(`${process.env.API_URL}/api/event/now`, {
      date: now
    })

    const locs = []
    const months = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAI',
      'JUN',
      'JUL',
      'AGO',
      'SEP',
      'OCT',
      'NOV',
      'DEC'
    ]
    for (let d = 0; d < data.length; d++) {
      const latitude = data[d].lat
      const longitude = data[d].lng
      const idEv = data[d].id

      const parsedStHour = Date.parse(data[d].startHour)
      const newStHour = new Date(parsedStHour)
      const day = newStHour.getDate()
      const month = months[newStHour.getMonth()]
      let stHours = newStHour.getHours()
      stHours = ('0' + stHours).slice(-2)
      let stMinutes = newStHour.getMinutes()
      stMinutes = ('0' + stMinutes).slice(-2)

      const startsAt = `${day} ${month} ${stHours}:${stMinutes}`

      const parsedEnHour = Date.parse(data[d].endHour)
      const newEnHour = new Date(parsedEnHour)
      let enHours = newEnHour.getHours()
      const enDay = newEnHour.getDate()
      const enMonth = months[newEnHour.getMonth()]
      enHours = ('0' + enHours).slice(-2)
      let enMinutes = newEnHour.getMinutes()
      enMinutes = ('0' + enMinutes).slice(-2)

      const endsAt = `${enDay} ${enMonth} ${enHours}:${enMinutes}`

      const na =
        '<h5>' +
        data[d].id +
        '</h5>' +
        '<h1>' +
        data[d].name +
        '</h1>' +
        '<br /><h3> Starts at: ' +
        startsAt +
        '</h3>' +
        '<h3> Until: ' +
        endsAt +
        '</h3>' +
        '<br /> Hosted by: ' +
        data[d].userId

      const loc = {
        id: idEv,
        name: data[d].name,
        starts: startsAt,
        ends: endsAt,
        locs: { lat: latitude, lng: longitude, name: na }
      }
      locs.push(loc)
    }
    return { event: data, events: locs }
  },
  updated() {
    if (this.$refs.userMarker.mapObject._icon) {
      this.$refs.userMarker.mapObject._icon.style.height = '50px'
      this.$refs.userMarker.mapObject._icon.style.width = '50px'
      this.$refs.userMarker.mapObject._icon.src = '/icons8-unicórnio-96.png'
      // 'https://img.icons8.com/nolan/64/unicorn.png'
      /* this.$refs.eventMarker.mapObject._icon.src =
        'https://img.icons8.com/emoji/48/000000/octopus-emoji.png'
      */
    }
  },
  methods: {
    showJoinButton(id) {
      console.log(id)

      this.joinButton = true
    },
    findMe() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
      }
    },
    showPosition(position) {
      this.joinButton = false
      const currPos = []
      currPos.push(this.$refs.map.mapObject.getCenter().lat)
      currPos.push(this.$refs.map.mapObject.getCenter().lng)

      this.center = currPos

      const initCenter = []
      initCenter.push(position.coords.latitude)
      initCenter.push(position.coords.longitude)
      this.center = initCenter
      this.$refs.map.setCenter(currPos, initCenter)
    },
    async addMarker(e) {
      this.joinButton = false
      // this.$L.marker([43.65107, -79.347015]).addTo(map)

      // this.$L.map.marker([43.65107, -79.347015]).addTo(map)
      this.event.lat = e.latlng.lat.toString()
      this.event.lng = e.latlng.lng.toString()

      this.open = true
      await this.updateMarkers
    },
    async updateMarkers() {
      const { data } = await axios.get(`${process.env.API_URL}/api/event`)
      // console.log('data')
      // console.log(data)
      const locs = []
      // const metaData = []
      for (let d = 0; d < data.length; d++) {
        const latitude = data[d].lat
        const longitude = data[d].lng
        const idEv = data[d].id
        const location = { lat: latitude, lng: longitude }
        const result = { id: idEv, loc: location }

        locs.push(result)
      }

      return { event: data, events: locs }
    },
    async createEffect() {
      this.effect = true
      this.x = event.pageX
      this.y = event.pageY
      await setTimeout(() => {
        this.effect = false
      }, 1000)
    },
    async createNodeAndMarker(e) {
      await this.addMarker(e)
    },
    updateWindow(opened) {
      this.open = opened
    }
  },
  data() {
    return {
      effect: false,
      joinButton: false,
      randomNum: 0,
      x: 0,
      y: 0,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      zoom: 15,
      center: [43.65107, -79.347015],
      locs: [],
      newMarker: [],
      clusterOptions: {},
      open: null,
      event: {
        lat: null,
        lng: null
      },
      geolocs: [
        { lat: 43.65107, lng: -79.347015 },
        { lat: 47.5125, lng: 16.03823 },
        { lat: 47.532612, lng: 16.154989 }
      ]
    }
  }
}
</script>

<style>
/* @import '~leaflet.markercluster/dist/MarkerCluster.css';
@import '~leaflet.markercluster/dist/MarkerCluster.Default.css';
*/
.popup {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.popup-name {
  text-align: center;
  font-weight: 500;
  margin: 0.5em;
}
.popup-button {
  padding: 0.5em 5em;
  margin: 1em;
  border: none;
  box-shadow: 0px 0px 6px #000;
  background: #60ebd2;
  cursor: pointer;
  transition: 0.25s linear;
}
.popup-button:hover {
  transform: scale(1.1);
}
.popup-hours {
  text-align: center;
  font-size: 1em;
  font-weight: 100;
}
.join-event-button {
  position: absolute;
  z-index: 999;
  padding: 0.5em 1.5em;
  font-size: 1.7em;
  border: none;
  box-shadow: 0px 0px 10px 1px #383838d6;
  background: #60ebd2;
  border-radius: 4px;
  color: #000;
  bottom: 10vh;
  transition: 0.25s linear;
}

.join-event-button:hover {
  transform: scale(1.1);
}

.recenter-button {
  box-shadow: 0px 0px 10px 1px #383838d6;
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 999;
  height: 50px;
  width: 50px;
  border: none;
  background: #60ebd2;
  cursor: pointer;
  transition: 0.5s linear;
}
.recenter-button:hover {
  transform: scale(1.1);
}
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

// https://codepen.io/mmsmdali/pen/KqjNPN
