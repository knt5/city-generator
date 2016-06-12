import stage from '../../models/stage/stage';
import cities from '../../models/stage/cities';
import {
	$stage,
	$map,
	$cityCanvas,
	$cityCanvasStatus,
	$buildingGenerator,
	$userInterface,
	$citySelect,
} from '../../models/stage/dom';
import Building from '../../models/stage/Building';
import MapController from './MapController';
import BuildingGeneratorController from './BuildingGeneratorController';
import BuildingCanvasController from './BuildingCanvasController';
import CityCanvasController from './CityCanvasController';
import cityUtil from '../../utils/cityUtil';

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
			
			// Make city bounds, delta lat/lng and cneter
			if (city.south === undefined) {
				cityUtil.updateCityBounds(city);
				
				console.log(city);
			}
			
			//=============================================
			// Generate buildings
			for (let feature of city.geo.features) {
				//-----------------------------------------
				// Generate building mesh
				
				let building = new Building(feature, city);
				let type = feature.properties.type;
				let fid = feature.properties.fid;
				let amount;
				let color;
				
				switch (type) {
					case 0:
						amount = 1;
						color = '#ffec47';
						break;
					case 1:
						amount = 2;
						color = '#93ca76';
						break;
					case 2:
						amount = 0.5;
						color = '#ec6800';
						break;
					case 3:
						amount = 6;
						color = '#2ca9e1';
						break;
				}
				
				let geometry = new THREE.ExtrudeGeometry(building.shape, {
					amount,
					bevelThickness: 0,
					bevelSize: 0,
					bevelSegments: 0,
					bevelEnabled: false,
					curveSegments: 1,
					steps: 1
				});
				
				let material = new THREE.MeshStandardMaterial({
					color,
				});
				
				let mesh = new THREE.Mesh(geometry, material);
				
				//-----------------------------------------
				// Save building mesh
				
				if (!city.buildings) {
					city.buildings = {};
				}
				
				if (!city.buildings[fid]) {
					city.buildings[fid] = {};
				}
				
				city.buildings[fid].mesh = mesh;
				
				//-----------------------------------------
				// Generate city mesh (merge)
				
				if (!city.geometries) {
					city.geometries = {};
				}
				
				if (!city.geometries[type]) {
					city.geometries[type] = new THREE.Geometry();
				}
				
				city.geometries[type].mergeMesh(mesh);
				
				//-----------------------------------------
				stage.buildingCanvasController.scene.add(mesh);
			}
			
			//=============================================
			// Add merged geometry to city canvas
			for (let type in city.geometries) {
				let color;
				
				console.log(city.geometries);
				console.log(type);
				
				switch (type) {
					case 0:
						color = '#ffec47';
						break;
					case 1:
						color = '#93ca76';
						break;
					case 2:
						color = '#ec6800';
						break;
					case 3:
						color = '#2ca9e1';
						break;
				}
				
				let material = new THREE.MeshStandardMaterial({
					color,
				});
				
				let cityMesh = new THREE.Mesh(city.geometries[type], material);
				
				stage.cityCanvasController.scene.add(cityMesh);
			}
			
			stage.cityCanvasController.render();
		});
	}
}
