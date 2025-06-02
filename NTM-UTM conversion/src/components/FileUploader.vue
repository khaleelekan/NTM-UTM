<template>
    <div class="p-4 border rounded-lg bg-white shadow-md">
      <h2 class="text-xl font-bold mb-4">Upload Coordinates CSV</h2>
      <input type="file" @change="handleFileUpload" accept=".csv" class="mb-2" />
      <div v-if="parsedData.length" class="mt-4">
        <p class="font-semibold">Parsed {{ parsedData.length }} rows</p>
        <button class="mt-2 px-4 py-2 bg-blue-500 text-white rounded" @click="convertCoordinates">
          Convert Coordinates
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import Papa from 'papaparse'
  import { ref } from 'vue'
  import { ntmToWGS84 } from '../utils/Projections.js'
  
  const parsedData = ref([])
  const convertedResults = ref([])
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
  
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        parsedData.value = results.data
      }
    })
  }
  
  const convertCoordinates = () => {
    convertedResults.value = parsedData.value.map(row => {
      const { Easting, Northing } = row
      const [lon, lat] = ntmToWGS84(parseFloat(Easting), parseFloat(Northing))
      return {
        ...row,
        Latitude: lat.toFixed(6),
        Longitude: lon.toFixed(6)
      }
    })
    console.log('Converted:', convertedResults.value)
  }
  </script>
  
  <style scoped>
  input[type="file"] {
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 6px;
  }
  </style>../utils/conversion.js../utils/Projections.js