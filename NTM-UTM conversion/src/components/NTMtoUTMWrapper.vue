<template>
  <div class="flex w-full max-w-7xl mx-auto p-6 gap-6 h-[80vh]">
    <!-- Left Side: Input and Result -->
    <div class="flex flex-col flex-shrink-0 w-96 overflow-auto border rounded p-4">
      <h1 class="text-xl font-bold mb-4">NTM ⇄ UTM Converter</h1>

      <select v-model="direction" class="mb-4 p-2 border rounded w-full">
        <option value="NTMtoUTM">NTM to UTM</option>
        <option value="UTMtoNTM">UTM to NTM</option>
      </select>

      <CoordinateInput @convert="handleConvert" />

      <div v-if="convertedCoords" class="mt-4 p-4 border rounded bg-gray-100">
        <p>
          <strong>{{ direction === 'NTMtoUTM' ? 'UTM' : 'NTM' }} Easting:</strong>
          {{ convertedCoords[0].toFixed(3) }}
        </p>
        <p>
          <strong>{{ direction === 'NTMtoUTM' ? 'UTM' : 'NTM' }} Northing:</strong>
          {{ convertedCoords[1].toFixed(3) }}
        </p>
      </div>
    </div>

    <!-- Right Side: Map -->
    <div class="flex-1 border rounded overflow-hidden">
      <MapDisplay v-if="convertedCoords" :coords="convertedCoords" />
    </div>
  </div>
</template>

<script>
import CoordinateInput from './CoordinateInput.vue';
import MapDisplay from './MapDisplay.vue';
import { convertNTMtoUTM, convertUTMtoNTM } from '@/utils/Projections.js';

export default {
  components: { CoordinateInput, MapDisplay },
  data() {
    return {
      direction: 'NTMtoUTM',
      convertedCoords: null,
    };
  },
  methods: {
    handleConvert(coords) {
      if (this.direction === 'NTMtoUTM') {
        this.convertedCoords = convertNTMtoUTM(coords);
      } else {
        this.convertedCoords = convertUTMtoNTM(coords);
      }
    },
  },
};
</script>

<style scoped>
/* Optional custom map container style if needed */
</style>

  