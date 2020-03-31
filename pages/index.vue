<template>
  <div class="container">
    <client-only>
      <l-map
        style="min-height: 100vh;"
        :zoom="zoom"
        :center="center"
        :options="{ zoomControl: false }"
        @click="addMarker"
      >
        <l-tile-layer :url="url"></l-tile-layer>
        <l-marker v-for="(geoloc, key) in events" :key="key" :lat-lng="geoloc">
          <l-popup :content="geoloc.name" ref="popup"> </l-popup>
        </l-marker>
      </l-map>
    </client-only>

    <Navbar />
  </div>
</template>

<script>
import axios from 'axios'

import Navbar from '~/components/Navbar.vue'

export default {
  components: {
    Navbar
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
      await axios.post(`${process.env.API_URL}/api/event`, {
        user: '5e80111c6d65770000a2c1b2',
        timestamp: '2020-03-29T03:06:41Z',
        starthour: '2020-03-29T03:06:41Z',
        endHour: '2020-03-29T03:06:41Z',
        lat: e.latlng.lat.toString(),
        lng: e.latlng.lng.toString(),
        name: 'Testing :)'
      })
      this.updateMarkers()
    },
    async updateMarkers() {
      const { data } = await axios.get(`${process.env.API_URL}/api/event`)
      console.log('data')
      console.log(data)
      const locs = []
      for (let d = 0; d < data.length; d++) {
        const latitude = data[d].lat
        const longitude = data[d].lng
        const loc = { lat: latitude, lng: longitude }
        locs.push(loc)
      }
      return { event: data, events: locs }
    },
    test() {
      console.log('e')
    }
  },
  data() {
    return {
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      zoom: 15,
      center: [43.65107, -79.347015],
      locs: [],
      newMarker: [],

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

.links {
  padding-top: 15px;
}
</style>
