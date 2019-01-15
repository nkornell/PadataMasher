//program 1: add to the database
// give it a list of references. 
// for each
	// identify it
	// 	give a message if you can't
	// 	next
	// check if it's in the database
	// 	if it is
	// 		update date added
	// 		add it to some list that's displayed on screen
	// 	else
	// 		add it to the database
	// 		display it on screen
	// end if

// Program 2: crunch the numbers
// 	Figure out the list of citees that exist in the database. 
// 	Display a list of citees? Or have them type them in a box
// 	choose which citees you want to compare
// 		put the originals in one box 
// 		put the replications in another
// 	it goes through the database
// 		figures out spits out how many of each 
// 		type there are. 


var inputArray = [];
var lastColumn = [];
var cfData = []; // this is information about the file that will go in the cf table: fileName, numColumns, numRows, etc. 
var numColumnsMode = 0;
var numRowsMode = 0;
var finalTrialNumMode = 0;
var modalColumnNameString = "";
var modalColumnType = [];
var modalDelimiter = '';
var modalProblemCount = 0;
var fileNotesLogRaw = "";
var fileNotesLog = "";
var mostRecentPressedCheckBoxRow = 0;
// var wasShiftPressed = false;
// var fileLastRowArray = [];
// var fileColumnNamesArray = [];
// var message = [];

function showFOstuff() {
	var x = document.getElementById("foBigBox");
	x.style.display = "block";
}

