import stage from '../../models/stage/stage';
import cities from '../../models/stage/cities';
import Building from '../../models/stage/Building';
import {
	$stage,
	$map,
	$cityCanvas,
	$cityCanvasStatus,
	$buildingGenerator,
	$userInterface,
	$citySelect,
} from '../../models/stage/dom';
import MapController from './MapController';
import BuildingGeneratorController from './BuildingGeneratorController';
import BuildingCanvasController from './BuildingCanvasController';
import CityCanvasController from './CityCanvasController';

export default class StageController {
	constructor() {
		// Create controllers of stage children
		stage.mapController = new MapController($map);
		stage.buildingGeneratorController = new BuildingGeneratorController();
		stage.buildingCanvasController = new BuildingCanvasController();
		stage.cityCanvasController = new CityCanvasController();
		
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
		// TODO: Check Facebook app or not and change the height
		
		// Resize stage
		this.resize($stage, width, height);
		
		// Resize stage layers
		this.resize($cityCanvas, width, height);
		this.resize($cityCanvasStatus, width, height);
		this.resize($buildingGenerator, width, height);
		this.resize($userInterface, width, height);
		
		// Reset building generator layer
		stage.buildingGeneratorController.resetLayer(width, height);
		
		// Call resize() of canvas controller
		stage.cityCanvasController.resize(width, height);
		stage.buildingCanvasController.resize();
	}
	
	/**
	 * City select change event handler
	 */
	onChangeCitySelect() {
		let id = $citySelect.val();
		
		// Change city
		stage.mapController.changeCity(id, (city) => {
			
			for (let feature of city.geo.features) {
				let building = new Building(feature);

				let geometry = new THREE.ExtrudeGeometry(building.shape, {
					amount: 20,
					bevelThickness: 0,
					bevelSize: 0,
					bevelSegments: 0,
					bevelEnabled: false,
					curveSegments: 1,
					steps: 1
				});

				//geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-20, 0, 0));

				let material = new THREE.MeshStandardMaterial({
					color: '#93ca76'
				});

				let mesh = new THREE.Mesh(geometry, material);

				stage.buildingCanvasController.scene.add(mesh);
			}
		});
	}
}
