import stage from 'index/models/stage/stage';
import cities from 'index/models/stage/cities';

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
			
			// Show status
			stage.cityCanvasStatusController.show('Loading...', () => {
				// Load data
				$.getJSON(`assets/dat/${id}.geojson`)
				.done((data) => {
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
					
					//-----------------------------------------
					// Load DSM image
					let dsmImage = new Image();
					dsmImage.src = `assets/dat/${id}.dsm.png`;
					dsmImage.onerror = stage.cityCanvasStatusController.showFailedToLoad;
					dsmImage.onload = () => {
						// Save image
						city.dsm.image = dsmImage;
						
						// Create DSM points
						createElevationPoints(city.dsm);
						
						// Add DSM to map
						addDsm(city);
						
						//-------------------------------------
						// Load DEM image
						let demImage = new Image();
						demImage.src = `assets/dat/${id}.dem.png`;
						demImage.onerror = stage.cityCanvasStatusController.showFailedToLoad;
						demImage.onload = () => {
							// Save image
							city.dem.image = demImage;
							
							// Create DEM points
							createElevationPoints(city.dem);
							
							// Done
							callback(city);
						};
					};
				})
				.fail(stage.cityCanvasStatusController.showFailedToLoad);
			});
			
		} else {
			setCenter(city.center);
			
			// Done
			callback(city);
		}
	}
}

//=========================================================
// Elevation points data

function createElevationPoints(container) {
	container.points = [];
	
	// Create canvas
	container.canvas = document.createElement('canvas');
	container.canvas.width = container.image.width;
	container.canvas.height = container.image.height;
	
	// Get context
	let context = container.canvas.getContext('2d');
	
	// Draw image
	context.drawImage(container.image, 0, 0);
	
	// Get image data
	let imageData = context.getImageData(0, 0, container.image.width, container.image.height);
	
	// Create elevation points data
	for (let y=0; y<container.image.height; y++) {
		container.points.push([]);
		for (let x=0; x<container.image.width; x++) {
			container.points[y].push(imageData.data[
				x * 4 +
				(container.image.height - y - 1) * container.image.width * 4
			]);
		}
	}
}

//=========================================================
// Map

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
// Data layer of map

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
