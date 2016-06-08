const fs = require('fs');

//=========================================================
// Arguments

if (process.argv.length < 3) {
	console.error('Usage: ' + process.argv[0] + ' ' + process.argv[1] + ' filePath');
	process.exit(1);
}

let path = process.argv[2];

//=========================================================
let json = fs.readFileSync(path);
let obj = JSON.parse(json);
let features = obj.features;

let feature;
for (feature of features) {
	let geometry = feature.geometry;
	
	// Delete id
	if (feature.properties.id) {
		delete feature.properties.id;
	}
	
	// Check geometry type
	if (geometry.type === 'MultiPolygon') {
		reduceMultiPolygon(geometry.coordinates);
	} else if (geometry.type === 'Polygon') {
		reducePolygon(geometry.coordinates);
	} else {
		throw new Error('Unknown geometry type in ' + path + ': ' + geometry.type);
	}
}

console.log(JSON.stringify(obj));

//=========================================================
function reduceMultiPolygon(multiPolygon) {
	let polygon;
	for (polygon of multiPolygon) {
		reducePolygon(polygon);
	}
}

//=========================================================
function reducePolygon(polygon) {
	let ring;
	for (ring of polygon) {
		reduce(ring);
	}
}

//=========================================================
function reduce(lngLatArray) {
	let lngLat;
	for (lngLat of lngLatArray) {
		lngLat[0] = reduceFloat(lngLat[0]);
		lngLat[1] = reduceFloat(lngLat[1]);
	}
}

//=========================================================
function reduceFloat(n) {
	const d = 100000000;
	let x = Math.round(n * d) / d;
	return x;
}