function compute_cfDataForAFile(fileNameString) {
	// This works with a single file's data. 
	// It assumes that appropriate values are already assigned to inputCell.
	// It creates cfData (data about the file) and inputArray (the file contents).
	
	inputArray.push(inputCell);
	var fileCounter = inputArray.length - 1; 
	var numRows = inputArray[fileCounter].length;
	var tempHighestRowNumWithColumnNames = 0;
	var lastPlus1equalsThis_columnNum = [];
	var columnType = [];
	var tempMessage = "";	
	var temp_arrayMadeFromOneColumn = [];

	// ------------ Go through all of the rows. ------------
	var tempNumColumns = [];
	for (i = 0; i < numRows; i++) {
		// Prepare data to compute modal number of columns for this file. 
		tempNumColumns.push(inputArray[fileCounter][i].length); 

		// Find repeats of columnNames.
		if (inputArray[fileCounter][i].toString() == inputArray[fileCounter][0].toString() && i > 0) { // if it's the column names again
			tempHighestRowNumWithColumnNames = i;
		}
		
		// Find columns where the values increment by +1.
		for (j = 0; j < inputArray[fileCounter][i].length; j++) {
			if (i < 2 || inputArray[fileCounter][i-1][j] === undefined) {
				// do nothin'
			} else if (inputArray[fileCounter][i][j] - 1 == inputArray[fileCounter][i-1][j]) { // this value is 1 more than the previous row's value
				// add every column name that fits to an array.
				lastPlus1equalsThis_columnNum.push(j);
			}
		}
	}
			
	// ------------ Figure out columnType ------------

	// Compute modal number of columns.
	var mostFrequentNumberOfColumns = Mode(tempNumColumns);
	var maxNumberOfColumns = Math.max.apply(Math, tempNumColumns);
	
	// -- Identify any plusOneColumn (i.e., trial numbers that increment by 1 each time) --
	var tempPlusOneColumn = -1;
	var possiblePlus1column = Mode(lastPlus1equalsThis_columnNum);
	var tempFinalTrialNum = 0;
	if (possiblePlus1column.frequency/numRows > .4) { // the proportion here is just a gut feeling
		// if there is, record the column number. 
		tempPlusOneColumn = possiblePlus1column.value;	
		columnType[tempPlusOneColumn] = "trial numbers";
	}
	
	// create a separate array made up of each column of the input 
	for (j = 0; j < mostFrequentNumberOfColumns.value; j++) { // j is the column we're on, i is the row
		for (i = 1; i < numRows; i++) { //  starting with 1 
			if (temp_arrayMadeFromOneColumn[j] === undefined) {temp_arrayMadeFromOneColumn[j] = [];} 
			if (inputArray[fileCounter][i][j] != undefined) {
				temp_arrayMadeFromOneColumn[j].push(inputArray[fileCounter][i][j]); // make an array for each column
			}
		}
	}
	// look for patterns in each of the arrays of columns
	var temp_mode = 0;
	for (j = 0; j < mostFrequentNumberOfColumns.value; j++) { 
		temp_mode = Mode(temp_arrayMadeFromOneColumn[j]);
		if (temp_mode.frequency/numRows > .8) { // if the same value appears in this proportion of trials... (gut feeling)
			if (temp_mode.value == 0 || temp_mode.value == 1) { 
				// if it's 0 or 1, which I don't want to consider as a constant column
				columnType[j] = "binary";
			} else {
				// assign the modal value to columnType for that column.
				columnType[j] = "always " + temp_mode.value;
			} 				
		} 
		if (temp_mode.uniqueLevels/numRows > .5) {
			if (columnType[j] === undefined) {
				columnType[j] = "many levels"; // note, uniqueLevels isn't being recorded or used (other than to set columnType here), should it? 
			}
		}
		if (columnType[j] === undefined) { 
			columnType[j] = "uncategorized";
		}
	}
	

	// ------------ figure out problems within the file ------------ //
	
	var previousTrialNum = -999;
	var gap = 0;
	var problemCount = 0;
	var problemCountThisRow = 0;
	var hasTrialNum = false;
	var thisTrialNum = 0;
	
	if (lastColumn[fileCounter] === undefined) { 
		lastColumn[fileCounter] = []; 
	}
	
	lastColumn[fileCounter].push('Problem with file: no column names at the top of this file'); // this only appears if the 1st row isn't column names. I initially added it because without it lastColumn will be out of synch when it pushes because the loop below starts at 1.
	for (i = 1; i < numRows; i++) { //  starting with 1
		additionalColumnText = '';
		hasTrialNum = false; // until we find it
		thisTrialNum = -999;
		problemCountThisRow = 0;
		
		
		// if this row has the wrong number of columns (for this file)
		if (mostFrequentNumberOfColumns.value != inputArray[fileCounter][i].length) { // if it's the wrong num of columns
			problemCountThisRow++;
			additionalColumnText += 'Number of columns = ' + inputArray[fileCounter][i].length + ' (' + mostFrequentNumberOfColumns.value + ' expected). ';
		}
		
		// if this row comes before future column names
		if (i <= tempHighestRowNumWithColumnNames) { 
			if (i < tempHighestRowNumWithColumnNames) {
				additionalColumnText += 'Column names appear later in this file. ';
				problemCountThisRow++;
			} else {
				additionalColumnText += 'ok, column names'; // this won't show up because column names aren't shown. 
				previousTrialNum = -999;
				// note I don't add to problem count here because it's not a problem itself... only if it makes actual rows repeat
			}
		}
		
		// in columns where a certain value is expected, check each row value and flag deviations
		columnType.forEach(checkForUnexpectedValues);
		
		function checkForUnexpectedValues(item, index) {
			if (item.includes("always ")) { // look at constant columns
				if (inputArray[fileCounter][i][index] != item.substr(7)) {
					additionalColumnText += "Unexpected value in column '" + inputArray[fileCounter][0][index] + "'. ";
					problemCountThisRow++;
				}
			} else if (item == "binary") { // look at binary columns
				if (inputArray[fileCounter][i][index] === undefined || (inputArray[fileCounter][i][index].trim() != '0' && inputArray[fileCounter][i][index].trim() != '1')) {
					additionalColumnText += "Unexpected value in column '" + inputArray[fileCounter][0][index] + "'. ";
					problemCountThisRow++;
// 					console.log( "Unexpected value in column '" + inputArray[fileCounter][0][index] + "'. ");
				}
			}					
		}

		// ------------ figure out trial number problems ------------	

		// figure out this trial's trial number
		if (tempPlusOneColumn != -1) { // if there is a plus one column (ie trial numbers)
			if (Number.isInteger(Number(inputArray[fileCounter][i][tempPlusOneColumn]))) { // if the number value of it is an integer
				hasTrialNum = true;
				thisTrialNum = inputArray[fileCounter][i][tempPlusOneColumn];
				tempFinalTrialNum = thisTrialNum;
			}
		}
		
		// figure out gap between last trial number and this one
		if (hasTrialNum && (previousTrialNum != -999)) {
			gap = thisTrialNum - previousTrialNum;
		} else { 
			gap = -999;
		}
		
		// examine the trial numbers 
		if (tempPlusOneColumn != -1) { // if this file has trial numbers...
			if (hasTrialNum == false) { // if there's no trial number in this row
				problemCountThisRow++;
				additionalColumnText += 'Trial number not found. ';
			} else if (previousTrialNum == -999) { // if it's the first trial num that we've found (i.e., the first row)
 				// additionalColumnText += 'ok';
			} else if (gap != -999) { // it has a trial num and a gap was computed
				if (gap == 1) {
 					// additionalColumnText += 'ok';
				} else if (gap == 0) {
					problemCountThisRow++;
					additionalColumnText += 'Trial number same as previous. ';
				} else if (gap > 1) {
					problemCountThisRow += gap-1;
					additionalColumnText += 'Trial num increased by ' + gap + '. ';
				} else if (gap < 0) {
					problemCountThisRow += Math.abs(gap)+1;
					additionalColumnText += 'Trial num decreased by ' + Math.abs(gap) + '. ';
				}
			} else { // if something weird happened
				problemCountThisRow++;
				additionalColumnText += "Warning: if this happened, there is an error in compute_cfDataForAFile";
			}
		}

		// update trial number
		if (hasTrialNum) {
			previousTrialNum = inputArray[fileCounter][i][tempPlusOneColumn];
		}
		
		if (problemCountThisRow > 0) { // if one or more problems was found, add one to problemCount and say so in the output file. 
			problemCount++;
			additionalColumnText = problemCountThisRow + " problems found. " + additionalColumnText;
		} else {		
			additionalColumnText = 'ok'; // add the message to the last column
		}
		lastColumn[fileCounter].push(additionalColumnText);
		
 	} // loop up to next row
 	
 	// ------------ Assign values to cfData ------------
	
	// if cfData isn't defined, define it. 
	if (cfData[fileCounter] === undefined) { 
		cfData[fileCounter] = []; 
	}

	// put the information that was just computed in cfData
	cfData[fileCounter] = {
		fileName: fileNameString,
		numColumns: mostFrequentNumberOfColumns.value,
		maxNumberOfColumns: maxNumberOfColumns,
		numRows: numRows,
// 		numDeviantRows: numRows - mostFrequentNumberOfColumns.frequency, // num deviant rows
		numlastRowDeviations: 0,
		numProblemsWithinFile: problemCount,
		numProblemsTotal: 0, // this is problems within file plus problems compared to other files. To get the latter, subtract. 
		columnNames: [],
		lastRow: [],
		message: tempMessage,
		plusOneColumn: tempPlusOneColumn,
		finalTrialNum: tempFinalTrialNum,
		largestRowNumWithColumnNames: tempHighestRowNumWithColumnNames,
		columnType: [],
	};
	
	cfData[fileCounter].columnNames = inputArray[fileCounter][0]; // for this line and the next two there has to be a better way to initialize (above). But who cares I guess. 
	cfData[fileCounter].lastRow = inputArray[fileCounter][numRows-1];
	cfData[fileCounter].columnType = columnType;
}



