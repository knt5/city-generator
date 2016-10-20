#!/bin/bash

dir=simplified

mkdir "$dir"

\ls *.geojson | while read line
do
	name=`basename $line .geojson`
	
	ogr2ogr \
		-where 'OGR_GEOM_AREA > 0.0000000025' \
		-lco ENCODING=UTF-8 \
		-s_srs EPSG:4612 \
		-t_srs EPSG:4612 \
		-f 'ESRI Shapefile' \
		-simplify 0.00001 \
		"$dir/$name".shp \
		"$name".geojson
done
