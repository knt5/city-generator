export default class Building {
	constructor(feature) {
		if (feature.geometry.type === 'MultiPolygon') {
			this.shape = getShapes(feature.geometry.coordinates);
			
		} else if (feature.geometry.type === 'Polygon') {
			this.shape = getShape(feature.geometry.coordinates);
		} else {
			console.error('Unkown feature geometry type: ' + feature.geometry.type);
		}
	}
	
	setHeight(height) {
		this.height = height;
	}
	
	
	
	
	
	
	
}

function getShapes(multiPolygon) {
	let shapes = [];
	
	for (let polygon of multiPolygon) {
		shapes.push(getShape(polygon));
	}
	
	return shapes;
}

function getShape(polygon) {
	let i = 0;
	let shape;
	
	for (let ring of polygon) {
		if (i === 0) {
			// exterior ring
			shape = new THREE.Shape(getVector2Array(ring));
		} else {
			// interior ring
			shape.holes.push(new THREE.Path(getVector2Array(ring)));
		}
	}
	
	return shape;
}

function getVector2Array(ring) {
	let array = [];
	for (let lngLat of ring) {
		let x = (lngLat[0] - 139) * 100;
		let y = (lngLat[1] - 35) * 100;
		array.push(new THREE.Vector2(x, y));
	}
	return array;
}
