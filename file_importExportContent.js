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
	
	var countCommasQuotes = (first1000characters.match(/","/g) || []).length

	

	// Split the string into rows
	var inputRow = rawFileInputString.split(/\r\n|\r|\n/g);

	// If it's comma-delimited with quotations marks, get rid of the quotation marks. 
	if (countCommasQuotes > countCommas/3) {
		delimiter = "\t";
		for (i = 0; i < inputRow.length; i++) { 
			// console.log( inputRow[i].slice(0,1));
			if (inputRow[i].slice(0,1) == '"' && inputRow[i].slice(-1) == '"') { // if the row starts and ends with quotation marks
				inputRow[i] = inputRow[i].replace(/","/gi, "\t"); // replace quotation mark comma quotation mark (i.e., ",") with a tab
				inputRow[i] = inputRow[i].slice(1, inputRow[i].length-1) // get rid of first and last character (" marks)
			}
		}
	}


	// Figure out inputCell[]
	var temp = []; 
	for (i = 0; i < inputRow.length; i++) { 
		inputRow[i] = inputRow[i].trim(); // Trim columns and blanks. I added this 5/6/18. It's fine, I think. 
		if (inputRow[i].trim().length > 0) { // if it's not a blank line
			temp = inputRow[i].split(delimiter); // Set temp[] = the row of data, split by delimiter
			for (k = 0; k < temp.length; k++) {
				temp[k] = String(temp[k]).trim(); // Trim each item in temp
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
	} else if (analysisType == "combine" ) {
		// if it's combine files
		analyzeCFexpectedvalues();
		computeNumProblemsComparedToOtherFiles();
		buildTableCF();
		adjustCheckboxes();
		hideFileSelectorStuff();
		showCFstuff();
	} else if (analysisType == "importFOdatabase") { // dfd get rid of this
		import_FOdatabase();
	} else {
		compute_citation_overlap(); // dfd I'd want to make this happen when they press a button or select two files or whatever later on
		showFOstuff();
		hideFileSelectorStuff();
	}
}


// if the exportbutton is pressed this happens. It puts the data in a blob and then makes it download. 
document.getElementById('exportButton').onclick = function(event){
	if (analysisType == 'combine') {
		writeToFile(buildOutputStringCAC(), 'Cleaned Data.txt');
	} else if (analysisType == 'compute') {
		writeToFile(buildOutputStringPTP(), 'Pivoted Data.txt');
	} else {
		writeToFile(buildOutputStringFO(), "Citation Overlap Tally.txt");
	}
}

function writeToFile(str, fileName) {
	var a = document.getElementById('exportButton'); // this could be any object, I'm pretty sure. I chose export button cause whatever. 

   	var blob = new Blob([str], {type: "text/plain;charset=utf-8"});
	url = window.URL.createObjectURL(blob);

  	a.href = url;
    a.target = '_blank';
	a.download = fileName;
}





// ----- The function below works but only with files under like 1.6 mb, so I decided to use blobs and create a URL and stuff. 
// function exportOutput(fName, outString) {
// 	var element = document.createElement('a');

// 	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(outString));
// 	element.setAttribute('download', fName);

// 	element.style.display = 'none';
// 	document.body.appendChild(element);

// 	element.click();

// 	document.body.removeChild(element);
// }

	