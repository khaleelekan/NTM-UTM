<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import { wgs84ToUtm, wgs84ToNtm, utmToWGS84, ntmToWGS84 } from '@/utils/conversion'

const preview = ref([])

const conversion = ref({
  easting: '',
  northing: '',
  system: 'utm',
  lat: null,
  lng: null
})

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = e => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 })

    const headers = json[0]
    const rows = json.slice(1).map(row => {
      const rowData = {}
      headers.forEach((key, i) => rowData[key?.toString().trim().toLowerCase()] = row[i])
      return rowData
    })

    const validRows = rows.filter(r => !isNaN(r.lat) && !isNaN(r.lng))

    preview.value = validRows.map(r => {
      const lat = parseFloat(r.lat)
      const lng = parseFloat(r.lng)
      const popup = r.popup || ''

      const [utmX, utmY] = wgs84ToUtm(lng, lat)
      const [ntmX, ntmY] = wgs84ToNtm(lng, lat)

      return {
        lat, lng, popup,
        utmEasting: utmX.toFixed(2),
        utmNorthing: utmY.toFixed(2),
        ntmEasting: ntmX.toFixed(2),
        ntmNorthing: ntmY.toFixed(2)
      }
    })
  }

  reader.readAsArrayBuffer(file)
}

function convertToLatLng() {
  const e = parseFloat(conversion.value.easting)
  const n = parseFloat(conversion.value.northing)
  if (isNaN(e) || isNaN(n)) return alert('Enter valid easting/northing.')

  const [lng, lat] = conversion.value.system === 'utm'
    ? utmToWGS84(e, n)
    : ntmToWGS84(e, n)

  conversion.value.lat = lat.toFixed(6)
  conversion.value.lng = lng.toFixed(6)
}

function downloadCSV() {
  const headers = ['lat', 'lng', 'popup', 'utmEasting', 'utmNorthing', 'ntmEasting', 'ntmNorthing']
  const rows = preview.value.map(row => headers.map(h => row[h]).join(','))
  const csvContent = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'converted_coordinates.csv'
  link.click()
}
</script>

<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold mb-4">Coordinate Form</h2>

    <input type="file" @change="handleFileUpload" class="mb-4" />

    <div v-if="preview.length" class="overflow-auto">
      <table class="table-auto border-collapse border w-full text-sm">
        <thead class="bg-gray-200">
          <tr>
            <th class="border px-2 py-1">Latitude</th>
            <th class="border px-2 py-1">Longitude</th>
            <th class="border px-2 py-1">Popup</th>
            <th class="border px-2 py-1">UTM Easting</th>
            <th class="border px-2 py-1">UTM Northing</th>
            <th class="border px-2 py-1">NTM Easting</th>
            <th class="border px-2 py-1">NTM Northing</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in preview" :key="i">
            <td class="border px-2 py-1">{{ row.lat }}</td>
            <td class="border px-2 py-1">{{ row.lng }}</td>
            <td class="border px-2 py-1">{{ row.popup }}</td>
            <td class="border px-2 py-1">{{ row.utmEasting }}</td>
            <td class="border px-2 py-1">{{ row.utmNorthing }}</td>
            <td class="border px-2 py-1">{{ row.ntmEasting }}</td>
            <td class="border px-2 py-1">{{ row.ntmNorthing }}</td>
          </tr>
        </tbody>
      </table>

      <button @click="downloadCSV" class="mt-4 bg-green-600 text-white px-4 py-2 rounded">
        Download CSV
      </button>
    </div>

    <div class="mt-8">
      <h3 class="text-lg font-semibold mb-2">Reverse Conversion (UTM/NTM ➝ WGS84)</h3>

      <div class="flex flex-wrap gap-4 mb-4">
        <input type="number" v-model="conversion.easting" placeholder="Easting" class="border px-2 py-1 rounded" />
        <input type="number" v-model="conversion.northing" placeholder="Northing" class="border px-2 py-1 rounded" />
        <select v-model="conversion.system" class="border px-2 py-1 rounded">
          <option value="utm">UTM</option>
          <option value="ntm">NTM</option>
        </select>
        <button @click="convertToLatLng" class="bg-blue-600 text-white px-4 py-2 rounded">
          Convert
        </button>
      </div>

      <div v-if="conversion.lat && conversion.lng">
        <p><strong>Latitude:</strong> {{ conversion.lat }}</p>
        <p><strong>Longitude:</strong> {{ conversion.lng }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
input, select {
  min-width: 120px;
}
</style>

  