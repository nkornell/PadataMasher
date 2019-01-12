var analysisType;
var allFilesString = "<ol>";
var fileExtension = /text.*/;  //Set the extension for the file 
var listOfFiles;
var arrayOfFiles = [];
var rawFileInputString;
var excludedFile_name = [];

document.getElementById('files').addEventListener('change', handleFileSelect, false); // apparently this... works from the start

// The stuff below pauses after the files are found but before processing them. But apparently finding them is the slow part. 
// document.getElementById('files').addEventListener('change', pauseAbit, false); // apparently this... works from the start
// function pauseAbit(evt) {
// 	setTimeout(function() { handleFileSelect(evt); }, 5000);
// }



function handleFileSelect(evt) {
	/// if they use the button to select a file
	filesSelectedStepOne(evt.target.files);
}

function filesSelectedStepOne (listOfFiles) {
	if (document.URL.includes("Combine")) {
		analysisType = "combine";
	} else {
		analysisType = "compute";
	}
	// hide and show some stuff
	var x = document.getElementById("fileSelectorBox");
	x.style.display = "none";
	x = document.getElementById("processingBox");
	x.style.display = "flex";

	// a FileList isn't an array, so move the files into an array.
	for (var i = 0, f; f = listOfFiles[i]; i++) {
		arrayOfFiles.push(f);
	}
	chooseAFileToImport();
}

function chooseAFileToImport() {
	// This method just goes to the next file, makes sure there is one and that it has the right type, and then calls importDataFromOneFile.
	// The importing is actually done by importDataFromOneFile. 
	// is called recursively. The advantage is, importDataFromOneFile can finish processing each file before showing the next one. 
    if (arrayOfFiles.length < 1) {
    	afterAllFilesAreProcessed();
    	return;
    }

	var f = arrayOfFiles.shift();
	
	if (f.type.match(fileExtension)) { 
		importDataFromOneFile(f); 

		allFilesString += '<li>' + f.name;
		document.getElementById("processing").innerHTML = "<p>Processing Files:<p>" + allFilesString + "</p>"; // I wanted this to show the filenames one at a time but if it doesn't might as well move this outside the for loop
	} else {
		allFilesString += '<li><b>Cannot Process: ' + f.name + '</b>';
		excludedFile_name.push(f.name);
		chooseAFileToImport(); // this calls itself recursively. 
	}
}

function importDataFromOneFile(f) {
	// This imports the data, then calls another function (depending on the task, (e.g., cf, mc)) to process the data. 
	var fileReader = new FileReader(); 
	fileReader.readAsText(f);  // I guess this triggers the onload event below

	fileReader.onload = function (e) { 
		rawFileInputString = fileReader.result;		
		createInputCell();

		if (analysisType == "compute") {
			afterAllFilesAreProcessed();
		} else {
			compute_cfDataForAFile(f.name);
			chooseAFileToImport(); // this ends up being recursive, because chooseAFileToImport calls importDataFromOneFile.
		}
	}
}

window.ondrop = function(ev) {
	document.getElementById("drop_zone").style.border = "";
	var files = [];
	
	ev.preventDefault();
	// If dropped items aren't files, reject them
	var dt = ev.dataTransfer;
	if (dt.items) {
	// Use DataTransferItemList interface to access the file(s)
		for (var i=0; i < dt.items.length; i++) {
			if (dt.items[i].kind == "file") {
				files.push(dt.items[i].getAsFile());
			}
		}
		filesSelectedStepOne(files); 
  	} else {
		// I've never been able to make this happen and I don't know what it is. 
		console.log("how do you get this to happen??");
		// Use DataTransfer interface to access the file(s)
		for (var i=0; i < dt.files.length; i++) {
			console.log("... file[" + i + "].name = " + dt.files[i].name);
		}
 	}
};

window.onmouseout = function() {
// 	console.log(  "mouse out");
	document.getElementById("drop_zone").style.border = "";
}

window.ondragover = function(ev) {
    ev.preventDefault();
};

window.ondragenter = function(ev) {
	document.getElementById("drop_zone").style.border = "dashed #aaa 6px";
};