function analyzeCFexpectedvalues() {
	// Figure out expected values and then color the cells. 
	var numColumns = [];
	var numRows = [];
	var finalTrialNum = [];
	var colNamesString = [];
	var numProblems = [];
// 	var numDeviantRows = [];
	var perfectLastRowArray = [];
	var plraLength = [];  //perfectLastRowArray length
	var plrCol = [];
	var plrSignature = [];
	var plrSignatureCount = 0;
	var score = 0;
	var tempMessage = "";
	var i = 0;
	var j = 0;
		
	modalDelimiter = Mode(fileDelimiterArray).value;

	// Figure out expected (modal) value for some variables. 
	for (i = 0; i < cfData.length; i++) {
		// put all the values of the variable into an array that can be run through the Mode function. 
		numColumns.push(cfData[i].numColumns);
		numRows.push(cfData[i].numRows);
		finalTrialNum.push(cfData[i].finalTrialNum);
		colNamesString.push(cfData[i].columnNames.join(modalDelimiter));
		numProblems.push(cfData[i].numProblemsWithinFile);
// 		numDeviantRows.push(cfData[i].numDeviantRows);
	}
	numColumnsMode = Mode(numColumns).value;
	numRowsMode = Mode(numRows).value; 	// maybe make it only care about numRows if mode frequency is > .5?
	finalTrialNumMode = Mode(finalTrialNum).value;
	modalColumnNameString = Mode(colNamesString).value;
	modalProblemCount = Mode(numProblems).value; // number of problems within perfect files
// 	numDeviantRowsMode = Mode(numDeviantRows).value;

	

	// figure out features of the last row in the 'perfect' files
	for (i = 0; i < cfData.length; i++) {
		// if it looks like a perfect file
		if (cfData[i].numRows == numRowsMode && cfData[i].columnNames.join(modalDelimiter) == modalColumnNameString && cfData[i].numProblemsWithinFile == modalProblemCount && cfData[i].finalTrialNum == finalTrialNumMode) { 
			perfectLastRowArray.push(cfData[i].lastRow); // an array containing what the last row should look like
			plraLength.push(cfData[i].lastRow.length); // number of columns in those perfect-looking last rows
		}
	}
	plraLengthMode = Mode(plraLength).value; // modal number of columns in the perfect-looking last rows
// 	console.log('number of perfect files: ' + perfectLastRowArray.length);
	
	// -- start processing the last row --	
	// Create a 2d array (plrCol), extracted from the perfect last rows, that contains every entry in each column 
 	for (i = 0; i < perfectLastRowArray.length; i++) {
 		if (perfectLastRowArray[i].length == plraLengthMode) {
			for (col = 0; col < perfectLastRowArray[i].length; col++) {
				if (plrCol[col] === undefined) { 
					plrCol[col] = []; 
				}
				plrCol[col].push(perfectLastRowArray[i][col]);
			}		
		}
	}
	
	// Find signature column values in the perfect last rows, (signature values appear 100% of the time in perfect last rows). 
	for (col = 0; col < plrCol.length; col++) {
		if (Mode(plrCol[col]).frequency == plrCol[col].length) { // if the modal value appears 100% of the time
			plrSignature.push(Mode(plrCol[col]).value);
			plrSignatureCount++;
		} else {
			plrSignature.push('not a signature column');
		}
	}
	
	// Figure out how well the last row matches the signature columns. 
	for (i = 0; i < cfData.length; i++) {
		score = 0;
		tempMessage = "";
		for (col = 0; col < plrSignature.length; col++) {
			if (plrSignature[col] != 'not a signature column') {
				if (cfData[i].lastRow[col] != undefined) {
					if (cfData[i].lastRow[col] == plrSignature[col]) {
						score++;
					} else {
						tempMessage += 'Final row: Expected ' + plrSignature[col] + ', found ' + cfData[i].lastRow[col] + '<br>';
					}
				}
			}
		}
		cfData[i].numlastRowDeviations = plrSignatureCount - score;
		if (cfData[i].numlastRowDeviations > 2) {
			tempMessage = "Final row: not found (" + (plrSignatureCount - score) + " deviations)<br>";
		}
		cfData[i].message += tempMessage;
	}
	
	
	// ---------------- examine column types ----------------
	
	var columnTypesArray = [];
	var temp_modalColumnType = 0;
	var tempcounter = 0;
	
	// create a 2x2 array of column types (column x file)
	for (i = 0; i < numColumnsMode; i++) {
		columnTypesArray[i] = [];
		for (j = 0; j < cfData.length; j++) {
			if (cfData[j].columnType[i] != undefined) {
				columnTypesArray[i].push(cfData[j].columnType[i]);
			}
		}
	}

	// assign values to modalColumnType[]
	for (i = 0; i < numColumnsMode; i++) {
	 	temp_modalColumnType = Mode(columnTypesArray[i]);
		if (temp_modalColumnType.frequency/columnTypesArray[i].length > .8) { // gut feeling, maybe wrong? 
			// if > 80% of files have the same constant value, set its type to be the constant value
			modalColumnType[i] = temp_modalColumnType.value;
		} else {
			// see if this column contains constant values within each file but these values are unique across files.
			tempcounter = 0;
			if (temp_modalColumnType.frequency == 1) { // if each modal value is unique (i.e., no two are the same)
				for (j = 0; j < cfData.length; j++) {
					if (columnTypesArray[i][j].includes("always ")) {
						tempcounter++; // count the number that contain 'always ', meaning they're constant within the file
					}
				}
			}
			if (tempcounter/cfData.length > .8) { // if at least 80% have a constant value in this column
				modalColumnType[i] = "user IDs";
			} else { // otherwise, it means we didn't find a modal value (i.e., a mode for the column modes) for this column
				if (modalColumnType[i] === undefined) {
					modalColumnType[i] = "no mode";
				}
			}
		}
// 		console.log( modalColumnType[i]);
	}
}



