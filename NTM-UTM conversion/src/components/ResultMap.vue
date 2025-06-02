<template>
    <div ref="mapContainer" class="map-container"></div>
  </template>
  
  <script setup>
  import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
  import L from 'leaflet';

  
  // Props: Array of points with lat/lng and optional popup content
  const props = defineProps({
    results: {
      type: Array,
      default: () => [], // Example: [{ lat: 40.7128, lng: -74.006, popup: "NYC" }]
    },
  })
  
  const mapContainer = ref(null)
  let map = null
  let markersLayer = null
  
  onMounted(() => {
    map = L.map(mapContainer.value).setView([0, 0], 2)
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)
  
    markersLayer = L.layerGroup().addTo(map)
    updateMarkers(props.results)
  })
  
  // Clear map on unmount
  onBeforeUnmount(() => {
    if (map) {
      map.remove()
    }
  })
  
  // Watch for updates to results prop to update markers dynamically
  watch(
    () => props.results,
    (newResults) => {
      updateMarkers(newResults)
    }
  )
  
  // Helper function to update markers on the map
  function updateMarkers(results) {
    if (!markersLayer) return
  
    markersLayer.clearLayers()
  
    if (results.length === 0) {
      map.setView([0, 0], 2)
      return
    }
  
    const bounds = []
  
    results.forEach(({ lat, lng, popup }) => {
      if (lat && lng) {
        const marker = L.marker([lat, lng])
        if (popup) marker.bindPopup(popup)
        marker.addTo(markersLayer)
        bounds.push([lat, lng])
      }
    })
  
    if (bounds.length) {
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }
  </script>
  
  <style scoped>
  .map-container {
    width: 100%;
    height: 400px;
    border-radius: 8px;
    box-shadow: 0 0 8px rgba(0,0,0,0.1);
  }
  </style>
  