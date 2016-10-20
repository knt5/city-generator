#!/bin/bash

inputDir="cities"
outputDir="meta"

mkdir $outputDir

echo "{"
i=0
\ls $inputDir/*.dsm.asc | while read line
do
	# Camma
	if [ $i -ne 0 ]
	then
		echo ,
	fi
	
	# City name
	name=`basename "$line" | awk -F. '{print $1}'`
	echo "	'$name': {"
	
	# City DSM and DEM
	j=0
	for path in "$line" "$inputDir/$name.dem.asc"
	do
		# Comma
		if [ $j -ne 0 ]
		then
			echo ,
		fi
		
		# Key (dsm or dem)
		type=`basename "$path" | awk -F. '{print $2}'`
		echo "		$type: {"
		
		# Meta data of DSM/DEM
		k=0
		keys=("width" "height" "lng" "lat" "size")
		head -n 5 "$path" | while read row
		do
			echo -n "			${keys[k]}: "
			echo -n `echo "$row" | awk '{print $2}'`
			
			if [ $k -ne 4 ]
			then
				echo ,
			fi
			
			k=$((k + 1))
		done
		echo ""
		echo -n "		}"
		
		j=$((j + 1))
	done
	echo ""
	echo -n "	}"
	
	i=$((i + 1))
done

echo ""
echo "};"
