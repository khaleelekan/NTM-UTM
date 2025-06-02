<template>
    <div class="p-4 max-w-xl mx-auto">
      <h1 class="text-xl font-bold mb-4">NTM to UTM Converter</h1>
  
      <CoordinateInput @convert="handleConvert" />
  
      <div v-if="utmCoords" class="mt-4 p-2 border rounded bg-gray-100">
        <p><strong>UTM Easting:</strong> {{ utmCoords[0].toFixed(3) }}</p>
        <p><strong>UTM Northing:</strong> {{ utmCoords[1].toFixed(3) }}</p>
      </div>
  
      <MapDisplay :coords="utmCoords" />
    </div>
  </template>
  
  <script>
  import CoordinateInput from './CoordinateInput.vue';
  import MapDisplay from './MapDisplay.vue';
  import { convertNTMtoUTM } from '@/utils/Projections.js';
  
  export default {
    components: { CoordinateInput, MapDisplay },
    data() {
      return {
        utmCoords: null,
      };
    },
    methods: {
      handleConvert(ntmCoords) {
        this.utmCoords = convertNTMtoUTM(ntmCoords);
      },
    },
  };
  </script>
  