function computeNumProblemsComparedToOtherFiles() {
	// Figure out how many problems there are in the file overall. 
	var probCount = 0;
	var numRowsDeviation = 0;
	
	for (i = 0; i < cfData.length; i++) {
		probCount = 0;


		if (cfData[i].plusOneColumn == -1) { 
			// if trial numbers weren't found compute problems based on num rows
			numRowsDeviation = cfData[i].numRows - numRowsMode; // num rows based on counting rows
			probCount += Math.abs(numRowsDeviation);
		} else {
			// if trial numbers were found, compute problems based on final trial number
			// note this is preferable because unlike numRows, it's not redundant with problems noticed within the file
			numRowsDeviation = cfData[i].finalTrialNum - finalTrialNumMode;
			probCount += Math.abs(numRowsDeviation);
		}

		
		probCount += Math.abs(cfData[i].numlastRowDeviations);

		// check the column names
		if (cfData[i].columnNames.join(modalDelimiter) != modalColumnNameString) {
			if (cfData[i].numColumns != numColumnsMode) {
				probCount += 10; // either add 10 if the number of column names is wrong
				cfData[i].message += 'Columns of data: ' + cfData[i].numColumns + ' ('+ numColumnsMode + ' expected)<br>';
			} else {
				probCount += 5; // or add 5 if the column names mismatch but num columns is correct
				cfData[i].message += "Column names mismatch other files'<br>";
			}
		}
		
		// check whether the actual column type matches the expected column type
// 		console.log( "");
// 		console.log(cfData[i].fileName);
		var tempColumnMessage = 0;
		for (j = 0; j < numColumnsMode; j++) {
			if (cfData[i].columnType[j] != modalColumnType[j]) {
				if (modalColumnType[j] != "no mode" & modalColumnType[j] != "user IDs") {
					// if the column type for this file mismatches the modal column type across files. 
// 					console.log("col " + j + " expect " + modalColumnType[j] + " got " + cfData[i].columnType[j]);
					probCount += 2; 
					tempColumnMessage++;
				}
			}
		}
		if (tempColumnMessage > 0) {
			cfData[i].message += 'Column(s) of unexpected type: ' + tempColumnMessage + '<br>';
		}
		
		if (numRowsDeviation > 0) {
			cfData[i].message += Math.abs(numRowsDeviation) + ' more trials than expected<br>';
		} else if (numRowsDeviation < 0) {
			cfData[i].message += Math.abs(numRowsDeviation) + ' fewer trials than expected<br>';
		}
		
		if (cfData[i].largestRowNumWithColumnNames > 0) {
			cfData[i].message += "Column names appear in row " + (cfData[i].largestRowNumWithColumnNames + 1) + "<br>";
		}

		// total problems is probCount (probs found between files in this function) plus the difference between expected and actual number of problems found within the file
		cfData[i].numProblemsTotal = probCount + Math.abs(cfData[i].numProblemsWithinFile - modalProblemCount);
	}
}

