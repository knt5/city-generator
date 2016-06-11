import stage from '../../models/stage/stage';
import cities from '../../models/stage/cities';

export default class MapController {
	constructor($map) {
		this.$map = $map;
	}
	
	/**
	 * Initialize map (Google maps callback function)
	 */
	init() {
		let el = this.$map.get(0);
		
		//-------------------------------------------------
		// Create google map object
		stage.map = new google.maps.Map(el, {
			center: { lat: 35.67510369, lng: 139.76808639 },
			zoom: 15
		});
		
		//-------------------------------------------------
		// Register Google maps data layer event handler
		
		stage.map.data.addListener('mouseover', (event) => {
			stage.map.data.revertStyle();
			stage.map.data.overrideStyle(event.feature, {
				fillColor: '#fff',
				strokeColor: '#a0d8ef',
				strokeWeight: 3
			});
		});
		
		stage.map.data.addListener('mouseout', () => {
			stage.map.data.revertStyle();
		});
		
		//-------------------------------------------------
		// Call onChange at first
		stage.controller.onChangeCitySelect();
	}
	
	/**
	 *
	 */
	changeCity(id, callback) {
		let city = cities[id];
		
		// Check city cache
		if (!city.geo) {
			//---------------------------------------------
			// Load city GeoJSON and DSM/DEM images if needed
			$.getJSON(`assets/dat/${id}.geojson`, (data) => {
				// Save GeoJSON data
				city.geo = data;
				
				// Calculate center position
				let dem = city.dem;
				city.center = {
					lat: dem.lat + dem.size * (dem.height / 2),
					lng: dem.lng + dem.size * (dem.width / 2)
				};
				
				// Clear
				clearMap();
				
				// Add city
				addCity(city);
				
				// Done
				callback(city);
			});
			
			//---------------------------------------------
			// Load DSM image
			let dsmImage = new Image();
			dsmImage.src = `assets/dat/${id}.dsm.png`;
			dsmImage.onload = () => {
				city.dsm.image = dsmImage;
				addDsm(city);
			};
			
			//---------------------------------------------
			// Load DEM image
			let demImage = new Image();
			demImage.src = `assets/dat/${id}.dem.png`;
			demImage.onload = () => {
				city.dem.image = demImage;
			};
			
		} else {
			setCenter(city.center);
			
			// Done
			callback(city);
		}
	}
}

//=========================================================

/**
 * Add city GeoJSON to map
 */
function addCity(city) {
	stage.map.data.addGeoJson(city.geo);
	stage.map.data.setStyle(setStyle);
	setCenter(city.center);
}

/**
 * Set map center to city center
 */
function setCenter(center) {
	stage.map.setCenter(center);
}

/**
 * Remove all cities from map
 */
function clearMap() {
}

/**
 * Add DSM image to map
 */
function addDsm(city) {
	city.dsm.bounds = {
		south: city.dsm.lat,
		west: city.dsm.lng,
		north: city.dsm.lat + city.dsm.height * city.dsm.size,
		east: city.dsm.lng + city.dsm.width * city.dsm.size,
	};
	city.dsm.overlay = new google.maps.GroundOverlay(city.dsm.image.src, city.dsm.bounds);
	city.dsm.overlay.setOpacity(0.7);
	city.dsm.overlay.setMap(stage.map);
}

//=========================================================

function setStyle(feature) {
	let type = feature.getProperty('type');
	let style = {
		strokeWeight: 1
	};
	
	switch (type) {
		case 0:
			style.fillColor = '#ffec47';
			style.strokeColor = '#ffec47';
			break;
		case 1:
			style.fillColor = '#93ca76';
			style.strokeColor = '#93ca76';
			break;
		case 2:
			style.fillColor = '#ec6800';
			style.strokeColor = '#ec6800';
			break;
		case 3:
			style.fillColor = '#2ca9e1';
			style.strokeColor = '#2ca9e1';
			break;
	}
	
	return style;
}

