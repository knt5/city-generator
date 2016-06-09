import stage from '../../models/stage/stage';

export default class MapController {
	constructor($map) {
		this.$map = $map;
	}
	
	/**
	 * Initialize map (Google maps callback function)
	 */
	init() {
		let el = this.$map.get(0);
		
		// Create google map object
		stage.map = new google.maps.Map(el, {
			center: { lat: 35.67510369, lng: 139.76808639 },
			zoom: 13
		});
	}
	
	addCity() {
		// Check city cache
		
		
		// Load city GeoJSON and DSM/DEM images if needed
		
		
		// Add city GeoJSON to map
		
		
	}
}
