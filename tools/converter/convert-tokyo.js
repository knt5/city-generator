const glob = require('glob');
const path = require('path');
const convert = require('jpgis-convert');

// Parent directory
const parentDirectory = __dirname + '/../data/gsi-tokyo/building-peripheral-line/';

// Table of type name to id
const typeId = {
	'普通建物': 0,
	'堅ろう建物': 1,
	'普通無壁舎': 2,
	'堅ろう無壁舎': 3
};

// Get Directory list
const directories = glob.sync(parentDirectory + '*/');
let dirIndex = 0;

// Convert
convertFiles();
function convertFiles() {
	if (dirIndex < directories.length) {
		let dir = directories[dirIndex];
		let files = glob.sync(dir + '*BldA*.xml');
		let name = path.basename(dir).split('-')[2];
		
		convert(files, {
			output: name + '.geojson',
			typeId: typeId
		}, convertFiles);
		
		dirIndex ++;
	}
}
