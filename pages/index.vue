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
                :key="key"
                :lat-lng="geoloc"
              >
                <l-popup :content="geoloc.name" ref="popup"> </l-popup>
                <l-tooltip> </l-tooltip>
              </l-marker>
              <l-marker :lat-lng="center"></l-marker>
            </v-marker-cluster>
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

// import Vue2LeafletMarkercluster from 'Vue2-leaflet-markercluster'

import Navbar from '~/components/Navbar.vue'
import ClickEffect from '~/components/ClickEffect.vue'
import CreationForm from '~/components/CreationForm.vue'
// import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
let Vue2LeafletMarkerCluster = {}
if (process.client) {
  Vue2LeafletMarkerCluster = require('vue2-leaflet-markercluster')
  //  Vue2LeafletLocatecontrol = require('vue2-leaflet-locatecontrol')
}
/* let Vue2LeafletMarkerCluster = {}

if (!process.env.SERVER) {
  console.log('loading vue2-leaflet-markercluster')
  Vue2LeafletMarkerCluster = require('vue2-leaflet-markercluster')
}
*/
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
  computed: {},
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition)
      console.log(navigator.geolocation)
    } else {
      console.log('Geolocation is not supported by this browser.')
    }
  },
  async asyncData() {
    const { data } = await axios.get(`${process.env.API_URL}/api/event`)
    console.log('data')
    console.log(data)
    const locs = []
    for (let d = 0; d < data.length; d++) {
      const latitude = data[d].lat
      const longitude = data[d].lng

      const parsedStHour = Date.parse(data[d].startHour)
      const newStHour = new Date(parsedStHour)
      let stHours = newStHour.getHours()
      stHours = ('0' + stHours).slice(-2)
      let stMinutes = newStHour.getMinutes()
      stMinutes = ('0' + stMinutes).slice(-2)

      const startsAt = `${stHours}:${stMinutes}`

      const parsedEnHour = Date.parse(data[d].endHour)
      const newEnHour = new Date(parsedEnHour)
      let enHours = newEnHour.getHours()
      enHours = ('0' + enHours).slice(-2)
      let enMinutes = newEnHour.getMinutes()
      enMinutes = ('0' + enMinutes).slice(-2)

      const endsAt = `${enHours}:${enMinutes}`

      const na =
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
      const loc = { lat: latitude, lng: longitude, name: na }
      locs.push(loc)
    }
    return { event: data, events: locs }
  },
  methods: {
    findMe() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
      }
    },
    showPosition(position) {
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
    addMarker(e) {
      // this.$L.marker([43.65107, -79.347015]).addTo(map)

      // this.$L.map.marker([43.65107, -79.347015]).addTo(map)
      this.event.lat = e.latlng.lat.toString()
      this.event.lng = e.latlng.lng.toString()

      this.open = true
      this.updateMarkers()
    },
    async updateMarkers() {
      const { data } = await axios.get(`${process.env.API_URL}/api/event`)
      // console.log('data')
      // console.log(data)
      const locs = []
      for (let d = 0; d < data.length; d++) {
        const latitude = data[d].lat
        const longitude = data[d].lng
        const loc = { lat: latitude, lng: longitude }
        locs.push(loc)
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
.recenter-button {
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
