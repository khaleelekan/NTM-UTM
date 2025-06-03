<template>
  <div v-if="results && results.length">
    <h3 class="mb-2 font-semibold text-lg">Uploaded Coordinates</h3>
    <ul class="list-disc pl-5 space-y-1">
      <li v-for="(r, i) in results" :key="i">
        Lat: {{ r.lat.toFixed(6) }}, Lng: {{ r.lng.toFixed(6) }} — {{ r.popup }}
      </li>
    </ul>
  </div>
  <p v-else class="text-gray-500 italic">No coordinates uploaded yet.</p>
</template>

<script setup>
defineProps({
  results: {
    type: Array,
    default: () => [],
  },
});
</script>

  
  