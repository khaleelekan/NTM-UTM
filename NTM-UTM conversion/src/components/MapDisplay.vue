<template>
  <div ref="mapContainer" id="map" class="map-container"></div>
</template>

<script>
import L from 'leaflet';

export default {
  name: 'MapDisplay',
  props: {
    coords: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      map: null,
      marker: null,
    };
  },
  mounted() {
    this.initMap();
  },
  watch: {
    coords(newCoords) {
      this.updateMarker(newCoords);
    },
  },
  methods: {
    initMap() {
      this.map = L.map(this.$refs.mapContainer).setView(this.coords, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);

      this.marker = L.marker(this.coords).addTo(this.map);

      // Click event
      this.map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        alert(`Clicked coordinates:\nLat: ${lat.toFixed(6)}\nLng: ${lng.toFixed(6)}`);
      });

      this.$nextTick(() => {
        setTimeout(() => {
          this.map.invalidateSize();
        }, 300);
      });
    },
    updateMarker(newCoords) {
      if (this.marker) {
        this.marker.setLatLng(newCoords);
        this.map.setView(newCoords, 13);
      } else {
        this.marker = L.marker(newCoords).addTo(this.map);
        this.map.setView(newCoords, 13);
      }
    },
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
}
</style>







  