<template>
    <div v-if="results.length">
      <h3>Uploaded Coordinates</h3>
      <ul>
        <li v-for="(r, i) in results" :key="i">
          {{ r.lat }}, {{ r.lng }} — {{ r.popup }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  defineProps({ results: Array })
  </script>
  
  