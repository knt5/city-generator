#!/bin/bash

dir="cities"
srcDsm="../data/jaxa/dsm/N035E139/AVERAGE/N035E139_AVE_DSM.tif"
demDir="dem"

mkdir "$dir"

#----------------------------------------------------------
# Generate city
function generate() {
	src=$1
	name=$2
	bounds=$3
	
	# Generate GeoJSON
	ogr2ogr \
		-lco ENCODING=UTF-8 \
		-s_srs EPSG:4612 \
		-t_srs EPSG:4326 \
		-f 'GeoJSON' \
		-spat $bounds \
		"$dir/$name".geojson \
		"simplified/$src".shp
	
	# Convert bounds parameter for gdal_translate from ogr2ogr
	dsmBounds=`node get-ws-en.js "$dir/$name".geojson | awk '{print $1" "$4" "$3" "$2}'`
	
	# Convert DSM and DEM from GeoTIFF to asc and png
	for format in "AAIGrid asc" "PNG png"
	do
		formatName=`echo $format | awk '{print $1}'`
		formatSuffix=`echo $format | awk '{print $2}'`
		
		# Crop DSM
		gdal_translate \
			-projwin $dsmBounds \
			-of "$formatName" \
			"$srcDsm" \
			"$dir/$name.dsm.$formatSuffix"
		
		# Crop DEM
		gdal_translate \
			-projwin $dsmBounds \
			-of "$formatName" \
			"$demDir/$src.tif" \
			"$dir/$name.dem.$formatSuffix"
	done
}

#----------------------------------------------------------
# 533946

# Tokyo station
generate "533946" "tokyo" "139.76070 35.67466 139.77250 35.68854"

# Asakusa
generate "533946" "asakusa" "139.79531 35.70900 139.80209 35.71507"

# Tokyo sky tree
generate "533946" "tokyo-sky-tree" "139.80809 35.70418 139.81405 35.71232"

# Ueno
generate "533946" "ueno" "139.77095 35.71063 139.77996 35.72001"

# Tokyo dome
generate "533946" "tokyo-dome" "139.75002 35.70237 139.75844 35.70825"

# Tokyo university
generate "533946" "tokyo-university" "139.75974 35.70775 139.76753 35.71721"

#----------------------------------------------------------
# 533935

# Shibuya
generate "533935" "shibuya" "139.69755 35.65350 139.70729 35.66173"

#----------------------------------------------------------
# 533936

# Odaiba
generate "533936" "odaiba" "139.77082 35.61536 139.80103 35.63645"

#----------------------------------------------------------
# 533945

# Shinjuku
generate "533945" "shinjuku" "139.69067 35.68422 139.70301 35.69331"
