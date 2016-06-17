import stage from '../../models/stage/stage';
import {
	$buildingCanvas,
} from '../../models/stage/dom';

let radius = 200;
//let theta = -1;

export default class BuildingCanvasController {
	constructor() {
	}
	
	init() {
		// Renderer
		if (this.renderer) {
			delete this.renderer;
		}
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize($buildingCanvas.width(), $buildingCanvas.height());
		$buildingCanvas.append(this.renderer.domElement);
		
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
		this.scene.fog = new THREE.Fog(0xffffff, 100, 800);
		
		// Camera
		if (this.camera) {
			delete this.camera;
		}
		this.camera = new THREE.PerspectiveCamera(45, $buildingCanvas.width() / $buildingCanvas.height(), 1, 1000);
		this.camera.position.set(0, -radius, radius/2);
		this.camera.lookAt(0);
		
		//-------------------------------------------------
		// Trackball
		if (this.trackball) {
			delete this.trackball;
		}
		this.trackball = new THREE.TrackballControls(this.camera, $buildingCanvas.get(0));
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
		this.axisHelper = new THREE.AxisHelper(120);
		this.scene.add(this.axisHelper);
		
		// Grid helper
		if (this.gridHelper) {
			delete this.gridHelper;
		}
		this.gridHelper = new THREE.GridHelper(50, 5);
		this.scene.add(this.gridHelper);
		
		//-------------------------------------------------
		// Start animation
		//this.animate();
	}
	
	/**
	 *
	 */
	render() {
		let self = stage.buildingCanvasController;
		
		// Rotate
		/*
		theta += 0.5;
		self.camera.position.x = radius * Math.cos(THREE.Math.degToRad(theta));
		self.camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta));
		//self.camera.lookAt(self.scene.position);
		//self.camera.lookAt(0);
		//*/
		
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
		let self = stage.buildingCanvasController;
		
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
	resize() {
		let width = $buildingCanvas.width();
		let height = $buildingCanvas.height();
		if (this.camera && this.renderer) {
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(width, height);
		}
	}
	
}
