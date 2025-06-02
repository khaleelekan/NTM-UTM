<template>
  <div ref="mapContainer" id="map" class="map-container"></div>
</template>

<script>
import L from 'leaflet';
import proj4 from 'proj4';

export default {
  props: {
    coords: {
      type: Array,
      default: () => null,
    },
  },

  data() {
    return {
      map: null,
      marker: null,
    };
  },

  mounted() {
    // Define projections
    proj4.defs('NTM',
      '+proj=tmerc +lat_0=4.5 +lon_0=7 +k=0.9999 +x_0=670000 +y_0=0 ' +
      '+a=6378249.145 +rf=293.466 +units=m +no_defs');
    proj4.defs('UTM',
      '+proj=utm +zone=31 +datum=WGS84 +units=m +no_defs');

    // Initialize the map
    this.map = L.map(this.$refs.mapContainer).setView([9.08, 7.49], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(this.map);

    this.marker = null;

    if (this.coords) {
      this.updateMarker(this.coords);
    }

    this.map.on('click', this.handleMapClick);

    this.$nextTick(() => {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 300);
    });
  },

  methods: {
    updateMarker(coords) {
      if (!coords) return;
      const [lng, lat] = coords;

      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.map);
      }

      this.map.setView([lat, lng], 14);
    },

    handleMapClick(e) {
      const { lat, lng } = e.latlng;

      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.map);
      }

      // Convert clicked WGS84 coords to UTM and NTM
      const [utmE, utmN] = proj4('WGS84', 'UTM', [lng, lat]);
      const [ntmE, ntmN] = proj4('WGS84', 'NTM', [lng, lat]);

      // Emit all coords (Lng, Lat, UTM easting/northing, NTM easting/northing)
      this.$emit('map-click', {
        wgs84: { lat, lng },
        utm: { easting: utmE, northing: utmN },
        ntm: { easting: ntmE, northing: ntmN },
      });

      L.popup()
        .setLatLng([lat, lng])
        .setContent(`
          <strong>WGS84:</strong><br>Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}<br>
          <strong>UTM:</strong><br>Easting: ${utmE.toFixed(2)}, Northing: ${utmN.toFixed(2)}<br>
          <strong>NTM:</strong><br>Easting: ${ntmE.toFixed(2)}, Northing: ${ntmN.toFixed(2)}
        `)
        .openOn(this.map);
    },
  },
};
</script>

<style scoped>
.map-container {
  width: 90vw;
  height: 70vh;
  border-radius: 0.5rem;
  z-index: 0;
  overflow: hidden;
}
</style>




  