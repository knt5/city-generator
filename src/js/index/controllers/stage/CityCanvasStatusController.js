import {
	$cityCanvasStatus,
	$cityCanvasStatusText,
} from '../../models/stage/dom';

export default class CityCanvasStatusController {
	constructor() {
	}
	
	show(text, callback) {
		if (text === undefined) {
			text = '';
		}
		
		$cityCanvasStatusText.text(text);
		
		$cityCanvasStatus.css('display', 'table-cell');
		
		if (callback) {
			setTimeout(callback, 1);
		}
	}
	
	showFailedToLoad() {
		this.show('Failed to load, please reload the page.');
	}
	
	hide() {
		$cityCanvasStatus.css('display', 'none');
	}
}
