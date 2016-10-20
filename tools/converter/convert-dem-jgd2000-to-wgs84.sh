#!/bin/bash

dir="dem"

mkdir "$dir"

#----------------------------------------------------------
# Convert DEM from JGD2000 to WGS84
function convertDem() {
	srcDem=$1
	dstDem=$2
	
	gdalwarp \
		-s_srs EPSG:4612 \
		-t_srs EPSG:4326 \
		"$srcDem" \
		"$dstDem"
}

#----------------------------------------------------------
convertDem "../data/gsi-tokyo/dem/FG-GML-5339-35-DEM5A/merge.tif" "$dir/533935.tif"
convertDem "../data/gsi-tokyo/dem/FG-GML-5339-36-DEM5A/merge.tif" "$dir/533936.tif"
convertDem "../data/gsi-tokyo/dem/FG-GML-5339-45-DEM5A/merge.tif" "$dir/533945.tif"
convertDem "../data/gsi-tokyo/dem/FG-GML-5339-46-DEM5A/merge.tif" "$dir/533946.tif"
