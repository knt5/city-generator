import stage from 'index/models/stage/stage';
import {
	$cityCanvas,
	$rotationCheckbox,
} from 'index/models/stage/dom';
import deviceUtil from 'index/utils/deviceUtil';
//import GridHelper from 'index/three/GridHelper';
import CityControls from 'index/three/CityControls';

let theta = Math.PI;

export default class CityCanvasController {
	constructor() {
		this.rotationChecked = $rotationCheckbox.prop('checked');
	}
	
	init() {
		// Renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize($cityCanvas.width(), $cityCanvas.height());
		this.renderer.setPixelRatio(deviceUtil.getPixelRatio());
		$cityCanvas.append(this.renderer.domElement);
		
		// Generate EnvMap
		const cubeTextureLoader = new THREE.CubeTextureLoader();
		cubeTextureLoader.load([
			'assets/img/env/top-right.png',  // left is left
			'assets/img/env/top-right.png',  // right is right
			'assets/img/env/bottom-right.png',  // top is back
			'assets/img/env/black.png',  // bottom is front
			'assets/img/env/black.png',  // back is bottom
			'assets/img/env/black.png',  // front is top
		], (texture) => {
			this.envMap = texture;
		});
		
		// CityControls
		this.cityControls = new CityControls($cityCanvas);
		
		// Build scene
		//this.rebuild();
	}
	
	rebuild(city) {
		//-------------------------------------------------
		// Save the city
		this.city = city;
		
		//-------------------------------------------------
		// Scene
		if (this.scene) {
			delete this.scene;
		}
		this.scene = new THREE.Scene();
		this.scene.autoUpdate = false;
		this.scene.fog = new THREE.Fog(0xffffff, 10, 500);
		
		// Camera
		if (this.camera) {
			delete this.camera;
		}
		this.camera = new THREE.PerspectiveCamera(45, $cityCanvas.width() / $cityCanvas.height(), 1, 1000);
		this.camera.position.set(0, -50, 50);
		this.camera.lookAt(this.scene.position);
		
		//-------------------------------------------------
		// Ground mesh
		this.scene.add(this.city.ground.mesh);
		
		//-------------------------------------------------
		// Controls
		this.changeControls();
		
		//-------------------------------------------------
		// Directional light
		if (this.directionalLight) {
			delete this.directionalLight;
		}
		this.directionalLight = new THREE.DirectionalLight(0xffffff, 3);
		this.directionalLight.position.set(-80, 100, 200);
		//this.directionalLight.castShadow = true;
		this.scene.add(this.directionalLight);
		
		// East
		if (this.eastDirectionalLight) {
			delete this.eastDirectionalLight;
		}
		this.eastDirectionalLight = new THREE.DirectionalLight(0xf19072, 2);
		this.eastDirectionalLight.position.set(80, 20, 80);
		this.scene.add(this.eastDirectionalLight);
		
		// West
		if (this.westDirectionalLight) {
			delete this.westDirectionalLight;
		}
		this.westDirectionalLight = new THREE.DirectionalLight(0xe7e7eb, 2);
		this.westDirectionalLight.position.set(80, 20, 80);
		this.scene.add(this.westDirectionalLight);
		
		//-------------------------------------------------
		// Ambient light
		if (this.ambientLight) {
			delete this.ambientLight;
		}
		//this.ambientLight = new THREE.AmbientLight(0x999999);
		this.ambientLight = new THREE.AmbientLight(0xffffff);
		this.scene.add(this.ambientLight);
		
		//-------------------------------------------------
		// Axis helper
		/*
		if (this.axisHelper) {
			delete this.axisHelper;
		}
		this.axisHelper = new THREE.AxisHelper(500);
		this.scene.add(this.axisHelper);
		//*/
		
		// Grid helper
		/*
		if (this.gridHelper) {
			delete this.gridHelper;
		}
		if (this.city) {
			this.gridHelper = new GridHelper(this.city.bounds.end.x, this.city.bounds.end.y, 2);
		} else {
			this.gridHelper = new GridHelper(100, 100, 2);
		}
		this.scene.add(this.gridHelper);
		//*/
		
		// Directional Light Helper
		/*
		this.directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight);
		this.scene.add(this.directionalLightHelper);
		*/
		
		//-------------------------------------------------
		// Call render at first
		this.render();
		
		// Start animation
		//this.animate();
	}
	
	/**
	 *
	 */
	changeControls() {
		this.rotationChecked = $rotationCheckbox.prop('checked');
		
		if (this.rotationChecked) {
			// CityControls
			this.cityControls.dispose();
			
			// TrackballControls
			if (this.trackball) {
				this.trackball.dispose();
				delete this.trackball;
			}
			this.trackball = new THREE.TrackballControls(this.camera, $cityCanvas.get(0));
			this.trackball.staticMoving = true;
			
		} else {
			// TrackballControls
			if (this.trackball) {
				this.trackball.dispose();
				delete this.trackball;
			}
			
			// CityControls
			this.cityControls.init();
			this.cityControls.setCamera(this.camera);
		}
	}
	
	/**
	 *
	 */
	render() {
		let self = stage.cityCanvasController;
		
		// Controls
		if (this.rotationChecked) {
			self.trackball.update();
		} else {
			self.cityControls.update();
		}
		
		// Render
		self.scene.updateMatrixWorld();
		self.renderer.render(self.scene, self.camera);
	}
	
	/**
	 *
	 */
	animate() {
		let self = stage.cityCanvasController;
		
		theta += 0.01;
		
		for (let type in self.city.meshes) {
			let intensity = Math.cos(theta + parseInt(type) * 1.5) * 0.8;
			if (type === 1) {
				if (intensity < 0) {
					intensity = 0;
				}
			} else {
				intensity = Math.abs(intensity);
			}
			self.city.meshes[type].material.emissiveIntensity = intensity;
		}
		
		self.render();
		
		if (!self.stopAnimationSignal) {
			self.requestId = requestAnimationFrame(self.animate);
		}
	}
	
	/**
	 *
	 */
	stopAnimation() {
		let self = stage.cityCanvasController;
		
		if (self.requestId) {
			cancelAnimationFrame(self.requestId);
		}
	}
	
	/**
	 *
	 */
	resize(width, height) {
		if (this.camera && this.renderer) {
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(width, height);
		}
	}
}
