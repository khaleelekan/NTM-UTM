<template>
  <div class="p-4 max-w-6xl mx-auto flex gap-6">
    <!-- Left pane: Inputs and results -->
    <div class="flex-1 max-w-md">
      <h1 class="text-xl font-bold mb-4">NTM ⇄ UTM Converter</h1>

      <select v-model="direction" class="mb-4 p-2 border rounded w-full">
        <option value="NTMtoUTM">NTM to UTM</option>
        <option value="UTMtoNTM">UTM to NTM</option>
      </select>

      <CoordinateInput
        :eastingLabel="inputEastingLabel"
        :northingLabel="inputNorthingLabel"
        @convert="handleConvert"
      />

      <div v-if="convertedCoords" class="mt-4 p-4 border rounded bg-gray-100">
        <p>
          <strong>{{ outputLabel }} Easting:</strong>
          {{ convertedCoords[0].toFixed(3) }}
        </p>
        <p>
          <strong>{{ outputLabel }} Northing:</strong>
          {{ convertedCoords[1].toFixed(3) }}
        </p>
      </div>
    </div>

    <!-- Right pane: Map -->
    <div class="flex-1 h-[70vh] rounded overflow-hidden border">
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
  computed: {
    inputEastingLabel() {
      return this.direction === 'NTMtoUTM' ? 'NTM Easting' : 'UTM Easting';
    },
    inputNorthingLabel() {
      return this.direction === 'NTMtoUTM' ? 'NTM Northing' : 'UTM Northing';
    },
    outputLabel() {
      return this.direction === 'NTMtoUTM' ? 'UTM' : 'NTM';
    },
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
/* Optional: add scrollbar for the left pane if content is tall */
div.flex-1.max-w-md {
  max-height: 70vh;
  overflow-y: auto;
}
</style>


  