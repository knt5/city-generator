import stage from '../../models/stage/stage';
import cities from '../../models/stage/cities';
import {
	$stage,
	$map,
	$cityCanvas,
	$cityCanvasStatus,
	$buildingPreview,
	$userInterface,
	$citySelect,
} from '../../models/stage/dom';
import Building from '../../models/stage/Building';
import MapController from './MapController';
import BuildingPreviewController from './BuildingPreviewController';
import BuildingCanvasController from './BuildingCanvasController';
import CityCanvasController from './CityCanvasController';
import cityUtil from '../../utils/cityUtil';
import heightPredictionUtil from '../../utils/heightPredictionUtil';

export default class StageController {
	constructor() {
		// Create controllers of stage children
		stage.mapController = new MapController($map);
		stage.buildingPreviewController = new BuildingPreviewController();
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
		// Resize stage
		this.resize($stage, width, height);
		
		// Resize stage layers
		this.resize($cityCanvas, width, height);
		this.resize($cityCanvasStatus, width, height);
		this.resize($buildingPreview, width, height);
		this.resize($userInterface, width, height);
		
		// Reset building preview layer
		stage.buildingPreviewController.resetLayer(width, height);
		
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
			
			//=============================================
			// Stop animation
			
			// Stop city animation
			stage.cityCanvasController.stopAnimation();
			
			// Stop building animation
			stage.buildingCanvasController.stopAnimation();
			
			//=============================================
			// Make city bounds, delta lat/lng and cneter
			if (city.south === undefined) {
				cityUtil.updateCityBounds(city);
			}
			
			//=============================================
			// Generate buildings
			
			// Init building scene
			//stage.buildingCanvasController.rebuild();
			
			// Generate
			if (!city.geometries) {
				for (let feature of city.geo.features) {
					//-----------------------------------------
					// Generate building mesh
					
					let building = new Building(feature, city);
					let type = feature.properties.type;
					let fid = feature.properties.fid;
					let amount = building.height;
					
					let geometry = new THREE.ExtrudeGeometry(building.shape, {
						amount,
						bevelThickness: 0.1,
						bevelSize: 0.1,
						bevelSegments: 1,
						bevelEnabled: true,
						curveSegments: 1,
						steps: 1
					});
					
					let mesh = new THREE.Mesh(geometry, null);
					
					// Elevation
					let elevation = heightPredictionUtil.getElevation(building, city);
					mesh.position.z += elevation;
					
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
					// Merge building mesh to city mesh
					
					if (!city.geometries) {
						city.geometries = {};
					}
					
					if (!city.geometries[type]) {
						city.geometries[type] = new THREE.Geometry();
					}
					
					city.geometries[type].mergeMesh(mesh);
				}
			}
			
			//=============================================
			// Add merged geometry to city canvas
			
			// Init city scene
			stage.cityCanvasController.rebuild(city);
			
			// Add mesh
			for (let type in city.geometries) {
				let color;
				
				// Calc normals
				city.geometries[type].computeVertexNormals();
				
				// Convert string to number for switch
				type = parseInt(type);
				
				switch (type) {
					case 0:
						color = 0xffec47;
						break;
					case 1:
						color = 0x618e34;
						break;
					case 2:
						color = 0xeb6101;
						break;
					case 3:
						color = 0xa0d8ef;
						break;
				}
				
				let material = new THREE.MeshPhongMaterial({
					color: 0x333333,
					emissive: color,
					emissiveIntensity: 0.2,
					reflectivity: 0.7,
					envMap: stage.cityCanvasController.envMap,
				});
				
				let cityMesh = new THREE.Mesh(city.geometries[type], material);
				
				// Save mesh
				if (!city.meshes) {
					city.meshes = {};
				}
				city.meshes[type] = cityMesh;
				
				// Add mesh to scene
				stage.cityCanvasController.scene.add(cityMesh);
			}
			
			stage.cityCanvasController.animate();
		});
	}
}
