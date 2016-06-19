import stage from 'index/models/stage/stage';
import Building from 'index/models/stage/Building';
import projectionUtil from './projectionUtil';
import heightPredictionUtil from './heightPredictionUtil';

export default {
	updateCity(city) {
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
			
			// Generate ground mesh
			let groundGeometry = new THREE.BoxGeometry(deltaX * 2, deltaY * 2, 0.5);
			let groundMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
			let groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
			city.ground = {
				mesh: groundMesh
			};
		}
	},
	
	addCityToScene(city) {
		generateCityGeometries(city);
		generateCityMeshes(city);
		addCityMeshesToScene(city);
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

//=========================================================

function generateCityGeometries(city) {
	if (!city.geometries) {
		city.geometries = {};
		
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
			
			city.buildings[fid] = building;
			
			/*
			if (!city.buildings[fid]) {
				city.buildings[fid] = {};
			}
			
			city.buildings[fid].mesh = mesh;
			*/
			
			//-----------------------------------------
			// Merge building mesh to city mesh
			
			if (!city.geometries[type]) {
				city.geometries[type] = new THREE.Geometry();
			}
			
			city.geometries[type].mergeMesh(mesh);
		}
	}
}

function generateCityMeshes(city) {
	//-----------------------------------------------------
	// Add merged geometry to city canvas
	if (!city.meshes) {
		city.meshes = {};
		
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
			city.meshes[type] = cityMesh;
		}
	}
}

function addCityMeshesToScene(city) {
	if (city.meshes) {
		for (let type in city.meshes) {
			// Add mesh to scene
			stage.cityCanvasController.scene.add(city.meshes[type]);
		}
	}
}
