import {
	$map,
	$buildingCanvas,
} from '../../models/stage/dom';

//=========================================================
const buildingCanvas = {
	borderWidth: 4,
	mobile: {
		widthBorder: 415,
		topDelta: 30,
	},
	default: {
		width: 600,
		height: 600,
		left: 16,
		top: 200,
		marginBottom: 16,
		minHeight: 60,
	},
};

let firstCallOfResetLayer = true;

//=========================================================
export default class BuildingPreviewController {
	constructor() {
	}
	
	/**
	 * Set absolute position of elements
	 */
	setPosition($element, left, top) {
		$element.css('left', left);
		$element.css('top', top);
	}
	
	/**
	 * Reset position and size of elements in this layer
	 */
	resetLayer(stageWidth, stageHeight) {
		let width;
		let height;
		let left;
		let top;
		
		//-------------------------------------------------
		// Width & left
		if (stageWidth < buildingCanvas.default.width) {
			width = stageWidth - buildingCanvas.borderWidth * 2;
			left = '0';
		} else {
			width = buildingCanvas.default.width;
			left = buildingCanvas.default.left + 'px';
		}
		
		//-------------------------------------------------
		// Height & top
		if (stageHeight < buildingCanvas.default.top + buildingCanvas.default.height) {
			height = stageHeight - buildingCanvas.default.top - buildingCanvas.borderWidth * 2;
			top = buildingCanvas.default.top;
		} else {
			height = buildingCanvas.default.height;
			top = buildingCanvas.default.top;
		}
		
		//-------------------------------------------------
		// Height & top on mobile
		if (stageWidth < buildingCanvas.mobile.widthBorder) {
			height -= $map.height() - buildingCanvas.mobile.topDelta;
			top -= buildingCanvas.mobile.topDelta;
		} else {
			height -= buildingCanvas.default.marginBottom;
		}
		
		//-------------------------------------------------
		// Set minimum height
		if (height < buildingCanvas.default.minHeight) {
			height = buildingCanvas.default.minHeight;
		}
		
		//-------------------------------------------------
		// Set size
		$buildingCanvas.width(width);
		$buildingCanvas.height(height);
		
		// Set position
		this.setPosition($buildingCanvas, left, top);
		
		//-------------------------------------------------
		// Set visibility
		if (firstCallOfResetLayer) {
			firstCallOfResetLayer = false;
			$buildingCanvas.css('display', 'block');
		}
	}
}
