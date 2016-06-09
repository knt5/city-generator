//import app from '../../models/app/app';
import stage from '../../models/stage/stage';

export default class AppController {
	/**
	 * Setup application
	 */
	setup() {
		// Register init callback of Google maps
		window.initMap = () => {
			stage.mapController.init();
		};
		
		// Register window resize event handler
		$(window).on('resize', this.onResize);
		
		// Call onResize at first
		this.onResize();
	}
	
	/**
	 * Window resize event hanlder
	 */
	onResize() {
		let $window = $(window);
		let width = $window.width();
		let height = $window.height();
		
		stage.controller.resizeStage(width, height);
	}
};
