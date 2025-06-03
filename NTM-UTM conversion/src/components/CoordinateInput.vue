<template>
  <div class="coordinate-input p-4 border rounded shadow">
    <label>
      {{ eastingLabel }}:
      <input type="number" v-model.number="easting" :placeholder="`Enter ${eastingLabel}`" />
    </label>
    <label>
      {{ northingLabel }}:
      <input type="number" v-model.number="northing" :placeholder="`Enter ${northingLabel}`" />
    </label>
    <button @click="convert" class="mt-2 px-4 py-1 bg-blue-600 text-white rounded">Convert</button>
  </div>
</template>

<script>
export default {
  props: {
    eastingLabel: {
      type: String,
      default: 'Easting',
    },
    northingLabel: {
      type: String,
      default: 'Northing',
    },
  },
  data() {
    return {
      easting: null,
      northing: null,
    };
  },
  methods: {
    convert() {
      if (this.easting != null && this.northing != null) {
        this.$emit('convert', [this.easting, this.northing]);
      } else {
        alert('Please enter both easting and northing');
      }
    },
  },
};
</script>


