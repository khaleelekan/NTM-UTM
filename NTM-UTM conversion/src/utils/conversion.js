import proj4 from 'proj4'

// Example: Minna datum NTM zone (customize as needed)
const ntmProj = "+proj=tmerc +lat_0=4.5 +lon_0=7.5 +k=0.9996 +x_0=500000 +y_0=0 +datum=WGS84 +units=m +no_defs"
const utmProj = "+proj=utm +zone=31 +datum=WGS84 +units=m +no_defs"
const wgs84 = proj4.WGS84

export function ntmToWGS84(easting, northing) {
  return proj4(ntmProj, wgs84, [easting, northing])
}

export function utmToWGS84(easting, northing) {
  return proj4(utmProj, wgs84, [easting, northing])
}

export function wgs84ToNtm(lon, lat) {
  return proj4(wgs84, ntmProj, [lon, lat])
}

export function wgs84ToUtm(lon, lat) {
  return proj4(wgs84, utmProj, [lon, lat])
}