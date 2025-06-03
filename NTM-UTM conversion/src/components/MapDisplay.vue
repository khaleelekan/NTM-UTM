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

    // Initialize the map centered roughly in Nigeria
    this.map = L.map(this.$refs.mapContainer).setView([9.08, 7.49], 7);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Add marker if coords passed in as prop
    if (this.coords) {
      this.updateMarker(this.coords);
    }

    // Listen for clicks on the map
    this.map.on('click', this.handleMapClick);

    // Fix for map resizing issues
    this.$nextTick(() => {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 300);
    });
  },

  methods: {
    updateMarker(coords) {
      if (!coords) return;

      // Coordinates passed in are expected as [easting, northing]
      // but Leaflet needs [lat, lng], so convert to WGS84 first
      // Here we assume input coords are in UTM or NTM; you might want to adjust

      // For simplicity, treat coords as [lng, lat] if you pass them as such
      // If needed, convert proj coords to WGS84 here before using

      // Example: coords = [easting, northing] in UTM or NTM
      // convert to WGS84:
      // const [lng, lat] = proj4('UTM', 'WGS84', coords); // or 'NTM'

      // For now, assuming coords = [lng, lat]
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

      // Show popup with formatted coordinates
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






  