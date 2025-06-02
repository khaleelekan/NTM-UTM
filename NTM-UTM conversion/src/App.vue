<template>
  <div class="app">
    <h1>Coordinate Uploader</h1>

    <CoordinateForm
      @submit="handleSingleSubmit"
      @bulk-upload="handleBulkUpload"
    />

    <ResultsList :results="coordinates" />
  </div>
</template>

<script setup>
import CoordinateForm from './components/CoordinateForm.vue'
import ResultsList from './components/ResultsList.vue'
import { ref } from 'vue'

const coordinates = ref([])

// Handle single input submission
function handleSingleSubmit(coord) {
  coordinates.value.push(coord)
}

// Handle bulk upload submission
function handleBulkUpload(coords) {
  coordinates.value.push(...coords)
}
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: auto;
  padding: 24px;
}
</style>

