import stage from '../../models/stage/stage';
import {
	$buildingCanvas,
} from '../../models/stage/dom';

let radius = 100;
let theta = -1;

export default class BuildingCanvasController {
	constructor() {
	}
	
	init() {
		//-------------------------------------------------
		// Scene
		this.scene = new THREE.Scene();
		this.scene.autoUpdate = false;
		this.scene.fog = new THREE.Fog(0xffffff, 100, 1200);
		
		// Camera
		this.camera = new THREE.PerspectiveCamera(45, $buildingCanvas.width() / $buildingCanvas.height(), 1, 1000);
		this.camera.position.set(radius/1.5, radius/1.5, radius);
		this.camera.lookAt(this.scene.position);
		
		// Renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize($buildingCanvas.width(), $buildingCanvas.height());
		$buildingCanvas.append(this.renderer.domElement);
		
		// Trackball
		this.trackball = new THREE.TrackballControls(this.camera, $buildingCanvas.get(0));
		this.trackball.staticMoving = true;
		
		// Directional light
		this.directionalLight = new THREE.DirectionalLight(0xffffff);
		this.directionalLight.position.set(0, 100, 20);
		this.directionalLight.castShadow = true;
		this.scene.add(this.directionalLight);
		
		// Ambient light
		this.ambientLight = new THREE.AmbientLight(0x999999);
		this.scene.add(this.ambientLight);
		
		// Axis helper
		this.axisHelper = new THREE.AxisHelper(120);
		this.scene.add(this.axisHelper);
		
		// Grid helper
		this.gridHelper = new THREE.GridHelper(50, 5);
		this.scene.add(this.gridHelper);
		
		// Start animation
		this.animate();
	}
	
	/**
	 *
	 */
	render() {
		let self = stage.buildingCanvasController;
		
		// Rotate
		theta += 0.4;
		//self.camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
		//self.camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
		//self.camera.lookAt(self.scene.position);
		
		self.trackball.update();
		
		self.scene.updateMatrixWorld();
		self.renderer.render(self.scene, self.camera);
	}
	
	/**
	 *
	 */
	animate() {
		let self = stage.buildingCanvasController;
		self.render();
		requestAnimationFrame(self.animate);
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
