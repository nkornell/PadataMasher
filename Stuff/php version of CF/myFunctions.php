<?php

function churn($input, $dl) { 
	$returnArray = str_replace($dl."\n", "\n", $input); // get rid of extra columns that aren't trim-able
	$returnArray = explode("\n", $returnArray);
	$returnArray = array_map('trim',$returnArray); // Trim. (Tabs should already be gone, but not other invisibles.)
	$returnArray = array_diff($returnArray, [""]); // Remove blank elements in the array. 
	return $returnArray; 
}

function mostFrequentCharacter($needleList, $haystack) {
	// Needle should be an array of strings (I'm using it for characters).
	// Note: In case of a tie, max returns whichever was provided to it first. 
	foreach ($needleList as $needle) {
	  	$valCounter[$needle] = substr_count($haystack, $needle);
	}
	return array_search(max($valCounter), $valCounter);
}

function mostCommonValue($input, $minProportion) {
	// Input parameter is an array.		
	$valCounter = array_count_values($input);
	$maxValCount = max($valCounter);
	if ($maxValCount/count($input) > $minProportion) { // If it accounts for more than $minProportion of the values...
		return array_search($maxValCount, $valCounter); // Return the most common value in the array.
	} else {
		return "NOT FOUND";
	}
}

function processNumberOfColumns($input, $dl, &$mostCommonColumnCount, &$numDeviantRows) {
	$counter = array();
	foreach($input as $line) {
		$cols = substr_count($line, $dl);
		if (array_key_exists($cols, $counter) == false) {
			$counter[$cols] = 0;
		}
		$counter[$cols]++;
	}
	$maxColumnCount = max($counter);
	$numDeviantRows = count($input) - $maxColumnCount;
	$mostCommonColumnCount = array_search($maxColumnCount, $counter);
}

function deviationColoration($actual, $expected) {
	$diff = $expected - $actual;
	$increment = 20; // subtract this value for each integer of differene
	$colorFloor = 100; // none of the three can go below this value
	if ($actual == $expected) {
		// white
		return "rgb(255,255,255)";
	} elseif ($actual < $expected) {
		// blue
		$red = max($colorFloor, 255 - $diff*$increment);
		$green = max($colorFloor, 255 - $diff*$increment);
		return "rgb(".$red.",".$green.",255)";
	} else {
		// red
		$blue = max($colorFloor, 255 - abs($diff*$increment));
		$green = max($colorFloor, 255 - abs($diff*$increment));
		return "rgb(255,".$green.",".$blue.")";
	}
}

function specialStringsInEnglish($input) {
	switch ($input) {
		case "\r\n":
			return "windows (\\r\\n)";
		case "\r":
			return "macintosh (\\r)";
		case "\n":
			return "linux (\\n)";
		case "\t":
			return "tab";
		default:
			return $input;
	}
}

function beautifulOutput($input) {
	foreach ($input as $r) {
		if (strlen($r) == 0) {
			echo "<p>********************************************************<br>";
		} else {
			echo $r."<br>";
		}
	}
}

?>
