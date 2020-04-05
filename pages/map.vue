<template>
  <div id="app">
    <!-- <v-map :zoom="zoom" :center="center">
      <v-tilelayer :url="url" :attribution="attribution"> </v-tilelayer>
      <v-marker
        v-for="contact in contacts"
        :key="contact"
        :lat-lng="contact.address.position"
        v-on:l-click="hello(contact)"
        :icon="contact.icon"
      ></v-marker>
    </v-map> --->
    <div id="map"></div>
  </div>
</template>

<script>
/* import axios from 'axios'

import Navbar from '~/components/Navbar.vue'
import ClickEffect from '~/components/ClickEffect.vue'
import CreationForm from '~/components/CreationForm.vue'
let Vue2LeafletMarkerCluster = {}

  Vue2LeafletMarkerCluster = require('vue2-leaflet-markercluster')
//
} */

let L = {}
if (process.client) L = require('leaflet')

export default {
  head() {
    return {
      link: [{}, {}]
    }
  },
  components: {
    /* 'v-marker-cluster': Vue2LeafletMarkerCluster,

    Navbar,
    ClickEffect,
    CreationForm */
  },
  computed: {},

  data() {
    return {
      zoom: 13,
      center: [47.41322, -1.219482],
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',

      /* defaultIcon: L.icon({
        iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
        shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png',
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
      }),
      selectedIcon: L.icon({
        iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-red.png',
        shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png',
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
      }), */ contacts: [
        {
          name: 'Contact1',
          address: {
            complete_address: '...',
            position: [47.41322, -1.219482]
          },
          phone_number: '+49.....',
          email: 'me@here.com'
        },
        {
          name: 'Contact2',
          address: {
            complete_address: '...',
            position: [47.44322, -1.219482]
          },
          phone_number: '+49.....',
          email: 'me@here.com'
        }
      ]
    }
  },
  mounted() {
    const map = L.map('map').setView([51.505, -0.09], 13)

    L.marker([51.5, -0.09])
      .addTo(map)
      .bindPopup('I am a green leaf.')

    L.marker([51.495, -0.083])
      .addTo(map)
      .bindPopup('I am a red leaf.')
    L.marker([51.49, -0.1])
      .addTo(map)
      .bindPopup('I am an orange leaf.')
    /* for (contact of this.contacts) {
      contact.icon = this.defaultIcon
    } */
  },
  methods: {
    hello(contact) {
      /* if (this.currentContact) {
        this.currentContact.icon = this.defaultIcon
      } */
      this.currentContact = contact
      // this.currentContact.icon = this.selectedIcon
      alert(contact.name)
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
