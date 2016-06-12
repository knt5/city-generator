import stage from '../../models/stage/stage';
import {
	$cityCanvas,
} from '../../models/stage/dom';

let radius = 145;
let cameraHeight = 50;

export default class CityCanvasController {
	constructor() {
	}
	
	init() {
		// Renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize($cityCanvas.width(), $cityCanvas.height());
		$cityCanvas.append(this.renderer.domElement);
		
		// Build scene
		this.rebuild();
	}
	
	rebuild() {
		//-------------------------------------------------
		// Scene
		if (this.scene) {
			delete this.scene;
		}
		this.scene = new THREE.Scene();
		this.scene.autoUpdate = false;
		this.scene.fog = new THREE.Fog(0xffffff, 100, 1200);
		
		// Camera
		if (this.camera) {
			delete this.camera;
		}
		this.camera = new THREE.PerspectiveCamera(45, $cityCanvas.width() / $cityCanvas.height(), 1, 1000);
		this.camera.position.set(0, -radius, cameraHeight);
		this.camera.lookAt(this.scene.position);
		
		//-------------------------------------------------
		// Trackball
		if (this.trackball) {
			delete this.trackball;
		}
		this.trackball = new THREE.TrackballControls(this.camera, $cityCanvas.get(0));
		this.trackball.staticMoving = true;
		
		//-------------------------------------------------
		// Directional light
		if (this.directionalLight) {
			delete this.directionalLight;
		}
		this.directionalLight = new THREE.DirectionalLight(0xffffff);
		this.directionalLight.position.set(0, 100, 20);
		this.directionalLight.castShadow = true;
		this.scene.add(this.directionalLight);
		
		// Ambient light
		if (this.ambientLight) {
			delete this.ambientLight;
		}
		this.ambientLight = new THREE.AmbientLight(0x999999);
		this.scene.add(this.ambientLight);
		
		//-------------------------------------------------
		// Axis helper
		if (this.axisHelper) {
			delete this.axisHelper;
		}
		this.axisHelper = new THREE.AxisHelper(500);
		this.scene.add(this.axisHelper);
		
		// Grid helper
		if (this.gridHelper) {
			delete this.gridHelper;
		}
		this.gridHelper = new THREE.GridHelper(500, 5);
		this.scene.add(this.gridHelper);
		
		//-------------------------------------------------
		// Call render at first
		this.render();
		
		// Start animation
		//this.animate();
	}
	
	/**
	 *
	 */
	render() {
		let self = stage.cityCanvasController;
		
		// Control
		self.trackball.update();
		
		// Render
		self.scene.updateMatrixWorld();
		self.renderer.render(self.scene, self.camera);
	}
	
	/**
	 *
	 */
	animate() {
		let self = stage.cityCanvasController;
		self.render();
		
		if (self === this) {
			self.stopAnimationSignal = false;
		}
		
		if (!self.stopAnimationSignal) {
			requestAnimationFrame(self.animate);
		}
	}
	
	/**
	 *
	 */
	stopAnimation() {
		this.stopAnimationSignal = true;
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