function buildTableCF() {
	var out = "";
	
	document.getElementById('cfHeading').innerHTML = cfData.length + ' files imported.';

	// Build Header
	out = "<tr><th onclick='sortTable(0, "+'"cfTable"'+")' title='Click to Sort'>Use in output</th>";
	out += "<th onclick='sortTable(1, "+'"cfTable"'+")' title='Click to Sort'>File name</th>";
	out += "<th onclick='sortTable(2, "+'"cfTable"'+")' title='Click to Sort'>Rows</th>";
	out += "<th onclick='sortTable(3, "+'"cfTable"'+")' title='Click to Sort'>Problems</th>";
	out += "<th onclick='sortTable(4, "+'"cfTable"'+")' title='Click to Sort'>Message</th></tr>";

	// Build all the other cells.
	for (i = 0; i < cfData.length; i++) {
		// First figure out, based on number of problems, whether the row is good, warning, or bad
		if (cfData[i].numProblemsTotal <= 5) {
			tdText = '<td class=cfTableCell_Row_good>';
		} else if (cfData[i].numProblemsTotal <= 20) {
			tdText = '<td class=cfTableCell_Row_warning>';
		} else {
			tdText = '<td class=cfTableCell_Row_bad>';
		}
		// write them.
		out = out + "<tr>";
		out = out + "<td>" + '<input type="checkbox" id="cfTableCell_Row'+i+'_Col0" checked onclick="cfCheckBoxPress('+i+', event)"></td>';
		out = out + "<td>" + cfData[i].fileName + "</td>";
		out = out + "<td>" + cfData[i].numRows + "</td>";
		out = out + tdText + cfData[i].numProblemsTotal + "</td>";
		out = out + "<td>" + cfData[i].message + "</td>";
		out = out + "</tr>";
	}
	
	// Put everything in the HTML on the page.
	document.getElementById("cfTable").innerHTML = "<table>" + out + "</table>";
	
	// If necessary, add an alert for excluded files. 
	if (excludedFile_name.length > 0) {
		var x = document.getElementById("cfExcludedFilesBox");
		x.style.display = "block";
		document.getElementById("cfExcludedFilesText").innerHTML = excludedFile_name.join('<br>');
	}
	
	// make a record of what went in to the onscreen table, to be modified and then recorded later in the file cleanup notes
	fileNotesLogRaw = out + "\r\n";
	if (document.getElementById("cfExcludedFilesText").innerHTML.length > 0) {
		fileNotesLogRaw += "Files that could not be analyzed: " + document.getElementById("cfExcludedFilesText").innerHTML + "\r\n\r\n";
	}
}

