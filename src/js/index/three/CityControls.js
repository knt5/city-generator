const border = {
	positionZ: 30,
	minZ: 1,
};

export default class CityControls {
	
	constructor($element) {
		this.$element = $element;
	}
	
	init() {
		this.$element.on('mousedown', this.mousedown.bind(this));
		this.$element.on('mouseup', this.mouseup.bind(this));
		this.$element.on('mousemove', this.mousemove.bind(this));
		
		this.$element.on('mousewheel', this.mousewheel.bind(this));
		
		this.$element.on('touchstart', this.touchstart.bind(this));
		this.$element.on('touchend', this.touchend.bind(this));
		this.$element.on('touchcancel', this.touchend.bind(this));
		this.$element.on('touchmove', this.touchmove.bind(this));
		
		this.$element.on('gesturestart', this.gesturestart.bind(this));
		this.$element.on('gestureend', this.gestureend.bind(this));
		this.$element.on('gesturechange', this.gesturechange.bind(this));
		
		this.handlingGesture = false;
	}
	
	dispose() {
		this.$element.off('mousedown');
		this.$element.off('mousemove');
		this.$element.off('mouseup');
		
		this.$element.off('mousewheel');
		
		this.$element.off('touchstart');
		this.$element.off('touchend');
		this.$element.off('touchcancel');
		this.$element.off('touchmove');
		
		this.$element.off('gesturestart');
		this.$element.off('gestureend');
		this.$element.off('gesturechange');
	}
	
	setCamera(camera) {
		this.camera = camera;
		
		this.prevX = -1;
		this.prevY = -1;
		
		this.firstY = this.camera.position.y;
		this.firstZ = this.camera.position.z;
		this.firstYZRate = this.firstY / this.firstZ;
		
		this.firstRotationX = this.camera.rotation.x;
	}
	
	setCameraPosition(x, y) {
		this.camera.position.x = x;
		this.camera.position.y = this.camera.position.z * this.firstYZRate + y;
	}
	
	update() {
	}
	
	//=====================================================
	mousedown(event) {
		if (event.buttons & 1) {
			this.prevX = event.offsetX;
			this.prevY = event.offsetY;
		}
		
		return false;
	}
	
	//=====================================================
	mouseup() {
		return false;
	}
	
	//=====================================================
	mousemove(event) {
		let x, y;
		
		if (event.type === 'touchmove') {
			if (event.touches) {
				const touch = event.touches[0];
				x = touch.clientX - touch.target.offsetLeft;
				y = touch.clientY - touch.target.offsetTop;
			}
			
		} else if (event.type === 'mousemove') {
			if (event.buttons & 1) {
				x = event.offsetX;
				y = event.offsetY;
			}
		}
		
		// Move
		if (x !== undefined) {
			let velocity = this.camera.position.z / border.positionZ;
			
			if (velocity < 2) {
				velocity = 2;
			}
			
			this.camera.position.x -= (x - this.prevX) / 10 * velocity;
			this.camera.position.y += (y - this.prevY) / 10 * velocity;
			
			this.prevX = x;
			this.prevY = y;
		}
		
		return false;
	}
	
	//=====================================================
	mousewheel(event) {
		let z, y;
		
		// from gesturechange
		if (event.originalEvent.scale !== undefined) {
			// Position
			z = this.gestureStartCameraZ / event.originalEvent.scale;
			y = z * this.firstYZRate;
			
		} else if (event.originalEvent.deltaY != 0) {  // -0, 0
			// Position
			z = this.camera.position.z + event.originalEvent.deltaY / 10;
			y = this.camera.position.y + event.originalEvent.deltaY / 10 * this.firstYZRate;
		}
		
		if (z !== undefined) {
			// Position
			if (z < border.minZ) {
				z = border.minZ;
				//y = z * this.firstYZRate;
				this.camera.position.z = z;
			} else {
				this.camera.position.z = z;
				this.camera.position.y = y;
			}
			
			// Rotation
			if (z < 5 + border.minZ) {
				this.camera.rotation.x = (Math.PI / 2) -
					(Math.PI / 2 - this.firstRotationX) * ((z - border.minZ) / 5);
			} else {
				this.camera.rotation.x = this.firstRotationX;
			}
		}
		
		return false;
	}
	
	//=====================================================
	touchstart(event) {
		if (event.touches) {
			const touch = event.touches[0];
			this.prevX = touch.clientX - touch.target.offsetLeft;
			this.prevY = touch.clientY - touch.target.offsetTop;
		}
	}
	
	//=====================================================
	touchend() {
	}
	
	//=====================================================
	touchmove(event) {
		if (!this.handlingGesture) {
			this.mousemove(event);
		}
		
		return false;
	}
	
	//=====================================================
	gesturestart() {
		this.gestureStartCameraZ = this.camera.position.z;
		this.handlingGesture = true;
	}
	
	//=====================================================
	gestureend() {
		setTimeout(() => {
			this.handlingGesture = false;
		}, 200);
	}
	
	//=====================================================
	gesturechange(event) {
		this.mousewheel(event);
		
		return false;
	}
}
