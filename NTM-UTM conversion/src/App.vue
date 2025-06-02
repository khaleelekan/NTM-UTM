<template>
  <div id="app" class="min-h-screen bg-gray-50 flex items-center justify-center">
    <NTMtoUTMWrapper />
  </div>
</template>

<script>
import NTMtoUTMWrapper from './components/NTMtoUTMWrapper.vue';

export default {
  name: 'App',
  components: {
    NTMtoUTMWrapper,
  },
};
</script>

<style>
/* optional global styles */

body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 100%;
}
</style>