function adjustCheckboxes() {
	// uncheck columns that look questionable. 
	for (i = 0; i < cfData.length; i++) {
		if (cfData[i].numProblemsTotal > 5) {
			document.getElementById('cfTableCell_Row'+i+'_Col0').checked = false; // if you comment this out no row gets unchecked
		}
	}
}

function cfCheckBoxPress(whichOne, event) {
	// This happens whenever they press a checkbox. 
	// If the shift key is also pressed at the time, 
	// it makes the checkboxes between the two most recently pressed checkboxes change. 
	var currentRow = rowOfThisCheckbox(whichOne);
	var min = 0;
	var max = 0;
	var i = 0;

	// if there's a most recently pressed box on record and shift is being pressed
	if (mostRecentPressedCheckBoxRow > 0 && event.shiftKey == true){
		var setTo = document.getElementById('cfTableCell_Row'+whichOne+'_Col0').checked;
		min = Math.min(currentRow, mostRecentPressedCheckBoxRow);
		max = Math.max(currentRow, mostRecentPressedCheckBoxRow);
        for(i = min; i <= max; i++) {
			checkboxOfThisRow(i).checked = setTo; // set all of the betweeners to the most recent boolean
		}
	}
	mostRecentPressedCheckBoxRow = currentRow;
}

