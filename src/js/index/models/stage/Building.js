import projectionUtil from '../../utils/projectionUtil';

export default class Building {
	constructor(feature, city) {
		let coordinates = feature.geometry.coordinates;
		
		// Make shape
		if (feature.geometry.type === 'MultiPolygon') {
			this.shape = getShapes(coordinates, city);
		} else if (feature.geometry.type === 'Polygon') {
			this.shape = getShape(coordinates, city);
		} else {
			console.error('Unkown feature geometry type: ' + feature.geometry.type);
		}
	}
	
	setHeight(height) {
		this.height = height;
	}
}

//=========================================================

function getShapes(multiPolygon, city) {
	let shapes = [];
	
	for (let polygon of multiPolygon) {
		shapes.push(getShape(polygon, city));
	}
	
	return shapes;
}

function getShape(polygon, city) {
	let i = 0;
	let shape;
	
	for (let ring of polygon) {
		if (i === 0) {
			// exterior ring
			shape = new THREE.Shape(getVector2Array(ring, city));
		} else {
			// interior ring
			shape.holes.push(new THREE.Path(getVector2Array(ring, city)));
		}
	}
	
	return shape;
}

function getVector2Array(ring, city) {
	let array = [];
	for (let lngLat of ring) {
		let x = city.bounds.start.x + projectionUtil.getMeterFromDeltaLng(lngLat[0] - city.west, lngLat[1]) / 10;
		let y = city.bounds.start.y + projectionUtil.getMeterFromDeltaLat(lngLat[1] - city.south, lngLat[1]) / 10;
		
		array.push(new THREE.Vector2(x, y));
	}
	return array;
}
