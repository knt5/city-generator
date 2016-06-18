// Models
import stage from '../../models/stage/stage';
import cities from '../../models/stage/cities';
import {
	$stage,
	$map,
	$cityCanvas,
	$cityCanvasStatus,
	$cityCanvasStatusText,
	$buildingPreview,
	$userInterface,
	$citySelect,
} from '../../models/stage/dom';

// Controllers
import MapController from './MapController';
import BuildingPreviewController from './BuildingPreviewController';
import BuildingCanvasController from './BuildingCanvasController';
import CityCanvasController from './CityCanvasController';
import CityCanvasStatusController from './CityCanvasStatusController';

// Utils
import cityUtil from '../../utils/cityUtil';

export default class StageController {
	constructor() {
		// Create controllers of stage children
		stage.mapController = new MapController($map);
		stage.buildingPreviewController = new BuildingPreviewController();
		stage.buildingCanvasController = new BuildingCanvasController();
		stage.cityCanvasController = new CityCanvasController();
		stage.cityCanvasStatusController = new CityCanvasStatusController();
		
		// Generate city select contents
		for (let id in cities) {
			let html = '';
			html += `<option value="${id}">${cities[id].name}</option>`;
			$citySelect.append(html);
		}
		
		// Register city select change event handler
		$citySelect.on('change', this.onChangeCitySelect);
	}
	
	/**
	 * Resize element
	 */
	resize($element, width, height) {
		$element.width(width);
		$element.height(height);
	}
	
	/**
	 * Resize stage and layers
	 */
	resizeStage(width, height) {
		// Resize stage
		this.resize($stage, width, height);
		
		// Resize stage layers
		this.resize($cityCanvas, width, height);
		this.resize($cityCanvasStatus, width, height);
		this.resize($buildingPreview, width, height);
		this.resize($userInterface, width, height);
		
		// Reset building preview layer
		stage.buildingPreviewController.resetLayer(width, height);
		
		// Canvas controllers' resize() for three.js
		stage.cityCanvasController.resize(width, height);
		stage.buildingCanvasController.resize();
		
		// Set message box position
		$cityCanvasStatusText.css('top', height / 2 - 40 + 'px');
	}
	
	/**
	 * City select change event handler
	 */
	onChangeCitySelect() {
		let id = $citySelect.val();
		
		// Change city
		stage.mapController.changeCity(id, (city) => {
			// Stop city animation
			stage.cityCanvasController.stopAnimation();
			
			// Update city info
			if (city.south === undefined) {
				cityUtil.updateCity(city);
			}
			
			// Init city scene
			stage.cityCanvasController.rebuild(city);
			
			// Generate
			stage.cityCanvasStatusController.show('Predicting and generating...', () => {
				cityUtil.addCityToScene(city);
				stage.cityCanvasController.animate();
				stage.cityCanvasStatusController.hide();
			});
		});
	}
}
