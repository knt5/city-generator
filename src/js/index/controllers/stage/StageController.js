import {
	$stage,
	$cityCanvas,
	$cityCanvasStatus,
	$buildingGenerator,
	$userInterface
} from '../../models/stage/dom';

export default class StageController {
	resize($element, width, height) {
		$element.width(width);
		$element.height(height);
	}
	
	resizeStage(width, height) {
		// TODO: Check Facebook app or not and change the height
		
		// Resize stage
		this.resize($stage, width, height);
		
		// Resize stage children
		this.resize($cityCanvas, width, height);
		this.resize($cityCanvasStatus, width, height);
		this.resize($buildingGenerator, width, height);
		this.resize($userInterface, width, height);
	}
	
	
}
