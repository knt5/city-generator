import projectionUtil from './projectionUtil';

export default {
	updateCityBounds(city) {
		if (city.geo) {
			// Lat lng bounds
			city.south = 1000;
			city.west = 1000;
			city.north = -1000;
			city.east = -1000;
			
			for (let feature of city.geo.features) {
				updateCityBoundsByFeature(feature, city);
			}
			
			// Delta lat and lng
			city.deltaLat = city.north - city.south;
			city.deltaLng = city.east - city.west;
			
			// Center
			city.center = {
				lat: city.north - city.deltaLat / 2,
				lng: city.east - city.deltaLng / 2
			};
			
			// x,y bounds
			let deltaX = projectionUtil.getMeterFromDeltaLng(city.east - city.center.lng, city.center.lat) / 10;
			let deltaY = projectionUtil.getMeterFromDeltaLat(city.north - city.center.lat, city.center.lat) / 10;
			city.bounds = {
				start: { x: -deltaX, y: -deltaY },
				end: { x: deltaX, y: deltaY }
			};
		}
	},
};

//=========================================================

function updateCityBoundsByFeature(feature, city) {
	let coordinates = feature.geometry.coordinates;
	let type = feature.geometry.type;
	
	if (type === 'MultiPolygon') {
		updateCityBoundsByMultiPolygon(coordinates, city);
	} else if (type === 'Polygon') {
		updateCityBoundsByPolygon(coordinates, city);
	}
}

function updateCityBoundsByMultiPolygon(multiPolygon, city) {
	for (let polygon of multiPolygon) {
		updateCityBoundsByPolygon(polygon, city);
	}
}

function updateCityBoundsByPolygon(polygon, city) {
	// Only an exterior ring
	updateCityBoundsByRing(polygon[0], city);
}

function updateCityBoundsByRing(ring, city) {
	for (let lngLat of ring) {
		if (lngLat[0] < city.west) {
			city.west = lngLat[0];
		}
		if (lngLat[1] < city.south) {
			city.south = lngLat[1];
		}
		if (lngLat[0] > city.east) {
			city.east = lngLat[0];
		}
		if (lngLat[1] > city.north) {
			city.north = lngLat[1];
		}
	}
}
