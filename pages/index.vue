<template>
  <transition appear>
    <div>
      <div class="container" @click="createEffect">
        <client-only>
          <l-map
            id="map"
            style="min-height: 100vh;"
            :zoom="zoom"
            :center="center"
            :options="{ zoomControl: false }"
            @click="createNodeAndMarker"
          >
            <l-tile-layer :url="url"></l-tile-layer>

            <l-marker
              v-for="(geoloc, key) in events"
              :key="key"
              :lat-lng="geoloc"
            >
              <l-popup :content="geoloc.name" ref="popup"> </l-popup>
            </l-marker>
          </l-map>
        </client-only>

        <ClickEffect :x="x" :y="y" :effect="effect" />
        <Navbar />
      </div>
      <CreationForm
        v-if="open"
        :open="open"
        @update-window-state="updateWindow"
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
    Navbar,
    ClickEffect,
    CreationForm
  },
  computed: {},
  mounted() {
    /* for (let i = 0; i < this.$refs.popup.length; i++) {
      this.$refs.popup[i].innerHTML =
    } */
  },
  async asyncData() {
    const { data } = await axios.get(`${process.env.API_URL}/api/event`)
    console.log('data')
    console.log(data)
    const locs = []
    for (let d = 0; d < data.length; d++) {
      const latitude = data[d].lat
      const longitude = data[d].lng
      const na =
        data[d].name +
        '<br /> Hosted by: ' +
        data[d].userId +
        '<br /> Starts at: ' +
        data[d].startHour +
        '<br /> Until: ' +
        data[d].endHour
      const loc = { lat: latitude, lng: longitude, name: na }
      locs.push(loc)
    }
    return { event: data, events: locs }
  },
  methods: {
    async addMarker(e) {
      // screenX/Y gives the coordinates relative to the screen in device pixels.
      // console.log(e)
      await axios.post(`${process.env.API_URL}/api/event`, {
        user: '5e80111c6d65770000a2c1b2',
        timestamp: '2020-03-29T03:06:41Z',
        starthour: '2020-03-29T03:06:41Z',
        endHour: '2020-03-29T03:06:41Z',
        lat: e.latlng.lat.toString(),
        lng: e.latlng.lng.toString(),
        name: 'Testing :)'
      })
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
    // click: (e) => console.log('clusterclick', e),
    // ready: (e) => console.log('ready', e)
  },
  data() {
    return {
      effect: false,
      x: 0,
      y: 0,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      zoom: 15,
      center: [43.65107, -79.347015],
      locs: [],
      newMarker: [],
      clusterOptions: {},
      open: null,
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
