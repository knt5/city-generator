import projectionUtil from '../../utils/projectionUtil';
import heightPredictionUtil from '../../utils/heightPredictionUtil';

export default class Building {
	constructor(feature, city) {
		let coordinates = feature.geometry.coordinates;
		let type = feature.geometry.type;
		
		// Bounds
		this.south = 1000;
		this.west = 1000;
		this.north = -1000;
		this.east = -1000;
		
		// Shape and bounds
		if (type === 'MultiPolygon') {
			this.shape = getShapes(coordinates, this, city);
		} else if (type === 'Polygon') {
			this.shape = getShape(coordinates, this, city);
		} else {
			console.error('Unkown feature geometry type: ' + type);
		}
		
		// Delta lat and lng
		this.deltaLat = this.north - this.south;
		this.deltaLng = this.east - this.west;
		
		// Center
		this.center = {
			lat: this.north - this.deltaLat / 2,
			lng: this.east - this.deltaLng / 2
		};
		
		// Height
		this.height = heightPredictionUtil.getHeight(feature, this, city);
	}
}

//=========================================================
// Shape

function getShapes(multiPolygon, building, city) {
	let shapes = [];
	
	for (let polygon of multiPolygon) {
		shapes.push(getShape(polygon, building, city));
	}
	
	return shapes;
}

function getShape(polygon, building, city) {
	let i = 0;
	let shape;
	
	for (let ring of polygon) {
		if (i === 0) {
			// exterior ring
			shape = new THREE.Shape(getVector2Array(ring, building, city));
		} else {
			// interior ring
			shape.holes.push(new THREE.Path(getVector2Array(ring, building, city)));
		}
		i++;
	}
	
	return shape;
}

function getVector2Array(ring, building, city) {
	let array = [];
	for (let lngLat of ring) {
		// Add a shape point
		let x = city.bounds.start.x + projectionUtil.getMeterFromDeltaLng(lngLat[0] - city.west, lngLat[1]) / 10;
		let y = city.bounds.start.y + projectionUtil.getMeterFromDeltaLat(lngLat[1] - city.south, lngLat[1]) / 10;
		array.push(new THREE.Vector2(x, y));
		
		// Update building bounds
		updateBuildingBoundsByRing(ring, building);
	}
	return array;
}

function updateBuildingBoundsByRing(ring, building) {
	for (let lngLat of ring) {
		if (lngLat[0] < building.west) {
			building.west = lngLat[0];
		}
		if (lngLat[1] < building.south) {
			building.south = lngLat[1];
		}
		if (lngLat[0] > building.east) {
			building.east = lngLat[0];
		}
		if (lngLat[1] > building.north) {
			building.north = lngLat[1];
		}
	}
}
