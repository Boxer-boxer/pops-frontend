<template>
  <div class="container">
    {{ articles }}
    <GmapMap
      :center="{ lat: 10, lng: 10 }"
      :zoom="7"
      map-type-id="terrain"
      style="width: 1500px; height: 1300px"
    >
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center = m.position"
      />
    </GmapMap>
    <Navbar />
  </div>
</template>

<script>
import axios from 'axios'

import Navbar from '~/components/Navbar.vue'

export default {
  components: {
    Navbar
    // StaticMap
  },
  mounted() {
    // At this point, the child GmapMap has been mounted, but
    // its map has not been initialized.
    // Therefore we need to write mapRef.$mapPromise.then(() => ...)
    //  this.$refs.mapRef.$mapPromise.then((map) => {
    //    map.panTo({ lat: 1.38, lng: 103.8 })
    //  })
  },
  async asyncData() {
    const { data } = await axios.get('https://localhost:44326/api/users')
    return { articles: data }
  },
  data() {
    return {
      apiKey: `${process.env.API_KEY}`, // required
      zoom: 13, // required
      center: 'Brooklyn+Bridge,New+York,NY',
      format: 'gif',
      language: 'ja',
      markers: [
        {
          label: 'B',
          color: 'blue',
          lat: 40.702147,
          lng: -74.015794,
          size: 'normal'
        },
        {
          label: 'Y',
          color: 'yellow',
          lat: 40.711614,
          lng: -74.012318,
          size: 'tiny'
        },
        {
          label: 'G',
          color: 'green',
          lat: 40.718217,
          lng: -74.015794,
          size: 'small',
          icon: 'http://www.airsoftmap.net/images/pin_map.png'
        }
      ],
      paths: [
        {
          color: 'blue',
          weight: 8,
          geodesic: false,
          fillcolor: '0xFFFF0033',
          locations: [
            { startLat: 40.737102, endLng: -73.990318 },
            { startLat: 40.749825, endLng: -73.987963 },
            { startLat: 40.752946, endLng: -73.987384 },
            { startLat: 40.762946, endLng: -73.997399 }
          ]
        }
      ],
      type: 'roadmap',
      size: [800, 400]
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
