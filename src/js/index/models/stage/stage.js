import StageController from '../../controllers/stage/StageController';
import MapController from '../../controllers/map/MapController';
import { $map } from '../../models/stage/dom';

export default {
	// Controllers
	controller: new StageController(),
	mapController: new MapController($map),
	
	// Map object of Google maps
	map: null,
};