function rowOfThisCheckbox(whichIndex) {
	// Pass this the index of the checkbox that was pressed. 
	// It return the current row number of that checkbox (i.e., what row it's at in its table).
	return document.getElementById('cfTableCell_Row'+whichIndex+'_Col0').parentNode.parentNode.rowIndex;
}

function checkboxOfThisRow(rowIndex) {
	// Pass this the current row number of a checkbox in its table.
	// It returns the checkbox element that was pressed.
	var table = document.getElementById('cfTable');
	var rows = table.getElementsByTagName("TR");
	var whichTD = rows[rowIndex].getElementsByTagName("TD")[0]; // this is zero because the checkboxes are in the first column
	return whichTD.getElementsByTagName('input')[0];
}

function buildOutputStringCAC() {
	// Turn the data into a string that can be stuck in a file for export. 
	// It uses the modal delimiter as the output delimiter for all rows.
	// It starts with the modal column names and excludes any other instances of those column names. 
	var outString = "";
	var f = 0;
	var r = 0;
	var temp = "";
	var tempExtraDelimiters = "";
	var extraDelimitersNeeded = 0
	
	if (inputArray[0] === undefined) {
		return "No Output Data Available";
	}
	
	outString = modalColumnNameString + modalDelimiter + "Data cleanup notes" + "\r\n"; // start by writing the column names
	
	for (f = 0; f < inputArray.length; f++) { // for every file...
		if (document.getElementById('cfTableCell_Row'+f+'_Col0').checked == true) { // if its checkbox is checked...
			for (r = 0; r < inputArray[f].length; r++) { // go through all of its rows...
				temp = inputArray[f][r].join(modalDelimiter); // join the row array into a string
				extraDelimitersNeeded = Math.max( (modalColumnNameString.split(modalDelimiter).length), cfData[f].maxNumberOfColumns  );
				extraDelimitersNeeded = extraDelimitersNeeded - inputArray[f][r].length;					
				tempExtraDelimiters = Array(extraDelimitersNeeded+1).join(modalDelimiter);
				
				if (temp != modalColumnNameString) { // if the string isn't the column names...
					outString += temp + tempExtraDelimiters + modalDelimiter + lastColumn[f][r] + "\r\n"; // add it to outString. 
				} else { 
// 					console.log("skipping column names"); 
				}
			}
		}
	}
	return outString;
}

function buildLogStringCAC() {
	// Build the file cleanup notes string. Which is basically what's showing on the screen
	// when this is run. This takes the string that was created when the data were imported,
	// strips out the html and puts in tabs and stuff instead. Then it figures out whether
	// or not each file is being included (i.e., whether the checkboxes are checked.) 
	
	var temp = "";
	var fileNotesLog = "";

	// Replace some of the html stuff that needs to be replaced. 
	fileNotesLog = fileNotesLogRaw.replace(/<\/td>/gi, "\t");
	fileNotesLog = fileNotesLog.replace(/<\/th>/gi, "\t");
	fileNotesLog = fileNotesLog.replace(/<\/tr>/gi, "\r\n");
	fileNotesLog = fileNotesLog.replace(/<br>/gi, "; ");
// 	fileNotesLog = fileNotesLog.replace(/ checked /gi, "");

	// Figure out whether the checkbox is checked, for each checkbox. 
	for (f = 0; f < inputArray.length; f++) { // for every file...
		temp = '<input type="checkbox" id="cfTableCell_Row'+f+'_Col0" checked onclick="cfCheckBoxPress('+f+', event)">';
		if (document.getElementById('cfTableCell_Row'+f+'_Col0').checked == true) { // if its checkbox is checked...
			fileNotesLog = fileNotesLog.replace(temp, "Included in analysis");
		} else  {
			fileNotesLog = fileNotesLog.replace(temp, "Excluded from analysis");
		}
	}

	// Strip out the rest of the html. 
	var tmp = document.createElement("DIV");
	tmp.innerHTML = fileNotesLog;
	fileNotesLog = tmp.textContent || tmp.innerText || "";
	
	// Figure out the current date and time.
	var d = new Date();
	fileNotesLog += "Analyzed on " + d + "\r\n\r\n";
	
// 	console.log(fileNotesLog);
	return fileNotesLog;
}