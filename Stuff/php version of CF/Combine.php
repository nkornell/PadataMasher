<?php
if (!isset ($_SESSION)) session_start();
?>
<!-- 
Note: by default php allows only 20 files to be uploaded. To change this you have to change the php.ini file, which is called phprc on Dreamhost. 
I added the line "max_file_uploads = 1000" (without the quotes) to phprc, which I found in ftp.pincub.com/.php/7.0/. 
You have to show invisible files in Forklift, or whatever, to see the .php folder. And if you're not running php 7.0, use a different folder.
https://help.dreamhost.com/hc/en-us/articles/214894037-How-do-I-create-a-phprc-file-via-FTP-
-->
<html>
<head>

<link rel="stylesheet" href="mystyle.css">

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

<script>

// Modified from https://www.w3schools.com/php/php_ajax_php.asp
// This function gets a string as input and then it opens another page using that string as a parameter in the URL. 
// The launched page isn't displayed but it does its job and whatever it echos is shown in the span id=downloadLinks below.
// I don't really understand some/most of how it does this stuff. 
function showLinks(str) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("downloadLinks").innerHTML = this.responseText;
		}
	};
	xmlhttp.open("GET", "CombineSaver.php?q=" + str +"&sNames=" + figureOutBoxes(), true); // dfd figureOutBoxes returns an array that ends up being delimited by commas later. either change that or make it work when a filename contains a comma. 
	xmlhttp.send();
}

// Look at all of the checkboxes. Return the value (i.e., the sName) of each of the ones that is checked. 
function figureOutBoxes() {
	var values = []
	$("[name='checkboxvar[]']:checked").each(function () { // this gives us what they're called if they're checked
		values.push($(this).val());
// 		alert($(this).val());
	});
	return values; // returns an array containing the sName of each checked box
}

// Clear downloadlinks. This is called when a checkbox is clicked, so that they have to press compute again for the links to show up. 
function clearLinks() {
	document.getElementById("downloadLinks").innerHTML = "";
}

</script>

</head>

<body>

<?php
include 'myFunctions.php';
ini_set("auto_detect_line_endings", true);
$allowed = array('txt','csv','tsv'); // add as many others as you like
$uploadFolderName = "uploaded";
$tableNotes = array();
$bottomNotes = "";


// --Get file input --//


if (isset($_POST['submit'])){
	if (count($_FILES['filesToUpload']['name']) > 0){
		//Loop through each file
		for ($i=0; $i<count($_FILES['filesToUpload']['name']); $i++) {
			//Get the temp file path (this is a storage address assigned to it until you give it one with move_uploaded_file, I think)
			$tmpFilePath = $_FILES['filesToUpload']['tmp_name'][$i];

			//Make sure we have a filepath
			if($tmpFilePath != "") {
			
				//save the filename
				$shortname = $_FILES['filesToUpload']['name'][$i];
				
				// make sure it's a text file
				$ext = pathinfo($shortname, PATHINFO_EXTENSION);
				if (!in_array($ext,$allowed) ) {
					echo '<h2>Could not open non-text file: ' . $shortname . "</h2>";
					echo '<hr>';
				} else {

					//save the url and the file
					$filePath = $uploadFolderName . "/" . date('Y-m-d-H-i-s').'-'.$_FILES['filesToUpload']['name'][$i];

					//Upload the file into your filename 
					if(move_uploaded_file($tmpFilePath, $filePath)) {
						$fileShortname[] = $shortname;
						$fileData[$shortname] = file_get_contents($filePath);
						//$fileDateModified[] =  date("Y m-d h:i a",filemtime($filePath));
					}
				}
			}
		}
	}
}


// dfd to do

// Change last column to num col name rows, add notes column after
// Maybe make it identify commonalities among rows that are the wrong number of columns? 

// Maybe put in a thing that tells you which columns are invariant (across everyone) and lets you remove them if you wish. 


// Make it put all the uploads from this session in the same folder. 
// -- Name it the date/time thing plus the name of the first file. Create a session variable called folderpath.
// -- Have downloads in there too. That way you don't have to add the firstfilename to the name of the output files and there won't be a chance of overlap. 
 



// --- process data --- //	


if (is_array($fileShortname)){
	foreach ($fileShortname as $sName) { 
		// Figure out (and then clean up) line endings
		$lineEnding[] = mostFrequentCharacter(array("\r\n","\r","\n"), $fileData[$sName]);
		$fileData[$sName] = str_replace(array("\r\n", "\r"), "\n", $fileData[$sName]);

		// Figure out delimiter
		$dl[$sName] = mostFrequentCharacter(array("\t",",",";"), $fileData[$sName]);
		switch ($dl[$sName]) {
			case ",":
				if (strpos($sName, '.csv') == false) {
					$bottomNotes .= "Delimiters (,) mismatch filename in ".$sName.".<br>";
				}
				break;
			default:
				if (strpos($sName, '.csv') !== false) {
					$bottomNotes .= "Delimiters (".specialStringsInEnglish($dl[$sName]).") mismatch filename in ".$sName.".<br>";
				}
				break;
		}

		// Figure out what's in the first row
		$_SESSION['rowArray'][$sName] = churn($fileData[$sName], $dl[$sName]); // Encode rowArray
		$firstRow[] = $_SESSION['rowArray'][$sName][0]; // Encode first row, which I assume to be column names
	}
}

$_SESSION['lineEnding'] = mostCommonValue($lineEnding, 0);
$_SESSION['columnNames'] = mostCommonValue($firstRow, .5); // note, last I checked, if it can't find column names it still works
$_SESSION['delimiter'] = mostCommonValue($dl, 0);

