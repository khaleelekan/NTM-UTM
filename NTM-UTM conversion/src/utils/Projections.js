import proj4 from 'proj4';

proj4.defs('NTM', '+proj=tmerc +lat_0=4.5 +lon_0=7 +k=0.9999 +x_0=670000 +y_0=0 +a=6378249.145 +rf=293.466 +units=m +no_defs');
proj4.defs('UTM', '+proj=utm +zone=31 +datum=WGS84 +units=m +no_defs');

export function convertNTMtoUTM([easting, northing]) {
  return proj4('NTM', 'UTM', [easting, northing]);
}

export default proj4;
