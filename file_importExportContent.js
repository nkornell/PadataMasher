function createInputCell() {
	// This function assigns two global variables: inputCell and fileDelimiterArray. 
	// inputCell[row][column] is used when there's a single input file. 
	// (inputCell also used to make inputArray[file][row][column], when there are multiple input files, but that happens elsewhere, sometimes. 
	

	// Reset inputCell
	inputCell = [];

	// Figure out delimiter
	var first1000characters = rawFileInputString.slice(0, 1000);
	var countCommas = (first1000characters.match(/,/g) || []).length;
	var countTabs = (first1000characters.match(/\t/g) || []).length;
	if (countCommas > countTabs) {
		var delimiter = ",";
	} else {
		var delimiter = "\t";
	}
	fileDelimiterArray.push(delimiter); // add this file's delimiter to fileDelimiterArray

	// Split the string into rows
	var inputRow = rawFileInputString.split(/\r\n|\r|\n/g);
	
	// Figure out inputCell[]
	var temp = []; 
	for (i = 0; i < inputRow.length; i++) { 
		inputRow[i] = inputRow[i].trim(); // Trim columns and blanks. I added this 5/6/18. It's fine, I think. 
		if (inputRow[i].trim().length > 0) { // if it's not a blank line
			temp = inputRow[i].split(delimiter); // Set temp[] = the row of data, split by delimiter
			for (k = 0; k < temp.length; k++) {
				temp[k] = temp[k].trim(); // Trim each item in temp
			}
			inputCell.push(temp); // Add temp to inputCell[]
		}
	}
}

function afterAllFilesAreProcessed() {
	if (analysisType == "compute") {
		// if we're just importing one file
		buildTablePTP("input");
		computeResults();
		buildVariableSelectorTable();
	} else {
		// if it's combine files
		analyzeCFexpectedvalues();
		computeNumProblemsComparedToOtherFiles();
		buildTableCF();
		adjustCheckboxes();
		hideFileSelectorStuff();
		showCFstuff();
	}
}

function exportOutput(fName, outString) {
	var element = document.createElement('a');

	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(outString));
	element.setAttribute('download', fName);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}
