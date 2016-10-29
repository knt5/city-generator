const glob = require('glob');
const path = require('path');
const convert = require('jpgis-convert');

// Parent directory
const parentDirectory = __dirname + '/../data/gsi-tokyo/building-peripheral-line/';

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
		}, convertFiles);
		
		dirIndex ++;
	}
}