// Figure out the typical number of rows containing column names
foreach ($fileShortname as $sName) {
	$rowsOfColumnNamesCount[$sName] = substr_count ( implode( ',', $_SESSION['rowArray'][$sName]), $_SESSION['columnNames']);
}
$typical['numColumnNameSets'] = mostCommonValue($rowsOfColumnNamesCount, .2);

// Clean up rowArray, process info about its contents. 
foreach ($fileShortname as $sName) {
	// create  this variable if it doesn't exist
	if (array_key_exists($sName, $tableNotes) == false) {
		$tableNotes[$sName] = "";
	}
	// keep track of which ones have the wrong number of rows containing column names
	if ($rowsOfColumnNamesCount[$sName] !== $typical['numColumnNameSets']) {
		$tableNotes[$sName] .= $rowsOfColumnNamesCount[$sName]." rows of column names (".$typical['numColumnNameSets']." expected).<br>"; // Make note of files with the wrong number of columnName rows. 
	}
	// put in warning if the delimiters are wrong relative to the other files. 
	if ($dl[$sName] !== $_SESSION['delimiter']) {

		$bottomNotes .= "<span style='color:red'>Problem with file: ".$sName." </span>: This file's delimiters (".specialStringsInEnglish($dl[$sName]).") mismatch the delimiter that will be used in the output file (".specialStringsInEnglish($_SESSION['delimiter'])."). This file's data will not appear in separate columns in the output file.<br>";
	}
		
	$_SESSION['rowArray'][$sName] = array_diff($_SESSION['rowArray'][$sName], array($_SESSION['columnNames']) ); // Remove all column names from rowArray
	$rowCount[] = count($_SESSION['rowArray'][$sName]); // Count rows
	processNumberOfColumns($_SESSION['rowArray'][$sName], $dl[$sName], $columnCount[], $deviantRowCount[]); // Count deviant rows
}

// Figure out some more typical values. 
$typical['numRows'] = mostCommonValue($rowCount, .2);
$_SESSION['numColumns'] = mostCommonValue($columnCount, .2);
$typical['numDeviantRows'] = mostCommonValue($deviantRowCount, .2);


// --- write output --- //

echo '<form action="CombineSaver.php" target="saver" method="post">';
// Table headers
echo '<table id="myTable"><tr>';
echo '<th onclick="sortTable(0)">Include</th>'; // I'd like to be able to allow sorting with this so I could arrange by rows and copy the excluded list. I haven't tried to figure it out yet. If I do make it work, put in the little arrows in the column header. If I don't, try to make a list of excluded files appear below.  
echo '<th onclick="sortTable(1)">File name &#8693</th>';
echo '<th onclick="sortTable(2)">Columns &#8693</th>';
echo '<th onclick="sortTable(3)">Rows &#8693</th>';
echo '<th onclick="sortTable(4)">Deviant rows &#8693</th>';
echo '<th onclick="sortTable(5)">Notes &#8693</th>';
echo '</tr>';
// Actual content of rows
for ($i=0; $i<=count($fileShortname)-1; $i++) {	
	echo "<tr>";
	echo "<td><input type='checkbox' name='checkboxvar[]' value='$fileShortname[$i]' onclick='clearLinks()' checked></td>";
	echo "<td>" . $fileShortname[$i] . "</td>";
	echo "<td style='background-color:". deviationColoration($columnCount[$i], $_SESSION['numColumns']) . "'>" . $columnCount[$i] . "</td>";
	echo "<td style='background-color:". deviationColoration($rowCount[$i], $typical['numRows']) . "'>" . $rowCount[$i] . "</td>";
	echo "<td style='background-color:". deviationColoration($deviantRowCount[$i], $typical['numDeviantRows']) . "'>" . $deviantRowCount[$i] . "</td>";
	echo "<td>" . $tableNotes[$fileShortname[$i]] . "</td>";	
	echo "</tr>";
}
echo "</table>";
// echo "<p><i>Note: In the table above, only atypical values are shown.<br>";
echo "<p>'Deviant' rows have an atypical (for that file) number of columns.</i></p>";
if (strlen($bottomNotes) > 0) {
echo "<hr>";
	echo "Notes:<br>".$bottomNotes."</p>";
	echo "<hr>";
}

?>

<input type="button" value="Combine into one file" onclick="showLinks('OneFile')">
<input type="button" value="Combine into separate files" onclick="showLinks('TwoFiles')">

<p><span id="downloadLinks"></span></p>

</form>


<!-- 
// Sort columns. This is from:
https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sort_table_desc
 -->
<script>
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc"; 
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /*Loop through all table rows (except the
    first two, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
       	if ( isNaN(x.innerHTML.toLowerCase()) == false && isNaN(y.innerHTML.toLowerCase()) == false ) {
	       	/*if the values are both numerical, sort based on their numeric values*/
      		if ( parseFloat(x.innerHTML.toLowerCase()) > parseFloat(y.innerHTML.toLowerCase()) ) {
      			shouldSwitch = true;
      			break;
      		}
       	} else {
       		/*otherwise sort based on string value*/
			if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
			  shouldSwitch= true;
			  break;
			}
         }
      } else if (dir == "desc") {
       	if ( isNaN(x.innerHTML.toLowerCase()) == false && isNaN(y.innerHTML.toLowerCase()) == false ) {
	       	/*if the values are both numerical, sort based on their numeric values*/
      		if ( parseFloat(x.innerHTML.toLowerCase()) < parseFloat(y.innerHTML.toLowerCase()) ) {
      			shouldSwitch = true;
      			break;
      		}
       	} else {
       		/*otherwise sort based on string value*/
			if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
			  shouldSwitch= true;
			  break;
			}
		}
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;      
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
</script>

</body>
</html>