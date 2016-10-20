const fs = require('fs');

//=========================================================
// Arguments

if (process.argv.length < 3) {
	console.error(`Usage: ${process.argv[0]} ${process.argv[1]} geojson-file-name`);
	process.exit(1);
}

const fileName = process.argv[2];

//=========================================================
// Process GeoJSON file

const geo = JSON.parse(fs.readFileSync(fileName));
let minLngLat = [1000, 1000];
let maxLngLat = [-1000, -1000];

for (let feature of geo.features) {
	let g = feature.geometry;
	
	if (g.type === 'Polygon') {
		calcPolygon(g.coordinates);
	} else if (g.type === 'MultiPolygon') {
		calcMultiPolygon(g.coordinates);
	} else {
		throw new Error(`Unknown geometry type: ${g.type}`);
	}
}

// Spread bounds
// lng +/- 60m (0.00066260809)
// lat +/- 60m (0.00054077109)
minLngLat[0] -= 0.00066260809;
maxLngLat[0] += 0.00066260809;
minLngLat[1] -= 0.00054077109;
maxLngLat[1] += 0.00054077109;

console.log(`${minLngLat[0]} ${minLngLat[1]} ${maxLngLat[0]} ${maxLngLat[1]}`);

//=========================================================
function calcMultiPolygon(multiPolygon) {
	let polygon;
	for (polygon of multiPolygon) {
		calcPolygon(polygon);
	}
}

//=========================================================
function calcPolygon(polygon) {
	let ring;
	for (ring of polygon) {
		calc(ring);
	}
}

//=========================================================
function calc(lngLatArray) {
	let lngLat;
	for (lngLat of lngLatArray) {
		min(lngLat);
		max(lngLat);
	}
}

//=========================================================
function min(lngLat) {
	if (lngLat[0] < minLngLat[0]) {
		minLngLat[0] = lngLat[0];
	}
	
	if (lngLat[1] < minLngLat[1]) {
		minLngLat[1] = lngLat[1];
	}
}

//=========================================================
function max(lngLat) {
	if (lngLat[0] > maxLngLat[0]) {
		maxLngLat[0] = lngLat[0];
	}
	
	if (lngLat[1] > maxLngLat[1]) {
		maxLngLat[1] = lngLat[1];
	}
}
