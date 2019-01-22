<?php
if (!isset ($_SESSION)) session_start();

// get the q parameter from URL
$input = $_REQUEST["q"];
$sNameList = explode(",", $_REQUEST["sNames"]);
// print_r ($sNameList);
// echo  "<br>";


include 'myFunctions.php';
$outputDeviantLines = "";

$output = $_SESSION['columnNames'] . $_SESSION['lineEnding']; // start by adding column names at the start of output

// --Put data in the output variables-- //

// if (isset($_POST['checkboxvar'])) {
 	foreach ($sNameList as $sName) {
	// For each of the filenames that was checked on the previous page...
 		$sName = trim($sName);
		//if (isset($_POST['makeTwoFiles'])) { 
		if ($input == "TwoFiles") {
			// If the checkbox for splitting into 2 files was checked...
 			$typicalRows = array();
 			$deviantRows = array();
 			// add typical rows to one variable, deviant rows to another
 			foreach ($_SESSION['rowArray'][$sName] as $line) {
 				if (substr_count($line, $_SESSION['delimiter']) == $_SESSION['numColumns']) {
 					$typicalRows[] = $line;
 				} else {
 					$deviantRows[] = $line;
 				}
 			}
 			// if there are typical rows, record them in output
 			if (count($typicalRows) > 0) {
	 			$output .= implode($_SESSION['lineEnding'], $typicalRows) . $_SESSION['lineEnding'];
	 		}
	 		// if there are deviant rows, record them in outputDeviantLines
	 		if (count($deviantRows) > 0) {
	 			$outputDeviantLines .= implode($_SESSION['lineEnding'], $deviantRows) . $_SESSION['lineEnding'];
	 		}
 		} else {
 			// If the checkbox for splitting into 2 files was NOT checked...
 			$output .= implode($_SESSION['lineEnding'], $_SESSION['rowArray'][$sName]) . $_SESSION['lineEnding'];
 		}
 	}
// }

// Output some summary info. 
// : Maybe report total rows, columnNames, files included, files not included, whether there were mixed delimiters, etc? 


// --Choose a filename-- //

// Figure out the name of the first file, to use at the end of the filename
$firstFileName = trim(str_replace(" ","",$sNameList[0])); // trim and strip out spaces
$firstFileName = pathinfo($firstFileName, PATHINFO_FILENAME); // returns the filename without its extension

// Figure out extension
if ($_SESSION['delimiter'] == "\t") {
	$ext = ".tsv";
} elseif ($_SESSION['delimiter'] == ",") {
	$ext = ".csv";
} else {
	$ext = ".txt";
}

// Figure out actual filename.
if (strlen($outputDeviantLines) == 0) {
	// if there is just one output file
	$filePath = "downloaded/" . date('Y-m-d-H-i-s') . "-all_rows-" . $firstFileName . $ext;
} else {
	// if there are 2 output files
	$filePath = "downloaded/" . date('Y-m-d-H-i-s') . "-typical_rows-" . $firstFileName . $ext;
	$filePathDeviant = "downloaded/" . date('Y-m-d-H-i-s') . "-deviant_rows-" . $firstFileName . $ext;
}

// Make and write to the file we want on the server. They download it by clicking the link. 

$file = fopen($filePath,"w");
fwrite($file,$output);
fclose($file);

// Make and write to the deviant-rows file. 
if (strlen($outputDeviantLines) > 0) {
	$file = fopen($filePathDeviant,"w");
	fwrite($file,$outputDeviantLines);
	fclose($file);
}

// Show links so they can download the files. 
if (strlen($outputDeviantLines) == 0) {
// 	echo '<meta http-equiv="refresh" content=".1;URL='.$filePath.'">';
	echo '<h2>Your file is ready!</h2>';
	echo '<p><a href="'.$filePath.'" download>Download your file.</a></p>';
} else {
	echo '<h2>Your files are ready!</h2>';
	echo '<p><a href="'.$filePath.'" download>Download your typical-rows file.</a></p>';
	echo '<p><a href="'.$filePathDeviant.'" download>Download your deviant-rows file.</a></p>';
}
// echo "<h3>Files included:</h3>";
// foreach ($sNameList as $sName) {
// 	echo $sName . "<br>";
// }


?>

















