import elevationsByHand from '../models/stage/elevationsByHand';

const maxHeight = {
	'0': 1.5,  //  15m
	'1': 30,   // 300m
	'2': 0.5,  //   5m
	'3': 20,   // 200m
};

const minHeight = {
	'0': 0.5,  //  5m
	'1': 1.5,  // 15m
	'2': 0.3,  //  3m
	'3': 1.5,  // 15m
};

export default {
	getHeight(feature, building, city) {
		if (elevationsByHand[feature.properties.fid] !== undefined) {
			return elevationsByHand[feature.properties.fid] / 10;
		} else {
			// Prediction
			return predictHeight(feature, building, city);
		}
	},
	
	getElevation(building, city) {
		return getElevationByCenter(building, city.dem);
	}
};

//=========================================================

function predictHeight(feature, building, city) {
	let type = feature.properties.type;
	let height = 1;
	
	//-----------------------------------------------------
	// Basic height by type
	switch (type) {
		case 0:
			height = 1;
			break;
		case 1:
			height = 2;
			break;
		case 2:
			height = 0.5;
			break;
		case 3:
			height = 6;
			break;
	}
	
	//-----------------------------------------------------
	// Height prediction
	if (type === 0 || type === 1 || type === 2) {
		height = getHeightByCenter(building, city);
	}
	
	//-----------------------------------------------------
	// Cap height
	if (height > maxHeight[type]) {
		height = maxHeight[type];
	} else if (height < minHeight[type]) {
		height = minHeight[type];
	}
	
	return height;
}

//=========================================================
// Height prediction by center

function getHeightByCenter(building, city) {
	return getElevationByCenter(building, city.dsm) - getElevationByCenter(building, city.dem);
}

function getElevationByCenter(building, container) {
	let deltaLng = building.center.lng - container.lng;
	let deltaLat = building.center.lat - container.lat;
	
	let x = Math.floor(deltaLng / container.size);  // container cell size
	let y = Math.floor(deltaLat / container.size);
	
	let xRemainder = container.lng % container.size;
	let yRemainder = container.lat % container.size;
	
	if (xRemainder - container.size / 2 > 0) {
		x++;
	}
	if (yRemainder - container.size / 2 > 0) {
		y++;
	}
	
	return container.points[y][x] / 10;
}
