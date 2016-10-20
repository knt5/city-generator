#!/bin/bash

srcDir="./converter"
dstDir="../assets/dat/"

# png
cp "$srcDir"/cities/*.png "$dstDir"

# GeoJSON
\ls "$srcDir"/cities/*.geojson | while read line
do
	node reduce-geojson.js "$line" > "$dstDir"/`basename "$line"`
done
